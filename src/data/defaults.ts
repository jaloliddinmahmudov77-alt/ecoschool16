// Boshlang‘ich (shablon) kontent. Bu yerda faqat tavsiflar bor —
// natijalar, raqamlar va yutuqlar YO‘Q: ular administrator tomonidan kiritiladi.
// Ushbu fayl supabase/seed.sql ni yaratish uchun ham ishlatiladi
// (scripts/generate-seed.ts), shuning uchun faqat `import type` ishlating.
import type { GalleryItem, SiteSettings, Stat, Step } from '../lib/types'

export const defaultSettings: SiteSettings = {
  id: 1,
  school_name: '16-maktab',
  project_name: 'EcoSchool16',
  address: null,
  phone: null,
  email: null,
  working_hours: null,
  map_url: null,
  telegram_url: null,
  instagram_url: null,
  facebook_url: null,
  youtube_url: null,
  hero_image_url: null,
  green_school_goal:
    '“Green School” respublika tanlovi umumta’lim maktablarida ekologik madaniyatni shakllantirish, ' +
    'Eco-Schools “7 qadam” metodologiyasini amalda qo‘llash va o‘quvchilarning ekologik tashabbuslarini ' +
    'qo‘llab-quvvatlashga qaratilgan.',
  green_school_preparation: null,
  green_school_works: null,
}

export const defaultStats: Stat[] = [
  { key: 'students', label: 'Ekologik tadbirlarda qatnashgan o‘quvchilar', value: null, unit: 'nafar', note: null, sort_order: 1 },
  { key: 'plants', label: 'Ekilgan daraxt va gullar', value: null, unit: 'tup', note: null, sort_order: 2 },
  { key: 'waste', label: 'Yig‘ilgan chiqindilar', value: null, unit: 'kg', note: null, sort_order: 3 },
  { key: 'projects', label: 'Amalga oshirilgan ekologik loyihalar', value: null, unit: 'ta', note: null, sort_order: 4 },
]

export const defaultSteps: Step[] = [
  {
    step_number: 1,
    title: 'Ekologik qo‘mita',
    short_description: 'Maktab ekologik jamoasini tashkil etish.',
    description:
      'O‘quvchilar, o‘qituvchilar, maktab ma’muriyati, texnik xodimlar va ota-onalar vakillaridan iborat ekologik qo‘mita tuziladi. ' +
      'Qo‘mita dasturning barcha bosqichlarini boshqaradi, yig‘ilishlar o‘tkazadi va qarorlarni hujjatlashtiradi.',
    icon: 'Users',
    status: 'planned',
  },
  {
    step_number: 2,
    title: 'Ekologik tahlil',
    short_description: 'Maktabdagi ekologik holatni o‘rganish.',
    description:
      'Chiqindilar, suv, energiya, maktab hududi, bioxilma-xillik va sog‘lom turmush tarzi kabi yo‘nalishlarda maktabning hozirgi holati o‘rganiladi. ' +
      'Tahlil natijalari keyingi harakat rejasi uchun asos bo‘ladi.',
    icon: 'Search',
    status: 'planned',
  },
  {
    step_number: 3,
    title: 'Harakat rejasi',
    short_description: 'Ekologik muammolar uchun yechimlar rejasini tuzish.',
    description:
      'Ekologik tahlil asosida ustuvor yo‘nalishlar tanlanadi va har biri uchun aniq maqsad, mas’ul shaxslar, muddatlar hamda o‘lchanadigan ko‘rsatkichlar belgilanadi.',
    icon: 'ClipboardList',
    status: 'planned',
  },
  {
    step_number: 4,
    title: 'Monitoring va baholash',
    short_description: 'Natijalarni o‘lchash va tahlil qilish.',
    description:
      'Harakat rejasining bajarilishi muntazam kuzatib boriladi: ko‘rsatkichlar o‘lchanadi, natijalar boshlang‘ich holat bilan solishtiriladi va kerak bo‘lsa reja yangilanadi.',
    icon: 'LineChart',
    status: 'planned',
  },
  {
    step_number: 5,
    title: 'O‘quv dasturiga integratsiya',
    short_description: 'Ekologik mavzularni ta’limga kiritish.',
    description:
      'Ekologik mavzular turli fanlar darslariga, sinfdan tashqari mashg‘ulotlar va to‘garaklarga kiritiladi. O‘quvchilar amaliy tadqiqotlar orqali bilim oladi.',
    icon: 'BookOpen',
    status: 'planned',
  },
  {
    step_number: 6,
    title: 'Axborot va hamkorlik',
    short_description: 'O‘quvchilar, ota-onalar va jamoatchilikni jalb qilish.',
    description:
      'Maktab ekologik faoliyati haqida axborot taxtalari, ijtimoiy tarmoqlar va tadbirlar orqali ma’lumot beriladi. Ota-onalar, mahalla va hamkor tashkilotlar jalb qilinadi.',
    icon: 'Megaphone',
    status: 'planned',
  },
  {
    step_number: 7,
    title: 'Ekologik kodeks',
    short_description: 'Maktabning ekologik qoidalarini ishlab chiqish.',
    description:
      'Butun maktab jamoasi ishtirokida maktabning ekologik qadriyatlari va kundalik xatti-harakat qoidalarini ifodalovchi ekologik kodeks (shior) ishlab chiqiladi va ko‘zga ko‘rinadigan joyga joylashtiriladi.',
    icon: 'ScrollText',
    status: 'planned',
  },
]

