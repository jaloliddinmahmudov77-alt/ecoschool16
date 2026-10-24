import { animate, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatNumber } from '../lib/format'
import { DynamicIcon } from '../lib/icons'
import type { Stat, Step } from '../lib/types'
import { StatusBadge } from './ui/StatusBadge'

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
