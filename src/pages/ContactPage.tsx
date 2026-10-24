import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, School, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { SocialLinks } from '../components/ui/SocialLinks'
import { usePageMeta } from '../hooks/usePageMeta'
import { isSupabaseConfigured, sendContactMessage } from '../lib/api'
import { useSettings } from '../lib/settings'

interface FormState {
  name: string
  email: string
  phone: string
  message: string
  website: string // honeypot — botlar uchun yashirin maydon
}

const empty: FormState = { name: '', email: '', phone: '', message: '', website: '' }

function validate(f: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {}
  if (f.name.trim().length < 2) errors.name = 'Ismingizni kiriting (kamida 2 ta belgi).'
  if (!f.email.trim() && !f.phone.trim()) errors.email = 'Email yoki telefon raqamidan kamida bittasini kiriting.'
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errors.email = 'Email manzili noto‘g‘ri.'
  if (f.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(f.phone.trim())) errors.phone = 'Telefon raqami noto‘g‘ri.'
  if (f.message.trim().length < 5) errors.message = 'Xabar matnini kiriting (kamida 5 ta belgi).'
  if (f.message.length > 4000) errors.message = 'Xabar 4000 belgidan oshmasligi kerak.'
  return errors
}

export default function ContactPage() {
  usePageMeta('Aloqa', 'EcoSchool16 bilan bog‘lanish: aloqa formasi, manzil va ijtimoiy tarmoqlar.')
  const { settings } = useSettings()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const set = (key: keyof FormState) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    const firstInvalid = Object.keys(v)[0]
    if (firstInvalid) return document.getElementById(`contact-${firstInvalid}`)?.focus()
    if (form.website) return setStatus('sent') // bot
    setStatus('sending')
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        message: form.message.trim(),
      })
      setStatus('sent')
      setForm(empty)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : String(err))
      setStatus('error')
    }
  }

  const info = [
    { icon: School, label: 'Maktab', value: settings.school_name },
    { icon: MapPin, label: 'Manzil', value: settings.address },
    { icon: Phone, label: 'Telefon', value: settings.phone, href: settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, '')}` : undefined },
    { icon: Mail, label: 'Elektron pochta', value: settings.email, href: settings.email ? `mailto:${settings.email}` : undefined },
    { icon: Clock, label: 'Ish vaqti', value: settings.working_hours },
  ]

  const field = (key: keyof FormState) => ({
    id: `contact-${key}`,
    value: form[key],
    onChange: set(key),
    'aria-invalid': Boolean(errors[key]) || undefined,
    'aria-describedby': errors[key] ? `contact-${key}-error` : undefined,
    className: `input ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`,
  })

  const ErrorText = ({ k }: { k: keyof FormState }) =>
    errors[k] ? (
      <p id={`contact-${k}-error`} className="mt-1.5 text-sm text-red-600">
        {errors[k]}
      </p>
    ) : null

  return (
    <>
      <PageHero
        title="Aloqa"
        description="Savollaringiz, takliflaringiz yoki hamkorlik g‘oyalaringiz bormi? Bizga yozing — EcoSchool16 jamoasi albatta javob beradi."
        crumbs={[{ label: 'Aloqa' }]}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[380px_1fr]">
          <Reveal className="space-y-4">
            <div className="rounded-3xl bg-forest-900 p-7 text-white">
              <p className="text-sm font-bold tracking-widest text-leaf-300 uppercase">Loyiha</p>
              <p className="mt-1 font-display text-3xl font-bold">{settings.project_name}</p>
              <ul className="mt-6 space-y-5">
                {info.map((i) => (
                  <li key={i.label} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-leaf-300">
                      <i.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white/50">{i.label}</p>
                      {i.value ? (
                        i.href ? (
                          <a href={i.href} className="font-semibold break-all hover:text-leaf-300">
                            {i.value}
                          </a>
                        ) : (
                          <p className="font-semibold">{i.value}</p>
                        )
                      ) : (
                        <p className="text-sm text-white/40 italic">Kiritilmagan</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <SocialLinks settings={settings} className="mt-7" />
            </div>
            {settings.map_url && (
              <a href={settings.map_url} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
                <MapPin className="h-4 w-4" aria-hidden="true" /> Xaritada ko‘rish
              </a>
            )}
          </Reveal>

          <Reveal delay={0.1} className="card p-7 sm:p-10">
            {status === 'sent' ? (
              <div role="status" className="flex flex-col items-center py-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-forest-500" aria-hidden="true" />
                <h2 className="mt-5 text-2xl font-bold text-forest-950">Xabaringiz yuborildi!</h2>
                <p className="mt-2 text-forest-900/70">Rahmat. Tez orada siz bilan bog‘lanamiz.</p>
                <button onClick={() => setStatus('idle')} className="btn-outline mt-8">
                  Yana xabar yozish
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <h2 className="text-2xl font-bold text-forest-950">Bizga xabar yozing</h2>
                <p className="mt-1 text-forest-900/60">Barcha maydonlar maxfiy saqlanadi va faqat maktab ma’muriyatiga ko‘rinadi.</p>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="contact-name" className="label">
                      Ism-familiya *
                    </label>
                    <input {...field('name')} autoComplete="name" maxLength={120} />
                    <ErrorText k="name" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="label">
                      Elektron pochta
                    </label>
                    <input {...field('email')} type="email" autoComplete="email" maxLength={200} />
                    <ErrorText k="email" />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="label">
                      Telefon
                    </label>
                    <input {...field('phone')} type="tel" autoComplete="tel" maxLength={40} />
                    <ErrorText k="phone" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="contact-message" className="label">
                      Xabar *
                    </label>
                    <textarea {...field('message')} rows={6} maxLength={4000} />
                    <ErrorText k="message" />
                  </div>
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact-website">Veb-sayt</label>
                    <input {...field('website')} tabIndex={-1} autoComplete="off" />
                  </div>
                </div>
                {status === 'error' && (
                  <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    Xabar yuborilmadi: {serverError}
                  </p>
                )}
                {!isSupabaseConfigured && (
                  <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                    Forma ishlashi uchun Supabase ulanishi sozlanishi kerak (README’ga qarang).
                  </p>
                )}
                <button type="submit" disabled={status === 'sending'} className="btn-primary mt-7 w-full px-8 py-3.5 sm:w-auto">
                  {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
                  {status === 'sending' ? 'Yuborilmoqda…' : 'Xabarni yuborish'}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
