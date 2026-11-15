import type { User } from '../types'
import { Avatar } from '../ui/Avatar'
import { cx } from '../lib/cx'
import styles from './HeroBadge.module.css'

/** The selected user's badge, clipped to the top of the posts panel. */
export function HeroBadge({ user }: { user: User }) {
  return (
    <header className={styles.hero}>
      <span className={styles.hero__clip} aria-hidden="true" />
      <div className={styles.hero__main}>
        <Avatar
          name={user.name}
          size="lg"
          selected
          className={styles.hero__avatar}
        />
        <div className={styles.hero__who}>
          <h1 className={styles.hero__name}>{user.name}</h1>
          <p className={styles.hero__meta}>
            <span>@{user.username}</span>
            <span aria-hidden="true" className={styles.hero__dot}>
              ·
            </span>
            <a href={`mailto:${user.email}`} className={styles.hero__email}>
              {user.email}
            </a>
          </p>
        </div>
      </div>
      <p className={styles.hero__company}>
        <span className="visually-hidden">Company: </span>
        {user.company.name}
      </p>
    </header>
  )
}

export function HeroBadgeSkeleton() {
  return (
    <div
      className={cx(styles.hero, styles['hero--skeleton'])}
      aria-hidden="true"
    >
      <div className={styles.hero__main}>
        <span className={cx(styles.bone, styles['bone--avatar'])} />
        <div className={styles.hero__who}>
          <span className={cx(styles.bone, styles['bone--name'])} />
          <span className={cx(styles.bone, styles['bone--meta'])} />
        </div>
      </div>
      <div className={styles.hero__company}>
        <span className={cx(styles.bone, styles['bone--company'])} />
      </div>
    </div>
  )
}
