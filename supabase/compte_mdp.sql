-- ============================================================================
-- Bivaska : connexion par mot de passe et accord pour les nouvelles par e-mail (v0.9.108)
-- À lancer UNE fois dans Supabase > SQL Editor > New query > Run, après schema.sql et securite.sql.
-- Peut être relancé sans risque.
-- ============================================================================

-- Accord pour recevoir les nouvelles de Bivaska par e-mail : NON par défaut, donné ou retiré par le membre lui-même.
alter table public.profiles add column if not exists news_optin boolean not null default false;
alter table public.profiles add column if not exists news_optin_at timestamptz;  -- date du dernier choix (preuve de l'accord)

-- Le membre peut modifier son pseudo et son accord, rien d'autre
grant update (pseudo, news_optin) on public.profiles to authenticated;

-- Date du choix tenue par la base (on ne fait pas confiance au téléphone)
create or replace function public.news_optin_date() returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if new.news_optin then new.news_optin_at := now(); end if;
  elsif new.news_optin is distinct from old.news_optin then
    new.news_optin_at := now();
  else
    new.news_optin_at := old.news_optin_at;
  end if;
  return new;
end $$;
drop trigger if exists news_optin_date on public.profiles;
create trigger news_optin_date before insert or update on public.profiles for each row execute function public.news_optin_date();
revoke all on function public.news_optin_date() from public, anon, authenticated;

-- Profil créé à l'inscription : reprend la case cochée sur le formulaire de création de compte
create or replace function public.new_profile() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, news_optin)
  values (new.id, coalesce((new.raw_user_meta_data->>'news_optin')::boolean, false))
  on conflict do nothing;
  return new;
end $$;
revoke all on function public.new_profile() from public, anon, authenticated;

-- Mon profil complet : ajoute news_optin (le type de retour change : on recrée la fonction)
drop function if exists public.my_profile();
create function public.my_profile() returns table (id uuid, pseudo text, trusted boolean, is_admin boolean, banned boolean, news_optin boolean)
language sql stable security definer set search_path = public as $$
  select p.id, p.pseudo, p.trusted, p.is_admin, p.banned, p.news_optin from profiles p where p.id = auth.uid() $$;
revoke all on function public.my_profile() from public, anon;
grant execute on function public.my_profile() to authenticated;

-- ----------------------------------------------------------------------------
-- Pour Tim : liste des adresses qui ont accepté les nouvelles (à lancer dans le SQL Editor,
-- puis Export > CSV, et importer dans Brevo > Contacts). Ne jamais importer d'autres adresses.
--
--   select u.email, p.news_optin_at
--   from auth.users u join public.profiles p on p.id = u.id
--   where p.news_optin and u.email_confirmed_at is not null
--   order by p.news_optin_at;
-- ----------------------------------------------------------------------------
