import { Leaf, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { useSettings } from '../../lib/settings'
import { LogoMark } from '../ui/Logo'
import { SocialLinks } from '../ui/SocialLinks'

export function Footer() {
  const { t } = useI18n()
  const { settings } = useSettings()

  const sections = [
    { to: '/biz-haqimizda', label: t.nav.about },
    { to: '/7-qadam', label: t.nav.steps },
    { to: '/loyihalar', label: t.nav.projects },
    { to: '/yutuqlar', label: t.nav.achievements },
    { to: '/galereya', label: t.nav.gallery },
    { to: '/yangiliklar', label: t.nav.news },
    { to: '/aloqa', label: t.nav.contact },
  ]

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-white">
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-forest-700/30 blur-3xl" />
      <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-sky-eco-700/20 blur-3xl" />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3">
            <LogoMark className="h-12 w-12" />
            <span className="text-2xl font-extrabold">
              EcoSchool<span className="text-leaf-300">16</span>
            </span>
          </Link>
          <p className="mt-5 max-w-md leading-relaxed text-white/65">
            {settings.school_name}ning ekologik platformasi — Eco-Schools “7 qadam” metodologiyasi asosidagi faoliyatimiz, loyihalarimiz va
            natijalarimiz.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf-400/15 px-4 py-2 font-display text-lg text-leaf-300">
            <Leaf className="h-5 w-5" aria-hidden="true" /> {t.footer.slogan}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-widest text-white/50 uppercase">Bo‘limlar</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-1">
            {sections.map((s) => (
              <li key={s.to}>
                <Link to={s.to} className="text-white/75 transition hover:text-leaf-300">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-widest text-white/50 uppercase">Aloqa</h2>
          <ul className="mt-4 space-y-3 text-white/75">
            {settings.address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-leaf-300" aria-hidden="true" /> {settings.address}
              </li>
            )}
            {settings.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-leaf-300" aria-hidden="true" />
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-leaf-300" aria-hidden="true" />
                <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
            {!settings.address && !settings.phone && !settings.email && (
              <li>
                <Link to="/aloqa" className="hover:text-white">
                  Aloqa formasi orqali yozing →
                </Link>
              </li>
            )}
          </ul>
          <SocialLinks settings={settings} className="mt-5" />
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-sm text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} EcoSchool16 · {settings.school_name}. {t.footer.rights}
          </p>
          <p>Eco-Schools Uzbekistan · Green School 2026</p>
        </div>
      </div>
    </footer>
  )
}
