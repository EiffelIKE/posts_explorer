import {
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { createPost, fetchUserPosts, fetchUsers } from './endpoints'
import { nextLocalPostId } from './localIds'
import type { NewPost, Post } from './schemas'

export const queryKeys = {
  users: ['users'] as const,
  userPosts: (userId: number) => ['users', userId, 'posts'] as const,
  localPostsAll: ['local-posts'] as const,
  localPosts: (userId: number) => ['local-posts', userId] as const,
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
  // Created posts exist only in this cache (PLAN decision 12); never drop them.
  queryClient.setQueryDefaults(queryKeys.localPostsAll, {
    staleTime: Infinity,
    gcTime: Infinity,
  })
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
 * Posts created this session, newest first. Kept apart from the server list
 * so that creating a post while that list is loading or failed neither gets
 * overwritten by the fetch nor masks the error. The query function returns
 * what is already cached, so any refetch or invalidation is a no-op.
 */
export function useLocalPosts(userId: number): Post[] {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.localPosts(userId)
  const { data } = useQuery({
    queryKey,
    queryFn: () => queryClient.getQueryData<Post[]>(queryKey) ?? [],
    initialData: [],
  })
  return data
}

export function useCreatePost(userId: number) {
  const queryClient = useQueryClient()
  return useMutation({
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
  })
}
