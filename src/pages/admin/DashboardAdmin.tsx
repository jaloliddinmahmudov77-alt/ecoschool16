import { ArrowRight, BarChart3, FileCheck2, Footprints, FolderKanban, Images, Inbox, Newspaper, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Loader } from '../../components/ui/States'
import { useAsync } from '../../hooks/useAsync'
import { countUnreadMessages, listRows } from '../../lib/api'
import { useAuth } from '../../lib/auth'
import type { Stat, Step } from '../../lib/types'

async function loadOverview() {
  const [projects, news, gallery, achievements, evidence, steps, stats, unread] = await Promise.all([
    listRows('projects', 'created_at'),
    listRows('news', 'created_at'),
    listRows('gallery', 'created_at'),
    listRows('achievements', 'created_at'),
    listRows('evidence', 'created_at'),
    listRows<Step>('steps', 'step_number'),
    listRows<Stat>('stats', 'sort_order'),
    countUnreadMessages(),
  ])
  return {
    counts: { projects: projects.length, news: news.length, gallery: gallery.length, achievements: achievements.length, evidence: evidence.length },
    stepsDone: steps.filter((s) => s.status === 'completed').length,
    stepsTotal: steps.length,
    statsFilled: stats.filter((s) => s.value !== null).length,
    statsTotal: stats.length,
    unread,
  }
}

export default function DashboardAdmin() {
  const { session } = useAuth()
  const { data, loading, error } = useAsync(loadOverview)

  if (loading) return <Loader />
  if (error || !data) return <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>

  const cards = [
    { to: '/admin/loyihalar', label: 'Loyihalar', value: data.counts.projects, icon: FolderKanban },
    { to: '/admin/yangiliklar', label: 'Yangiliklar', value: data.counts.news, icon: Newspaper },
    { to: '/admin/galereya', label: 'Galereya rasmlari', value: data.counts.gallery, icon: Images },
    { to: '/admin/yutuqlar', label: 'Yutuqlar', value: data.counts.achievements, icon: Trophy },
    { to: '/admin/dalillar', label: 'Dalillar', value: data.counts.evidence, icon: FileCheck2 },
    { to: '/admin/xabarlar', label: 'Yangi xabarlar', value: data.unread, icon: Inbox },
  ]

  const todo = [
    data.statsFilled < data.statsTotal && { to: '/admin/statistika', text: `Statistika: ${data.statsTotal - data.statsFilled} ta ko‘rsatkich kiritilmagan`, icon: BarChart3 },
    data.stepsDone < data.stepsTotal && { to: '/admin/7-qadam', text: `7 qadam: ${data.stepsDone}/${data.stepsTotal} qadam bajarilgan deb belgilangan`, icon: Footprints },
    data.counts.evidence === 0 && { to: '/admin/dalillar', text: 'Green School 2026 uchun dalillar hali qo‘shilmagan', icon: FileCheck2 },
    data.counts.gallery === 0 && { to: '/admin/galereya', text: 'Galereyaga rasmlar yuklang', icon: Images },
  ].filter(Boolean) as { to: string; text: string; icon: typeof BarChart3 }[]

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest-950 sm:text-3xl">Xush kelibsiz!</h1>
      <p className="mt-1 text-forest-900/60">{session?.user.email} · EcoSchool16 boshqaruv paneli</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-100 text-forest-700 transition group-hover:bg-forest-700 group-hover:text-white">
              <c.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-3xl font-bold text-forest-950">{c.value}</p>
              <p className="text-sm text-forest-900/60">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {todo.length > 0 && (
        <section className="card mt-8 p-6">
          <h2 className="text-lg font-bold text-forest-950">Green School 2026 uchun tayyorgarlik</h2>
          <ul className="mt-4 divide-y divide-forest-100">
            {todo.map((t) => (
              <li key={t.to}>
                <Link to={t.to} className="group flex items-center gap-3 py-3 text-forest-900 hover:text-forest-700">
                  <t.icon className="h-5 w-5 text-amber-600" aria-hidden="true" />
                  <span className="flex-1">{t.text}</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
