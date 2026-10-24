import { ImagePlus, Loader2, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { uploadMedia } from '../../lib/api'
import { errorText, useToast } from './Toast'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

interface SingleProps {
  value: string | null
  onChange: (url: string | null) => void
  folder: string
  accept?: string
  id?: string
}

/** Bitta rasm (yoki PDF) yuklash. Yuklangan fayl Supabase Storage’ga tushadi. */
export function MediaInput({ value, onChange, folder, accept = ACCEPT, id }: SingleProps) {
  const toast = useToast()
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const isPdf = value?.toLowerCase().endsWith('.pdf')

  async function onFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    try {
      onChange(await uploadMedia(file, folder))
    } catch (e) {
      toast('error', `Yuklanmadi: ${errorText(e)}`)
    } finally {
      setBusy(false)
      if (ref.current) ref.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-fit">
          {isPdf ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="block rounded-xl bg-forest-50 px-4 py-3 text-sm font-semibold text-forest-700 underline">
              PDF hujjat
            </a>
          ) : (
            <img src={value} alt="" className="h-32 w-48 rounded-xl object-cover ring-1 ring-forest-100" />
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white shadow hover:bg-red-700"
            aria-label="Faylni olib tashlash"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="btn-outline px-4 py-2">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? 'Yuklanmoqda…' : value ? 'Almashtirish' : 'Fayl yuklash'}
        </button>
        <input
          id={id}
          type="url"
          placeholder="yoki havola (https://…)"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="input max-w-xs py-2"
        />
      </div>
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  )
}

/** Bir nechta rasm yuklash (galereya / loyiha / qadam fotosuratlari). */
export function MultiImageInput({ value, onChange, folder }: { value: string[]; onChange: (urls: string[]) => void; folder: string }) {
  const toast = useToast()
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(0)

  async function onFiles(files: FileList | null) {
    if (!files?.length) return
    const list = Array.from(files)
    setBusy(list.length)
    const uploaded: string[] = []
    for (const file of list) {
      try {
        uploaded.push(await uploadMedia(file, folder))
      } catch (e) {
        toast('error', `${file.name}: ${errorText(e)}`)
      }
      setBusy((b) => b - 1)
    }
    onChange([...value, ...uploaded])
    if (ref.current) ref.current.value = ''
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {value.map((src, i) => (
          <div key={src} className="group relative aspect-square">
            <img src={src} alt="" className="h-full w-full rounded-xl object-cover ring-1 ring-forest-100" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-90 shadow hover:bg-red-700"
              aria-label={`${i + 1}-rasmni olib tashlash`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy > 0}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-forest-200 text-xs font-semibold text-forest-600 transition hover:border-forest-400 hover:bg-forest-50"
        >
          {busy > 0 ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
          {busy > 0 ? `${busy} ta qoldi` : 'Qo‘shish'}
        </button>
      </div>
      <input ref={ref} type="file" accept={ACCEPT} multiple hidden onChange={(e) => onFiles(e.target.files)} />
    </div>
  )
}
