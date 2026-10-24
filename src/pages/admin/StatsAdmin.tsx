import { Info, Loader2, Save } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { errorText, useToast } from '../../components/admin/Toast'
import { AsyncView } from '../../components/ui/States'
import { useAsync } from '../../hooks/useAsync'
import { listRows, updateRow } from '../../lib/api'
import { formatDate } from '../../lib/format'
import type { Stat } from '../../lib/types'

type Draft = { label: string; value: string; unit: string; note: string }

export default function StatsAdmin() {
  const toast = useToast()
  const state = useAsync(() => listRows<Stat>('stats', 'sort_order'))
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!state.data) return
    setDrafts(
      Object.fromEntries(
        state.data.map((s) => [s.key, { label: s.label, value: s.value === null ? '' : String(s.value), unit: s.unit ?? '', note: s.note ?? '' }]),
      ),
    )
  }, [state.data])

  const set = (key: string, field: keyof Draft, value: string) => setDrafts((d) => ({ ...d, [key]: { ...d[key], [field]: value } }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      for (const s of state.data ?? []) {
        const d = drafts[s.key]
        const value = d.value.trim() === '' ? null : Number(d.value)
        if (value !== null && (Number.isNaN(value) || value < 0)) throw new Error(`“${d.label}” uchun musbat son kiriting.`)
        await updateRow<Stat>('stats', 'key', s.key, { label: d.label.trim(), value, unit: d.unit.trim() || null, note: d.note.trim() || null })
      }
      toast('success', 'Statistika yangilandi')
      state.reload()
    } catch (err) {
      toast('error', errorText(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest-950 sm:text-3xl">Statistik ko‘rsatkichlar</h1>
      <p className="mt-3 flex gap-2 rounded-xl bg-sky-eco-100 p-4 text-sm text-sky-eco-700">
        <Info className="h-5 w-5 shrink-0" aria-hidden="true" />
        Faqat hujjatlar bilan tasdiqlangan haqiqiy raqamlarni kiriting. Qiymat bo‘sh qoldirilsa saytda “Ma’lumot kiritilmagan” deb ko‘rsatiladi.
      </p>
      <AsyncView state={state} empty={(d) => d.length === 0}>
        {(stats) => (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {stats.map((s) =>
              drafts[s.key] ? (
                <fieldset key={s.key} className="card grid gap-4 p-5 sm:grid-cols-[2fr_1fr_1fr]">
                  <legend className="sr-only">{s.label}</legend>
                  <div>
                    <label className="label" htmlFor={`${s.key}-label`}>
                      Ko‘rsatkich nomi
                    </label>
                    <input id={`${s.key}-label`} className="input" value={drafts[s.key].label} onChange={(e) => set(s.key, 'label', e.target.value)} />
                  </div>
                  <div>
                    <label className="label" htmlFor={`${s.key}-value`}>
                      Qiymat
                    </label>
                    <input
                      id={`${s.key}-value`}
                      className="input"
                      type="number"
                      min={0}
                      step="any"
                      placeholder="—"
                      value={drafts[s.key].value}
                      onChange={(e) => set(s.key, 'value', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor={`${s.key}-unit`}>
                      O‘lchov birligi
                    </label>
                    <input id={`${s.key}-unit`} className="input" value={drafts[s.key].unit} onChange={(e) => set(s.key, 'unit', e.target.value)} />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="label" htmlFor={`${s.key}-note`}>
                      Izoh (manba yoki davr)
                    </label>
                    <input
                      id={`${s.key}-note`}
                      className="input"
                      placeholder="Masalan: 2025–2026 o‘quv yili"
                      value={drafts[s.key].note}
                      onChange={(e) => set(s.key, 'note', e.target.value)}
                    />
                    {s.updated_at && <p className="mt-1.5 text-xs text-forest-900/50">Oxirgi yangilanish: {formatDate(s.updated_at)}</p>}
                  </div>
                </fieldset>
              ) : null,
            )}
            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary px-8">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Saqlash
              </button>
            </div>
          </form>
        )}
      </AsyncView>
    </div>
  )
}
