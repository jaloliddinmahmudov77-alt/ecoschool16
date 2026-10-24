import { AnimatePresence, motion } from 'framer-motion'
import { ImageOff, Loader2, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react'
import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useAsync } from '../../hooks/useAsync'
import { deleteRow, insertRow, listRows, removeMedia, updateRow, type TableName } from '../../lib/api'
import { AsyncView, EmptyState } from '../ui/States'
import { FieldInput, normalize, validateRequired, type FieldDef, type Values } from './FormFields'
import { errorText, useToast } from './Toast'

export interface RowView {
  title: string
  subtitle?: ReactNode
  image?: string | null
  badge?: ReactNode
}

interface Props<T extends Values> {
  title: string
  description?: string
  table: TableName
  keyColumn?: string
  orderBy: string
  ascending?: boolean
  fields: FieldDef[]
  defaults: Values
  folder: string
  view: (row: T) => RowView
  /** saqlashdan oldin qiymatlarni o‘zgartirish (masalan, slug yasash) */
  beforeSave?: (values: Values, existing: T | null) => Values
  /** faqat shu shartga mos qatorlarni ko‘rsatish */
  filter?: (row: T) => boolean
  addLabel?: string
  compact?: boolean
}

/** Jadval uchun umumiy CRUD: ro‘yxat, qidiruv, qo‘shish, tahrirlash, o‘chirish. */
export function ResourceManager<T extends Values>(props: Props<T>) {
  const { table, keyColumn = 'id', orderBy, ascending = true, fields, defaults, folder, view, beforeSave, filter } = props
  const toast = useToast()
  const state = useAsync(() => listRows<T>(table, orderBy, ascending), [table])
  const [editing, setEditing] = useState<{ row: T | null; values: Values } | null>(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (state.data ?? []).filter((r) => (!filter || filter(r)) && (!q || view(r).title.toLowerCase().includes(q)))
  }, [state.data, filter, query, view])

  const imageFields = fields.filter((f) => ['image', 'file', 'images'].includes(f.type)).map((f) => f.name)

  function openNew() {
    setEditing({ row: null, values: { ...defaults } })
  }

  function openEdit(row: T) {
    setEditing({ row, values: { ...row } })
  }

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!editing) return
    const missing = validateRequired(fields, editing.values)
    if (missing) return toast('error', missing)
    let values = normalize(fields, editing.values)
    if (beforeSave) values = beforeSave(values, editing.row)
    setSaving(true)
    try {
      if (editing.row) {
        await updateRow<T>(table, keyColumn, editing.row[keyColumn] as string, values as Partial<T>)
        // Formadan olib tashlangan rasmlarni storage’dan ham o‘chiramiz
        for (const name of imageFields) {
          const before = ([] as unknown[]).concat(editing.row[name] ?? [])
          const after = ([] as unknown[]).concat(values[name] ?? [])
          for (const url of before) if (!after.includes(url)) void removeMedia(url as string)
        }
        toast('success', 'O‘zgarishlar saqlandi')
      } else {
        await insertRow<T>(table, values as Partial<T>)
        toast('success', 'Yangi yozuv qo‘shildi')
      }
      setEditing(null)
      state.reload()
    } catch (err) {
      const msg = errorText(err)
      toast('error', /duplicate key/i.test(msg) ? 'Bunday manzil (slug) allaqachon mavjud. Boshqasini kiriting.' : msg)
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(row: T) {
    if (!confirm(`“${view(row).title}” o‘chirilsinmi? Bu amalni qaytarib bo‘lmaydi.`)) return
    try {
      await deleteRow(table, keyColumn, row[keyColumn] as string)
      for (const name of imageFields) for (const url of ([] as unknown[]).concat(row[name] ?? [])) void removeMedia(url as string)
      toast('success', 'O‘chirildi')
      state.reload()
    } catch (err) {
      toast('error', errorText(err))
    }
  }

  return (
    <div>
      {!props.compact && (
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold text-forest-950 sm:text-3xl">{props.title}</h1>
            {props.description && <p className="mt-1 text-forest-900/60">{props.description}</p>}
          </div>
          <button onClick={openNew} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" /> {props.addLabel ?? 'Qo‘shish'}
          </button>
        </div>
      )}
      {props.compact && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-forest-950">{props.title}</h2>
          <button onClick={openNew} className="btn-primary px-4 py-2">
            <Plus className="h-4 w-4" /> {props.addLabel ?? 'Qo‘shish'}
          </button>
        </div>
      )}

      {(state.data?.length ?? 0) > 6 && (
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-forest-400" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Qidirish…" aria-label="Qidirish" className="input pl-10" />
        </div>
      )}

      <AsyncView state={state}>
        {() =>
          rows.length === 0 ? (
            <EmptyState title="Hozircha yozuvlar yo‘q">“{props.addLabel ?? 'Qo‘shish'}” tugmasini bosing.</EmptyState>
          ) : (
            <ul className="card divide-y divide-forest-100">
              {rows.map((row) => {
                const v = view(row)
                return (
                  <li key={String(row[keyColumn])} className="flex items-center gap-4 p-4">
                    {v.image !== undefined &&
                      (v.image ? (
                        <img src={v.image} alt="" loading="lazy" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-300">
                          <ImageOff className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ))}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-forest-950">{v.title}</p>
                      {v.subtitle && <div className="truncate text-sm text-forest-900/55">{v.subtitle}</div>}
                    </div>
                    {v.badge && <div className="hidden sm:block">{v.badge}</div>}
                    <div className="flex shrink-0 gap-1">
                      <button onClick={() => openEdit(row)} className="rounded-lg p-2 text-forest-700 hover:bg-forest-50" aria-label={`${v.title} — tahrirlash`}>
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(row)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`${v.title} — o‘chirish`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )
        }
      </AsyncView>

      <AnimatePresence>
        {editing && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end justify-center bg-forest-950/60 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={onSave}
              role="dialog"
              aria-modal="true"
              aria-labelledby="editor-title"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-forest-100 px-6 py-4">
                <h2 id="editor-title" className="text-lg font-bold text-forest-950">
                  {editing.row ? 'Tahrirlash' : props.addLabel ?? 'Qo‘shish'}
                </h2>
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 hover:bg-forest-50" aria-label="Yopish">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid flex-1 gap-5 overflow-y-auto px-6 py-6 sm:grid-cols-2">
                {fields.map((f) => (
                  <FieldInput
                    key={f.name}
                    field={f}
                    folder={folder}
                    value={editing.values[f.name]}
                    onChange={(v) => setEditing((e) => e && { ...e, values: { ...e.values, [f.name]: v } })}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2 border-t border-forest-100 px-6 py-4">
                <button type="button" onClick={() => setEditing(null)} className="btn-outline">
                  Bekor qilish
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Saqlash
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
