import { useCallback, useEffect, useState } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'

// Keep in sync with the pre-paint script in index.html.
const STORAGE_KEY = 'posts-explorer:theme'

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

function applyPreference(preference: ThemePreference) {
  const root = document.documentElement
  if (preference === 'system') {
    delete root.dataset.theme
  } else {
    root.dataset.theme = preference
  }
  try {
    if (preference === 'system') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Storage can be blocked (private mode); the choice then lasts the session.
  }
}

/** System by default; an explicit Light or Dark choice is remembered per browser. */
export function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>(readPreference)

  useEffect(() => {
    applyPreference(preference)
  }, [preference])

  const choose = useCallback((next: ThemePreference) => setPreference(next), [])
  return [preference, choose] as const
}
