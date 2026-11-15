import { Link } from 'react-router'
import { StateMessage } from '../ui/StateMessage'
import button from '../ui/button.module.css'
import { cx } from '../lib/cx'
import styles from './NotFound.module.css'

/** Unknown routes render inside the detail panel. */
export function NotFound() {
  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">Page not found</h1>
      <StateMessage
        kind="not-found"
        title="This page doesn’t exist"
        action={
          <Link
            to="/"
            className={cx(button.button, button['button--secondary'])}
          >
            Go to all users
          </Link>
        }
      >
        Check the address, or head back to the directory.
      </StateMessage>
    </div>
  )
}
