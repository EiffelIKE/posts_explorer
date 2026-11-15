import { createBrowserRouter } from 'react-router'
import { NotFound } from './layout/NotFound'
import { RootLayout } from './layout/RootLayout'
import { NoUserSelected } from './posts/NoUserSelected'
import { UserPostsRoute } from './posts/UserPostsPanel'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <NoUserSelected /> },
      { path: 'users/:userId', element: <UserPostsRoute /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
