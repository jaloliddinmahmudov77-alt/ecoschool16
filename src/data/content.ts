import { Droplets, GraduationCap, Lightbulb, Recycle, TreePine, type LucideIcon } from 'lucide-react'
import type { GalleryCategory } from '../lib/types'

export interface Value {
  icon: LucideIcon
  title: string
  text: string
}

/** "Biz haqimizda" bo‘limidagi asosiy yo‘nalishlar. */
export const values: Value[] = [
  {
    icon: GraduationCap,
    title: 'Ekologik ta’lim va tarbiya',
    text: 'Darslar, to‘garaklar va amaliy mashg‘ulotlar orqali o‘quvchilarda tabiatga mas’uliyatli munosabatni shakllantiramiz.',
  },
  {
    icon: TreePine,
    title: 'Maktab hududini obodonlashtirish',
    text: 'Daraxt va gullar ekamiz, yashil maydonlarni parvarish qilamiz, maktab hududini qulay va chiroyli qilamiz.',
  },
  {
    icon: Recycle,
    title: 'Chiqindilarni saralash madaniyati',
    text: 'Qog‘oz, plastik va boshqa chiqindilarni alohida yig‘ish hamda qayta ishlashga topshirish odatini rivojlantiramiz.',
  },
  {
    icon: Droplets,
    title: 'Suv va energiyani tejash',
    text: 'Suv va elektr energiyasini oqilona ishlatish bo‘yicha kundalik odatlarni targ‘ib qilamiz va nazorat qilamiz.',
  },
  {
    icon: Lightbulb,
    title: 'O‘quvchilar tashabbuslarini qo‘llab-quvvatlash',
    text: 'O‘quvchilarning ekologik g‘oyalarini tinglaymiz, ularni loyihaga aylantirishga yordam beramiz.',
  },
]

export const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: 'tadbirlar', label: 'Ekologik tadbirlar' },
  { value: 'daraxt-ekish', label: 'Daraxt ekish' },
  { value: 'oldin-keyin', label: 'Oldin va keyin' },
  { value: 'oquvchilar', label: 'O‘quvchilar faoliyati' },
  { value: 'natijalar', label: 'Loyiha natijalari' },
]

export const achievementKinds = [
  { value: 'sertifikat', label: 'Sertifikat' },
  { value: 'diplom', label: 'Diplom' },
  { value: 'mukofot', label: 'Mukofot' },
  { value: 'tanlov', label: 'Tanlovda ishtirok' },
] as const
