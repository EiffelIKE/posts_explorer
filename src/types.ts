// Shapes of the JSONPlaceholder resources the app reads.
// Only the fields the UI uses are typed; the API returns more.

export interface User {
  id: number
  name: string
  username: string
  email: string
  company: {
    name: string
  }
}

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface NewPost {
  title: string
  body: string
}
