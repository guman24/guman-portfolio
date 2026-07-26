-- ============================================================
-- 0002_rls_policies.sql
-- RLS is the real security boundary for this app (no server runtime).
-- ============================================================

alter table admin_users enable row level security;
alter table projects enable row level security;
alter table project_views enable row level security;
alter table skills enable row level security;
alter table experience enable row level security;
alter table messages enable row level security;
alter table message_submissions_log enable row level security;
alter table site_config enable row level security;

-- ---------- admin_users ----------
create policy admin_users_select_self on admin_users
  for select using (is_admin());

-- ---------- projects ----------
create policy projects_public_select on projects
  for select using (published = true);

create policy projects_admin_select_all on projects
  for select using (is_admin());

create policy projects_admin_insert on projects
  for insert with check (is_admin());

create policy projects_admin_update on projects
  for update using (is_admin()) with check (is_admin());

create policy projects_admin_delete on projects
  for delete using (is_admin());

-- ---------- project_views ----------
-- Writes only via increment_project_view() (security definer, bypasses RLS).
-- No insert/update/delete policy needed for anon/authenticated.
create policy project_views_admin_select on project_views
  for select using (is_admin());

-- ---------- skills ----------
create policy skills_public_select on skills
  for select using (published = true);
create policy skills_admin_select_all on skills
  for select using (is_admin());
create policy skills_admin_insert on skills for insert with check (is_admin());
create policy skills_admin_update on skills for update using (is_admin()) with check (is_admin());
create policy skills_admin_delete on skills for delete using (is_admin());

-- ---------- experience ----------
create policy experience_public_select on experience
  for select using (published = true);
create policy experience_admin_select_all on experience
  for select using (is_admin());
create policy experience_admin_insert on experience for insert with check (is_admin());
create policy experience_admin_update on experience for update using (is_admin()) with check (is_admin());
create policy experience_admin_delete on experience for delete using (is_admin());

-- ---------- messages ----------
-- Deliberately NO public insert policy: RLS can't express "max N inserts per
-- IP per hour," so the contact form writes through the `contact-submit` Edge
-- Function using the service-role key (which bypasses RLS) after a rate-limit
-- + honeypot check. This closes the gap an insert-only policy would leave open
-- to anyone hitting the REST API directly with curl.
create policy messages_admin_select on messages
  for select using (is_admin());
create policy messages_admin_update on messages
  for update using (is_admin()) with check (is_admin());
create policy messages_admin_delete on messages
  for delete using (is_admin());

-- ---------- message_submissions_log ----------
-- RLS enabled, zero policies defined => fully denied to anon/authenticated.
-- Only the service role (used inside the Edge Function) bypasses RLS entirely.

-- ---------- site_config ----------
create policy site_config_public_select on site_config
  for select using (true);   -- whole row is public-safe; never store secrets here
create policy site_config_admin_update on site_config
  for update using (is_admin()) with check (is_admin());
-- no insert/delete policies — singleton row seeded once in 0001.
