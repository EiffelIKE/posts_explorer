import { createBrowserRouter, type RouteObject } from 'react-router'
import { NotFound } from './layout/NotFound/NotFound'
import { RootLayout } from './layout/RootLayout/RootLayout'
import { RouteError } from './layout/RouteError/RouteError'
import { NoUserSelected } from './posts/NoUserSelected/NoUserSelected'
import { UserPostsRoute } from './posts/UserPostsPanel/UserPostsPanel'

/** Exported apart from the router so tests can mount it in a memory router. */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    // A crash in the layout itself (top bar, users panel) replaces the page.
    errorElement: <RouteError scope="app" />,
    children: [
      {
        // A crash in the detail panel stays there; the user list keeps working.
        errorElement: <RouteError scope="panel" />,
        children: [
          { index: true, element: <NoUserSelected /> },
          { path: 'users/:userId', element: <UserPostsRoute /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
