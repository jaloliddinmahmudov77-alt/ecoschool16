import { AlertTriangle, Inbox, Loader2, RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'

export function Loader({ label = 'Yuklanmoqda…', className = 'py-20' }: { label?: string; className?: string }) {
  return (
    <div role="status" className={`flex flex-col items-center justify-center gap-3 text-forest-600 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-3xl border border-red-200 bg-red-50 p-8 text-center"
    >
      <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
      <p className="font-semibold text-red-800">Ma’lumotlarni yuklashda xatolik yuz berdi</p>
      <p className="text-sm text-red-700/80">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-2 py-2">
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Qayta urinish
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'Ma’lumotlar hali kiritilmagan', children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-forest-200 bg-white/60 p-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-100 text-forest-600">
        <Inbox className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="font-semibold text-forest-900">{title}</p>
      {children && <div className="text-sm text-forest-900/60">{children}</div>}
    </div>
  )
}

interface AsyncLike<T> {
  data: T | undefined
  loading: boolean
  error: string | null
  reload: () => void
}

/** useAsync natijasini yuklanish / xatolik / bo‘sh holatlar bilan ko‘rsatadi. */
export function AsyncView<T>({
  state,
  empty,
  emptyView,
  children,
}: {
  state: AsyncLike<T>
  empty?: (data: T) => boolean
  emptyView?: ReactNode
  children: (data: T) => ReactNode
}) {
  if (state.loading && state.data === undefined) return <Loader />
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />
  if (state.data === undefined) return null
  if (empty?.(state.data)) return <>{emptyView ?? <EmptyState />}</>
  return <>{children(state.data)}</>
}
