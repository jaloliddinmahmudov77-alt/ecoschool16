import {
  BookOpen, ClipboardList, Droplets, FileStack, Flower2, HeartHandshake, Leaf, LineChart, Megaphone,
  Recycle, ScrollText, Search, Sparkles, Sprout, Sun, TreePine, Users, Zap, type LucideIcon,
} from 'lucide-react'

/** Admin paneli tanlay oladigan ikonkalar. */
export const iconMap: Record<string, LucideIcon> = {
  Leaf, Users, Search, ClipboardList, LineChart, BookOpen, Megaphone, ScrollText, TreePine, Sparkles,
  Recycle, Droplets, FileStack, Sprout, Flower2, Sun, Zap, HeartHandshake,
}

export const iconNames = Object.keys(iconMap)

export function DynamicIcon({ name, className }: { name: string | null | undefined; className?: string }) {
  const Icon = (name && iconMap[name]) || Leaf
  return <Icon className={className} aria-hidden="true" />
}
