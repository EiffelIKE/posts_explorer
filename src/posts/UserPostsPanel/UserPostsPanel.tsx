import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { fixturePostsFor, fixtureUsers } from '../../fixtures/data'
import { useFixtureState } from '../../fixtures/useFixtureState'
import { getFirstName } from '../../lib/names'
import { cx } from '../../lib/cx'
import type { NewPost, Post } from '../../types'
import { StateMessage } from '../../ui/StateMessage/StateMessage'
import button from '../../ui/button.module.css'
import { Composer } from '../Composer/Composer'
import { HeroBadge, HeroBadgeSkeleton } from '../HeroBadge/HeroBadge'
import { nextLocalPostId } from '../../api/localIds'
import { PostList, PostListSkeleton } from '../PostList/PostList'
import styles from './UserPostsPanel.module.css'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Route element for /users/:userId; remounts per user so drafts don't leak. */
export function UserPostsRoute() {
  const { userId } = useParams()
  return <UserPostsPanel key={userId} userId={Number(userId)} />
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

function UserPostsPanel({ userId }: { userId: number }) {
  const fixture = useFixtureState()
  const { search } = useLocation()
  const user = fixtureUsers.find((candidate) => candidate.id === userId)
  const [localPosts, setLocalPosts] = useState<Post[]>([])

  if (fixture.users === 'loading') {
    return (
      <div className={styles.panel}>
        <BackLink />
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
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.panel}>
        <BackLink />
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
      </div>
    )
  }

  const firstName = getFirstName(user.name)
  const serverPosts = fixture.posts === 'empty' ? [] : fixturePostsFor(user.id)
  const posts = [...localPosts, ...serverPosts]

  async function publish(values: NewPost) {
    await wait(600)
    if (fixture.publishFails) throw new Error('Publish failed')
    setLocalPosts((current) => [
      { id: nextLocalPostId(), userId, ...values },
      ...current,
    ])
  }

  return (
    <div className={styles.panel}>
      <BackLink />
      <HeroBadge user={user} />
      <Composer authorFirstName={firstName} onPublish={publish} />

      <section className={styles.posts} aria-labelledby="posts-heading">
        <div className={styles.posts__heading}>
          <h2 id="posts-heading" className={styles.posts__title}>
            Posts
          </h2>
          {fixture.posts !== 'loading' && fixture.posts !== 'error' && (
            <span className={styles.posts__count}>{posts.length}</span>
          )}
        </div>

        {fixture.posts === 'loading' && <PostListSkeleton />}

        {fixture.posts === 'error' && (
          <StateMessage
            kind="error"
            title={`Couldn’t load ${firstName}’s posts`}
            action={
              <button
                type="button"
                className={cx(button.button, button['button--secondary'])}
              >
                Try again
              </button>
            }
          >
            Check your connection, then try again. You can still write a new
            post.
          </StateMessage>
        )}

        {(fixture.posts === 'ready' || fixture.posts === 'empty') &&
          (posts.length === 0 ? (
            <StateMessage
              kind="no-posts"
              title={`${firstName} hasn’t posted yet`}
            >
              Use “New post” above to write the first one.
            </StateMessage>
          ) : (
            <PostList posts={posts} />
          ))}
      </section>
    </div>
  )
}
