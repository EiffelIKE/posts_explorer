import { createBrowserRouter } from 'react-router'
import { NotFound } from './layout/NotFound/NotFound'
import { RootLayout } from './layout/RootLayout/RootLayout'
import { NoUserSelected } from './posts/NoUserSelected/NoUserSelected'
import { UserPostsRoute } from './posts/UserPostsPanel/UserPostsPanel'

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
