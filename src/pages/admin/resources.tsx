// Oddiy CRUD bo‘limlari: loyihalar, yangiliklar, galereya, yutuqlar, dalillar.
import { ResourceManager } from '../../components/admin/ResourceManager'
import type { FieldDef, Values } from '../../components/admin/FormFields'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { achievementKinds, galleryCategories } from '../../data/content'
import { defaultSteps } from '../../data/defaults'
import { formatDate, slugify } from '../../lib/format'
import { iconNames } from '../../lib/icons'
import type { Achievement, Evidence, GalleryItem, NewsItem, Project } from '../../lib/types'

const withSlug = (values: Values) => ({ ...values, slug: slugify(String(values.slug || values.title || '')) || `yozuv-${Date.now()}` })

const today = () => new Date().toISOString().slice(0, 10)

// ------------------------------------------------------------- loyihalar

const projectFields: FieldDef[] = [
  { name: 'title', label: 'Loyiha nomi', type: 'text', required: true },
  { name: 'slug', label: 'URL manzil (slug)', type: 'text', help: 'Bo‘sh qoldirilsa nomdan avtomatik yasaladi. Masalan: yashil-maktab' },
  { name: 'summary', label: 'Qisqa tavsif (kartochka uchun)', type: 'textarea', rows: 2, required: true },
  { name: 'description', label: 'To‘liq tavsif', type: 'textarea', rows: 5, help: 'Paragraflarni bo‘sh qator bilan ajrating.' },
  { name: 'goal', label: 'Maqsad', type: 'textarea', rows: 3 },
  { name: 'activities', label: 'Amalga oshirilgan ishlar', type: 'textarea', rows: 5, help: 'Har bir ishni yangi qatordan yozing.' },
  { name: 'results', label: 'Natijalar', type: 'textarea', rows: 4, help: 'Faqat haqiqiy, tasdiqlangan natijalar. Har birini yangi qatordan.' },
  {
    name: 'status',
    label: 'Holati',
    type: 'select',
    required: true,
    options: [
      { value: 'planned', label: 'Rejalashtirilgan' },
      { value: 'active', label: 'Faol' },
      { value: 'completed', label: 'Bajarilgan' },
    ],
  },
  { name: 'start_date', label: 'Boshlangan sana', type: 'date' },
  { name: 'sort_order', label: 'Tartib raqami', type: 'number' },
  { name: 'icon', label: 'Ikonka', type: 'icon' },
  { name: 'cover_image', label: 'Muqova rasmi', type: 'image' },
  { name: 'images', label: 'Fotosuratlar', type: 'images' },
  { name: 'published', label: 'Saytda ko‘rsatish', type: 'checkbox' },
]

export function ProjectsAdmin() {
  return (
    <ResourceManager<Project & Values>
      title="Ekologik loyihalar"
      description="Loyihalarni qo‘shing, tahrirlang, natija va fotosuratlarni kiriting."
      table="projects"
      orderBy="sort_order"
      fields={projectFields}
      defaults={{ status: 'planned', icon: iconNames[0], images: [], published: true, sort_order: 0 }}
      folder="projects"
      addLabel="Yangi loyiha"
      beforeSave={withSlug}
      view={(p) => ({
        title: p.title,
        subtitle: `/loyihalar/${p.slug}${p.published ? '' : ' · yashirin'}`,
        image: p.cover_image,
        badge: <StatusBadge status={p.status} />,
      })}
    />
  )
}

// ------------------------------------------------------------- yangiliklar

const newsFields: FieldDef[] = [
  { name: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
  { name: 'slug', label: 'URL manzil (slug)', type: 'text', help: 'Bo‘sh qoldirilsa sarlavhadan yasaladi.' },
  { name: 'published_at', label: 'Sana', type: 'date', required: true },
  { name: 'excerpt', label: 'Qisqa tavsif', type: 'textarea', rows: 2 },
  { name: 'content', label: 'Matn', type: 'textarea', rows: 10, required: true, help: 'Paragraflarni bo‘sh qator bilan ajrating.' },
  { name: 'cover_image', label: 'Rasm', type: 'image' },
  { name: 'published', label: 'Nashr etilgan', type: 'checkbox' },
]

export function NewsAdmin() {
  return (
    <ResourceManager<NewsItem & Values>
      title="Yangiliklar"
      description="Ekologik tadbirlar, yangi loyihalar va o‘quvchilar tashabbuslari haqida maqolalar."
      table="news"
      orderBy="published_at"
      ascending={false}
      fields={newsFields}
      defaults={{ published: true, published_at: today() }}
      folder="news"
      addLabel="Yangi maqola"
      beforeSave={withSlug}
      view={(n) => ({
        title: n.title,
        subtitle: `${formatDate(n.published_at)}${n.published ? '' : ' · qoralama'}`,
        image: n.cover_image,
      })}
    />
  )
}

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
