const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']

/** "2026-03-15" → "15-mart, 2026" */
export function formatDate(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value)
  if (Number.isNaN(d.getTime())) return value
  return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('uz-UZ').format(value).replace(/,/g, ' ')
}

/** Lotin o‘zbek matnidan URL uchun slug yasaydi. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʻʼ'`]/g, '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Matndagi bo‘sh qatorlar bo‘yicha paragraflarga ajratadi. */
export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
}

/** Har bir qatorni ro‘yxat elementi sifatida qaytaradi ("- " belgisi olib tashlanadi). */
export function lines(text: string | null | undefined): string[] {
  return (text ?? '').split('\n').map((l) => l.replace(/^\s*[-•*]\s*/, '').trim()).filter(Boolean)
}
