import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface Props {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  center?: boolean
  light?: boolean
}

export function SectionHeading({ eyebrow, title, description, center = false, light = false }: Props) {
  return (
    <Reveal className={`mb-12 max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <span className={light ? 'eyebrow bg-white/15 text-leaf-300' : 'eyebrow'}>{eyebrow}</span>}
      <h2
        className={`mt-4 font-display text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl ${light ? 'text-white' : 'text-forest-950'}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-white/75' : 'text-forest-900/70'}`}>{description}</p>
      )}
    </Reveal>
  )
}
