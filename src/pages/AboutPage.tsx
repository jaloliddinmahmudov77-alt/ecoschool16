import { ArrowRight, Compass, HeartHandshake, ListChecks, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { values } from '../data/content'
import { aboutImage } from '../data/defaults'
import { usePageMeta } from '../hooks/usePageMeta'
import { useSettings } from '../lib/settings'

const pillars = [
  {
    icon: Target,
    title: 'Maqsadimiz',
    text: 'Maktabda ekologik madaniyatni kundalik hayotning ajralmas qismiga aylantirish va kelajak avlod uchun sog‘lom, yashil muhit yaratish.',
  },
  {
    icon: ListChecks,
    title: 'Vazifalarimiz',
    text: 'Eco-Schools “7 qadam” metodologiyasini izchil qo‘llash, ekologik muammolarni aniqlash, ularga amaliy yechim topish va natijalarni o‘lchab borish.',
  },
  {
    icon: Compass,
    title: 'Yondashuvimiz',
    text: 'O‘quvchilar boshqaradi, kattalar qo‘llab-quvvatlaydi. Har bir qaror ekologik qo‘mitada muhokama qilinadi va hujjatlashtiriladi.',
  },
]

const principles = ['Mas’uliyat', 'Hamkorlik', 'Tejamkorlik', 'Ochiqlik', 'Tashabbuskorlik', 'Tabiatga hurmat']

export default function AboutPage() {
  const { settings } = useSettings()
  usePageMeta('Biz haqimizda', 'EcoSchool16 jamoasining maqsadi, vazifalari va ekologik qadriyatlari.')

  return (
    <>
      <PageHero
        title="Biz haqimizda"
        description={`EcoSchool16 — ${settings.school_name} jamoasining ekologik tashabbusi. Biz tabiatni asrashni bilim, odat va amaliy ishga aylantiramiz.`}
        crumbs={[{ label: 'Biz haqimizda' }]}
        image={aboutImage}
      />

      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} className="card p-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 text-white">
                <p.icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-2xl font-bold text-forest-950">{p.title}</h2>
              <p className="mt-3 leading-relaxed text-forest-900/70">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-forest-50/70 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Faoliyat yo‘nalishlari"
            title="Biz nima bilan shug‘ullanamiz"
            description="Ekologik ishlarimiz besh asosiy yo‘nalish atrofida tashkil etilgan."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                delay={(i % 3) * 0.08}
                className="group card relative overflow-hidden p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="absolute top-6 right-6 font-display text-5xl font-bold text-forest-50 group-hover:text-forest-100">
                  0{i + 1}
                </span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-100 text-forest-700 transition group-hover:bg-forest-700 group-hover:text-white">
                  <v.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="relative mt-5 text-lg font-bold text-forest-950">{v.title}</h3>
                <p className="relative mt-2 leading-relaxed text-forest-900/70">{v.text}</p>
              </Reveal>
            ))}
            <Reveal delay={0.16} className="flex flex-col justify-between rounded-3xl bg-forest-900 p-7 text-white">
              <HeartHandshake className="h-10 w-10 text-leaf-300" aria-hidden="true" />
              <div>
                <h3 className="mt-6 text-lg font-bold">Ekologik qadriyatlarimiz</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {principles.map((p) => (
                    <li key={p} className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-x">
          <Reveal className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-gradient-to-r from-forest-700 to-forest-900 p-10 text-white md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold">Faoliyatimiz “7 qadam” asosida quriladi</h2>
              <p className="mt-2 text-white/75">Har bir qadamda nima qilinganini, sanalar va natijalarni ko‘ring.</p>
            </div>
            <Link to="/7-qadam" className="btn-light shrink-0">
              7 qadam <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
