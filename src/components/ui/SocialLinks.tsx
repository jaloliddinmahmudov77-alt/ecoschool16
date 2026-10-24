import type { SiteSettings } from '../../lib/types'

// lucide-react 1.x da brend ikonkalari yo‘q, shuning uchun soddalashtirilgan SVG’lar.
const paths = {
  telegram: 'M21.9 4.3 18.7 19.5c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13.2l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 3c.9-.3 1.7.2 1.4 1.3z',
  instagram:
    'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM16.5 2h-9A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2zm3.7 14.5a3.7 3.7 0 0 1-3.7 3.7h-9a3.7 3.7 0 0 1-3.7-3.7v-9a3.7 3.7 0 0 1 3.7-3.7h9a3.7 3.7 0 0 1 3.7 3.7z',
  facebook: 'M14 8.5V6.6c0-.9.6-1.1 1-1.1h2.6V1.6L14 1.5c-4 0-4.9 3-4.9 4.9v2.1H6.8v4h2.3V22.5H14V12.5h3.3l.4-4z',
  youtube:
    'M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z',
}

const labels = { telegram: 'Telegram', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube' }

export function SocialLinks({ settings, className = '' }: { settings: SiteSettings; className?: string }) {
  const items = (Object.keys(paths) as (keyof typeof paths)[])
    .map((key) => ({ key, url: settings[`${key}_url`] }))
    .filter((i): i is { key: keyof typeof paths; url: string } => Boolean(i.url))

  if (items.length === 0) return null

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((i) => (
        <li key={i.key}>
          <a
            href={i.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels[i.key]}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-leaf-400 hover:text-forest-950"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d={paths[i.key]} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
