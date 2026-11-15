import type { z } from 'zod'

export const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

/** Non-2xx response from the API. Network failures surface as `TypeError`. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, path: string) {
    super(`Request to ${path} failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Fetches `path` as JSON and validates the response body against `schema`. */
export async function request<Schema extends z.ZodType>(
  path: string,
  schema: Schema,
  init?: RequestInit,
): Promise<z.infer<Schema>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })
  if (!response.ok) throw new ApiError(response.status, path)
  return schema.parse(await response.json())
}
