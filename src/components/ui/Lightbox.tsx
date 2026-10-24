import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect } from 'react'

export interface LightboxImage {
  src: string
  alt: string
  caption?: string
}

interface Props {
  images: LightboxImage[]
  index: number | null
  onChange: (index: number | null) => void
}

/** Bosilganda rasmni kattalashtiradi. Klaviatura: ← → Esc. */
export function Lightbox({ images, index, onChange }: Props) {
  const current = index !== null ? images[index] : undefined
  const go = useCallback(
    (delta: number) => index !== null && onChange((index + delta + images.length) % images.length),
    [index, images.length, onChange],
  )

  useEffect(() => {
    if (!current) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [current, go, onChange])

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-950/95 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onChange(null)}
        >
          <button
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Yopish"
            autoFocus
          >
            <X className="h-6 w-6" />
          </button>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-6"
                aria-label="Oldingi rasm"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-6"
                aria-label="Keyingi rasm"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <motion.figure
            key={index}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={current.src} alt={current.alt} className="max-h-[80vh] w-auto rounded-2xl object-contain" />
            {(current.caption || images.length > 1) && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {current.caption}
                {images.length > 1 && (
                  <span className="ml-2 text-white/50">
                    {index! + 1} / {images.length}
                  </span>
                )}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
