import { z } from 'zod'

// Runtime shapes of the JSONPlaceholder resources the app reads. Only the
// fields the UI uses are declared; Zod strips the rest from each response.

export const userSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  company: z.object({
    name: z.string(),
  }),
})

export const postSchema = z.object({
  userId: z.number().int(),
  id: z.number().int(),
  title: z.string(),
  body: z.string(),
})

export const usersSchema = z.array(userSchema)
export const postsSchema = z.array(postSchema)

export type User = z.infer<typeof userSchema>
export type Post = z.infer<typeof postSchema>
export type NewPost = Pick<Post, 'title' | 'body'>
