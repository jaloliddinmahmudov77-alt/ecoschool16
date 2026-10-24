import { ArrowLeft, Calendar } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { NewsCard } from '../components/cards'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { AsyncView } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { getNews, getNewsItem } from '../lib/api'
import { formatDate, paragraphs } from '../lib/format'
import NotFoundPage from './NotFoundPage'

export default function NewsDetailPage() {
  const { slug = '' } = useParams()
  const state = useAsync(() => Promise.all([getNewsItem(slug), getNews(4)]), [slug])
  const item = state.data?.[0]
  usePageMeta(item?.title ?? 'Yangilik', item?.excerpt)

  if (state.data && !item) return <NotFoundPage />

  return (
    <>
      <PageHero
        title={item?.title ?? 'Yangilik'}
        crumbs={[{ label: 'Yangiliklar', to: '/yangiliklar' }, { label: item ? formatDate(item.published_at) : '…' }]}
      />
      <article className="py-16 sm:py-20">
        <AsyncView state={state}>
          {([n, latest]) =>
            n && (
              <>
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                  <time dateTime={n.published_at} className="flex items-center gap-2 font-semibold text-forest-600">
                    <Calendar className="h-4 w-4" aria-hidden="true" /> {formatDate(n.published_at)}
                  </time>
                  {n.excerpt && <p className="mt-4 text-xl leading-relaxed font-medium text-forest-900">{n.excerpt}</p>}
                  {n.cover_image && (
                    <Reveal>
                      <img src={n.cover_image} alt={n.title} decoding="async" className="mt-8 w-full rounded-3xl object-cover shadow-xl" />
                    </Reveal>
                  )}
                  <div className="prose-eco mt-10 text-lg">
                    {paragraphs(n.content).map((p) => (
                      <p key={p} className="whitespace-pre-line">
                        {p}
                      </p>
                    ))}
                  </div>
                  <Link to="/yangiliklar" className="btn-outline mt-10">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Barcha yangiliklar
                  </Link>
                </div>
                {latest.filter((x) => x.id !== n.id).length > 0 && (
                  <div className="container-x mt-20">
                    <h2 className="mb-6 font-display text-2xl font-bold text-forest-950">Boshqa yangiliklar</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                      {latest
                        .filter((x) => x.id !== n.id)
                        .slice(0, 3)
                        .map((x) => (
                          <NewsCard key={x.id} item={x} />
                        ))}
                    </div>
                  </div>
                )}
              </>
            )
          }
        </AsyncView>
      </article>
    </>
  )
}
