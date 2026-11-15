import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/client'
import { fixturePostsFor, fixtureUsers } from '../../test/data'
import { findUserHeader, postsRegion, renderApp } from '../../test/renderApp'
import { server } from '../../test/server'

const USERS_URL = `${API_BASE_URL}/users`
const POSTS_URL = `${API_BASE_URL}/users/:userId/posts`

// One failure per cause, each with the copy `errorMessage()` gives it.
const failures = [
  {
    cause: 'a server error (5xx)',
    respond: () => new HttpResponse(null, { status: 500 }),
    message:
      'The server ran into a problem (error 500). Try again in a moment.',
  },
  {
    cause: 'a client error (4xx)',
    respond: () => new HttpResponse(null, { status: 404 }),
    message: 'The server turned the request down (error 404).',
  },
  {
    cause: 'a network failure',
    respond: () => HttpResponse.error(),
    message: 'Check your connection, then try again.',
  },
  {
    cause: 'a response with an unexpected shape',
    respond: () => HttpResponse.json([{ id: 'not-a-number' }]),
    message:
      'The server sent data this app doesn’t recognize. Try again later.',
  },
]

describe('GET /users errors', () => {
  it.each(failures)(
    'explains $cause and recovers on "Try again"',
    async ({ respond, message }) => {
      server.use(http.get(USERS_URL, respond, { once: true }))
      const { user } = renderApp('/')

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Couldn’t load users')
      expect(alert).toHaveTextContent(message)
      expect(
        screen.getByRole('searchbox', { name: 'Search users by name' }),
      ).toBeDisabled()

      await user.click(within(alert).getByRole('button', { name: 'Try again' }))

      const nav = await screen.findByRole('navigation', { name: 'Users' })
      expect(within(nav).getAllByRole('link')).toHaveLength(fixtureUsers.length)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    },
  )

  it('shows the error in the posts panel too when opening a user directly', async () => {
    server.use(
      http.get(USERS_URL, () => new HttpResponse(null, { status: 502 })),
    )
    renderApp('/users/1')

    const alerts = await screen.findAllByRole('alert')
    expect(alerts.map((alert) => alert.textContent)).toEqual([
      expect.stringContaining('Couldn’t load users'),
      expect.stringContaining('Couldn’t load this user'),
    ])
  })
})

describe('GET /users/:id/posts errors', () => {
  it.each(failures)(
    'explains $cause, keeps the composer, and recovers on "Try again"',
    async ({ respond, message }) => {
      server.use(http.get(POSTS_URL, respond, { once: true }))
      const { user } = renderApp('/users/1')
      await findUserHeader('Leanne Graham')

      const alert = await postsRegion().findByRole('alert')
      expect(alert).toHaveTextContent('Couldn’t load Leanne’s posts')
      expect(alert).toHaveTextContent(message)
      expect(alert).toHaveTextContent('You can still write a new post.')
      expect(
        screen.getByRole('button', { name: /New post/ }),
      ).toBeInTheDocument()

      await user.click(within(alert).getByRole('button', { name: 'Try again' }))

      const titles = (
        await postsRegion().findAllByRole('heading', {
          level: 3,
        })
      ).map((heading) => heading.textContent)
      expect(titles).toEqual(fixturePostsFor(1).map((post) => post.title))
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    },
  )

  it('keeps the error and the focused button in place while retrying', async () => {
    let releaseRetry!: () => void
    const retryGate = new Promise<void>((resolve) => (releaseRetry = resolve))
    server.use(
      http.get(POSTS_URL, () => new HttpResponse(null, { status: 500 }), {
        once: true,
      }),
      http.get(POSTS_URL, async ({ params }) => {
        await retryGate
        return HttpResponse.json(fixturePostsFor(Number(params.userId)))
      }),
    )
    const { user } = renderApp('/users/1')
    const alert = await postsRegion().findByRole('alert')

    await user.click(within(alert).getByRole('button', { name: 'Try again' }))

    const retrying = within(alert).getByRole('button', { name: 'Retrying…' })
    expect(retrying).toHaveFocus()
    expect(retrying).toHaveAttribute('aria-disabled', 'true')
    expect(alert).toHaveTextContent('error 500')

    releaseRetry()
    expect(await postsRegion().findAllByRole('article')).toHaveLength(10)
  })
})
