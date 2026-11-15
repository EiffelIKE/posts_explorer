import { Link, useLocation } from 'react-router'
import { cx } from '../../lib/cx'
import button from '../../ui/button.module.css'
import { StateMessage } from '../../ui/StateMessage/StateMessage'
import styles from './RouteError.module.css'

interface RouteErrorProps {
  /**
   * `panel`: the detail panel crashed and the user list still works.
   * `app`: the layout itself crashed, so this replaces the whole page.
   */
  scope: 'panel' | 'app'
}

const reloadNote = 'Reloading also clears posts you created in this tab.'

/**
 * Route `errorElement` for render crashes. React Router already logs the
 * error and clears this boundary on the next navigation, so leaving the
 * panel is the gentler fix: unlike a reload, it keeps this tab's posts.
 */
export function RouteError({ scope }: RouteErrorProps) {
  const { search } = useLocation()

  const reload = (
    <button
      type="button"
      className={cx(
        button.button,
        button[scope === 'app' ? 'button--secondary' : 'button--ghost'],
      )}
      onClick={() => window.location.reload()}
    >
      Reload page
    </button>
  )

  if (scope === 'app') {
    return (
      <main className={styles.app}>
        <h1 className={styles.app__wordmark}>Posts Explorer</h1>
        <StateMessage kind="error" title="Something went wrong" action={reload}>
          The app hit an unexpected error. Reloading the page usually fixes it.{' '}
          {reloadNote}
        </StateMessage>
      </main>
    )
  }

  return (
    <div className={styles.panel}>
      <h1 className="visually-hidden">Something went wrong</h1>
      <StateMessage
        kind="error"
        title="This panel stopped working"
        action={
          <>
            <Link
              to={{ pathname: '/', search }}
              className={cx(button.button, button['button--secondary'])}
            >
              Back to all users
            </Link>
            {reload}
          </>
        }
      >
        An unexpected error interrupted it. Pick a user from the list, or go
        back to all users. {reloadNote}
      </StateMessage>
    </div>
  )
}
