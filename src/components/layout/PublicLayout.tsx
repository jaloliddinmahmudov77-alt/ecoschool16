import { X } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Loader } from '../ui/States'
import { Footer } from './Footer'
import { Header } from './Header'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function DemoNotice() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="fixed bottom-4 left-4 z-40 flex max-w-sm gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 shadow-lg ring-1 ring-amber-200 max-sm:right-4">
      <p>
        <b>Demo rejim:</b> Supabase sozlanmagan. Sayt boshlang‘ich shablon kontent bilan ishlamoqda. README’dagi ko‘rsatmaga qarang.
      </p>
      <button onClick={() => setVisible(false)} className="shrink-0 self-start rounded-lg p-1 hover:bg-amber-100" aria-label="Yopish">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main" className="min-h-screen">
        <Suspense fallback={<Loader className="min-h-screen" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      {!isSupabaseConfigured && import.meta.env.DEV && <DemoNotice />}
    </>
  )
}
