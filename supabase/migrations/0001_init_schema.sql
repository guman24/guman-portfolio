-- ============================================================
-- 0001_init_schema.sql
-- Core tables for the portfolio + admin CMS.
-- ============================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------- updated_at trigger helper ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- admin_users: single-owner RBAC anchor table
-- ============================================================
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'owner' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

-- security definer function: RLS policies call this instead of embedding
-- a hardcoded email, and it's immune to being blocked by RLS on admin_users itself.
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$ language sql security definer stable;

-- ============================================================
-- projects
-- ============================================================
create type project_category as enum ('mobile', 'full_stack', 'ui_ux', 'ai_tools');

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,               -- short card description
  description text,                    -- longer public blurb (optional, distinct from case study)
  case_study_body text,                -- markdown, full case study content
  category project_category not null,
  tech_stack text[] not null default '{}',
  thumbnail_url text,
  video_url text,
  live_url text,
  repo_url text,
  problem_statement text,
  architecture_notes text,
  impact_metrics jsonb not null default '[]',   -- [{label, value}] structured "measurable impact"
  featured boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default false,
  view_count integer not null default 0,        -- denormalized counter
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_projects_published on projects (published, sort_order);
create index idx_projects_category on projects (category) where published;
create index idx_projects_featured on projects (featured) where published;
create trigger trg_projects_updated_at before update on projects
  for each row execute function set_updated_at();

-- project_views: append-only log, gives the dashboard real time-series data
create table project_views (
  id bigint generated always as identity primary key,
  project_id uuid not null references projects(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  referrer text
);
create index idx_project_views_project_time on project_views (project_id, viewed_at desc);

-- RPC: atomic increment, callable by anon, avoids read-then-write race
create or replace function increment_project_view(p_project_id uuid, p_referrer text default null)
returns void as $$
begin
  update projects set view_count = view_count + 1 where id = p_project_id and published;
  insert into project_views (project_id, referrer) values (p_project_id, p_referrer);
end;
$$ language plpgsql security definer;

-- ============================================================
-- skills
-- ============================================================
create type skill_domain as enum ('mobile', 'frontend', 'backend', 'cloud_devops', 'daily_tools');

create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain skill_domain not null,
  proficiency smallint not null check (proficiency between 1 and 5),
  years_experience numeric(3,1),
  icon_name text,                 -- lucide icon key
  description text,               -- context blurb shown on hover/expand
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, domain)
);
create index idx_skills_domain on skills (domain, sort_order) where published;
create trigger trg_skills_updated_at before update on skills
  for each row execute function set_updated_at();

-- ============================================================
-- experience (roles / milestones timeline)
-- ============================================================
create type experience_type as enum ('role', 'project_milestone', 'education', 'certification');

create table experience (
  id uuid primary key default gen_random_uuid(),
  type experience_type not null default 'role',
  title text not null,              -- e.g. "Senior Mobile Engineer"
  organization text,
  location text,
  start_date date not null,
  end_date date,                    -- null = current/ongoing
  is_current boolean not null default false,
  description text,
  highlights text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_experience_published on experience (published, start_date desc);
create trigger trg_experience_updated_at before update on experience
  for each row execute function set_updated_at();

-- ============================================================
-- messages (contact/lead capture inbox)
-- ============================================================
create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  body text not null,
  is_read boolean not null default false,
  is_starred boolean not null default false,
  source_ip inet,                    -- captured server-side (edge function), for spam triage
  created_at timestamptz not null default now()
);
create index idx_messages_created_at on messages (created_at desc);
create index idx_messages_unread on messages (is_read) where not is_read;

-- message_submissions_log: pure rate-limit ledger, never exposed to any client role
create table message_submissions_log (
  id bigint generated always as identity primary key,
  ip inet not null,
  submitted_at timestamptz not null default now()
);
create index idx_submissions_ip_time on message_submissions_log (ip, submitted_at desc);

-- ============================================================
-- site_config (singleton row: hire status, bio, resume, SEO)
-- ============================================================
create table site_config (
  id boolean primary key default true check (id),  -- enforces single row
  available_for_hire boolean not null default true,
  bio text,
  headline text,
  resume_url text,
  seo_title text,
  seo_description text,
  seo_og_image_url text,
  social_links jsonb not null default '{}',    -- {github, linkedin, twitter, ...}
  booking_url text,
  updated_at timestamptz not null default now()
);
insert into site_config (id) values (true);
create trigger trg_site_config_updated_at before update on site_config
  for each row execute function set_updated_at();
