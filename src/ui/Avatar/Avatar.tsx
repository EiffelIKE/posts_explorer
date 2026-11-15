import { getInitials } from '../../lib/names'
import { cx } from '../../lib/cx'
import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
  size?: 'md' | 'lg'
  selected?: boolean
  className?: string
}

/** Initials monogram. Decorative: the name is always rendered next to it. */
export function Avatar({
  name,
  size = 'md',
  selected = false,
  className,
}: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        styles.avatar,
        size === 'lg' && styles['avatar--lg'],
        selected && styles['avatar--selected'],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
