import { Loader2, Save } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { FieldInput, normalize, validateRequired, type FieldDef, type Values } from '../../components/admin/FormFields'
import { errorText, useToast } from '../../components/admin/Toast'
import { AsyncView } from '../../components/ui/States'
import { useAsync } from '../../hooks/useAsync'
import { getSettings, upsertRow } from '../../lib/api'
import { useSettings } from '../../lib/settings'
import type { SiteSettings } from '../../lib/types'

const groups: { title: string; description?: string; fields: FieldDef[] }[] = [
  {
    title: 'Maktab va aloqa ma’lumotlari',
    description: 'Faqat haqiqiy ma’lumotlarni kiriting. Bo‘sh maydonlar saytda ko‘rsatilmaydi.',
    fields: [
      { name: 'school_name', label: 'Maktab nomi', type: 'text', required: true },
      { name: 'project_name', label: 'Loyiha nomi', type: 'text', required: true },
      { name: 'address', label: 'Manzil', type: 'text', full: true },
      { name: 'phone', label: 'Telefon', type: 'text' },
      { name: 'email', label: 'Elektron pochta', type: 'email' },
      { name: 'working_hours', label: 'Ish vaqti', type: 'text', placeholder: 'Du–Sha, 8:00–17:00' },
      { name: 'map_url', label: 'Xarita havolasi', type: 'url', placeholder: 'https://maps.google.com/…' },
    ],
  },
  {
    title: 'Ijtimoiy tarmoqlar',
    fields: [
      { name: 'telegram_url', label: 'Telegram', type: 'url', placeholder: 'https://t.me/…' },
      { name: 'instagram_url', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/…' },
      { name: 'facebook_url', label: 'Facebook', type: 'url' },
      { name: 'youtube_url', label: 'YouTube', type: 'url' },
    ],
  },
  {
    title: 'Bosh sahifa',
    fields: [{ name: 'hero_image_url', label: 'Hero fon rasmi', type: 'image', help: 'Bo‘sh qoldirilsa tabiat mavzusidagi standart rasm ishlatiladi. Maktabning haqiqiy fotosurati tavsiya etiladi.' }],
  },
  {
    title: 'Green School 2026',
    fields: [
      { name: 'green_school_goal', label: 'Tanlov maqsadi', type: 'textarea', rows: 4 },
      { name: 'green_school_preparation', label: 'Jamoaning tayyorgarligi', type: 'textarea', rows: 5 },
      { name: 'green_school_works', label: 'Amalga oshirilgan ishlar', type: 'textarea', rows: 6, help: 'Har bir ishni yangi qatordan yozing.' },
    ],
  },
]

const allFields = groups.flatMap((g) => g.fields)

export default function SettingsAdmin() {
  const toast = useToast()
  const { reload: reloadPublic } = useSettings()
  const state = useAsync(getSettings)
  const [values, setValues] = useState<Values>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (state.data) setValues({ ...state.data })
  }, [state.data])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const missing = validateRequired(allFields, values)
    if (missing) return toast('error', missing)
    setSaving(true)
    try {
      await upsertRow<SiteSettings>('site_settings', { id: 1, ...normalize(allFields, values) } as Partial<SiteSettings>)
      toast('success', 'Sozlamalar saqlandi')
      reloadPublic()
    } catch (err) {
      toast('error', errorText(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest-950 sm:text-3xl">Sayt va aloqa sozlamalari</h1>
      <AsyncView state={state}>
        {() => (
          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            {groups.map((g) => (
              <section key={g.title} className="card p-6">
                <h2 className="text-lg font-bold text-forest-950">{g.title}</h2>
                {g.description && <p className="mt-1 text-sm text-forest-900/60">{g.description}</p>}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {g.fields.map((f) => (
                    <FieldInput key={f.name} field={f} folder="site" value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
                  ))}
                </div>
              </section>
            ))}
            <div className="sticky bottom-4 flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary px-8 shadow-xl">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Saqlash
              </button>
            </div>
          </form>
        )}
      </AsyncView>
    </div>
  )
}
