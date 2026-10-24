import {
  BarChart3, ExternalLink, FileCheck2, Footprints, FolderKanban, Images, Inbox, LayoutDashboard, LogOut, Menu, Newspaper, Settings, Trophy,
} from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { isSupabaseConfigured } from '../../lib/supabase'
import { LogoMark } from '../ui/Logo'
import { Loader } from '../ui/States'
import { SetupRequired } from './SetupRequired'
import { ToastProvider } from './Toast'

const nav = [
  { to: '/admin', label: 'Boshqaruv paneli', icon: LayoutDashboard, end: true },
  { to: '/admin/sozlamalar', label: 'Sayt va aloqa', icon: Settings },
  { to: '/admin/statistika', label: 'Statistika', icon: BarChart3 },
  { to: '/admin/7-qadam', label: '7 qadam', icon: Footprints },
  { to: '/admin/loyihalar', label: 'Loyihalar', icon: FolderKanban },
  { to: '/admin/yangiliklar', label: 'Yangiliklar', icon: Newspaper },
  { to: '/admin/galereya', label: 'Galereya', icon: Images },
  { to: '/admin/yutuqlar', label: 'Yutuqlar', icon: Trophy },
  { to: '/admin/dalillar', label: 'Green School dalillari', icon: FileCheck2 },
  { to: '/admin/xabarlar', label: 'Xabarlar', icon: Inbox },
]

export function AdminLayout() {
  const { session, isAdmin, loading, signOut } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    document.title = 'Admin panel — EcoSchool16'
    return () => meta.remove()
  }, [])

  if (!isSupabaseConfigured) return <SetupRequired />
  if (loading) return <Loader className="min-h-screen" label="Tekshirilmoqda…" />
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/admin" className="flex items-center gap-2.5 px-5 py-5">
        <LogoMark className="h-9 w-9" />
        <span>
          <span className="block font-extrabold text-white">EcoSchool16</span>
          <span className="block text-xs text-white/50">Administrator</span>
        </span>
      </Link>
      <nav aria-label="Admin menyu" className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {nav.map((n) => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    isActive ? 'bg-white text-forest-900' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <n.icon className="h-[18px] w-[18px]" aria-hidden="true" /> {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white">
          <ExternalLink className="h-[18px] w-[18px]" aria-hidden="true" /> Saytni ochish
        </a>
        <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white">
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" /> Chiqish
        </button>
        <p className="truncate px-3 pt-2 text-xs text-white/40">{session.user.email}</p>
      </div>
    </div>
  )

  return (
    <ToastProvider>
      <div className="min-h-screen bg-forest-50/50">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-forest-950 lg:block">{sidebar}</aside>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 bg-forest-950">{sidebar}</aside>
          </div>
        )}
        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-forest-100 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
            <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-forest-50" aria-label="Menyuni ochish">
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-bold text-forest-900">EcoSchool16 · Admin</span>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
            <Suspense fallback={<Loader />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
