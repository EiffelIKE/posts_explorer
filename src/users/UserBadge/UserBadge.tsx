import {
  NavLink,
  useLocation,
  useMatch,
  useViewTransitionState,
} from 'react-router'
import type { User } from '../../types'
import { Avatar } from '../../ui/Avatar/Avatar'
import { cx } from '../../lib/cx'
import styles from './UserBadge.module.css'

/** One user in the rack, drawn as a conference name badge. */
export function UserBadge({ user }: { user: User }) {
  const to = `/users/${user.id}`
  // Keep `?q=` (and any other params) so the search survives the navigation.
  const { search } = useLocation()
  const isCurrent = useMatch(to) !== null
  // While navigating to this badge's route, it lends its monogram and name to
  // the hero badge (the handoff). `data-handoff` tells the outgoing hero to
  // release those transition names for the old snapshot (HeroBadge.module.css).
  const isHandingOff = useViewTransitionState(to) && !isCurrent

  return (
    <NavLink
      to={{ pathname: to, search }}
      viewTransition
      data-handoff={isHandingOff ? '' : undefined}
      className={({ isActive }) =>
        cx(
          styles.badge,
          isActive && styles['badge--selected'],
          isHandingOff && styles['badge--handoff'],
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className={styles.badge__clip} aria-hidden="true" />
          )}
          <Avatar
            name={user.name}
            selected={isActive}
            className={styles.badge__avatar}
          />
          <span className={styles.badge__who}>
            <span className={styles.badge__name}>{user.name}</span>
            <span className={styles.badge__username}>@{user.username}</span>
          </span>
          <span className={styles.badge__company}>{user.company.name}</span>
        </>
      )}
    </NavLink>
  )
}

/** Placeholder that holds a badge's exact geometry while users load. */
export function UserBadgeSkeleton() {
  return (
    <div
      className={cx(styles.badge, styles['badge--skeleton'])}
      aria-hidden="true"
    >
      <span
        className={cx(styles.badge__avatar, styles.bone, styles['bone--round'])}
      />
      <span className={styles.badge__who}>
        <span className={cx(styles.bone, styles['bone--name'])} />
        <span className={cx(styles.bone, styles['bone--username'])} />
      </span>
      <span className={styles.badge__company}>
        <span className={cx(styles.bone, styles['bone--company'])} />
      </span>
    </div>
  )
}
