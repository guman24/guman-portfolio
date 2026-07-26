-- ============================================================
-- 0004_seed_dev_data.sql
-- Placeholder content so Phase 1/2 have something real to render.
-- Everything here is editable later from /admin — treat as sample data, not final copy.
-- ============================================================

update site_config set
  headline = 'Full-Stack & Mobile Engineer',
  bio = 'I build fast, reliable products end-to-end — from React/Flutter interfaces down to the databases and infra underneath. Replace this bio from Admin > Settings.',
  available_for_hire = true,
  social_links = '{"github":"https://github.com/","linkedin":"https://linkedin.com/","twitter":"https://twitter.com/","email":"mailto:you@example.com"}'::jsonb,
  seo_title = 'Guman Singh Karki — Portfolio',
  seo_description = 'Full-stack and mobile engineer portfolio.'
where id = true;

insert into skills (name, domain, proficiency, years_experience, icon_name, description, sort_order) values
  ('Flutter', 'mobile', 5, 3.0, 'smartphone', 'Primary mobile framework — shipped multiple production apps.', 1),
  ('Swift', 'mobile', 3, 1.5, 'apple', 'Native iOS integrations and platform channels.', 2),
  ('React', 'frontend', 5, 4.0, 'atom', 'Daily driver for web UIs, including this site.', 1),
  ('TypeScript', 'frontend', 5, 4.0, 'file-code', 'Preferred language for anything shipping to prod.', 2),
  ('Tailwind CSS', 'frontend', 4, 3.0, 'palette', 'Default styling approach for new projects.', 3),
  ('Node.js', 'backend', 4, 3.5, 'server', 'APIs, background jobs, tooling.', 1),
  ('PostgreSQL', 'backend', 4, 3.5, 'database', 'Primary relational datastore, comfortable with RLS-based auth models.', 2),
  ('Supabase', 'backend', 4, 1.5, 'flame', 'Auth, Postgres, storage, and edge functions for smaller apps.', 3),
  ('Docker', 'cloud_devops', 3, 2.5, 'container', 'Local dev parity and deployment packaging.', 1),
  ('GitHub Actions', 'cloud_devops', 3, 2.0, 'git-branch', 'CI/CD pipelines for web and mobile releases.', 2),
  ('VS Code', 'daily_tools', 5, 5.0, 'code', 'Primary editor.', 1),
  ('Claude Code', 'daily_tools', 4, 0.5, 'terminal', 'AI pair-programmer in the daily workflow.', 2)
on conflict (name, domain) do nothing;

insert into experience (type, title, organization, location, start_date, end_date, is_current, description, highlights, sort_order) values
  ('role', 'Senior Mobile Engineer', 'Acme Corp', 'Remote', '2023-01-01', null, true,
    'Leading mobile development for a consumer fitness app.',
    array['Shipped a Flutter rewrite reducing crash rate by 40%', 'Introduced CI/CD pipeline for App Store & Play Store releases'],
    1),
  ('role', 'Full-Stack Developer', 'Prior Company', 'Remote', '2020-06-01', '2022-12-31', false,
    'Built and maintained internal tools and customer-facing web apps.',
    array['Migrated legacy PHP app to a React/Node stack', 'Owned deployment infrastructure on AWS'],
    2),
  ('education', 'B.S. Computer Science', 'Your University', null, '2016-09-01', '2020-05-31', false,
    null, array[]::text[], 3)
on conflict do nothing;

insert into projects (
  slug, title, summary, description, case_study_body, category, tech_stack,
  thumbnail_url, live_url, repo_url, problem_statement, architecture_notes,
  impact_metrics, featured, sort_order, published
) values
  (
    'fitapp-mobile', 'FitApp — Fitness Tracking',
    'A cross-platform fitness tracking app built with Flutter.',
    'Workout logging, coaching chat, and progress tracking for everyday athletes.',
    E'## Problem\nAthletes needed a single app to log workouts and chat with a coach.\n\n## Solution\nA Flutter app backed by a real-time chat and workout-log sync engine.',
    'mobile', array['Flutter', 'Dart', 'Firebase', 'Supabase'],
    null, null, null,
    'Existing fitness apps split workout logging and coach communication across separate tools.',
    'Flutter client with a Supabase Postgres backend; real-time chat via Supabase Realtime channels.',
    '[{"label":"Active users","value":"1,200+"},{"label":"Crash-free rate","value":"99.6%"}]'::jsonb,
    true, 1, true
  ),
  (
    'portfolio-cms', 'Portfolio + Admin CMS',
    'This site — a React/Supabase portfolio with a full admin panel.',
    'Public portfolio site with a protected CMS for managing projects, skills, timeline, and leads.',
    E'## Problem\nUpdating a static portfolio required a code push for every content change.\n\n## Solution\nA Postgres-backed CMS with RLS-enforced admin routes, no server runtime required.',
    'full_stack', array['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'TanStack Query'],
    null, null, null,
    'Static portfolios are slow to update — every content change needs a deploy.',
    'Vite SPA + Supabase Postgres/Auth/Storage; RLS is the security boundary since there is no server runtime.',
    '[{"label":"Content update time","value":"~30s, no deploy"}]'::jsonb,
    true, 2, true
  )
on conflict (slug) do nothing;
