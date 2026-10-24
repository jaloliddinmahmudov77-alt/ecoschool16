// Oddiy CRUD bo‘limlari: galereya, yutuqlar, dalillar.
import { ResourceManager } from '../../components/admin/ResourceManager'
import type { FieldDef, Values } from '../../components/admin/FormFields'
import { achievementKinds, galleryCategories } from '../../data/content'
import { defaultSteps } from '../../data/defaults'
import { formatDate } from '../../lib/format'
import type { Achievement, Evidence, GalleryItem } from '../../lib/types'

// ------------------------------------------------------------- galereya

const galleryFields: FieldDef[] = [
  { name: 'title', label: 'Izoh / sarlavha', type: 'text', full: true },
  { name: 'category', label: 'Kategoriya', type: 'select', required: true, options: galleryCategories },
  { name: 'taken_at', label: 'Olingan sana', type: 'date' },
  { name: 'image_url', label: 'Rasm (“Oldin-keyin” uchun — keyingi holat)', type: 'image', required: true },
  { name: 'before_image_url', label: 'Oldingi holat rasmi (ixtiyoriy)', type: 'image', help: 'To‘ldirilsa, galereyada taqqoslash slayderi ko‘rinadi.' },
]

export function GalleryAdmin() {
  return (
    <ResourceManager<GalleryItem & Values>
      title="Galereya"
      description="Rasmlar yuklanganda avtomatik siqiladi (WebP, maks. 1920px)."
      table="gallery"
      orderBy="created_at"
      ascending={false}
      fields={galleryFields}
      defaults={{ category: 'tadbirlar' }}
      folder="gallery"
      addLabel="Rasm qo‘shish"
      view={(g) => ({
        title: g.title || 'Nomsiz rasm',
        subtitle: [galleryCategories.find((c) => c.value === g.category)?.label, formatDate(g.taken_at), g.before_image_url && 'oldin-keyin']
          .filter(Boolean)
          .join(' · '),
        image: g.image_url,
      })}
    />
  )
}

// ------------------------------------------------------------- yutuqlar

const achievementFields: FieldDef[] = [
  { name: 'title', label: 'Nomi', type: 'text', required: true, full: true },
  { name: 'kind', label: 'Turi', type: 'select', required: true, options: [...achievementKinds] },
  { name: 'issuer', label: 'Bergan tashkilot', type: 'text' },
  { name: 'achieved_at', label: 'Sana', type: 'date' },
  { name: 'sort_order', label: 'Tartib raqami', type: 'number' },
  { name: 'description', label: 'Tavsif', type: 'textarea', rows: 3 },
  { name: 'image_url', label: 'Sertifikat / diplom rasmi', type: 'image' },
  { name: 'document_url', label: 'Hujjat (PDF yoki rasm)', type: 'file', help: 'Yutuqni tasdiqlovchi hujjat. Tasdiqlanmagan yutuqlarni kiritmang.' },
]

export function AchievementsAdmin() {
  return (
    <ResourceManager<Achievement & Values>
      title="Yutuqlar va sertifikatlar"
      description="Faqat hujjat bilan tasdiqlangan yutuqlarni kiriting."
      table="achievements"
      orderBy="sort_order"
      fields={achievementFields}
      defaults={{ kind: 'sertifikat', sort_order: 0 }}
      folder="achievements"
      addLabel="Yutuq qo‘shish"
      view={(a) => ({
        title: a.title,
        subtitle: [achievementKinds.find((k) => k.value === a.kind)?.label, a.issuer, formatDate(a.achieved_at)].filter(Boolean).join(' · '),
        image: a.image_url,
      })}
    />
  )
}

// ------------------------------------------------------------- dalillar

const evidenceFields: FieldDef[] = [
  { name: 'title', label: 'Dalil nomi', type: 'text', required: true, full: true },
  {
    name: 'step_number',
    label: 'Tegishli qadam',
    type: 'select',
    numeric: true,
    options: defaultSteps.map((s) => ({ value: s.step_number, label: `${s.step_number}. ${s.title}` })),
  },
  { name: 'evidence_date', label: 'Sana', type: 'date' },
  { name: 'description', label: 'Tavsif', type: 'textarea', rows: 3 },
  { name: 'image_url', label: 'Rasm', type: 'image' },
  { name: 'link_url', label: 'Hujjat (PDF) yoki havola', type: 'file' },
]

export function EvidenceAdmin() {
  return (
    <ResourceManager<Evidence & Values>
      title="Green School 2026 dalillari"
      description="Bayonnomalar, tahlil hujjatlari, harakat rejasi, fotosuratlar — tanlov uchun tasdiqlovchi materiallar."
      table="evidence"
      orderBy="evidence_date"
      ascending={false}
      fields={evidenceFields}
      defaults={{}}
      folder="evidence"
      addLabel="Dalil qo‘shish"
      view={(e) => ({
        title: e.title,
        subtitle: [e.step_number && `${e.step_number}-qadam`, formatDate(e.evidence_date)].filter(Boolean).join(' · '),
        image: e.image_url,
      })}
    />
  )
}
