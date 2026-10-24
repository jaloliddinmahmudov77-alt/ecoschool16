import { animate, useInView } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, formatNumber } from '../lib/format'
import { DynamicIcon } from '../lib/icons'
import type { NewsItem, Project, Stat, Step } from '../lib/types'
import { StatusBadge } from './ui/StatusBadge'

const isStockImage = (src: string | null) => Boolean(src?.includes('images.unsplash.com'))

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/loyihalar/${project.slug}`}
      className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-forest-900/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-forest-100">
        {project.cover_image ? (
          <img
            src={project.cover_image}
            alt={isStockImage(project.cover_image) ? '' : project.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-forest-100 to-sky-eco-100">
            <DynamicIcon name={project.icon} className="h-16 w-16 text-forest-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-forest-700 shadow backdrop-blur">
          <DynamicIcon name={project.icon} className="h-5 w-5" />
        </span>
        <span className="absolute top-4 right-4">
          <StatusBadge status={project.status} />
        </span>
        {isStockImage(project.cover_image) && (
          <span className="absolute bottom-3 left-4 text-[11px] font-medium text-white/70">Illyustrativ rasm</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-forest-950">“{project.title}”</h3>
        <p className="mt-2 flex-1 leading-relaxed text-forest-900/70">{project.summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-forest-700">
          Batafsil <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      to={`/yangiliklar/${item.slug}`}
      className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-forest-900/10"
    >
      <div className="aspect-[16/10] overflow-hidden bg-forest-100">
        {item.cover_image ? (
          <img
            src={item.cover_image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-forest-200 via-forest-100 to-sky-eco-100" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={item.published_at} className="flex items-center gap-2 text-xs font-semibold text-forest-500">
          <Calendar className="h-4 w-4" aria-hidden="true" /> {formatDate(item.published_at)}
        </time>
        <h3 className="mt-2 text-lg leading-snug font-bold text-forest-950 group-hover:text-forest-700">{item.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-forest-900/70">{item.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-forest-700">
          Batafsil o‘qish <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

export function StepCard({ step }: { step: Step }) {
  return (
    <Link
      to={`/7-qadam/${step.step_number}`}
      className="card group relative flex h-full flex-col overflow-hidden p-7 transition duration-300 hover:-translate-y-1.5 hover:border-forest-300 hover:shadow-xl hover:shadow-forest-900/10"
    >
      <span className="pointer-events-none absolute -top-4 -right-1 font-display text-8xl font-bold text-forest-50 transition group-hover:text-forest-100">
        {step.step_number}
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 text-white shadow-lg shadow-forest-900/20 transition group-hover:rotate-[-6deg]">
        <DynamicIcon name={step.icon} className="h-7 w-7" />
      </span>
      <p className="relative mt-5 text-xs font-bold tracking-widest text-forest-500 uppercase">{step.step_number}-qadam</p>
      <h3 className="relative mt-1 text-xl font-bold text-forest-950">{step.title}</h3>
      <p className="relative mt-2 flex-1 leading-relaxed text-forest-900/70">{step.short_description}</p>
      <div className="relative mt-5 flex items-center justify-between">
        <StatusBadge status={step.status} />
        <ArrowRight className="h-5 w-5 text-forest-600 transition group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </Link>
  )
}

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) })
    return () => controls.stop()
  }, [inView, value])
  return <span ref={ref}>{formatNumber(display)}</span>
}

export function StatCard({ stat, light = false }: { stat: Stat; light?: boolean }) {
  const hasValue = stat.value !== null && stat.value !== undefined
  return (
    <div
      className={`rounded-3xl p-7 transition duration-300 hover:-translate-y-1 ${
        light ? 'border border-white/15 bg-white/10 backdrop-blur' : 'card'
      }`}
    >
      <p className={`font-display text-4xl font-bold sm:text-5xl ${light ? 'text-white' : 'text-forest-800'}`}>
        {hasValue ? (
          <>
            <CountUp value={Number(stat.value)} />
            {stat.unit && <span className={`ml-1.5 text-xl font-semibold ${light ? 'text-leaf-300' : 'text-forest-500'}`}>{stat.unit}</span>}
          </>
        ) : (
          <span className={`text-2xl ${light ? 'text-white/50' : 'text-forest-300'}`}>—</span>
        )}
      </p>
      <p className={`mt-3 font-semibold ${light ? 'text-white/85' : 'text-forest-900/80'}`}>{stat.label}</p>
      {!hasValue && <p className={`mt-1 text-xs ${light ? 'text-white/50' : 'text-forest-900/50'}`}>Ma’lumot kiritilmagan</p>}
      {hasValue && stat.note && <p className={`mt-1 text-xs ${light ? 'text-white/60' : 'text-forest-900/50'}`}>{stat.note}</p>}
    </div>
  )
}
