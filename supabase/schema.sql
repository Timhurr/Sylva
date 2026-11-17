-- ============================================================================
-- Sylva : schéma Supabase (comptes, sauvegarde, communauté, signalements, idées)
-- À coller une seule fois dans Supabase > SQL Editor > New query > Run.
-- Toutes les tables sont protégées par RLS (Row Level Security) :
-- la clé « anon public » mise dans l'appli ne donne accès qu'à ce que ces règles autorisent.
-- ============================================================================

-- ---------- Profils ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pseudo text check (char_length(pseudo) between 2 and 30),
  trusted boolean not null default false,      -- membre de confiance : publie sans relecture
  is_admin boolean not null default false,     -- Tim : accès à la modération
  approved_count int not null default 0,
  banned boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profil lisible par tous" on public.profiles;
create policy "profil lisible par tous" on public.profiles for select using (true);
drop policy if exists "je modifie mon pseudo" on public.profiles;
create policy "je modifie mon pseudo" on public.profiles for update using (auth.uid() = id)
  with check (auth.uid() = id);
-- Empêche un utilisateur de se donner lui-même trusted / is_admin / banned
-- (pas « security definer » : current_user est le rôle de l'appelant ; les mises à jour faites par le système ou le SQL Editor passent)
create or replace function public.protect_profile() returns trigger language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') and not public.is_admin() then
    new.trusted := old.trusted; new.is_admin := old.is_admin; new.banned := old.banned; new.approved_count := old.approved_count;
  end if;
  return new;
end $$;
drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile before update on public.profiles for each row execute function public.protect_profile();
-- Profil créé automatiquement à l'inscription
create or replace function public.new_profile() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into profiles (id) values (new.id) on conflict do nothing; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.new_profile();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false) $$;
create or replace function public.can_post() returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and not coalesce((select banned from profiles where id = auth.uid()), false)
    and coalesce((select (u.email_confirmed_at is not null) from auth.users u where u.id = auth.uid()), false) $$;

-- ---------- Sauvegarde personnelle (privée) ----------
-- Une ligne par utilisateur et par clé de données (sylva_spots, sylva_pret…). Les infos médicales ne sont jamais envoyées.
create table if not exists public.user_data (
  user_id uuid not null references auth.users(id) on delete cascade,
  k text not null check (k like 'sylva\_%'),
  v jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, k)
);
alter table public.user_data enable row level security;
drop policy if exists "mes données uniquement" on public.user_data;
create policy "mes données uniquement" on public.user_data for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Spots communautaires ----------
create table if not exists public.community_spots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lat double precision not null check (lat between -90 and 90),
  lon double precision not null check (lon between -180 and 180),
  country text not null default 'BE',
  -- Statut légal obligatoire : pas de « bivouac sauvage »
  statut text not null check (statut in ('aire_officielle','terrain_prive_accord','camping','zone_toleree')),
  titre text not null check (char_length(titre) between 3 and 60),
  description text check (char_length(description) <= 500),
  eau boolean, abri boolean, feu_autorise boolean, acces_voiture boolean,
  status text not null default 'pending' check (status in ('pending','published','rejected','hidden')),
  reports int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists community_spots_geo on public.community_spots (status, lat, lon);
alter table public.community_spots enable row level security;
drop policy if exists "spots publiés visibles" on public.community_spots;
create policy "spots publiés visibles" on public.community_spots for select using (status = 'published' or user_id = auth.uid() or public.is_admin());
drop policy if exists "partager un spot" on public.community_spots;
create policy "partager un spot" on public.community_spots for insert with check (auth.uid() = user_id and public.can_post());
drop policy if exists "modifier mon spot ou admin" on public.community_spots;
create policy "modifier mon spot ou admin" on public.community_spots for update using (user_id = auth.uid() or public.is_admin());
drop policy if exists "supprimer mon spot ou admin" on public.community_spots;
create policy "supprimer mon spot ou admin" on public.community_spots for delete using (user_id = auth.uid() or public.is_admin());

