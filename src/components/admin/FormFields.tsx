import { iconNames, DynamicIcon } from '../../lib/icons'
import { MediaInput, MultiImageInput } from './MediaInputs'

export type FieldType = 'text' | 'textarea' | 'date' | 'number' | 'select' | 'checkbox' | 'image' | 'file' | 'images' | 'icon' | 'url' | 'email'

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: { value: string | number; label: string }[]
  /** select uchun: qiymatni songa aylantirish */
  numeric?: boolean
  help?: string
  rows?: number
  /** ikki ustunli formada butun qatorni egallaydi */
  full?: boolean
  placeholder?: string
}

export type Values = Record<string, unknown>

/** Formadagi qiymatlarni bazaga yozishga tayyorlaydi: bo‘sh satr → null, raqamlar → number. */
export function normalize(fields: FieldDef[], values: Values): Values {
  const out: Values = {}
  for (const f of fields) {
    let v = values[f.name]
    if (typeof v === 'string') v = v.trim()
    if (f.type === 'number' || f.numeric) v = v === '' || v === null || v === undefined ? null : Number(v)
    else if (f.type === 'images') v = Array.isArray(v) ? v : []
    else if (f.type === 'checkbox') v = Boolean(v)
    else if (v === '' || v === undefined) v = null
    out[f.name] = v
  }
  return out
}

export function validateRequired(fields: FieldDef[], values: Values): string | null {
  for (const f of fields) {
    const v = values[f.name]
    if (f.required && (v === null || v === undefined || (typeof v === 'string' && !v.trim()))) return `“${f.label}” maydonini to‘ldiring.`
  }
  return null
}

export function FieldInput({ field, value, onChange, folder }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void; folder: string }) {
  const id = `f-${field.name}`
  const str = value === null || value === undefined ? '' : String(value)

  let control
  switch (field.type) {
    case 'textarea':
      control = <textarea id={id} className="input" rows={field.rows ?? 4} value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
      break
    case 'select':
      control = (
        <select id={id} className="input" value={str} onChange={(e) => onChange(e.target.value)}>
          {!field.required && <option value="">— tanlanmagan —</option>}
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
      break
    case 'checkbox':
      return (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-forest-50 px-4 py-3 sm:col-span-2">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-forest-700" />
          <span className="text-sm font-semibold text-forest-900">{field.label}</span>
        </label>
      )
    case 'image':
      control = <MediaInput id={id} value={(value as string) ?? null} onChange={onChange} folder={folder} />
      break
    case 'file':
      control = <MediaInput id={id} value={(value as string) ?? null} onChange={onChange} folder={folder} accept="image/jpeg,image/png,image/webp,application/pdf" />
      break
    case 'images':
      control = <MultiImageInput value={(value as string[]) ?? []} onChange={onChange} folder={folder} />
      break
    case 'icon':
      control = (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={field.label}>
          {iconNames.map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={value === name}
              aria-label={name}
              title={name}
              onClick={() => onChange(name)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                value === name ? 'bg-forest-700 text-white' : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
              }`}
            >
              <DynamicIcon name={name} className="h-5 w-5" />
            </button>
          ))}
        </div>
      )
      break
    default:
      control = (
        <input
          id={id}
          className="input"
          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'}
          step={field.type === 'number' ? 'any' : undefined}
          value={str}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }

  const wide = field.full || ['textarea', 'images', 'icon', 'image', 'file'].includes(field.type)
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="label">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      {control}
      {field.help && <p className="mt-1.5 text-xs text-forest-900/50">{field.help}</p>}
    </div>
  )
}
