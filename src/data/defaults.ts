// Boshlang‘ich (shablon) kontent. Bu yerda faqat tavsiflar bor —
// natijalar, raqamlar va yutuqlar YO‘Q: ular administrator tomonidan kiritiladi.
// Ushbu fayl supabase/seed.sql ni yaratish uchun ham ishlatiladi
// (scripts/generate-seed.ts), shuning uchun faqat `import type` ishlating.
import type { Project, SiteSettings, Stat, Step } from '../lib/types'

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

// Loyiha muqovalari — faqat illyustrativ rasmlar; administrator haqiqiy rasmlar bilan almashtiradi.
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`

export const defaultProjects: Project[] = [
  {
    id: 'default-yashil-maktab',
    slug: 'yashil-maktab',
    title: 'Yashil maktab',
    summary: 'Maktab hududida daraxt va gullar ekish, yashil maydonlarni kengaytirish.',
    description: 'Maktab hududini ko‘kalamzorlashtirish, daraxt ko‘chatlari va gullar ekish hamda ularni parvarish qilish tashabbusi.',
    goal: 'Maktab hududidagi yashil maydonlarni ko‘paytirish va o‘quvchilarda tabiatga mehr uyg‘otish.',
    activities: null,
    results: null,
    icon: 'TreePine',
    cover_image: unsplash('1523348837708-15d4a09cfac2'),
    images: [],
    status: 'planned',
    start_date: null,
    sort_order: 1,
    published: true,
  },
  {
    id: 'default-toza-hudud',
    slug: 'toza-hudud',
    title: 'Toza hudud',
    summary: 'Maktab va uning atrofidagi hududlarni muntazam tozalash.',
    description: 'O‘quvchilar va o‘qituvchilar ishtirokida maktab hamda atrofdagi hududlarni tozalash bo‘yicha muntazam hasharlar.',
    goal: 'Maktab atrofini toza saqlash va chiqindilarni to‘g‘ri tashlash madaniyatini shakllantirish.',
    activities: null,
    results: null,
    icon: 'Sparkles',
    cover_image: unsplash('1416879595882-3373a0480b5b'),
    images: [],
    status: 'planned',
    start_date: null,
    sort_order: 2,
    published: true,
  },
  {
    id: 'default-plastiksiz-maktab',
    slug: 'plastiksiz-maktab',
    title: 'Plastiksiz maktab',
    summary: 'Bir martalik plastik mahsulotlardan foydalanishni kamaytirish.',
    description: 'Bir martalik plastik idishlar va paketlar o‘rniga qayta foydalaniladigan muqobillarni targ‘ib qilish, plastik chiqindilarni alohida yig‘ish.',
    goal: 'Maktabda hosil bo‘ladigan plastik chiqindilar hajmini kamaytirish.',
    activities: null,
    results: null,
    icon: 'Recycle',
    cover_image: unsplash('1532996122724-e3c354a0b15b'),
    images: [],
    status: 'planned',
    start_date: null,
    sort_order: 3,
    published: true,
  },
  {
    id: 'default-suvni-asraylik',
    slug: 'suvni-asraylik',
    title: 'Suvni asraylik',
    summary: 'Suvni tejash bo‘yicha amaliy tashabbuslar.',
    description: 'Jo‘mraklarni nazorat qilish, oqib turgan suvni aniqlash, suvni tejash bo‘yicha targ‘ibot materiallari tayyorlash.',
    goal: 'Maktabda suv sarfini kamaytirish va suvni tejash odatini shakllantirish.',
    activities: null,
    results: null,
    icon: 'Droplets',
    cover_image: unsplash('1497436072909-60f360e1d4b1'),
    images: [],
    status: 'planned',
    start_date: null,
    sort_order: 4,
    published: true,
  },
  {
    id: 'default-qogozni-qayta-ishlaymiz',
    slug: 'qogozni-qayta-ishlaymiz',
    title: 'Qog‘ozni qayta ishlaymiz',
    summary: 'Chiqindi qog‘ozlarni yig‘ish va saralash.',
    description: 'Sinflarda chiqindi qog‘oz uchun alohida qutilar o‘rnatish, yig‘ilgan qog‘ozni saralash va qayta ishlashga topshirish.',
    goal: 'Qog‘oz chiqindilarini qayta ishlashga yo‘naltirish va qog‘ozni tejash.',
    activities: null,
    results: null,
    icon: 'FileStack',
    cover_image: unsplash('1611284446314-60a58ac0deb9'),
    images: [],
    status: 'planned',
    start_date: null,
    sort_order: 5,
    published: true,
  },
  {
    id: 'default-yosh-ekologlar',
    slug: 'yosh-ekologlar',
    title: 'Yosh ekologlar',
    summary: 'O‘quvchilarning ekologik g‘oyalari va tashabbuslari.',
    description: 'O‘quvchilar o‘z ekologik g‘oyalarini taklif qiladi, kichik tadqiqot va loyihalar ustida ishlaydi.',
    goal: 'O‘quvchilarning ekologik tashabbuskorligini va tadqiqotchilik ko‘nikmalarini rivojlantirish.',
    activities: null,
    results: null,
    icon: 'Sprout',
    cover_image: unsplash('1501004318641-b39e6451bec6'),
    images: [],
    status: 'planned',
    start_date: null,
    sort_order: 6,
    published: true,
  },
]

export const heroImage = unsplash('1441974231531-c6227db76b6e').replace('w=1200', 'w=2000')
export const aboutImage = unsplash('1542601906990-b4d3fb778b09')
