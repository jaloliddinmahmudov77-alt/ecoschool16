import { useI18n } from '../../i18n'

const styles: Record<string, string> = {
  planned: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-amber-100 text-amber-800',
  active: 'bg-sky-eco-100 text-sky-eco-700',
  completed: 'bg-forest-100 text-forest-700',
}

export function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n()
  const label = t.status[status as keyof typeof t.status] ?? status
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[status] ?? styles.planned}`}>{label}</span>
  )
}
