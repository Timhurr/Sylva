-- ============================================================================
-- Bivaska : renforcement de la sécurité (audit du 19/11/2026)
-- À lancer UNE fois dans Supabase > SQL Editor > New query > Run, après schema.sql.
-- Peut être relancé sans risque (idempotent).
-- ============================================================================

-- ---------- 1. Profils : is_admin, banned, approved_count ne sont plus lisibles par tout le monde ----------
revoke select, update, insert, delete on public.profiles from anon, authenticated;
grant select (id, pseudo, trusted, created_at) on public.profiles to anon, authenticated;
grant update (pseudo) on public.profiles to authenticated;

-- Mon propre profil complet (pour l'appli et la page de modération)
create or replace function public.my_profile() returns table (id uuid, pseudo text, trusted boolean, is_admin boolean, banned boolean)
language sql stable security definer set search_path = public as $$
  select p.id, p.pseudo, p.trusted, p.is_admin, p.banned from profiles p where p.id = auth.uid() $$;
revoke all on function public.my_profile() from public, anon;
grant execute on function public.my_profile() to authenticated;

-- Pseudos uniques (sans tenir compte des majuscules) et noms réservés (usurpation)
create unique index if not exists profiles_pseudo_unique on public.profiles (lower(pseudo)) where pseudo is not null;
alter table public.profiles drop constraint if exists pseudo_reserve;
alter table public.profiles add constraint pseudo_reserve check (
  pseudo is null or (
    pseudo ~ '^[[:alnum:]À-ÿ _.-]{2,30}$'
    and lower(pseudo) !~ '(bivaska|sylva|admin|moderat|support|officiel|staff)'
  )) not valid;

-- ---------- 2. Signalements : anti-abus ----------
-- Avant : 3 signalements anonymes suffisaient à masquer n'importe quel spot.
-- Maintenant : il faut 3 membres connectés différents ; les signalements anonymes vont seulement en modération.
create or replace function public.on_report() returns trigger language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if new.kind = 'spot' and new.user_id is not null then
    select count(distinct user_id) into n from reports where kind = 'spot' and target = new.target and user_id is not null;
    update community_spots set reports = n,
      status = case when n >= 3 and status = 'published' then 'hidden' else status end
    where id::text = new.target;
  end if;
  return new;
end $$;

-- Limites de débit : 20 signalements par heure par membre, 60 par heure pour tous les anonymes réunis
create or replace function public.report_limits() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.status := 'open';
  if new.user_id is null then
    if (select count(*) from reports where user_id is null and created_at > now() - interval '1 hour') >= 60 then
      raise exception 'Trop de signalements, réessaie plus tard.';
    end if;
  elsif (select count(*) from reports where user_id = new.user_id and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'Trop de signalements, réessaie plus tard.';
  end if;
  return new;
end $$;
drop trigger if exists report_limits on public.reports;
create trigger report_limits before insert on public.reports for each row execute function public.report_limits();

-- ---------- 3. Avis : un membre ne peut plus ré-afficher un avis masqué par la modération ----------
create or replace function public.review_protect() returns trigger language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') and not public.is_admin() then
    if tg_op = 'INSERT' then new.hidden := false;
    else new.hidden := old.hidden; new.spot_id := old.spot_id; new.user_id := old.user_id; end if;
  end if;
  return new;
end $$;
drop trigger if exists review_protect on public.spot_reviews;
create trigger review_protect before insert or update on public.spot_reviews for each row execute function public.review_protect();

-- ---------- 4. Photos : chemin contrôlé, taille et type limités ----------
-- Le chemin doit être « <mon id>/<nom simple> » : empêche d'envoyer la page de modération vers une autre adresse.
alter table public.spot_photos drop constraint if exists photo_path_ok;
alter table public.spot_photos add constraint photo_path_ok
  check (path ~ '^[0-9a-f-]{36}/[A-Za-z0-9._-]{1,80}$') not valid;
drop policy if exists "ajouter une photo" on public.spot_photos;
create policy "ajouter une photo" on public.spot_photos for insert with check (
  auth.uid() = user_id and public.can_post() and status = 'pending'
  and split_part(path, '/', 1) = auth.uid()::text
  and (select count(*) from public.spot_photos p where p.spot_id = spot_photos.spot_id and p.user_id = auth.uid()) < 3);
-- 3 Mo maximum, images uniquement
update storage.buckets set file_size_limit = 3145728, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
  where id = 'spot-photos';

-- ---------- 5. Quotas contre le remplissage de la base ----------
-- Sauvegarde : 2 Mo par clé, 60 clés par compte
alter table public.user_data drop constraint if exists user_data_taille;
alter table public.user_data add constraint user_data_taille check (octet_length(v::text) <= 2000000) not valid;
create or replace function public.user_data_quota() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from user_data where user_id = new.user_id and k = new.k)
     and (select count(*) from user_data where user_id = new.user_id) >= 60 then raise exception 'Quota de sauvegarde atteint.'; end if;
  return new;
end $$;
drop trigger if exists user_data_quota on public.user_data;
create trigger user_data_quota before insert on public.user_data for each row execute function public.user_data_quota();

-- Spots : 5 en attente de relecture et 20 par jour maximum par membre
create or replace function public.spot_quota() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from community_spots where user_id = new.user_id and status = 'pending') >= 5
     or (select count(*) from community_spots where user_id = new.user_id and created_at > now() - interval '1 day') >= 20 then
    raise exception 'Trop de spots partagés pour aujourd''hui.';
  end if;
  return new;
end $$;
drop trigger if exists spot_quota on public.community_spots;
create trigger spot_quota before insert on public.community_spots for each row execute function public.spot_quota();

-- Idées : 5 par jour maximum par membre
create or replace function public.idea_quota() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from ideas where user_id = new.user_id and created_at > now() - interval '1 day') >= 5 then
    raise exception 'Trop d''idées pour aujourd''hui.';
  end if;
  return new;
end $$;
drop trigger if exists idea_quota on public.ideas;
create trigger idea_quota before insert on public.ideas for each row execute function public.idea_quota();

-- ---------- 6. Suppression de compte : marche même avec la protection du stockage de Supabase ----------
create or replace function public.delete_my_account() returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'non connecté'; end if;
  begin
    perform set_config('storage.allow_delete_query', 'true', true);
    delete from storage.objects where bucket_id = 'spot-photos' and (storage.foldername(name))[1] = auth.uid()::text;
  exception when others then null;  -- l'appli supprime aussi les photos par l'API de stockage avant
  end;
  delete from auth.users where id = auth.uid();   -- cascade : profil, données, spots, avis, votes
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------- 7. Fonctions internes : pas appelables de l'extérieur ----------
revoke all on function public.new_profile() from public, anon, authenticated;
revoke all on function public.on_report() from public, anon, authenticated;
revoke all on function public.report_limits() from public, anon, authenticated;
revoke all on function public.user_data_quota() from public, anon, authenticated;
revoke all on function public.spot_quota() from public, anon, authenticated;
revoke all on function public.idea_quota() from public, anon, authenticated;
revoke all on function public.spot_status_on_insert() from public, anon, authenticated;
