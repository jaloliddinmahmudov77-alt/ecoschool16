# EcoSchool16 — Green School ekologik platformasi

16-maktabning ekologik faoliyati, Eco-Schools “7 qadam” metodologiyasi, loyihalari, natijalari va **Green School 2026** respublika tanloviga tayyorgarligini namoyish etuvchi veb-platforma.

**Texnologiyalar:** React 19 + Vite + TypeScript, Tailwind CSS 4, React Router, Framer Motion, Lucide icons, Supabase (ma’lumotlar bazasi, autentifikatsiya, rasm yuklash).

---

## 1. Tez ishga tushirish (Supabase’siz, demo rejim)

```bash
npm install
npm run dev
```

Brauzerda `http://localhost:5173` ni oching. Supabase sozlanmagan bo‘lsa sayt **boshlang‘ich shablon kontent** bilan ishlaydi (7 qadam tavsiflari, 6 ta loyiha tavsifi). Statistika, yutuqlar, galereya va yangiliklar bo‘sh ko‘rinadi — ular faqat administrator kiritgan haqiqiy ma’lumotlar bilan to‘ldiriladi. Aloqa formasi va admin panel Supabase ulangach ishlaydi.

## 2. Supabase’ni sozlash (to‘liq ishlashi uchun)

1. [supabase.com](https://supabase.com/dashboard) da bepul loyiha yarating.
2. **SQL Editor** → `supabase/schema.sql` faylining to‘liq matnini qo‘yib, **Run** bosing.
   Bu jadvallar, Row Level Security siyosatlari va `media` rasm bucket’ini yaratadi.
3. Xuddi shu yerda `supabase/seed.sql` ni ishga tushiring (7 qadam va 6 loyihaning boshlang‘ich matni).
4. **Authentication → Users → Add user → Create new user**: administrator email va kuchli parolini kiriting, *Auto Confirm User* ni belgilang.
5. `supabase/make-admin.sql` dagi `admin@example.com` ni o‘sha emailga almashtirib, SQL Editor’da ishga tushiring.
6. **Project Settings → API** bo‘limidan `Project URL` va `anon public` kalitini oling. Loyiha ildizida `.env` fayl yarating:

   ```env
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

7. Dev-serverni qayta ishga tushiring va `http://localhost:5173/admin` ga kiring.

> **Tavsiya:** Authentication → Providers → Email bo‘limida *Allow new users to sign up* ni o‘chiring — shunda begonalar hisob ocha olmaydi. (Ochgan taqdirda ham ular hech narsani o‘zgartira olmaydi — pastga qarang.)

## 3. Xavfsizlik qanday ta’minlangan

Ruxsatlar **serverda** — Postgres Row Level Security orqali tekshiriladi, frontend tekshiruvi faqat qulaylik uchun:

| Kim | Nima qila oladi |
| --- | --- |
| Mehmon | Nashr etilgan kontentni o‘qish, aloqa formasi orqali xabar yuborish |
| Ro‘yxatdan o‘tgan, lekin admin bo‘lmagan foydalanuvchi | Mehmon bilan bir xil |
| `public.admins` jadvalidagi foydalanuvchi | Barcha kontentni qo‘shish / tahrirlash / o‘chirish, rasm yuklash, xabarlarni o‘qish |

- `public.is_admin()` funksiyasi joriy JWT foydalanuvchisini `admins` jadvalidan tekshiradi; barcha yozish siyosatlari shu funksiyaga bog‘langan.
- `admins` jadvaliga faqat SQL Editor (service role) orqali yozish mumkin — foydalanuvchi o‘zini admin qila olmaydi.
- `media` bucket: hamma ko‘radi, faqat admin yuklaydi/o‘chiradi.
- Aloqa xabarlarini faqat admin ko‘radi; uzunlik cheklovlari bazada ham tekshiriladi.

Sxema va siyosatlar PGlite (WASM’dagi Postgres) yordamida, Supabase’ning `auth`/`storage` sxemalarini taqlid qilib sinab ko‘rilgan. Haqiqiy Supabase loyihasida ham bir marta tekshirib chiqing.

## 4. Admin panel imkoniyatlari (`/admin`)

- **Sayt va aloqa** — maktab nomi, manzil, telefon, email, ish vaqti, xarita, ijtimoiy tarmoqlar, hero rasmi, Green School 2026 matnlari
- **Statistika** — 4 ko‘rsatkich (qiymat bo‘sh bo‘lsa saytda “Ma’lumot kiritilmagan”)
- **7 qadam** — har bir qadam matni, holati, ikonkasi + bajarilgan ishlar (sana, tavsif, natija, fotosuratlar)
- **Loyihalar** — CRUD, maqsad, bajarilgan ishlar, natijalar, muqova va fotosuratlar, yashirish
- **Yangiliklar** — CRUD, qoralama/nashr, rasm
- **Galereya** — 5 kategoriya, “oldin-keyin” taqqoslash slayderi
- **Yutuqlar** — sertifikat, diplom, mukofot, tanlov; tasdiqlovchi hujjat (PDF/rasm)
- **Green School dalillari** — qadamga bog‘langan hujjat va fotosuratlar
- **Xabarlar** — aloqa formasidan kelgan xabarlar

Yuklangan rasmlar brauzerda avtomatik WebP formatiga siqiladi (maks. 1920 px). Yozuv o‘chirilganda unga tegishli fayllar ham storage’dan o‘chiriladi.

## 5. Kontent bo‘yicha qoidalar

- Raqamlar, yutuqlar va natijalar faqat hujjat bilan tasdiqlangan holda kiritilsin. Saytda uydirma qiymat yo‘q — bo‘sh maydonlar halol “kiritilmagan” deb ko‘rsatiladi.
- Maktabning haqiqiy fotosuratlari `public/images/school/` da (hero, “Biz haqimizda”, “Yashil maktab”, “Toza hudud”, “Yosh ekologlar” loyihalari va galereya). Qolgan 3 loyiha muqovasi Unsplash’dan olingan **illyustrativ** rasm va “Illyustrativ rasm” deb belgilangan — haqiqiy foto bilan almashtiring.
- Matnlarda paragraflarni bo‘sh qator bilan, ro‘yxat elementlarini yangi qator bilan ajrating.

## 6. Production build va joylashtirish

```bash
npm run build
```

`dist/` papkasini Vercel, Netlify yoki Cloudflare Pages’ga joylang va hosting sozlamalariga `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` ni qo‘shing. Bu SPA bo‘lgani uchun barcha yo‘llarni `index.html` ga yo‘naltiring:

- **Netlify:** `public/_redirects` fayli tayyor
- **Vercel:** `vercel.json` fayli tayyor

## 7. Loyiha tuzilmasi

```
src/
  components/
    admin/      Admin panel: layout, umumiy CRUD (ResourceManager), forma maydonlari, rasm yuklash
    layout/     Header, Footer, PublicLayout
    ui/         Logo, Lightbox, PageHero, Reveal animatsiyasi, yuklanish/xato holatlari
    cards.tsx   Loyiha, yangilik, qadam, statistika kartochkalari
  data/         Boshlang‘ich kontent (defaults.ts) va statik matnlar
  hooks/        useAsync, usePageMeta (SEO)
  i18n/         Tarjimalar (hozircha uz)
  lib/          Supabase klienti, API, auth, sozlamalar, formatlash
  pages/        Ommaviy sahifalar va pages/admin
supabase/       schema.sql, seed.sql, make-admin.sql
scripts/        generate-seed.ts — seed.sql ni defaults.ts dan yaratadi
```

**Yangi til qo‘shish:** `src/i18n/uz.ts` asosida `ru.ts` / `en.ts` yarating va `src/i18n/index.tsx` dagi `languages` obyektiga qo‘shing. Bazadagi kontent uchun jadvallarga `_ru` / `_en` ustunlari qo‘shiladi.

**Boshlang‘ich kontentni o‘zgartirish:** `src/data/defaults.ts` ni tahrirlang va `npm run seed:generate` ni ishga tushiring.
