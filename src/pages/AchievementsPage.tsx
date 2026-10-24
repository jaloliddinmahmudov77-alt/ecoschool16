import { Award, Calendar, ExternalLink, FileCheck2, Medal, ScrollText, ShieldCheck, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Lightbox } from '../components/ui/Lightbox'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { AsyncView, EmptyState } from '../components/ui/States'
import { achievementKinds } from '../data/content'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { getAchievements, getEvidence, getSteps } from '../lib/api'
import { formatDate, lines, paragraphs } from '../lib/format'
import { useSettings } from '../lib/settings'
import type { Achievement } from '../lib/types'

const kindIcon = { sertifikat: ScrollText, diplom: Award, mukofot: Medal, tanlov: Trophy }

function AchievementCard({ a, onOpen }: { a: Achievement; onOpen: () => void }) {
  const Icon = kindIcon[a.kind] ?? Award
  const label = achievementKinds.find((k) => k.value === a.kind)?.label
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      {a.image_url ? (
        <button onClick={onOpen} className="aspect-[4/3] overflow-hidden bg-forest-50" aria-label={`${a.title} — rasmni kattalashtirish`}>
          <img src={a.image_url} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105" />
        </button>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-forest-50 to-sky-eco-100">
          <Icon className="h-16 w-16 text-forest-400" aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-forest-100 px-3 py-1 text-xs font-bold text-forest-700">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
        </span>
        <h3 className="mt-3 text-lg font-bold text-forest-950">{a.title}</h3>
        {a.issuer && <p className="mt-1 text-sm font-medium text-forest-700">{a.issuer}</p>}
        {a.description && <p className="mt-2 flex-1 text-sm leading-relaxed text-forest-900/70">{a.description}</p>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          {a.achieved_at && (
            <span className="flex items-center gap-1.5 text-forest-500">
              <Calendar className="h-4 w-4" aria-hidden="true" /> {formatDate(a.achieved_at)}
            </span>
          )}
          {a.document_url && (
            <a href={a.document_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-forest-700 hover:underline">
              Hujjat <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function GreenSchoolSection() {
  const { settings } = useSettings()
  const state = useAsync(() => Promise.all([getEvidence(), getSteps()]))
  const works = lines(settings.green_school_works)

  return (
    <section id="green-school" className="scroll-mt-24 bg-gradient-to-b from-forest-950 to-forest-900 py-20 text-white sm:py-28">
      <div className="container-x">
        <SectionHeading
          light
          eyebrow="Respublika tanlovi"
          title="Green School 2026"
          description="EcoSchool16 jamoasining tanlovga tayyorgarligi, amalga oshirilgan ishlari va ularni tasdiqlovchi dalillar."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
            <h3 className="flex items-center gap-2 text-lg font-bold text-leaf-300">
              <Trophy className="h-5 w-5" aria-hidden="true" /> Tanlov maqsadi
            </h3>
            <div className="mt-3 space-y-3 leading-relaxed text-white/80">
              {paragraphs(settings.green_school_goal).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
            <h3 className="flex items-center gap-2 text-lg font-bold text-leaf-300">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" /> Jamoamiz tayyorgarligi
            </h3>
            <div className="mt-3 space-y-3 leading-relaxed text-white/80">
              {settings.green_school_preparation ? (
                paragraphs(settings.green_school_preparation).map((p) => <p key={p}>{p}</p>)
              ) : (
                <p className="text-white/50 italic">Ma’lumot hali kiritilmagan.</p>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.16} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
            <h3 className="flex items-center gap-2 text-lg font-bold text-leaf-300">
              <FileCheck2 className="h-5 w-5" aria-hidden="true" /> Amalga oshirilgan ishlar
            </h3>
            {works.length > 0 ? (
              <ul className="mt-3 space-y-2 text-white/80">
                {works.map((w) => (
                  <li key={w} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-400" /> {w}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-white/50 italic">Ma’lumot hali kiritilmagan.</p>
            )}
          </Reveal>
        </div>

        <h3 className="mt-16 mb-6 font-display text-2xl font-bold">Dalillar</h3>
        <AsyncView
          state={state}
          empty={([ev]) => ev.length === 0}
          emptyView={
            <p className="rounded-3xl border border-dashed border-white/20 p-8 text-center text-white/60">
              Dalillar (hujjatlar, fotosuratlar, bayonnomalar) hali qo‘shilmagan.
            </p>
          }
        >
          {([evidence, steps]) => (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {evidence.map((e, i) => (
                <Reveal key={e.id} delay={(i % 3) * 0.06} className="overflow-hidden rounded-3xl bg-white text-forest-950">
                  {e.image_url && <img src={e.image_url} alt={e.title} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />}
                  <div className="p-6">
                    {e.step_number && (
                      <p className="text-xs font-bold tracking-widest text-forest-500 uppercase">
                        {e.step_number}-qadam · {steps.find((s) => s.step_number === e.step_number)?.title}
                      </p>
                    )}
                    <h4 className="mt-1 font-bold">{e.title}</h4>
                    {e.description && <p className="mt-2 text-sm text-forest-900/70">{e.description}</p>}
                    <div className="mt-3 flex items-center justify-between text-sm">
                      {e.evidence_date && <span className="text-forest-500">{formatDate(e.evidence_date)}</span>}
                      {e.link_url && (
                        <a href={e.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-forest-700 hover:underline">
                          Ochish <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </AsyncView>
      </div>
    </section>
  )
}

export default function AchievementsPage() {
  usePageMeta('Yutuqlar va Green School 2026', 'EcoSchool16 ekologik yutuqlari, sertifikatlari va Green School 2026 tanloviga tayyorgarlik dalillari.')
  const state = useAsync(getAchievements)
  const [index, setIndex] = useState<number | null>(null)
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 300)
  }, [hash])

  const withImages = (state.data ?? []).filter((a) => a.image_url)

  return (
    <>
      <PageHero
        title="Yutuqlar"
        description="Ekologiya yo‘nalishidagi sertifikatlar, diplomlar va tanlovlarda ishtirokimiz. Bu yerda faqat tasdiqlangan hujjatlar joylashtiriladi."
        crumbs={[{ label: 'Yutuqlar' }]}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <AsyncView
            state={state}
            empty={(d) => d.length === 0}
            emptyView={
              <EmptyState title="Yutuqlar hali qo‘shilmagan">Sertifikat va diplomlar administrator tomonidan hujjat bilan birga kiritiladi.</EmptyState>
            }
          >
            {(data) => (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((a, i) => (
                  <Reveal key={a.id} delay={(i % 3) * 0.08}>
                    <AchievementCard a={a} onOpen={() => setIndex(withImages.indexOf(a))} />
                  </Reveal>
                ))}
              </div>
            )}
          </AsyncView>
        </div>
      </section>
      <GreenSchoolSection />
      <Lightbox images={withImages.map((a) => ({ src: a.image_url!, alt: a.title, caption: a.title }))} index={index} onChange={setIndex} />
    </>
  )
}
