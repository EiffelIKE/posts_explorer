import type { Post } from '../types'
import { cx } from '../lib/cx'
import styles from './PostList.module.css'

/** Posts as flat entries on hairlines, one reading measure. */
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => {
        // Created posts get negative local IDs (see PLAN decision 2).
        const isLocal = post.id < 0
        return (
          <li key={post.id}>
            <article className={styles.post}>
              <h3 className={styles.post__title}>
                {post.title}
                {isLocal && (
                  <span className={styles.post__local}>Local only</span>
                )}
              </h3>
              <p className={styles.post__body}>{post.body}</p>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

export function PostListSkeleton() {
  return (
    <div aria-busy="true">
      <p className="visually-hidden" role="status">
        Loading posts…
      </p>
      <ul className={styles.list} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <li key={index} className={styles.post}>
            <span className={cx(styles.bone, styles['bone--title'])} />
            <span className={cx(styles.bone, styles['bone--line'])} />
            <span className={cx(styles.bone, styles['bone--line'])} />
            <span
              className={cx(
                styles.bone,
                styles['bone--line'],
                styles['bone--short'],
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
