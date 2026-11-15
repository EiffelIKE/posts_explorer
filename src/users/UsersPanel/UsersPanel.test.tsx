import { QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { createQueryClient } from '../../api/queries'
import { fixtureUsers } from '../../fixtures/data'
import { UsersPanel } from './UsersPanel'

function renderPanel(url = '/') {
  const router = createMemoryRouter(
    [{ path: '/', element: <UsersPanel /> }, { path: '/users/:userId' }],
    { initialEntries: [url] },
  )
  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  const search = () => router.state.location.search
  return { router, search }
}

const searchBox = () =>
  screen.getByRole('searchbox', { name: 'Search users by name' })
const userNames = async () => {
  const nav = await screen.findByRole('navigation', { name: 'Users' })
  return within(nav)
    .getAllByRole('link')
    .map((link) => link.querySelector('span span')?.textContent)
}

describe('UsersPanel search', () => {
  it('matches partial names ignoring case and surrounding spaces', async () => {
    const user = userEvent.setup()
    const { search } = renderPanel()
    await screen.findByRole('navigation', { name: 'Users' })

    await user.type(searchBox(), '  LEAN ')

    expect(searchBox()).toHaveValue('  LEAN ')
    expect(await userNames()).toEqual(['Leanne Graham'])
    expect(search()).toBe('?q=LEAN')
  })

  it('allows one-character searches and caps input at 60 characters', async () => {
    const user = userEvent.setup()
    renderPanel()
    await screen.findByRole('navigation', { name: 'Users' })

    await user.type(searchBox(), 'v')
    expect(await userNames()).toEqual(
      fixtureUsers.filter((u) => /v/i.test(u.name)).map((u) => u.name),
    )
    expect(searchBox()).toHaveAttribute('maxLength', '60')
  })

  it('shows everyone and drops q for a whitespace-only search', async () => {
    const user = userEvent.setup()
    const { search } = renderPanel('/?q=ervin&users=ready')
    await screen.findByRole('navigation', { name: 'Users' })

    await user.clear(searchBox())
    await user.type(searchBox(), '   ')

    expect(searchBox()).toHaveValue('   ')
    expect(await userNames()).toHaveLength(fixtureUsers.length)
    expect(search()).toBe('?users=ready')
  })

  it('starts from ?q= and keeps other parameters while typing', async () => {
    const user = userEvent.setup()
    const { search } = renderPanel('/?users=ready&q=Ervin')

    expect(await userNames()).toEqual(['Ervin Howell'])
    expect(searchBox()).toHaveValue('Ervin')

    await user.clear(searchBox())
    await user.type(searchBox(), 'Clem')
    expect(search()).toBe('?users=ready&q=Clem')
  })

  it('follows ?q= when navigating back', async () => {
    const user = userEvent.setup()
    const { router } = renderPanel('/?q=Leanne')
    await screen.findByRole('navigation', { name: 'Users' })
    await act(() => router.navigate('/?q=Patricia'))
    expect(searchBox()).toHaveValue('Patricia')

    await act(() => router.navigate(-1))
    expect(searchBox()).toHaveValue('Leanne')
    expect(await userNames()).toEqual(['Leanne Graham'])

    await user.click(screen.getByRole('link', { name: /Leanne Graham/ }))
    expect(router.state.location.pathname).toBe('/users/1')
    expect(router.state.location.search).toBe('?q=Leanne')
  })
})
