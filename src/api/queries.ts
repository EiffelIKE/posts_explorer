import { useEffect, useRef } from 'react'
import {
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import { createPost, fetchUserPosts, fetchUsers } from './endpoints'
import { errorMessage } from './errors'
import { nextLocalPostId } from './localIds'
import type { NewPost, Post } from './schemas'

/** A post whose publish failed after its composer was gone (PLAN decision 18). */
export interface UnsentPost extends NewPost {
  id: number
  /** `errorMessage()` of the failure, shown with the notice. */
  reason: string
}

export const queryKeys = {
  users: ['users'] as const,
  userPosts: (userId: number) => ['users', userId, 'posts'] as const,
  localPostsAll: ['local-posts'] as const,
  localPosts: (userId: number) => ['local-posts', userId] as const,
  unsentPostsAll: ['unsent-posts'] as const,
  unsentPosts: (userId: number) => ['unsent-posts', userId] as const,
}

export function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // JSONPlaceholder data never changes: fetch once per session.
        staleTime: Infinity,
        // One quick retry, so the error state shows in about a second.
        retry: 1,
      },
    },
  })
  // Created and unsent posts exist only in this cache (PLAN decisions 12 and
  // 18); never drop them.
  for (const key of [queryKeys.localPostsAll, queryKeys.unsentPostsAll]) {
    queryClient.setQueryDefaults(key, { staleTime: Infinity, gcTime: Infinity })
  }
  return queryClient
}

export const usersQuery = queryOptions({
  queryKey: queryKeys.users,
  queryFn: ({ signal }) => fetchUsers(signal),
})

export function useUsers() {
  return useQuery(usersQuery)
}

/** One user, read from the cached list (shared with the users panel). */
export function useUser(userId: number) {
  return useQuery({
    ...usersQuery,
    select: (users) => users.find((user) => user.id === userId),
  })
}

export function userPostsQuery(userId: number) {
  return queryOptions({
    queryKey: queryKeys.userPosts(userId),
    queryFn: ({ signal }) => fetchUserPosts(userId, signal),
  })
}

/** The user's posts as the server returns them. */
export function useUserPosts(userId: number) {
  return useQuery(userPostsQuery(userId))
}

/**
 * A list that lives only in the query cache. The query function returns what
 * is already cached, so any refetch or invalidation is a no-op.
 */
function useSessionList<T>(queryKey: QueryKey): T[] {
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey,
    queryFn: () => queryClient.getQueryData<T[]>(queryKey) ?? [],
    initialData: [],
  })
  return data
}

/**
 * Posts created this session, newest first. Kept apart from the server list
 * so that creating a post while that list is loading or failed neither gets
 * overwritten by the fetch nor masks the error.
 */
export function useLocalPosts(userId: number): Post[] {
  return useSessionList<Post>(queryKeys.localPosts(userId))
}

/** Failed publishes nobody saw, oldest first, with a way to drop one. */
export function useUnsentPosts(userId: number) {
  const queryClient = useQueryClient()
  const unsent = useSessionList<UnsentPost>(queryKeys.unsentPosts(userId))
  function remove(id: number) {
    queryClient.setQueryData<UnsentPost[]>(
      queryKeys.unsentPosts(userId),
      (current = []) => current.filter((post) => post.id !== id),
    )
  }
  return { unsent, remove }
}

export function useCreatePost(userId: number) {
  const queryClient = useQueryClient()
  // False once the panel that started the publish has unmounted.
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  // These callbacks belong to the mutation, so they still run after the panel
  // unmounts, with the author's `userId` (PLAN decision 17).
  return useMutation({
    // Offline, the default 'online' mode pauses the request and "Publishing…"
    // never ends. 'always' lets fetch fail so the composer can say so.
    networkMode: 'always',
    mutationFn: async (values: NewPost) => {
      const created = await createPost(userId, values)
      // The API always answers id 101 (PLAN decision 2).
      return { ...created, id: nextLocalPostId() }
    },
    onSuccess: (post) => {
      queryClient.setQueryData<Post[]>(
        queryKeys.localPosts(userId),
        (current = []) => [post, ...current],
      )
    },
    onError: (error, values) => {
      // A mounted composer shows the failure and still holds the draft.
      if (mounted.current) return
      // Otherwise keep the draft for the author's panel (PLAN decision 18).
      const unsent: UnsentPost = {
        ...values,
        id: nextLocalPostId(),
        reason: errorMessage(error),
      }
      queryClient.setQueryData<UnsentPost[]>(
        queryKeys.unsentPosts(userId),
        (current = []) => [...current, unsent],
      )
    },
  })
}
