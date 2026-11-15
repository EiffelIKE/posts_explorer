import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Individual tests override the defaults with `server.use(...)`.
export const server = setupServer(...handlers)
