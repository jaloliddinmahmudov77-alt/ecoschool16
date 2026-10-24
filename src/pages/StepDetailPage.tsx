import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, FileCheck2, Target } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageHero } from '../components/ui/PageHero'
import { ImageGrid } from '../components/ui/ImageGrid'
import { Reveal } from '../components/ui/Reveal'
import { AsyncView, EmptyState } from '../components/ui/States'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { getEvidence, getStepActivities, getSteps } from '../lib/api'
import { formatDate, paragraphs } from '../lib/format'
import { DynamicIcon } from '../lib/icons'
import NotFoundPage from './NotFoundPage'

export default function StepDetailPage() {
  const number = Number(useParams().number)
  const state = useAsync(() => Promise.all([getSteps(), getStepActivities(number), getEvidence()]), [number])
  const step = state.data?.[0].find((s) => s.step_number === number)
  usePageMeta(step ? `${number}-qadam: ${step.title}` : '7 qadam', step?.short_description)

  if (state.data && !step) return <NotFoundPage />

  return (
    <>
      <PageHero
        title={step ? `${number}-qadam: ${step.title}` : `${number}-qadam`}
        description={step?.short_description}
        crumbs={[{ label: '7 qadam', to: '/7-qadam' }, { label: `${number}-qadam` }]}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <AsyncView state={state}>
            {([steps, activities, evidence]) => {
              const s = step!
              const stepEvidence = evidence.filter((e) => e.step_number === number)
              const prev = steps.find((x) => x.step_number === number - 1)
              const next = steps.find((x) => x.step_number === number + 1)
              return (
                <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
                  <div>
                    <Reveal className="card p-7 sm:p-9">
                      <div className="flex items-center gap-4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 text-white">
                          <DynamicIcon name={s.icon} className="h-7 w-7" />
                        </span>
                        <div>
                          <p className="text-sm font-bold tracking-widest text-forest-500 uppercase">Qadam haqida</p>
                          <StatusBadge status={s.status} />
                        </div>
                      </div>
                      <div className="prose-eco mt-6 text-lg">
                        {paragraphs(s.description).map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    </Reveal>

                    <h2 className="mt-14 mb-6 flex items-center gap-3 text-2xl font-bold text-forest-950">
                      <CheckCircle2 className="h-7 w-7 text-forest-600" aria-hidden="true" /> Bajarilgan ishlar
                    </h2>
                    {activities.length === 0 ? (
                      <EmptyState title="Bu qadam bo‘yicha bajarilgan ishlar hali kiritilmagan">
                        Administrator panelidan ishlar, sanalar, natijalar va fotosuratlarni qo‘shish mumkin.
                      </EmptyState>
                    ) : (
                      <ol className="space-y-6">
                        {activities.map((a, i) => (
                          <Reveal key={a.id} delay={i * 0.05} className="card overflow-hidden p-6 sm:p-8">
                            {a.activity_date && (
                              <time dateTime={a.activity_date} className="flex items-center gap-2 text-sm font-semibold text-forest-500">
                                <Calendar className="h-4 w-4" aria-hidden="true" /> {formatDate(a.activity_date)}
                              </time>
                            )}
                            <h3 className="mt-2 text-xl font-bold text-forest-950">{a.title}</h3>
                            {a.description && (
                              <div className="prose-eco mt-3">
                                {paragraphs(a.description).map((p) => (
                                  <p key={p}>{p}</p>
                                ))}
                              </div>
                            )}
                            {a.result && (
                              <div className="mt-4 flex gap-3 rounded-2xl bg-forest-50 p-4">
                                <Target className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" />
                                <p className="text-forest-900">
                                  <b>Natija:</b> {a.result}
                                </p>
                              </div>
                            )}
                            {a.images.length > 0 && (
                              <div className="mt-5">
                                <ImageGrid images={a.images} alt={a.title} />
                              </div>
                            )}
                          </Reveal>
                        ))}
                      </ol>
                    )}
                  </div>

                  <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                    <div className="card p-6">
                      <h2 className="flex items-center gap-2 font-bold text-forest-950">
                        <FileCheck2 className="h-5 w-5 text-forest-600" aria-hidden="true" /> Dalillar
                      </h2>
                      {stepEvidence.length === 0 ? (
                        <p className="mt-3 text-sm text-forest-900/60">Bu qadamga oid dalillar hali qo‘shilmagan.</p>
                      ) : (
                        <ul className="mt-4 space-y-3">
                          {stepEvidence.map((e) => (
                            <li key={e.id} className="rounded-xl bg-forest-50 p-3 text-sm">
                              <p className="font-semibold text-forest-900">{e.title}</p>
                              {e.evidence_date && <p className="text-xs text-forest-500">{formatDate(e.evidence_date)}</p>}
                              {e.link_url && (
                                <a href={e.link_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-semibold text-forest-700 underline">
                                  Hujjatni ochish
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <nav aria-label="Qadamlar bo‘yicha" className="card divide-y divide-forest-100">
                      {steps.map((x) => (
                        <Link
                          key={x.step_number}
                          to={`/7-qadam/${x.step_number}`}
                          aria-current={x.step_number === number ? 'page' : undefined}
                          className={`flex items-center gap-3 px-5 py-3 text-sm transition first:rounded-t-3xl last:rounded-b-3xl ${
                            x.step_number === number ? 'bg-forest-700 font-bold text-white' : 'text-forest-900 hover:bg-forest-50'
                          }`}
                        >
                          <span className="w-5 text-center font-bold">{x.step_number}</span> {x.title}
                        </Link>
                      ))}
                    </nav>
                    <div className="flex gap-3">
                      {prev && (
                        <Link to={`/7-qadam/${prev.step_number}`} className="btn-outline flex-1 px-3">
                          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Oldingi
                        </Link>
                      )}
                      {next && (
                        <Link to={`/7-qadam/${next.step_number}`} className="btn-primary flex-1 px-3">
                          Keyingi <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </aside>
                </div>
              )
            }}
          </AsyncView>
        </div>
      </section>
    </>
  )
}