-- Publication directe pour les membres de confiance, file d'attente pour les autres
create or replace function public.spot_status_on_insert() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.status := case when coalesce((select trusted from profiles where id = new.user_id), false) then 'published' else 'pending' end;
  new.reports := 0;
  return new;
end $$;
drop trigger if exists spot_status_on_insert on public.community_spots;
create trigger spot_status_on_insert before insert on public.community_spots for each row execute function public.spot_status_on_insert();
-- Un utilisateur non admin ne peut pas publier lui-même son spot ; un membre pas encore de confiance qui modifie un spot publié repasse en relecture
create or replace function public.bump_approved(u uuid) returns void language sql security definer set search_path = public as $$
  update profiles set approved_count = approved_count + 1, trusted = trusted or approved_count + 1 >= 3 where id = u and public.is_admin() $$;
create or replace function public.spot_protect_update() returns trigger language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') and not public.is_admin() then
    new.reports := old.reports;
    new.status := case when old.status = 'published' and coalesce((select trusted from profiles where id = old.user_id), false) then 'published'
                       when old.status = 'published' then 'pending' else old.status end;
  end if;
  -- 3 spots validés => membre de confiance
  if old.status <> 'published' and new.status = 'published' then perform public.bump_approved(new.user_id); end if;
  return new;
end $$;
drop trigger if exists spot_protect_update on public.community_spots;
create trigger spot_protect_update before update on public.community_spots for each row execute function public.spot_protect_update();

