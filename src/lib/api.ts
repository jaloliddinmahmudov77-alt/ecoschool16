import { defaultProjects, defaultSettings, defaultStats, defaultSteps } from '../data/defaults'
import { isSupabaseConfigured, MEDIA_BUCKET, requireSupabase, supabase } from './supabase'
import type {
  Achievement,
  ContactMessage,
  Evidence,
  GalleryItem,
  NewsItem,
  Project,
  SiteSettings,
  Stat,
  Step,
  StepActivity,
} from './types'

export type TableName =
  | 'site_settings'
  | 'stats'
  | 'steps'
  | 'step_activities'
  | 'projects'
  | 'news'
  | 'gallery'
  | 'achievements'
  | 'evidence'
  | 'contact_messages'

function fail(error: { message: string; code?: string } | null): never {
  const msg = error?.message ?? 'Noma’lum xatolik'
  // PGRST116: RLS yozuvni yashirgan (yoki u o‘chirilgan) — update/select().single() natija qaytarmadi
  if (error?.code === '42501' || error?.code === 'PGRST116' || /row-level security/i.test(msg)) {
    throw new Error('Ruxsat yo‘q: bu amal faqat administratorlar uchun.')
  }
  if (/Failed to fetch|NetworkError/i.test(msg)) {
    throw new Error('Serverga ulanib bo‘lmadi. Internet aloqasini tekshiring.')
  }
  throw new Error(msg)
}

// ---------------------------------------------------------------- public

export async function getSettings(): Promise<SiteSettings> {
  if (!supabase) return defaultSettings
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  if (error) fail(error)
  return { ...defaultSettings, ...(data ?? {}) }
}

export async function getStats(): Promise<Stat[]> {
  if (!supabase) return defaultStats
  const { data, error } = await supabase.from('stats').select('*').order('sort_order')
  if (error) fail(error)
  return data ?? []
}

export async function getSteps(): Promise<Step[]> {
  if (!supabase) return defaultSteps
  const { data, error } = await supabase.from('steps').select('*').order('step_number')
  if (error) fail(error)
  return data ?? []
}

export async function getStepActivities(stepNumber?: number): Promise<StepActivity[]> {
  if (!supabase) return []
  let query = supabase.from('step_activities').select('*').order('activity_date', { ascending: false, nullsFirst: false })
  if (stepNumber !== undefined) query = query.eq('step_number', stepNumber)
  const { data, error } = await query
  if (error) fail(error)
  return data ?? []
}

export async function getProjects(): Promise<Project[]> {
  if (!supabase) return defaultProjects
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('sort_order')
    .order('created_at', { ascending: false })
  if (error) fail(error)
  return data ?? []
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!supabase) return defaultProjects.find((p) => p.slug === slug) ?? null
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).eq('published', true).maybeSingle()
  if (error) fail(error)
  return data
}

export async function getNews(limit?: number): Promise<NewsItem[]> {
  if (!supabase) return []
  let query = supabase.from('news').select('*').eq('published', true).order('published_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) fail(error)
  return data ?? []
}

export async function getNewsItem(slug: string): Promise<NewsItem | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('news').select('*').eq('slug', slug).eq('published', true).maybeSingle()
  if (error) fail(error)
  return data
}

export async function getGallery(): Promise<GalleryItem[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
  if (error) fail(error)
  return data ?? []
}

export async function getAchievements(): Promise<Achievement[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('sort_order')
    .order('achieved_at', { ascending: false, nullsFirst: false })
  if (error) fail(error)
  return data ?? []
}

export async function getEvidence(): Promise<Evidence[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('evidence')
    .select('*')
    .order('step_number', { nullsFirst: false })
    .order('evidence_date', { ascending: false, nullsFirst: false })
  if (error) fail(error)
  return data ?? []
}

export interface ContactInput {
  name: string
  email: string | null
  phone: string | null
  message: string
}

export async function sendContactMessage(input: ContactInput): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('contact_messages').insert(input)
  if (error) fail(error)
}

// ---------------------------------------------------------------- admin (RLS serverda tekshiradi)

export async function listRows<T>(table: TableName, orderBy: string, ascending = true): Promise<T[]> {
  const client = requireSupabase()
  const { data, error } = await client.from(table).select('*').order(orderBy, { ascending, nullsFirst: false })
  if (error) fail(error)
  return (data ?? []) as T[]
}

export async function insertRow<T>(table: TableName, row: Partial<T>): Promise<T> {
  const client = requireSupabase()
  const { data, error } = await client.from(table).insert(row as never).select().single()
  if (error) fail(error)
  return data as T
}

export async function updateRow<T>(table: TableName, keyColumn: string, key: string | number, patch: Partial<T>): Promise<T> {
  const client = requireSupabase()
  const { data, error } = await client.from(table).update(patch as never).eq(keyColumn, key).select().single()
  if (error) fail(error)
  return data as T
}

export async function upsertRow<T>(table: TableName, row: Partial<T>): Promise<T> {
  const client = requireSupabase()
  const { data, error } = await client.from(table).upsert(row as never).select().single()
  if (error) fail(error)
  return data as T
}

export async function deleteRow(table: TableName, keyColumn: string, key: string | number): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from(table).delete().eq(keyColumn, key)
  if (error) fail(error)
}

export async function listMessages(): Promise<ContactMessage[]> {
  return listRows<ContactMessage>('contact_messages', 'created_at', false)
}

export async function countUnreadMessages(): Promise<number> {
  const client = requireSupabase()
  const { count, error } = await client
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false)
  if (error) fail(error)
  return count ?? 0
}

// ---------------------------------------------------------------- storage

/** Rasmni brauzerda kichraytiradi (maks. 1920px, WebP) — tez yuklanish uchun. */
async function optimizeImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82))
    return blob && blob.size < file.size ? blob : file
  } catch {
    return file
  }
}

export async function uploadMedia(file: File, folder: string): Promise<string> {
  const client = requireSupabase()
  const body = await optimizeImage(file)
  const ext = body === file ? (file.name.split('.').pop() ?? 'bin').toLowerCase() : 'webp'
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
  const { error } = await client.storage.from(MEDIA_BUCKET).upload(path, body, {
    cacheControl: '31536000',
    contentType: body === file ? file.type : 'image/webp',
  })
  if (error) fail(error)
  return client.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
}

/** Faqat o‘zimizning bucketdagi faylni o‘chiradi; tashqi havolalarga tegmaydi. */
export async function removeMedia(publicUrl: string | null | undefined): Promise<void> {
  if (!publicUrl || !supabase) return
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return
  await supabase.storage.from(MEDIA_BUCKET).remove([decodeURIComponent(publicUrl.slice(idx + marker.length))])
}

export { isSupabaseConfigured }
