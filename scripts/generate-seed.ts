// supabase/seed.sql faylini src/data/defaults.ts asosida yaratadi.
// Ishga tushirish: npm run seed:generate
import { writeFileSync } from 'node:fs'
import { defaultGallery, defaultProjects, defaultSettings, defaultStats, defaultSteps } from '../src/data/defaults.ts'

const q = (v: unknown): string => {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) return `array[${v.map(q).join(', ')}]::text[]`
  return `'${String(v).replace(/'/g, "''")}'`
}

const lines: string[] = [
  '-- EcoSchool16 — boshlang‘ich kontent (schema.sql dan keyin ishga tushiring).',
  '-- Avtomatik yaratilgan: npm run seed:generate. Mavjud yozuvlar o‘zgartirilmaydi.',
  '',
  `insert into public.site_settings (id, school_name, project_name, green_school_goal) values (1, ${q(defaultSettings.school_name)}, ${q(defaultSettings.project_name)}, ${q(defaultSettings.green_school_goal)}) on conflict (id) do nothing;`,
  '',
]
for (const s of defaultStats) {
  lines.push(`insert into public.stats (key, label, value, unit, sort_order) values (${q(s.key)}, ${q(s.label)}, null, ${q(s.unit)}, ${s.sort_order}) on conflict (key) do nothing;`)
}
lines.push('')
for (const s of defaultSteps) {
  lines.push(`insert into public.steps (step_number, title, short_description, description, icon, status) values (${s.step_number}, ${q(s.title)}, ${q(s.short_description)}, ${q(s.description)}, ${q(s.icon)}, ${q(s.status)}) on conflict (step_number) do nothing;`)
}
lines.push('')
for (const p of defaultProjects) {
  lines.push(`insert into public.projects (slug, title, summary, description, goal, icon, cover_image, images, status, sort_order, published) values (${q(p.slug)}, ${q(p.title)}, ${q(p.summary)}, ${q(p.description)}, ${q(p.goal)}, ${q(p.icon)}, ${q(p.cover_image)}, ${q(p.images)}, ${q(p.status)}, ${p.sort_order}, true) on conflict (slug) do nothing;`)
}
lines.push('')
for (const g of defaultGallery) {
  lines.push(`insert into public.gallery (title, category, image_url) select ${q(g.title)}, ${q(g.category)}, ${q(g.image_url)} where not exists (select 1 from public.gallery where image_url = ${q(g.image_url)});`)
}
writeFileSync(new URL('../supabase/seed.sql', import.meta.url), lines.join('\n') + '\n', 'utf8')
console.log('supabase/seed.sql yaratildi')
