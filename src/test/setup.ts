import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './server'

// jsdom has no layout; ScrollRestoration calls scrollTo on every navigation.
vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

// Fail loudly on any request without a handler so tests never hit the real API.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
