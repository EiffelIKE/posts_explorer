import { setupServer } from 'msw/node'

// Default handlers get added here once the API layer exists;
// individual tests override them with `server.use(...)`.
export const server = setupServer()
