import { useState } from 'react'
import { Lightbox } from './Lightbox'

/** Loyiha / qadam / yangilik rasmlari uchun bosilganda kattalashadigan to‘r. */
export function ImageGrid({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState<number | null>(null)
  if (images.length === 0) return null
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setIndex(i)}
            className="group aspect-[4/3] overflow-hidden rounded-2xl bg-forest-100"
            aria-label={`${alt} — ${i + 1}-rasmni kattalashtirish`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      <Lightbox images={images.map((src, i) => ({ src, alt: `${alt} — ${i + 1}` }))} index={index} onChange={setIndex} />
    </>
  )
}
