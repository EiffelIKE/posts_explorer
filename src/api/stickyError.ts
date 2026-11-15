import { useState } from 'react'

interface QueryLike {
  status: 'pending' | 'error' | 'success'
  error: Error | null
  isFetching: boolean
}

/**
 * The query's error, kept through a retry. On refetch, TanStack resets a
 * query that has no data to `status: 'pending'` with `error: null`, which
 * would swap the error block (and the focused "Try again") for a skeleton.
 * Holding the last error keeps the block in place showing "Retrying…" until
 * the retry settles (PLAN decision 18).
 */
export function useStickyError(query: QueryLike) {
  const [lastError, setLastError] = useState<Error | null>(null)
  // Adjusting state while rendering: remember new errors, forget on success.
  if (query.error && query.error !== lastError) setLastError(query.error)
  if (query.status === 'success' && lastError) setLastError(null)

  const error = query.error ?? (query.isFetching ? lastError : null)
  return { error, retrying: error !== null && query.isFetching }
}
