import type { Session } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'

interface AuthValue {
  session: Session | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

/** Admin ekanligini serverdagi is_admin() funksiyasi orqali tekshiradi. */
async function checkAdmin(): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    let alive = true
    const apply = async (next: Session | null) => {
      const admin = next ? await checkAdmin() : false
      if (!alive) return
      setSession(next)
      setIsAdmin(admin)
      setLoading(false)
    }
    supabase.auth.getSession().then(({ data }) => apply(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (event === 'TOKEN_REFRESHED') return setSession(next)
      // onAuthStateChange ichida await qilmaslik kerak — keyingi tickda tekshiramiz
      setTimeout(() => apply(next), 0)
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase sozlanmagan.')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw new Error(/invalid login/i.test(error.message) ? 'Email yoki parol noto‘g‘ri.' : error.message)
    }
    if (!(await checkAdmin())) {
      await supabase.auth.signOut()
      throw new Error('Bu hisob administrator huquqiga ega emas.')
    }
  }, [])

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

  return <AuthContext.Provider value={{ session, isAdmin, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak')
  return ctx
}
