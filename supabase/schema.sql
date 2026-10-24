-- =====================================================================
-- EcoSchool16 — Supabase sxemasi
-- Supabase Dashboard → SQL Editor → ushbu faylni to‘liq ishga tushiring.
-- Fayl qayta ishga tushirilsa ham xavfsiz (idempotent).
-- =====================================================================


-- ---------------------------------------------------------------------
-- Administratorlar ro‘yxati va tekshiruv funksiyasi
-- Faqat shu jadvaldagi foydalanuvchilar ma'lumotlarni o‘zgartira oladi.
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- Sayt sozlamalari (bitta qator, id = 1)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  school_name text not null default '16-maktab',
  project_name text not null default 'EcoSchool16',
  address text,
  phone text,
  email text,
  working_hours text,
  map_url text,
  telegram_url text,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  hero_image_url text,
  green_school_goal text,
  green_school_preparation text,
  green_school_works text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Statistika (qiymatlar faqat administrator tomonidan kiritiladi)
-- ---------------------------------------------------------------------
create table if not exists public.stats (
  key text primary key,
  label text not null,
  value numeric,
  unit text,
  note text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- "7 qadam" metodologiyasi
-- ---------------------------------------------------------------------
create table if not exists public.steps (
  step_number int primary key check (step_number between 1 and 20),
  title text not null,
  short_description text not null default '',
  description text not null default '',
  icon text not null default 'Leaf',
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed')),
  updated_at timestamptz not null default now()
);

create table if not exists public.step_activities (
  id uuid primary key default gen_random_uuid(),
  step_number int not null references public.steps (step_number) on delete cascade,
  title text not null,
  description text,
  result text,
  activity_date date,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Ekologik loyihalar
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text,
  goal text,
  activities text,
  results text,
  icon text not null default 'Leaf',
  cover_image text,
  images text[] not null default '{}',
  status text not null default 'planned' check (status in ('planned', 'active', 'completed')),
  start_date date,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Yangiliklar
-- ---------------------------------------------------------------------
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  published_at date not null default current_date,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Galereya
-- ---------------------------------------------------------------------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text not null default 'tadbirlar'
    check (category in ('tadbirlar', 'daraxt-ekish', 'oldin-keyin', 'oquvchilar', 'natijalar')),
  image_url text not null,
  before_image_url text,
  taken_at date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Yutuqlar, sertifikatlar, diplomlar, tanlovlar
-- ---------------------------------------------------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null default 'sertifikat'
    check (kind in ('sertifikat', 'diplom', 'mukofot', 'tanlov')),
  issuer text,
  achieved_at date,
  description text,
  image_url text,
  document_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Green School 2026 dalillari
-- ---------------------------------------------------------------------
create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  step_number int references public.steps (step_number) on delete set null,
  evidence_date date,
  image_url text,
  link_url text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Aloqa formasi xabarlari
-- ---------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text check (email is null or char_length(email) <= 200),
  phone text check (phone is null or char_length(phone) <= 40),
  message text not null check (char_length(message) between 5 and 4000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- updated_at triggeri
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['site_settings', 'stats', 'steps', 'projects', 'news'] loop
    execute format('drop trigger if exists trg_touch on public.%I', t);
    execute format(
      'create trigger trg_touch before update on public.%I for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Row Level Security — serverda ruxsatlarni tekshirish
-- Hamma o‘qiy oladi (nashr etilgan kontent), faqat adminlar yozadi.
-- ---------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.stats enable row level security;
alter table public.steps enable row level security;
alter table public.step_activities enable row level security;
alter table public.projects enable row level security;
alter table public.news enable row level security;
alter table public.gallery enable row level security;
alter table public.achievements enable row level security;
alter table public.evidence enable row level security;
alter table public.contact_messages enable row level security;

-- admins: foydalanuvchi faqat o‘zini ko‘ra oladi; yozish faqat SQL Editor orqali
drop policy if exists "admins_self_read" on public.admins;
create policy "admins_self_read" on public.admins for select using (user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['site_settings', 'stats', 'steps', 'step_activities', 'gallery', 'achievements', 'evidence'] loop
    execute format('drop policy if exists "public_read" on public.%I', t);
    execute format('create policy "public_read" on public.%I for select using (true)', t);
    execute format('drop policy if exists "admin_write" on public.%I', t);
    execute format(
      'create policy "admin_write" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;

  -- projects va news: mehmonlar faqat nashr etilganlarini ko‘radi
  foreach t in array array['projects', 'news'] loop
    execute format('drop policy if exists "public_read" on public.%I', t);
    execute format('create policy "public_read" on public.%I for select using (published or public.is_admin())', t);
    execute format('drop policy if exists "admin_write" on public.%I', t);
    execute format(
      'create policy "admin_write" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- contact_messages: hamma yubora oladi, faqat admin o‘qiydi/o‘chiradi
drop policy if exists "anyone_insert" on public.contact_messages;
create policy "anyone_insert" on public.contact_messages for insert with check (is_read = false);
drop policy if exists "admin_read" on public.contact_messages;
create policy "admin_read" on public.contact_messages for select using (public.is_admin());
drop policy if exists "admin_update" on public.contact_messages;
create policy "admin_update" on public.contact_messages for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_delete" on public.contact_messages;
create policy "admin_delete" on public.contact_messages for delete using (public.is_admin());

-- ---------------------------------------------------------------------
-- Storage: "media" bucket — hamma ko‘radi, faqat admin yuklaydi/o‘chiradi
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());
