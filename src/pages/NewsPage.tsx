import { NewsCard } from '../components/cards'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { AsyncView, EmptyState } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { getNews } from '../lib/api'

export default function NewsPage() {
  usePageMeta('Yangiliklar', 'EcoSchool16 ekologik tadbirlari, yangi loyihalar va o‘quvchilar tashabbuslari haqida yangiliklar.')
  const state = useAsync(() => getNews())

  return (
    <>
      <PageHero
        title="Yangiliklar"
        description="Ekologik tadbirlar, yangi loyihalar, maktabimizdagi voqealar va o‘quvchilar tashabbuslari."
        crumbs={[{ label: 'Yangiliklar' }]}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <AsyncView
            state={state}
            empty={(d) => d.length === 0}
            emptyView={<EmptyState title="Yangiliklar hali e’lon qilinmagan" />}
          >
            {(data) => (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((n, i) => (
                  <Reveal key={n.id} delay={(i % 3) * 0.08}>
                    <NewsCard item={n} />
                  </Reveal>
                ))}
              </div>
            )}
          </AsyncView>
        </div>
      </section>
    </>
  )
}
