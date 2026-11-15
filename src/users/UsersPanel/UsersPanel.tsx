import { useId, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { errorMessage } from '../../api/errors'
import { useStickyError } from '../../api/stickyError'
import { useUsers } from '../../api/queries'
import { RetryButton } from '../../ui/RetryButton/RetryButton'
import { StateMessage } from '../../ui/StateMessage/StateMessage'
import button from '../../ui/button.module.css'
import { cx } from '../../lib/cx'
import { filterByName, SEARCH_MAX_LENGTH, useSearchQuery } from '../searchQuery'
import { UserBadge, UserBadgeSkeleton } from '../UserBadge/UserBadge'
import styles from './UsersPanel.module.css'

/** The badge rack: search on top, the directory of users below. */
export function UsersPanel() {
  const usersQuery = useUsers()
  const { data: users, isPending, isPaused, refetch } = usersQuery
  const { error, retrying } = useStickyError(usersQuery)
  const [query, setQuery] = useSearchQuery()
  const searchId = useId()
  const visible = useMemo(
    () => (users ? filterByName(users, query) : []),
    [users, query],
  )
  const isFiltering = query.trim() !== ''

  let count = ''
  if (users) {
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
            maxLength={SEARCH_MAX_LENGTH}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.preventDefault()
                setQuery('')
              }
            }}
            disabled={!users}
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
        {/* Offline, TanStack pauses the request until the connection returns. */}
        {!users && isPaused && (
          <StateMessage kind="offline" title="You’re offline">
            Users will load when your connection comes back.
          </StateMessage>
        )}

        {isPending && !isPaused && !error && (
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

        {error && !users && !isPaused && (
          <StateMessage
            kind="error"
            title="Couldn’t load users"
            action={
              <RetryButton retrying={retrying} onRetry={() => void refetch()} />
            }
          >
            {errorMessage(error)}
          </StateMessage>
        )}

        {users && visible.length === 0 && (
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

        {users && visible.length > 0 && (
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
