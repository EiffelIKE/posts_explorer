import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { createQueryClient } from '../api/queries'
import { routes } from '../router'

/**
 * The app's query client without the one automatic retry, so an error state
 * shows after a single failed response instead of waiting out the retry delay.
 * Everything else (session-only caches for created posts) is the real config.
 */
export function createTestQueryClient(): QueryClient {
  const queryClient = createQueryClient()
  queryClient.setDefaultOptions({
    ...queryClient.getDefaultOptions(),
    queries: { ...queryClient.getDefaultOptions().queries, retry: false },
  })
  return queryClient
}

/**
 * Mounts the real route tree (layout, users panel, posts panel) in a memory
 * router. Pass a fresh `queryClient` to simulate a reload of the tab.
 */
export function renderApp(url = '/', queryClient = createTestQueryClient()) {
  const router = createMemoryRouter(routes, { initialEntries: [url] })
  const user = userEvent.setup()
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { router, user, queryClient }
}

/** Resolves once the posts panel shows this user's badge header. */
export const findUserHeader = (name: string) =>
  screen.findByRole('heading', { level: 1, name })

/** The posts section of the open user's panel. */
export const postsRegion = () =>
  within(screen.getByRole('region', { name: 'Posts' }))

/** The user's badge link in the users panel. */
export const userLink = (name: string) =>
  within(screen.getByRole('navigation', { name: 'Users' })).getByRole('link', {
    name: new RegExp(name),
  })
