import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { SetupRequired } from '../../components/admin/SetupRequired'
import { LogoMark } from '../../components/ui/Logo'
import { Loader } from '../../components/ui/States'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useAuth } from '../../lib/auth'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function AdminLoginPage() {
  usePageMeta('Administrator kirishi')
  const { session, isAdmin, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!isSupabaseConfigured) return <SetupRequired />
  if (loading) return <Loader className="min-h-screen" />
  if (session && isAdmin) return <Navigate to={from} replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-950 via-forest-900 to-sky-eco-700/60 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14" />
          <h1 className="mt-4 text-2xl font-bold text-forest-950">Administrator kirishi</h1>
          <p className="mt-1 text-sm text-forest-900/60">EcoSchool16 boshqaruv paneli</p>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="login-email" className="label">
              Elektron pochta
            </label>
            <input id="login-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </div>
          <div>
            <label htmlFor="login-password" className="label">
              Parol
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-11"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-forest-500 hover:bg-forest-50"
                aria-label={show ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn-primary mt-6 w-full py-3.5">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Kirish
        </button>
        <Link to="/" className="mt-5 block text-center text-sm font-semibold text-forest-600 hover:underline">
          ← Saytga qaytish
        </Link>
      </form>
    </div>
  )
}
