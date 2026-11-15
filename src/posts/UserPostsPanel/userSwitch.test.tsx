import { cleanup, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/client'
import {
  findUserHeader,
  postsRegion,
  renderApp,
  userLink,
} from '../../test/renderApp'
import { server } from '../../test/server'

// User-switch rules from PLAN decisions 17 and 18.

type AppHandle = ReturnType<typeof renderApp>

async function writePost({ user }: AppHandle, title: string, body: string) {
  await user.click(screen.getByRole('button', { name: /New post/ }))
  await user.type(screen.getByRole('textbox', { name: 'Title' }), title)
  await user.type(screen.getByRole('textbox', { name: 'Body' }), body)
  await user.click(screen.getByRole('button', { name: 'Publish post' }))
}

async function openUser({ user }: AppHandle, name: string) {
  await user.click(userLink(name))
  await findUserHeader(name)
  // Wait for the server posts, so "not shown" means not shown, not loading.
  await postsRegion().findAllByRole('article')
}

/**
 * Holds `POST /posts` until the returned function is called, then answers
 * with `respond` (the API's echo by default).
 */
function holdPublish(
  respond: (post: Record<string, unknown>) => Response = (post) =>
    HttpResponse.json({ ...post, id: 101 }, { status: 201 }),
) {
  let release!: () => void
  const gate = new Promise<void>((resolve) => (release = resolve))
  server.use(
    http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
      const post = (await request.json()) as Record<string, unknown>
      await gate
      return respond(post)
    }),
  )
  return release
}

describe('Switching users', () => {
  it('never lands a delayed publish on the user switched to', async () => {
    const releasePublish = holdPublish()
    const app = renderApp('/users/1')
    await findUserHeader('Leanne Graham')
    await postsRegion().findAllByRole('article')

    await writePost(app, 'Slow news', 'Sent by Leanne')
    expect(screen.getByRole('button', { name: 'Publishing…' })).toBeDisabled()

    // Switch to Ervin while the request is still in flight, then let it land.
    await openUser(app, 'Ervin Howell')
    releasePublish()
    await waitFor(() => expect(app.queryClient.isMutating()).toBe(0))

    // Ervin's panel is untouched: no post, no "Published" notice.
    expect(screen.queryByText('Slow news')).not.toBeInTheDocument()
    expect(screen.queryByText('Published')).not.toBeInTheDocument()
    expect(postsRegion().getAllByRole('article')).toHaveLength(10)
    expect(
      screen.getByRole('button', { name: /Write a new post as Ervin/ }),
    ).toBeInTheDocument()

    // The post went to its author.
    await openUser(app, 'Leanne Graham')
    const [first] = postsRegion().getAllByRole('article')
    expect(first).toHaveTextContent('Slow news')
    expect(first).toHaveTextContent('Local only')
  })

  it('keeps a delayed failed publish as an unsent draft for its author only', async () => {
    const releasePublish = holdPublish(
      () => new HttpResponse(null, { status: 500 }),
    )
    const app = renderApp('/users/1')
    await findUserHeader('Leanne Graham')
    await postsRegion().findAllByRole('article')

    await writePost(app, 'Slow news', 'Sent by Leanne')
    await openUser(app, 'Ervin Howell')
    releasePublish()
    await waitFor(() => expect(app.queryClient.isMutating()).toBe(0))

    // Ervin sees nothing of it: no failure banner, no unsent notice.
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText(/Slow news/)).not.toBeInTheDocument()

    // Back on Leanne, the failure waits with its reason and both actions.
    await openUser(app, 'Leanne Graham')
    const notice = screen.getByRole('alert')
    expect(notice).toHaveTextContent('“Slow news” wasn’t published')
    expect(notice).toHaveTextContent(
      'The server ran into a problem (error 500).',
    )
    expect(postsRegion().queryByText('Slow news')).not.toBeInTheDocument()

    // "Restore draft" reopens the form filled in and clears the notice.
    await app.user.click(
      within(notice).getByRole('button', { name: 'Restore draft' }),
    )
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue(
      'Slow news',
    )
    expect(screen.getByRole('textbox', { name: 'Body' })).toHaveValue(
      'Sent by Leanne',
    )
    expect(screen.queryByText(/wasn’t published/)).not.toBeInTheDocument()

    // Restored, it publishes like any draft (the default handler succeeds).
    server.resetHandlers()
    await app.user.click(screen.getByRole('button', { name: 'Publish post' }))
    expect(await screen.findByText('Published')).toBeInTheDocument()
    expect(postsRegion().getAllByRole('article')[0]).toHaveTextContent(
      'Slow news',
    )
  })

  it('shows a created post again only for its author, and only this session', async () => {
    const app = renderApp('/users/1')
    await findUserHeader('Leanne Graham')
    await postsRegion().findAllByRole('article')

    await writePost(app, 'Hello from Leanne', 'Only mine')
    expect(await screen.findByText('Published')).toBeInTheDocument()

    await openUser(app, 'Ervin Howell')
    expect(screen.queryByText('Hello from Leanne')).not.toBeInTheDocument()
    expect(postsRegion().getAllByRole('article')).toHaveLength(10)

    await openUser(app, 'Leanne Graham')
    expect(postsRegion().getAllByRole('article')[0]).toHaveTextContent(
      'Hello from Leanne',
    )
    expect(postsRegion().getAllByRole('article')).toHaveLength(11)
    // Coming back is a fresh panel: the "Published" notice doesn't replay.
    expect(screen.queryByText('Published')).not.toBeInTheDocument()

    // A reload starts a new session: a fresh query client, nothing created.
    cleanup()
    renderApp('/users/1')
    await findUserHeader('Leanne Graham')
    expect(await postsRegion().findAllByRole('article')).toHaveLength(10)
    expect(screen.queryByText('Hello from Leanne')).not.toBeInTheDocument()
  })
})
