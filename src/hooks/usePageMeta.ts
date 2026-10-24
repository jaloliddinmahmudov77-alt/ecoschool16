import { useEffect } from 'react'

const SITE = 'EcoSchool16'

/** Har bir sahifa uchun SEO sarlavha va tavsifni o‘rnatadi. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — 16-maktabning Green School ekologik platformasi`
    if (description) {
      for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) {
        document.querySelector(selector)?.setAttribute('content', description)
      }
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
  }, [title, description])
}
