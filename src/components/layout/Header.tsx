import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { Logo } from '../ui/Logo'

export function Header() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/biz-haqimizda', label: t.nav.about },
    { to: '/7-qadam', label: t.nav.steps },
    { to: '/yutuqlar', label: t.nav.achievements },
    { to: '/galereya', label: t.nav.gallery },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'bg-white/90 py-3 shadow-sm shadow-forest-900/5 backdrop-blur-lg' : 'bg-transparent py-5'
      }`}
    >
      <a href="#main" className="sr-only rounded bg-white px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2">
        Asosiy kontentga o‘tish
      </a>
      <div className="container-x flex items-center justify-between gap-4">
        <Logo light={!solid} />
        <nav aria-label="Asosiy menyu" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `relative rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                      isActive
                        ? solid
                          ? 'bg-forest-100 text-forest-800'
                          : 'bg-white/20 text-white'
                        : solid
                          ? 'text-forest-900/70 hover:bg-forest-50 hover:text-forest-900'
                          : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          className={`rounded-xl p-2.5 xl:hidden ${solid ? 'text-forest-900 hover:bg-forest-50' : 'text-white hover:bg-white/10'}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.common.close : t.common.menu}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobil menyu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden"
          >
            <ul className="container-x flex max-h-[calc(100vh-80px)] flex-col gap-1 overflow-y-auto pt-4 pb-6">
              {links.map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-base font-semibold ${
                        isActive ? 'bg-forest-100 text-forest-800' : 'text-forest-900 hover:bg-forest-50'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
