import { ZodError } from 'zod'
import { ApiError } from './client'

export type ErrorKind = 'network' | 'server' | 'client' | 'invalid' | 'unknown'

/**
 * What went wrong, as far as the user can act on it. `fetch` rejects with a
 * `TypeError` when the request never got an answer; `request()` throws
 * `ApiError` on non-2xx and `ZodError` when the body has an unexpected shape
 * (a `SyntaxError` means it wasn't JSON at all).
 */
export function getErrorKind(error: unknown): ErrorKind {
  if (error instanceof ApiError)
    return error.status >= 500 ? 'server' : 'client'
  if (error instanceof ZodError || error instanceof SyntaxError)
    return 'invalid'
  if (error instanceof TypeError) return 'network'
  return 'unknown'
}

/** One sentence for the explanation line of an error state. */
export function errorMessage(error: unknown): string {
  switch (getErrorKind(error)) {
    case 'network':
      return navigator.onLine
        ? 'Check your connection, then try again.'
        : 'You’re offline. Reconnect, then try again.'
    case 'server':
      return `The server ran into a problem (error ${(error as ApiError).status}). Try again in a moment.`
    case 'client':
      return `The server turned the request down (error ${(error as ApiError).status}).`
    case 'invalid':
      return 'The server sent data this app doesn’t recognize. Try again later.'
    case 'unknown':
      return 'Something unexpected went wrong. Try again.'
  }
}
