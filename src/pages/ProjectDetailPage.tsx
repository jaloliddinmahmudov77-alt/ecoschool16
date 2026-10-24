import { ArrowLeft, Calendar, ClipboardCheck, Images, Target, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ImageGrid } from '../components/ui/ImageGrid'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { AsyncView } from '../components/ui/States'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { getProject } from '../lib/api'
import { formatDate, lines, paragraphs } from '../lib/format'
import { DynamicIcon } from '../lib/icons'
import NotFoundPage from './NotFoundPage'

function Block({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Reveal className="card p-7 sm:p-8">
      <h2 className="flex items-center gap-3 text-xl font-bold text-forest-950">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 text-forest-700">{icon}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </Reveal>
  )
}

const Pending = ({ text }: { text: string }) => <p className="text-forest-900/50 italic">{text}</p>

export default function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const state = useAsync(() => getProject(slug), [slug])
  const project = state.data
  usePageMeta(project ? `“${project.title}” loyihasi` : 'Loyiha', project?.summary)

  if (state.data === null) return <NotFoundPage />

  return (
    <>
      <PageHero
        title={project ? `“${project.title}”` : 'Loyiha'}
        description={project?.summary}
        crumbs={[{ label: 'Loyihalar', to: '/loyihalar' }, { label: project?.title ?? '…' }]}
        image={project?.cover_image}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <AsyncView state={state}>
            {(p) =>
              p && (
                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                  <div className="space-y-6">
                    {p.description && (
                      <Reveal className="prose-eco text-lg">
                        {paragraphs(p.description).map((x) => (
                          <p key={x}>{x}</p>
                        ))}
                      </Reveal>
                    )}
                    <Block icon={<Target className="h-5 w-5" />} title="Loyiha maqsadi">
                      {p.goal ? <p className="leading-relaxed text-forest-900/80">{p.goal}</p> : <Pending text="Maqsad hali kiritilmagan." />}
                    </Block>
                    <Block icon={<ClipboardCheck className="h-5 w-5" />} title="Amalga oshirilgan ishlar">
                      {lines(p.activities).length > 0 ? (
                        <ul className="space-y-2">
                          {lines(p.activities).map((l) => (
                            <li key={l} className="flex gap-3 text-forest-900/80">
                              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-forest-500" />
                              {l}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Pending text="Bajarilgan ishlar hali kiritilmagan." />
                      )}
                    </Block>
                    <Block icon={<TrendingUp className="h-5 w-5" />} title="Natijalar">
                      {lines(p.results).length > 0 ? (
                        <ul className="space-y-2">
                          {lines(p.results).map((l) => (
                            <li key={l} className="flex gap-3 font-medium text-forest-900">
                              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-leaf-400" />
                              {l}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Pending text="Natijalar loyiha yakunlangach kiritiladi." />
                      )}
                    </Block>
                    <Block icon={<Images className="h-5 w-5" />} title="Fotosuratlar">
                      {p.images.length > 0 ? <ImageGrid images={p.images} alt={p.title} /> : <Pending text="Fotosuratlar hali yuklanmagan." />}
                    </Block>
                  </div>
                  <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
                    <div className="card p-6">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 text-white">
                        <DynamicIcon name={p.icon} className="h-7 w-7" />
                      </span>
                      <dl className="mt-5 space-y-4 text-sm">
                        <div>
                          <dt className="font-semibold text-forest-900/50">Holati</dt>
                          <dd className="mt-1">
                            <StatusBadge status={p.status} />
                          </dd>
                        </div>
                        {p.start_date && (
                          <div>
                            <dt className="font-semibold text-forest-900/50">Boshlangan sana</dt>
                            <dd className="mt-1 flex items-center gap-2 font-semibold text-forest-900">
                              <Calendar className="h-4 w-4" aria-hidden="true" /> {formatDate(p.start_date)}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    <Link to="/loyihalar" className="btn-outline w-full">
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Barcha loyihalar
                    </Link>
                  </aside>
                </div>
              )
            }
          </AsyncView>
        </div>
      </section>
    </>
  )
}