-- ---------- Avis sur les spots ----------
create table if not exists public.spot_reviews (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.community_spots(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  note int not null check (note between 1 and 5),
  calme int check (calme between 1 and 5), proprete int check (proprete between 1 and 5),
  encore_ok boolean not null default true,      -- « J'y étais, c'est exact » / « n'existe plus »
  commentaire text check (char_length(commentaire) <= 280),
  visite date,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  unique (spot_id, user_id)
);
alter table public.spot_reviews enable row level security;
drop policy if exists "avis visibles" on public.spot_reviews;
create policy "avis visibles" on public.spot_reviews for select using (not hidden or user_id = auth.uid() or public.is_admin());
drop policy if exists "donner un avis" on public.spot_reviews;
create policy "donner un avis" on public.spot_reviews for insert with check (auth.uid() = user_id and public.can_post());
drop policy if exists "modifier mon avis" on public.spot_reviews;
create policy "modifier mon avis" on public.spot_reviews for update using (user_id = auth.uid() or public.is_admin());
drop policy if exists "supprimer mon avis" on public.spot_reviews;
create policy "supprimer mon avis" on public.spot_reviews for delete using (user_id = auth.uid() or public.is_admin());

-- Résumé des avis par spot (moyenne, nombre, dernier passage, « n'existe plus »)
create or replace view public.spot_summary with (security_invoker = true) as
  select spot_id, round(avg(note)::numeric, 1) as note_moy, count(*) as n_avis, max(visite) as dernier_passage,
         sum(case when encore_ok then 0 else 1 end) as n_disparu
  from public.spot_reviews where not hidden group by spot_id;

-- ---------- Photos (stockage) ----------
-- Bucket privé « spot-photos » : les photos sont relues avant d'être visibles.
create table if not exists public.spot_photos (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.community_spots(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  path text not null,
  status text not null default 'pending' check (status in ('pending','published','rejected')),
  created_at timestamptz not null default now()
);
alter table public.spot_photos enable row level security;
drop policy if exists "photos publiées visibles" on public.spot_photos;
create policy "photos publiées visibles" on public.spot_photos for select using (status = 'published' or user_id = auth.uid() or public.is_admin());
drop policy if exists "ajouter une photo" on public.spot_photos;
create policy "ajouter une photo" on public.spot_photos for insert with check (auth.uid() = user_id and public.can_post() and status = 'pending');
drop policy if exists "modérer les photos" on public.spot_photos;
create policy "modérer les photos" on public.spot_photos for update using (public.is_admin());
drop policy if exists "supprimer ma photo" on public.spot_photos;
create policy "supprimer ma photo" on public.spot_photos for delete using (user_id = auth.uid() or public.is_admin());

insert into storage.buckets (id, name, public) values ('spot-photos', 'spot-photos', false) on conflict (id) do nothing;
drop policy if exists "déposer mes photos" on storage.objects;
create policy "déposer mes photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'spot-photos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "lire photos publiées" on storage.objects;
create policy "lire photos publiées" on storage.objects for select using (
  bucket_id = 'spot-photos' and (
    (storage.foldername(name))[1] = auth.uid()::text or public.is_admin()
    or exists (select 1 from public.spot_photos p where p.path = name and p.status = 'published')));
drop policy if exists "supprimer mes photos" on storage.objects;
create policy "supprimer mes photos" on storage.objects for delete using (
  bucket_id = 'spot-photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- ---------- Signalements (erreurs dans les fiches, spots, avis, photos) ----------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,   -- possible sans compte
  kind text not null check (kind in ('fiche','espece','spot','avis','photo','autre')),
  target text not null check (char_length(target) <= 100),
  motif text check (char_length(motif) <= 60),
  message text not null check (char_length(message) between 5 and 1000),
  app_version text,
  status text not null default 'open' check (status in ('open','done','rejected')),
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "tout le monde signale" on public.reports;
create policy "tout le monde signale" on public.reports for insert with check (user_id is null or user_id = auth.uid());
drop policy if exists "admin lit les signalements" on public.reports;
create policy "admin lit les signalements" on public.reports for select using (public.is_admin());
drop policy if exists "admin traite les signalements" on public.reports;
create policy "admin traite les signalements" on public.reports for update using (public.is_admin());
-- Un spot signalé 3 fois est masqué en attendant la décision
create or replace function public.on_report() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.kind = 'spot' then
    update community_spots set reports = reports + 1,
      status = case when reports + 1 >= 3 and status = 'published' then 'hidden' else status end
    where id::text = new.target;
  end if;
  return new;
end $$;
drop trigger if exists on_report on public.reports;
create trigger on_report after insert on public.reports for each row execute function public.on_report();

-- ---------- Idées et votes ----------
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  titre text not null check (char_length(titre) between 5 and 90),
  detail text check (char_length(detail) <= 600),
  status text not null default 'pending' check (status in ('pending','open','planned','done','rejected')),
  created_at timestamptz not null default now()
);
alter table public.ideas enable row level security;
drop policy if exists "idées visibles" on public.ideas;
create policy "idées visibles" on public.ideas for select using (status <> 'pending' and status <> 'rejected' or user_id = auth.uid() or public.is_admin());
drop policy if exists "proposer une idée" on public.ideas;
create policy "proposer une idée" on public.ideas for insert with check (auth.uid() = user_id and public.can_post() and status = 'pending');
drop policy if exists "admin gère les idées" on public.ideas;
create policy "admin gère les idées" on public.ideas for update using (public.is_admin());

create table if not exists public.idea_votes (
  idea_id uuid not null references public.ideas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (idea_id, user_id)
);
alter table public.idea_votes enable row level security;
drop policy if exists "votes visibles" on public.idea_votes;
create policy "votes visibles" on public.idea_votes for select using (true);
drop policy if exists "voter" on public.idea_votes;
create policy "voter" on public.idea_votes for insert with check (auth.uid() = user_id and public.can_post());
drop policy if exists "retirer mon vote" on public.idea_votes;
create policy "retirer mon vote" on public.idea_votes for delete using (auth.uid() = user_id);

create or replace view public.idea_scores with (security_invoker = true) as
  select i.id, i.titre, i.detail, i.status, i.created_at, count(v.user_id) as votes
  from public.ideas i left join public.idea_votes v on v.idea_id = i.id group by i.id;

-- ---------- Supprimer mon compte (droit à l'effacement, RGPD) ----------
create or replace function public.delete_my_account() returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'non connecté'; end if;
  delete from storage.objects where bucket_id = 'spot-photos' and (storage.foldername(name))[1] = auth.uid()::text;
  delete from auth.users where id = auth.uid();   -- cascade : profil, données, spots, avis, votes
end $$;
revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