// Maktabning haqiqiy fotosuratlari (public/images/school).
export const schoolPhotos = {
  plantsWithTeacher: '/images/school/oquvchilar-gul-kochirish-1.webp',
  repotting: '/images/school/oquvchilar-gul-kochirish-2.webp',
  pottingSoil: '/images/school/tuvakka-tuproq-solish.webp',
  flowerbed: '/images/school/gulzor-tayyorlash.webp',
  courtyard: '/images/school/hovli-tozalash.webp',
  flowers: '/images/school/xrizantemalar.webp',
  street1: '/images/school/kocha-tozalash-1.webp',
  street2: '/images/school/kocha-tozalash-2.webp',
}

export const heroImage = schoolPhotos.flowerbed
export const aboutImage = schoolPhotos.plantsWithTeacher

// Galereyaning boshlang‘ich rasmlari (sanalar noma’lum bo‘lgani uchun kiritilmagan).
export const defaultGallery: GalleryItem[] = [
  { id: 'g1', title: 'O‘quvchilar ustoz bilan xona o‘simliklarini ko‘chirib o‘tqazmoqda', category: 'oquvchilar', image_url: schoolPhotos.plantsWithTeacher, before_image_url: null, taken_at: null },
  { id: 'g2', title: 'Gullarni yangi tuvaklarga o‘tqazish', category: 'oquvchilar', image_url: schoolPhotos.repotting, before_image_url: null, taken_at: null },
  { id: 'g8', title: 'O‘quvchilar ustoz bilan tuvaklarga tuproq solib, ko‘chat o‘tqazmoqda', category: 'oquvchilar', image_url: schoolPhotos.pottingSoil, before_image_url: null, taken_at: null },
  { id: 'g3', title: '5-B sinf o‘quvchilari gulzorni ekishga tayyorlamoqda', category: 'daraxt-ekish', image_url: schoolPhotos.flowerbed, before_image_url: null, taken_at: null },
  { id: 'g4', title: 'Ekish uchun keltirilgan xrizantemalar', category: 'daraxt-ekish', image_url: schoolPhotos.flowers, before_image_url: null, taken_at: null },
  { id: 'g5', title: 'Maktab hovlisini tozalash hashari', category: 'tadbirlar', image_url: schoolPhotos.courtyard, before_image_url: null, taken_at: null },
  { id: 'g6', title: 'Maktab atrofidagi ko‘chani chiqindilardan tozalash', category: 'tadbirlar', image_url: schoolPhotos.street1, before_image_url: null, taken_at: null },
  { id: 'g7', title: 'O‘quvchilar maktab oldidagi hududni tozalamoqda', category: 'tadbirlar', image_url: schoolPhotos.street2, before_image_url: null, taken_at: null },
]
