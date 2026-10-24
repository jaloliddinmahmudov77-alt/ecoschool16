import { createContext, useContext, type ReactNode } from 'react'
import { defaultSettings } from '../data/defaults'
import { useAsync } from '../hooks/useAsync'
import { getSettings } from './api'
import type { SiteSettings } from './types'

interface SettingsValue {
  settings: SiteSettings
  reload: () => void
}

const SettingsContext = createContext<SettingsValue>({ settings: defaultSettings, reload: () => {} })

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data, reload } = useAsync(getSettings)
  return <SettingsContext.Provider value={{ settings: data ?? defaultSettings, reload }}>{children}</SettingsContext.Provider>
}

export const useSettings = () => useContext(SettingsContext)
