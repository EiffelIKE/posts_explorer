import { z } from 'zod'
import type { NewPost } from '../../types'

export const TITLE_MIN_LENGTH = 2

/**
 * Create-post form rules (PLAN decision 16): both fields are required after
 * trimming, and the title needs at least two characters. Parsing returns the
 * trimmed values, which are what gets published.
 */
export const newPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Add a title.')
    .min(
      TITLE_MIN_LENGTH,
      `Use at least ${TITLE_MIN_LENGTH} characters for the title.`,
    ),
  body: z.string().trim().min(1, 'Write something in the body.'),
})

export type NewPostField = keyof NewPost
export type NewPostErrors = Partial<Record<NewPostField, string>>

/** First message per field; an empty object means the draft is valid. */
export function validateNewPost(values: NewPost): NewPostErrors {
  const result = newPostSchema.safeParse(values)
  if (result.success) return {}
  const errors: NewPostErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as NewPostField
    errors[field] ??= issue.message
  }
  return errors
}
