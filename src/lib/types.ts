export interface SiteSettings {
  id: number
  school_name: string
  project_name: string
  address: string | null
  phone: string | null
  email: string | null
  working_hours: string | null
  map_url: string | null
  telegram_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  youtube_url: string | null
  hero_image_url: string | null
  green_school_goal: string | null
  green_school_preparation: string | null
  green_school_works: string | null
  updated_at?: string
}

export interface Stat {
  key: string
  label: string
  value: number | null
  unit: string | null
  note: string | null
  sort_order: number
  updated_at?: string
}

export type StepStatus = 'planned' | 'in_progress' | 'completed'

export interface Step {
  step_number: number
  title: string
  short_description: string
  description: string
  icon: string
  status: StepStatus
  updated_at?: string
}

export interface StepActivity {
  id: string
  step_number: number
  title: string
  description: string | null
  result: string | null
  activity_date: string | null
  images: string[]
  created_at?: string
}

export type GalleryCategory = 'tadbirlar' | 'daraxt-ekish' | 'oldin-keyin' | 'oquvchilar' | 'natijalar'

export interface GalleryItem {
  id: string
  title: string
  category: GalleryCategory
  image_url: string
  before_image_url: string | null
  taken_at: string | null
  created_at?: string
}

export type AchievementKind = 'sertifikat' | 'diplom' | 'mukofot' | 'tanlov'

export interface Achievement {
  id: string
  title: string
  kind: AchievementKind
  issuer: string | null
  achieved_at: string | null
  description: string | null
  image_url: string | null
  document_url: string | null
  sort_order: number
  created_at?: string
}

export interface Evidence {
  id: string
  title: string
  description: string | null
  step_number: number | null
  evidence_date: string | null
  image_url: string | null
  link_url: string | null
  created_at?: string
}
