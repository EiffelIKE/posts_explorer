import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '../api/client'
import type { NewPost } from '../api/schemas'
import { fixturePostsFor, fixtureUsers } from '../fixtures/data'

/** Happy-path API; tests override single endpoints with `server.use(...)`. */
export const handlers = [
  http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(fixtureUsers)),

  http.get(`${API_BASE_URL}/users/:userId/posts`, ({ params }) =>
    HttpResponse.json(fixturePostsFor(Number(params.userId))),
  ),

  // Mirrors JSONPlaceholder: echoes the post back, always with id 101.
  http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
    const post = (await request.json()) as NewPost & { userId: number }
    return HttpResponse.json({ ...post, id: 101 }, { status: 201 })
  }),
]
