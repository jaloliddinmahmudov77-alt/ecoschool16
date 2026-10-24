import { useMemo, useState } from 'react'
import { ProjectCard } from '../components/cards'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { AsyncView, EmptyState } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import { getProjects } from '../lib/api'
import type { ProjectStatus } from '../lib/types'

const filters: (ProjectStatus | 'all')[] = ['all', 'active', 'completed', 'planned']

export default function ProjectsPage() {
  usePageMeta('Ekologik loyihalar', 'EcoSchool16 ekologik loyihalari: Yashil maktab, Toza hudud, Plastiksiz maktab va boshqalar.')
  const { t } = useI18n()
  const state = useAsync(getProjects)
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const visible = useMemo(
    () => (state.data ?? []).filter((p) => filter === 'all' || p.status === filter),
    [state.data, filter],
  )

  return (
    <>
      <PageHero
        title="Ekologik loyihalar"
        description="Maktabimizda amalga oshirilayotgan va rejalashtirilgan ekologik tashabbuslar — maqsadlari, bajarilgan ishlari va natijalari bilan."
        crumbs={[{ label: 'Loyihalar' }]}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <div role="group" aria-label="Loyihalarni holati bo‘yicha saralash" className="mb-10 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  filter === f ? 'bg-forest-700 text-white shadow-lg shadow-forest-900/20' : 'bg-white text-forest-800 ring-1 ring-forest-200 hover:bg-forest-50'
                }`}
              >
                {f === 'all' ? 'Barchasi' : t.status[f]}
              </button>
            ))}
          </div>
          <AsyncView state={state} empty={(d) => d.length === 0}>
            {() =>
              visible.length === 0 ? (
                <EmptyState title="Bu holatdagi loyihalar yo‘q" />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {visible.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 3) * 0.08}>
                      <ProjectCard project={p} />
                    </Reveal>
                  ))}
                </div>
              )
            }
          </AsyncView>
        </div>
      </section>
    </>
  )
}
