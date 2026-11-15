import { Link, Outlet, ScrollRestoration, useMatch } from 'react-router'
import { ThemeSwitch } from '../theme/ThemeSwitch'
import { UsersPanel } from '../users/UsersPanel'
import { cx } from '../lib/cx'
import styles from './RootLayout.module.css'

/**
 * Master–detail shell. Desktop shows the badge rack and the detail panel side
 * by side; mobile shows one at a time, chosen by the route (PLAN decision 7).
 */
export function RootLayout() {
  const atRoot = useMatch({ path: '/', end: true })

  return (
    <div className={cx(styles.layout, !atRoot && styles['layout--detail'])}>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>
      <header className={styles.topbar}>
        <Link to="/" className={styles.wordmark}>
          Posts Explorer
        </Link>
        <ThemeSwitch />
      </header>

      <div className={styles.body}>
        <aside className={styles.rack}>
          <UsersPanel />
        </aside>
        <main id="main" className={styles.detail} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      {/* Mobile scrolls the window: open details at the top, restore the list on back. */}
      <ScrollRestoration />
    </div>
  )
}
