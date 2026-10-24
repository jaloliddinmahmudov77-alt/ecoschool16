import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { AsyncView } from '../components/ui/States'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { getStepActivities, getSteps } from '../lib/api'
import { DynamicIcon } from '../lib/icons'

export default function StepsPage() {
  usePageMeta('7 qadam metodologiyasi', 'Eco-Schools “7 qadam” metodologiyasi: EcoSchool16 har bir qadamda bajargan ishlar va natijalar.')
  const state = useAsync(() => Promise.all([getSteps(), getStepActivities()]))

  return (
    <>
      <PageHero
        title="“7 qadam” metodologiyasi"
        description="Eco-Schools xalqaro dasturi maktabni bosqichma-bosqich ekomaktabga aylantiradi. Quyida har bir qadam bo‘yicha qilingan ishlarimiz."
        crumbs={[{ label: '7 qadam' }]}
      />
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <AsyncView state={state} empty={([steps]) => steps.length === 0}>
            {([steps, activities]) => {
              const done = steps.filter((s) => s.status === 'completed').length
              return (
                <>
                  <Reveal className="card mb-14 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-forest-950">Umumiy jarayon</p>
                      <p className="text-sm text-forest-900/60">
                        {done} / {steps.length} qadam bajarilgan
                      </p>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-forest-100 sm:w-1/2" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={steps.length}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-forest-500 to-leaf-400 transition-all duration-1000"
                        style={{ width: `${(done / Math.max(steps.length, 1)) * 100}%` }}
                      />
                    </div>
                  </Reveal>

                  <ol className="relative space-y-8 before:absolute before:top-0 before:bottom-0 before:left-7 before:w-0.5 before:bg-gradient-to-b before:from-forest-300 before:to-sky-eco-300 sm:before:left-9">
                    {steps.map((step, i) => {
                      const count = activities.filter((a) => a.step_number === step.step_number).length
                      return (
                        <motion.li
                          key={step.step_number}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-60px' }}
                          transition={{ duration: 0.5, delay: i * 0.04 }}
                          className="relative pl-20 sm:pl-24"
                        >
                          <span className="absolute top-2 left-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 text-white shadow-lg ring-8 ring-cream sm:h-[4.5rem] sm:w-[4.5rem]">
                            <DynamicIcon name={step.icon} className="h-7 w-7" />
                          </span>
                          <Link
                            to={`/7-qadam/${step.step_number}`}
                            className="card group block p-6 transition hover:-translate-y-1 hover:border-forest-300 hover:shadow-xl sm:p-8"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-sm font-bold tracking-widest text-forest-500 uppercase">{step.step_number}-qadam</span>
                              <StatusBadge status={step.status} />
                            </div>
                            <h2 className="mt-2 text-2xl font-bold text-forest-950">{step.title}</h2>
                            <p className="mt-2 leading-relaxed text-forest-900/70">{step.short_description}</p>
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-forest-100 pt-4">
                              <span className="flex items-center gap-2 text-sm font-semibold text-forest-700">
                                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                {count > 0 ? `${count} ta bajarilgan ish` : 'Bajarilgan ishlar hali kiritilmagan'}
                              </span>
                              <span className="inline-flex items-center gap-1 text-sm font-bold text-forest-700">
                                Batafsil <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                              </span>
                            </div>
                          </Link>
                        </motion.li>
                      )
                    })}
                  </ol>
                </>
              )
            }}
          </AsyncView>
        </div>
      </section>
    </>
  )
}
