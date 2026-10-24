-- Administrator tayinlash.
-- 1) Supabase Dashboard → Authentication → Users → "Add user" orqali
--    email va parol bilan foydalanuvchi yarating ("Auto Confirm User" belgilang).
-- 2) Quyidagi emailni o‘zingiznikiga almashtirib, SQL Editor’da ishga tushiring.
insert into public.admins (user_id)
select id from auth.users where email = 'admin@example.com'
on conflict (user_id) do nothing;

-- Tekshirish:
-- select u.email from public.admins a join auth.users u on u.id = a.user_id;
