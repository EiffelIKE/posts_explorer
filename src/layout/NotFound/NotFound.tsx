import { Link, useLocation } from 'react-router'
import { StateMessage } from '../../ui/StateMessage/StateMessage'
import button from '../../ui/button.module.css'
import { cx } from '../../lib/cx'
import styles from './NotFound.module.css'

/** Unknown routes render inside the detail panel. */
export function NotFound() {
  const { search } = useLocation()
  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">Page not found</h1>
      <StateMessage
        kind="not-found"
        title="This page doesn’t exist"
        action={
          <Link
            to={{ pathname: '/', search }}
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
