import { Loader2, Save } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { FieldInput, normalize, validateRequired, type FieldDef, type Values } from '../../components/admin/FormFields'
import { ResourceManager } from '../../components/admin/ResourceManager'
import { errorText, useToast } from '../../components/admin/Toast'
import { AsyncView } from '../../components/ui/States'
import { useAsync } from '../../hooks/useAsync'
import { listRows, updateRow } from '../../lib/api'
import { formatDate } from '../../lib/format'
import type { Step, StepActivity } from '../../lib/types'

const stepFields: FieldDef[] = [
  { name: 'title', label: 'Qadam nomi', type: 'text', required: true },
  {
    name: 'status',
    label: 'Holati',
    type: 'select',
    required: true,
    options: [
      { value: 'planned', label: 'Rejalashtirilgan' },
      { value: 'in_progress', label: 'Jarayonda' },
      { value: 'completed', label: 'Bajarilgan' },
    ],
  },
  { name: 'short_description', label: 'Qisqa tavsif', type: 'textarea', rows: 2, required: true },
  { name: 'description', label: 'To‘liq tavsif (rasmiy metodologiya bo‘yicha)', type: 'textarea', rows: 6 },
  { name: 'icon', label: 'Ikonka', type: 'icon' },
]

const activityFields: FieldDef[] = [
  { name: 'title', label: 'Bajarilgan ish', type: 'text', required: true },
  { name: 'activity_date', label: 'Sana', type: 'date' },
  { name: 'description', label: 'Tavsif', type: 'textarea', rows: 4 },
  { name: 'result', label: 'Natija', type: 'textarea', rows: 2, help: 'Masalan: o‘lchangan ko‘rsatkich, qabul qilingan qaror.' },
  { name: 'images', label: 'Fotosuratlar', type: 'images' },
]

function StepEditor({ step, onSaved }: { step: Step; onSaved: () => void }) {
  const toast = useToast()
  const [values, setValues] = useState<Values>({ ...step })
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    setValues({ ...step })
  }, [step])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const missing = validateRequired(stepFields, values)
    if (missing) return toast('error', missing)
    setSaving(true)
    try {
      await updateRow<Step>('steps', 'step_number', step.step_number, normalize(stepFields, values) as Partial<Step>)
      toast('success', `${step.step_number}-qadam saqlandi`)
      onSaved()
    } catch (err) {
      toast('error', errorText(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {stepFields.map((f) => (
          <FieldInput key={f.name} field={f} folder="steps" value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Qadamni saqlash
        </button>
      </div>
    </form>
  )
}

export default function StepsAdmin() {
  const state = useAsync(() => listRows<Step>('steps', 'step_number'))
  const [active, setActive] = useState(1)

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest-950 sm:text-3xl">“7 qadam” metodologiyasi</h1>
      <p className="mt-1 text-forest-900/60">Har bir qadam matnini rasmiy metodologiyaga moslang va bajarilgan ishlarni sanasi, natijasi, fotosuratlari bilan kiriting.</p>
      <AsyncView state={state} empty={(d) => d.length === 0}>
        {(steps) => {
          const step = steps.find((s) => s.step_number === active) ?? steps[0]
          return (
            <>
              <div role="tablist" aria-label="Qadamlar" className="mt-6 mb-6 flex gap-2 overflow-x-auto pb-2">
                {steps.map((s) => (
                  <button
                    key={s.step_number}
                    role="tab"
                    aria-selected={s.step_number === step.step_number}
                    onClick={() => setActive(s.step_number)}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      s.step_number === step.step_number ? 'bg-forest-700 text-white' : 'bg-white text-forest-800 ring-1 ring-forest-200 hover:bg-forest-50'
                    }`}
                  >
                    {s.step_number}. {s.title}
                  </button>
                ))}
              </div>
              <StepEditor step={step} onSaved={state.reload} />
              <div className="mt-10">
                <ResourceManager<StepActivity & Values>
                  key={step.step_number}
                  compact
                  title={`${step.step_number}-qadam: bajarilgan ishlar`}
                  table="step_activities"
                  orderBy="activity_date"
                  ascending={false}
                  fields={activityFields}
                  defaults={{ images: [] }}
                  folder={`steps/${step.step_number}`}
                  addLabel="Ish qo‘shish"
                  filter={(a) => a.step_number === step.step_number}
                  beforeSave={(v) => ({ ...v, step_number: step.step_number })}
                  view={(a) => ({
                    title: a.title,
                    subtitle: [formatDate(a.activity_date), a.images.length ? `${a.images.length} ta rasm` : null].filter(Boolean).join(' · '),
                    image: a.images[0] ?? null,
                  })}
                />
              </div>
            </>
          )
        }}
      </AsyncView>
    </div>
  )
}
