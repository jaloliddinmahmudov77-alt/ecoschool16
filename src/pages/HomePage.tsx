import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Leaf, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatCard, StepCard } from '../components/cards'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { AsyncView } from '../components/ui/States'
import { values } from '../data/content'
import { aboutImage, heroImage } from '../data/defaults'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { getStats, getSteps } from '../lib/api'
import { useSettings } from '../lib/settings'

function Hero() {
  const { settings } = useSettings()
  const image = settings.hero_image_url || heroImage

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-forest-950 text-white">
      <motion.img
        src={image}
        alt=""
        fetchPriority="high"
        decoding="async"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: 'easeOut' }}
        className="absolute inset-y-0 right-0 h-full w-full object-cover lg:w-[78%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/55 to-forest-950/85 lg:bg-gradient-to-r lg:from-forest-950 lg:from-25% lg:via-forest-950/55 lg:via-50% lg:to-forest-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />

      <Leaf className="absolute top-[22%] right-[12%] hidden h-16 w-16 animate-float text-leaf-300/40 lg:block" aria-hidden="true" />
      <Leaf
        className="absolute right-[30%] bottom-[18%] hidden h-10 w-10 animate-float text-sky-eco-300/40 [animation-delay:2s] lg:block"
        aria-hidden="true"
      />

      <div className="container-x relative pt-28 pb-24">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-leaf-400" />
          Eco-Schools Uzbekistan · Green School 2026
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl"
        >
          Yashil kelajak — <span className="bg-gradient-to-r from-leaf-300 to-sky-eco-300 bg-clip-text text-transparent">bizning qo‘limizda!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
        >
          <b className="text-white">EcoSchool16</b> — tabiatni asrash, ekologik madaniyatni rivojlantirish va kelajak avlod uchun yashil muhit
          yaratish yo‘lida birlashgan maktab jamoasi.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Link to="/galereya" className="btn-light px-7 py-3.5 text-base">
            Faoliyatimiz suratlarda <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link to="/7-qadam" className="btn-ghost px-7 py-3.5 text-base">
            Bizning faoliyatimiz
          </Link>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full p-2 text-white/70 transition hover:text-white"
        aria-label="Pastga o‘tish"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" />
      </a>
    </section>
  )
}

function AboutPreview() {
  return (
    <section id="about" className="scroll-mt-20 py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="absolute -inset-4 -rotate-3 rounded-[2.5rem] bg-gradient-to-br from-forest-200 to-sky-eco-100" />
          <img
            src={aboutImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="relative aspect-[4/3] w-full rounded-[2rem] object-cover object-[60%_center] shadow-2xl"
          />
          <div className="absolute -right-2 -bottom-6 max-w-[15rem] rounded-3xl bg-white p-5 shadow-xl sm:-right-6">
            <p className="font-display text-2xl font-bold text-forest-800">7 qadam</p>
            <p className="mt-1 text-sm text-forest-900/70">Eco-Schools xalqaro metodologiyasi asosida ishlaymiz</p>
          </div>
        </Reveal>
        <div>
          <SectionHeading
            eyebrow="Biz haqimizda"
            title="Tabiatni asrashni maktabdan boshlaymiz"
            description="EcoSchool16 jamoasi o‘quvchilar, o‘qituvchilar va ota-onalarni ekologik madaniyat atrofida birlashtiradi. Har bir kichik harakat — katta o‘zgarishning boshlanishi."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {values.slice(0, 4).map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
                  <v.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="pt-2.5 font-semibold text-forest-900">{v.title}</span>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.3}>
            <Link to="/biz-haqimizda" className="btn-primary mt-10">
              Batafsil tanishish <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function StepsPreview() {
  const steps = useAsync(getSteps)
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-forest-50 to-cream py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          center
          eyebrow="Metodologiya"
          title="“7 qadam” — ekomaktab sari yo‘l"
          description="Eco-Schools dasturining yetti bosqichi maktabimizdagi barcha ekologik ishlarning asosini tashkil etadi."
        />
        <AsyncView state={steps} empty={(d) => d.length === 0}>
          {(data) => (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.map((s, i) => (
                <Reveal key={s.step_number} delay={(i % 4) * 0.08} className={i === 6 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                  <StepCard step={s} />
                </Reveal>
              ))}
              <Reveal delay={0.2} className="hidden lg:block">
                <Link
                  to="/7-qadam"
                  className="flex h-full flex-col items-start justify-end rounded-3xl bg-gradient-to-br from-forest-700 to-forest-900 p-7 text-white transition hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <p className="font-display text-2xl font-bold">Barcha qadamlar va bajarilgan ishlar</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-semibold text-leaf-300">
                    Ko‘rish <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            </div>
          )}
        </AsyncView>
      </div>
    </section>
  )
}

function StatsBand() {
  const stats = useAsync(getStats)
  return (
    <section className="relative overflow-hidden bg-forest-900 py-24 text-white sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(163,230,53,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.15),transparent_40%)]" />
      <div className="container-x relative">
        <SectionHeading
          center
          light
          eyebrow="Natijalar"
          title="Raqamlarda bizning hissamiz"
          description="Ko‘rsatkichlar maktab ekologik qo‘mitasi tomonidan tasdiqlangan haqiqiy ma’lumotlar asosida yangilanadi."
        />
        <AsyncView state={stats} empty={(d) => d.length === 0}>
          {(data) => (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.map((s, i) => (
                <Reveal key={s.key} delay={i * 0.08}>
                  <StatCard stat={s} light />
                </Reveal>
              ))}
            </div>
          )}
        </AsyncView>
      </div>
    </section>
  )
}

function GreenSchoolBand() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-eco-100 via-forest-50 to-forest-100 p-8 sm:p-14">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-leaf-300/30 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="eyebrow bg-white">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> Respublika tanlovi
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold text-forest-950 sm:text-4xl lg:text-5xl">Green School 2026</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-forest-900/75">
                EcoSchool16 jamoasining tanlovga tayyorgarligi, amalga oshirilgan ishlar va ularni tasdiqlovchi dalillar bilan tanishing.
              </p>
            </div>
            <Link to="/yutuqlar#green-school" className="btn-primary px-8 py-4 text-base">
              Tayyorgarlik va dalillar <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function HomePage() {
  usePageMeta('')
  return (
    <>
      <Hero />
      <AboutPreview />
      <StepsPreview />
      <StatsBand />
      <GreenSchoolBand />
    </>
  )
}
