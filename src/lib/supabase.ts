import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey && !url.includes('YOUR-PROJECT'))

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, { auth: { persistSession: true, autoRefreshToken: true } })
  : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Supabase sozlanmagan. .env faylida VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY ni kiriting.')
  return supabase
}

export const MEDIA_BUCKET = 'media'
