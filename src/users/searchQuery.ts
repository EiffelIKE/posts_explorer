import { useState } from 'react'
import { useSearchParams } from 'react-router'

export const SEARCH_PARAM = 'q'
/** Only 10 users: one character is a useful search; 60 fits any real name. */
export const SEARCH_MAX_LENGTH = 60

/**
 * Users whose name contains the query, ignoring case and surrounding
 * whitespace. An empty or whitespace-only query matches everyone.
 */
export function filterByName<T extends { name: string }>(
  users: T[],
  query: string,
): T[] {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle) return users
  return users.filter((user) => user.name.toLocaleLowerCase().includes(needle))
}

/**
 * The search box value, synced with `?q=` so it survives reloads and
 * navigation. The input keeps exactly what was typed (spaces included); the URL
 * gets the trimmed value with the user's casing, and loses `q` when that is
 * empty. Other query parameters are left alone.
 */
export function useSearchQuery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = (searchParams.get(SEARCH_PARAM) ?? '').slice(
    0,
    SEARCH_MAX_LENGTH,
  )
  const [query, setQueryState] = useState(urlQuery)
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery)

  // `?q=` changed from outside (back/forward, a link): show it in the input.
  // Our own writes already equal the trimmed input, so typed spaces survive.
  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery)
    if (urlQuery !== query.trim()) setQueryState(urlQuery)
  }

  function setQuery(next: string) {
    setQueryState(next)
    const trimmed = next.trim()
    if (trimmed === (searchParams.get(SEARCH_PARAM) ?? '')) return
    setSearchParams(
      (params) => {
        const updated = new URLSearchParams(params)
        if (trimmed) updated.set(SEARCH_PARAM, trimmed)
        else updated.delete(SEARCH_PARAM)
        return updated
      },
      // One history entry per search, not per keystroke; keep the scroll.
      { replace: true, preventScrollReset: true },
    )
  }

  return [query, setQuery] as const
}
