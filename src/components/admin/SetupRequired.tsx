import { Database } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Supabase hali ulanmagan bo‘lsa admin panel o‘rniga ko‘rsatiladi. */
export function SetupRequired() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-50 p-6">
      <div className="card max-w-2xl p-8 sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Database className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-forest-950">Admin panel uchun Supabase ulanishi kerak</h1>
        <p className="mt-2 text-forest-900/70">
          Ma’lumotlarni saqlash, rasmlar yuklash va server tomonidagi autentifikatsiya Supabase orqali ishlaydi. Quyidagi qadamlarni bajaring:
        </p>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-forest-900/85">
          <li>
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-700 underline">
              supabase.com
            </a>{' '}
            da yangi loyiha yarating.
          </li>
          <li>
            SQL Editor’da <code className="rounded bg-forest-50 px-1.5">supabase/schema.sql</code>, so‘ng{' '}
            <code className="rounded bg-forest-50 px-1.5">supabase/seed.sql</code> fayllarini ishga tushiring.
          </li>
          <li>
            Authentication → Users bo‘limida administrator foydalanuvchisini yarating va{' '}
            <code className="rounded bg-forest-50 px-1.5">supabase/make-admin.sql</code> ni ishga tushiring.
          </li>
          <li>
            Loyiha ildizida <code className="rounded bg-forest-50 px-1.5">.env</code> faylini yarating (<code>.env.example</code> asosida) va
            dev-serverni qayta ishga tushiring.
          </li>
        </ol>
        <Link to="/" className="btn-outline mt-8">
          Saytga qaytish
        </Link>
      </div>
    </div>
  )
}
