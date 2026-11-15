// TEMPORARY (design step): lets reviewers force every UI state from the URL,
// e.g. `/?users=loading` or `/users/1?posts=error&publish=error`.
// Steps 3–6 replace this with real TanStack Query states.
import { useSearchParams } from 'react-router'

export type UsersState = 'ready' | 'loading' | 'error'
export type PostsState = 'ready' | 'loading' | 'error' | 'empty'

function pick<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback
}

export function useFixtureState() {
  const [params] = useSearchParams()
  return {
    users: pick<UsersState>(
      params.get('users'),
      ['ready', 'loading', 'error'],
      'ready',
    ),
    posts: pick<PostsState>(
      params.get('posts'),
      ['ready', 'loading', 'error', 'empty'],
      'ready',
    ),
    publishFails: params.get('publish') === 'error',
  }
}
