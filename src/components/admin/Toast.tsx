import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface Toast {
  id: number
  kind: 'success' | 'error'
  text: string
}

const ToastContext = createContext<(kind: Toast['kind'], text: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, kind, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 7000 : 3500)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="fixed right-4 bottom-4 z-[200] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              role={t.kind === 'error' ? 'alert' : 'status'}
              className={`flex gap-3 rounded-2xl p-4 text-sm font-medium shadow-xl ring-1 ${
                t.kind === 'success' ? 'bg-white text-forest-900 ring-forest-200' : 'bg-red-50 text-red-800 ring-red-200'
              }`}
            >
              {t.kind === 'success' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
              )}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

export const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e))
