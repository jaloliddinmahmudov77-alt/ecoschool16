import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  title: string
  description?: ReactNode
  crumbs?: { label: string; to?: string }[]
  image?: string | null
}

/** Ichki sahifalar uchun sarlavha banneri. */
export function PageHero({ title, description, crumbs = [], image }: Props) {
  return (
    <section className="relative overflow-hidden bg-forest-950 pt-32 pb-16 text-white sm:pt-40 sm:pb-20">
      {image && (
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" decoding="async" />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900/90 to-sky-eco-700/40" />
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-leaf-400/10 blur-3xl" />
      <div className="container-x relative">
        <nav aria-label="Navigatsiya yo‘li" className="mb-5 flex flex-wrap items-center gap-1 text-sm text-white/60">
          <Link to="/" className="hover:text-white">
            Bosh sahifa
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              {c.to ? (
                <Link to={c.to} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white/90">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl font-display text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  )
}
