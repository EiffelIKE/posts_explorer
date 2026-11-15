import { useId, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { fixtureUsers } from '../fixtures/data'
import { useFixtureState } from '../fixtures/useFixtureState'
import type { User } from '../types'
import { StateMessage } from '../ui/StateMessage'
import button from '../ui/button.module.css'
import { cx } from '../lib/cx'
import { UserBadge, UserBadgeSkeleton } from './UserBadge'
import styles from './UsersPanel.module.css'

function filterByName(users: User[], query: string) {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle) return users
  return users.filter((user) => user.name.toLocaleLowerCase().includes(needle))
}

/** The badge rack: search on top, the directory of users below. */
export function UsersPanel() {
  const fixture = useFixtureState()
  const [query, setQuery] = useState('')
  const searchId = useId()
  const users = fixtureUsers
  const visible = useMemo(() => filterByName(users, query), [users, query])
  const isFiltering = query.trim() !== ''

  let count = ''
  if (fixture.users === 'ready') {
    count = isFiltering
      ? `${visible.length} of ${users.length}`
      : `${users.length}`
  }

  return (
    <section className={styles.panel} aria-labelledby="users-heading">
      <div className={styles.panel__top}>
        <div className={styles.panel__heading}>
          <h2 id="users-heading" className={styles.panel__title}>
            Users
          </h2>
          <span className={styles.panel__count} aria-live="polite">
            {count && (
              <>
                {count}
                <span className="visually-hidden"> users</span>
              </>
            )}
          </span>
        </div>

        <div role="search" className={styles.search}>
          <label htmlFor={searchId} className="visually-hidden">
            Search users by name
          </label>
          <Search aria-hidden="true" className={styles.search__icon} />
          <input
            id={searchId}
            type="search"
            className={styles.search__input}
            placeholder="Search by name"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.preventDefault()
                setQuery('')
              }
            }}
            disabled={fixture.users !== 'ready'}
          />
          {query && (
            <button
              type="button"
              className={styles.search__clear}
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className={styles.panel__body}>
        {fixture.users === 'loading' && (
          <div aria-busy="true">
            <p className="visually-hidden" role="status">
              Loading users…
            </p>
            <ul className={styles.list}>
              {Array.from({ length: 8 }, (_, index) => (
                <li key={index}>
                  <UserBadgeSkeleton />
                </li>
              ))}
            </ul>
          </div>
        )}

        {fixture.users === 'error' && (
          <StateMessage
            kind="error"
            title="Couldn't load users"
            action={
              <button
                type="button"
                className={cx(button.button, button['button--secondary'])}
              >
                Try again
              </button>
            }
          >
            Check your connection, then try again.
          </StateMessage>
        )}

        {fixture.users === 'ready' && visible.length === 0 && (
          <StateMessage
            kind="no-results"
            title={`No users match “${query.trim()}”`}
            action={
              <button
                type="button"
                className={cx(button.button, button['button--secondary'])}
                onClick={() => setQuery('')}
              >
                Clear search
              </button>
            }
          >
            Search looks at names only. Try a first or last name.
          </StateMessage>
        )}

        {fixture.users === 'ready' && visible.length > 0 && (
          <nav aria-label="Users">
            <ul className={styles.list}>
              {visible.map((user) => (
                <li key={user.id}>
                  <UserBadge user={user} />
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  )
}
