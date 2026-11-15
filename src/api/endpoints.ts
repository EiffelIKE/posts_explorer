import { request } from './client'
import {
  postSchema,
  postsSchema,
  usersSchema,
  type NewPost,
  type Post,
  type User,
} from './schemas'

/**
 * All users. There are only 10, so search filters this list on the client:
 * no search parameter, no debounce, no request per keystroke.
 */
export function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  return request('/users', usersSchema, { signal })
}

export function fetchUserPosts(
  userId: number,
  signal?: AbortSignal,
): Promise<Post[]> {
  return request(`/users/${userId}/posts`, postsSchema, { signal })
}

/** JSONPlaceholder echoes the post back with `id: 101` and stores nothing. */
export function createPost(userId: number, post: NewPost): Promise<Post> {
  return request('/posts', postSchema, {
    method: 'POST',
    body: JSON.stringify({ ...post, userId }),
  })
}
