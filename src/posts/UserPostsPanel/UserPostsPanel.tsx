import type { ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import {
  useCreatePost,
  useLocalPosts,
  useUser,
  useUserPosts,
} from '../../api/queries'
import { getFirstName } from '../../lib/names'
import { cx } from '../../lib/cx'
import type { NewPost } from '../../types'
import { StateMessage } from '../../ui/StateMessage/StateMessage'
import button from '../../ui/button.module.css'
import { Composer } from '../Composer/Composer'
import { HeroBadge, HeroBadgeSkeleton } from '../HeroBadge/HeroBadge'
import { PostList, PostListSkeleton } from '../PostList/PostList'
import styles from './UserPostsPanel.module.css'

/** JSONPlaceholder IDs are positive integers; anything else can't exist. */
function parseUserId(param: string | undefined): number | null {
  if (!param || !/^\d+$/.test(param)) return null
  const id = Number(param)
  return id > 0 ? id : null
}

/** Route element for /users/:userId; remounts per user so drafts don't leak. */
export function UserPostsRoute() {
  const { userId: param } = useParams()
  const userId = parseUserId(param)
  if (userId === null) return <UserNotFound />
  return <UserPostsPanel key={userId} userId={userId} />
}

function BackLink() {
  const { search } = useLocation()
  return (
    <Link to={{ pathname: '/', search }} viewTransition className={styles.back}>
      <ArrowLeft aria-hidden="true" />
      All users
    </Link>
  )
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className={styles.panel}>
      <BackLink />
      {children}
    </div>
  )
}

function UserNotFound() {
  const { search } = useLocation()
  return (
    <Panel>
      <StateMessage
        kind="not-found"
        title="We couldn’t find that user"
        action={
          <Link
            to={{ pathname: '/', search }}
            className={cx(button.button, button['button--secondary'])}
          >
            Back to all users
          </Link>
        }
      >
        The link may be wrong, or the user no longer exists.
      </StateMessage>
    </Panel>
  )
}

function UserPostsPanel({ userId }: { userId: number }) {
  // Posts load in parallel with the user list, not after it.
  const userQuery = useUser(userId)
  const postsQuery = useUserPosts(userId)
  const localPosts = useLocalPosts(userId)
  const createPost = useCreatePost(userId)

  if (userQuery.isPending) {
    return (
      <Panel>
        <HeroBadgeSkeleton />
        {/* Same geometry as the loaded panel: composer bar, heading, posts. */}
        <div className={styles.composerBone} aria-hidden="true" />
        <section className={styles.posts} aria-label="Posts">
          <div className={styles.posts__heading}>
            <h2 className={styles.posts__title}>Posts</h2>
            {/* Holds the count's line box so the heading row keeps its height. */}
            <span className={styles.posts__count} aria-hidden="true">
              &nbsp;
            </span>
          </div>
          <PostListSkeleton />
        </section>
      </Panel>
    )
  }

  if (userQuery.isError && !userQuery.data) {
    return (
      <Panel>
        <StateMessage
          kind="error"
          title="Couldn’t load this user"
          action={
            <button
              type="button"
              className={cx(button.button, button['button--secondary'])}
              onClick={() => void userQuery.refetch()}
            >
              Try again
            </button>
          }
        >
          Check your connection, then try again.
        </StateMessage>
      </Panel>
    )
  }

  const user = userQuery.data
  if (!user) return <UserNotFound />

  const firstName = getFirstName(user.name)
  const serverPosts = postsQuery.data
  const posts = [...localPosts, ...(serverPosts ?? [])]

  async function publish(values: NewPost) {
    await createPost.mutateAsync(values)
  }

  return (
    <Panel>
      <HeroBadge user={user} />
      <Composer authorFirstName={firstName} onPublish={publish} />

      <section className={styles.posts} aria-labelledby="posts-heading">
        <div className={styles.posts__heading}>
          <h2 id="posts-heading" className={styles.posts__title}>
            Posts
          </h2>
          {serverPosts && (
            <span className={styles.posts__count}>{posts.length}</span>
          )}
        </div>

        {serverPosts ? (
          posts.length === 0 ? (
            <StateMessage
              kind="no-posts"
              title={`${firstName} hasn’t posted yet`}
            >
              Use “New post” above to write the first one.
            </StateMessage>
          ) : (
            <PostList posts={posts} />
          )
        ) : (
          <>
            {/* Posts created while the list loads or after it failed (PLAN decision 12). */}
            {localPosts.length > 0 && <PostList posts={localPosts} />}

            {postsQuery.isPending && <PostListSkeleton />}

            {postsQuery.isError && (
              <StateMessage
                kind="error"
                title={`Couldn’t load ${firstName}’s posts`}
                action={
                  <button
                    type="button"
                    className={cx(button.button, button['button--secondary'])}
                    onClick={() => void postsQuery.refetch()}
                  >
                    Try again
                  </button>
                }
              >
                Check your connection, then try again. You can still write a new
                post.
              </StateMessage>
            )}
          </>
        )}
      </section>
    </Panel>
  )
}
