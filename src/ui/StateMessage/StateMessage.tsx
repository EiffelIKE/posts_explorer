import type { ReactNode } from 'react'
import { CircleAlert, SearchX, FileText, UserX, WifiOff } from 'lucide-react'
import { cx } from '../../lib/cx'
import styles from './StateMessage.module.css'

const icons = {
  error: CircleAlert,
  offline: WifiOff,
  'no-results': SearchX,
  'no-posts': FileText,
  'not-found': UserX,
}

interface StateMessageProps {
  kind: keyof typeof icons
  title: string
  children?: ReactNode
  action?: ReactNode
  className?: string
}

/** Inline panel state: errors, offline waits, empty results, missing records. */
export function StateMessage({
  kind,
  title,
  children,
  action,
  className,
}: StateMessageProps) {
  const Icon = icons[kind]
  const isError = kind === 'error'
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={cx(styles.state, isError && styles['state--error'], className)}
    >
      <span className={styles.state__icon} aria-hidden="true">
        <Icon />
      </span>
      <div className={styles.state__body}>
        <p className={styles.state__title}>{title}</p>
        {children && <p className={styles.state__text}>{children}</p>}
        {action && <div className={styles.state__action}>{action}</div>}
      </div>
    </div>
  )
}
