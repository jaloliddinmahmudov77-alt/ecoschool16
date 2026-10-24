import { AnimatePresence, motion } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Lightbox } from '../components/ui/Lightbox'
import { PageHero } from '../components/ui/PageHero'
import { AsyncView, EmptyState } from '../components/ui/States'
import { galleryCategories } from '../data/content'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { getGallery } from '../lib/api'
import { formatDate } from '../lib/format'
import type { GalleryCategory, GalleryItem } from '../lib/types'

/** "Oldin / keyin" taqqoslash slayderi. */
function BeforeAfter({ item }: { item: GalleryItem }) {
  const [pos, setPos] = useState(50)
  return (
    <figure className="card overflow-hidden">
      <div className="relative aspect-[4/3] select-none">
        <img src={item.image_url} alt={`${item.title} — keyin`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={item.before_image_url!} alt={`${item.title} — oldin`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-1 bg-white shadow" style={{ left: `calc(${pos}% - 2px)` }}>
          <span className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-forest-800 shadow-lg">
            <MoveHorizontal className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-forest-950/70 px-3 py-1 text-xs font-bold text-white">Oldin</span>
        <span className="absolute top-3 right-3 rounded-full bg-forest-600/90 px-3 py-1 text-xs font-bold text-white">Keyin</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Oldin va keyin holatini taqqoslash"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="p-4">
        <p className="font-semibold text-forest-950">{item.title}</p>
        {item.taken_at && <p className="text-xs text-forest-500">{formatDate(item.taken_at)}</p>}
      </figcaption>
    </figure>
  )
}

export default function GalleryPage() {
  usePageMeta('Galereya', 'EcoSchool16 ekologik tadbirlari, daraxt ekish jarayonlari va loyiha natijalari fotosuratlari.')
  const state = useAsync(getGallery)
  const [category, setCategory] = useState<GalleryCategory | 'all'>('all')
  const [index, setIndex] = useState<number | null>(null)

  const items = useMemo(() => (state.data ?? []).filter((g) => category === 'all' || g.category === category), [state.data, category])
  const compare = items.filter((g) => g.before_image_url)
  const photos = items.filter((g) => !g.before_image_url)

  return (
    <>
      <PageHero
        title="Galereya"
        description="Ekologik tadbirlarimiz, daraxt ekish jarayonlari, maktab hududining oldingi va keyingi holati hamda loyiha natijalari."
        crumbs={[{ label: 'Galereya' }]}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <div role="group" aria-label="Kategoriya bo‘yicha saralash" className="mb-10 flex flex-wrap gap-2">
            {[{ value: 'all' as const, label: 'Barchasi' }, ...galleryCategories].map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                aria-pressed={category === c.value}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  category === c.value ? 'bg-forest-700 text-white shadow-lg shadow-forest-900/20' : 'bg-white text-forest-800 ring-1 ring-forest-200 hover:bg-forest-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <AsyncView
            state={state}
            empty={(d) => d.length === 0}
            emptyView={<EmptyState title="Galereya hali bo‘sh">Rasmlar administrator panelidan yuklanadi.</EmptyState>}
          >
            {() =>
              items.length === 0 ? (
                <EmptyState title="Bu kategoriyada rasmlar yo‘q" />
              ) : (
                <>
                  {compare.length > 0 && (
                    <div className="mb-10 grid gap-6 md:grid-cols-2">
                      {compare.map((g) => (
                        <BeforeAfter key={g.id} item={g} />
                      ))}
                    </div>
                  )}
                  <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                    <AnimatePresence>
                      {photos.map((g, i) => (
                        <motion.button
                          layout
                          key={g.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          onClick={() => setIndex(i)}
                          className="group relative mb-4 block w-full overflow-hidden rounded-3xl bg-forest-100 break-inside-avoid"
                          aria-label={`${g.title || 'Rasm'} — kattalashtirish`}
                        >
                          <img src={g.image_url} alt={g.title} loading="lazy" decoding="async" className="w-full transition duration-700 group-hover:scale-105" />
                          {g.title && (
                            <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-forest-950/90 to-transparent p-4 pt-10 text-left text-sm font-semibold text-white transition duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                              {g.title}
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </>
              )
            }
          </AsyncView>
        </div>
      </section>
      <Lightbox
        images={photos.map((g) => ({ src: g.image_url, alt: g.title || 'Galereya rasmi', caption: [g.title, formatDate(g.taken_at)].filter(Boolean).join(' · ') }))}
        index={index}
        onChange={setIndex}
      />
    </>
  )
}
