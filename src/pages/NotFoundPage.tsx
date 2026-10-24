import { motion } from 'framer-motion'
import { Home, Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFoundPage() {
  usePageMeta('Sahifa topilmadi')
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-sky-eco-700/70 pt-24 text-white">
      <div className="container-x relative flex flex-col items-center text-center">
        <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 120 }}>
          <Sprout className="h-20 w-20 text-leaf-300" aria-hidden="true" />
        </motion.div>
        <p className="mt-6 font-display text-8xl font-bold sm:text-9xl">404</p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Bu sahifa hali o‘smagan ekan</h1>
        <p className="mt-3 max-w-md text-white/70">Siz izlagan sahifa topilmadi yoki ko‘chirilgan. Bosh sahifaga qaytib, yashil yo‘lni davom ettiring.</p>
        <Link to="/" className="btn-light mt-8">
          <Home className="h-4 w-4" aria-hidden="true" /> Bosh sahifaga qaytish
        </Link>
      </div>
    </section>
  )
}
