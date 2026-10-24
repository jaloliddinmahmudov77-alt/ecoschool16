import { Link } from 'react-router-dom'

export function LogoMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#256d41" />
          <stop offset="1" stopColor="#0a2215" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#logo-g)" />
      <path
        d="M36 10C20 10 12 18 12 31c0 2.4.5 4.5 1.3 6.1C15 29 21 23.5 29 20.5c-6.5 4.8-10.5 10.5-12.4 17.6 1.6.6 3.4.9 5.2.9C34 39 38.5 28.5 36 10z"
        fill="#bef264"
      />
      <circle cx="35" cy="35" r="3" fill="#93c5fd" />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="EcoSchool16 — bosh sahifa">
      <LogoMark className="h-10 w-10 transition-transform duration-500 group-hover:rotate-[-8deg]" />
      <span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-forest-900'}`}>
        EcoSchool<span className={light ? 'text-leaf-300' : 'text-forest-500'}>16</span>
      </span>
    </Link>
  )
}
