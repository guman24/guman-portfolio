-- ============================================================
-- 0003_storage_buckets.sql
-- ============================================================

insert into storage.buckets (id, name, public) values
  ('project-media', 'project-media', true),
  ('resume', 'resume', true);

-- project-media: public read, admin-only write
create policy project_media_public_read on storage.objects
  for select using (bucket_id = 'project-media');

create policy project_media_admin_write on storage.objects
  for insert with check (bucket_id = 'project-media' and is_admin());

create policy project_media_admin_update on storage.objects
  for update using (bucket_id = 'project-media' and is_admin());

create policy project_media_admin_delete on storage.objects
  for delete using (bucket_id = 'project-media' and is_admin());

-- resume: public read, admin-only write
create policy resume_public_read on storage.objects
  for select using (bucket_id = 'resume');

create policy resume_admin_write on storage.objects
  for insert with check (bucket_id = 'resume' and is_admin());

create policy resume_admin_update on storage.objects
  for update using (bucket_id = 'resume' and is_admin());

create policy resume_admin_delete on storage.objects
  for delete using (bucket_id = 'resume' and is_admin());
