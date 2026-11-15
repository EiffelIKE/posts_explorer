import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/client'
import { findUserHeader, postsRegion, renderApp } from '../../test/renderApp'
import { server } from '../../test/server'

const titleBox = () => screen.getByRole('textbox', { name: 'Title' })
const bodyBox = () => screen.getByRole('textbox', { name: 'Body' })
const publishButton = () => screen.getByRole('button', { name: 'Publish post' })

async function openComposer(url = '/users/1') {
  const app = renderApp(url)
  await findUserHeader('Leanne Graham')
  await postsRegion().findAllByRole('article')
  await app.user.click(screen.getByRole('button', { name: /New post/ }))
  return app
}

describe('Create post', () => {
  it('validates the form, then publishes the trimmed post at the top', async () => {
    const sent: unknown[] = []
    server.use(
      http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
        const post = (await request.json()) as Record<string, unknown>
        sent.push(post)
        return HttpResponse.json({ ...post, id: 101 }, { status: 201 })
      }),
    )
    const { user } = await openComposer()

    // Empty submit: both errors, focus on the first invalid field, no request.
    await user.click(publishButton())
    expect(titleBox()).toHaveAccessibleDescription('Add a title.')
    expect(bodyBox()).toHaveAccessibleDescription(
      'Write something in the body.',
    )
    expect(titleBox()).toHaveAttribute('aria-invalid', 'true')
    expect(titleBox()).toHaveFocus()

    // After the first attempt, errors update live while typing.
    await user.type(titleBox(), ' H ')
    expect(titleBox()).toHaveAccessibleDescription(
      'Use at least 2 characters for the title.',
    )
    await user.type(titleBox(), 'ello world  ')
    expect(titleBox()).not.toHaveAttribute('aria-invalid')

    await user.type(bodyBox(), '   ')
    expect(bodyBox()).toHaveAccessibleDescription(
      'Write something in the body.',
    )
    await user.type(bodyBox(), 'First post!  ')
    expect(bodyBox()).not.toHaveAttribute('aria-invalid')
    expect(sent).toHaveLength(0)

    await user.click(publishButton())

    expect(await screen.findByText('Published')).toBeInTheDocument()
    expect(sent).toEqual([
      { title: 'H ello world', body: 'First post!', userId: 1 },
    ])

    // The form closes and the new post leads the list, marked local.
    expect(
      screen.queryByRole('textbox', { name: 'Title' }),
    ).not.toBeInTheDocument()
    const [first] = postsRegion().getAllByRole('article')
    expect(first).toHaveTextContent('H ello world')
    expect(first).toHaveTextContent('Local only')
    expect(first).toHaveTextContent('First post!')
    expect(postsRegion().getAllByRole('article')).toHaveLength(11)
  })

  it('keeps the draft and explains why when publishing fails', async () => {
    server.use(
      http.post(
        `${API_BASE_URL}/posts`,
        () => new HttpResponse(null, { status: 503 }),
      ),
    )
    const { user } = await openComposer()

    await user.type(titleBox(), 'Lost in transit')
    await user.type(bodyBox(), 'Will this make it?')
    await user.click(publishButton())

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Couldn’t publish your post. The server ran into a problem (error 503).',
    )
    expect(titleBox()).toHaveValue('Lost in transit')
    expect(bodyBox()).toHaveValue('Will this make it?')
    expect(postsRegion().getAllByRole('article')).toHaveLength(10)
    expect(postsRegion().queryByText('Lost in transit')).not.toBeInTheDocument()
  })
})
