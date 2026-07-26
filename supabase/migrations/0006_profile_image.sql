-- ============================================================
-- 0006_profile_image.sql
-- Lets the Hero section photo be managed from Admin > Settings instead of
-- being a hardcoded asset in the codebase.
-- ============================================================

alter table site_config add column if not exists profile_image_url text;

insert into storage.buckets (id, name, public) values
  ('profile', 'profile', true)
on conflict (id) do nothing;

create policy profile_public_read on storage.objects
  for select using (bucket_id = 'profile');

create policy profile_admin_write on storage.objects
  for insert with check (bucket_id = 'profile' and is_admin());

create policy profile_admin_update on storage.objects
  for update using (bucket_id = 'profile' and is_admin());

create policy profile_admin_delete on storage.objects
  for delete using (bucket_id = 'profile' and is_admin());
