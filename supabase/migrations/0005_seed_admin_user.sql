-- ============================================================
-- 0005_seed_admin_user.sql
-- Links the Supabase Auth user created via Dashboard > Authentication > Users
-- to admin_users, which is what is_admin() checks for RLS + the client route guard.
-- ============================================================

insert into admin_users (id, email)
select id, email from auth.users where id = 'b5a4dde4-ec4e-4af7-9587-a1715ebc67ba'
on conflict (id) do nothing;
