# Posts Explorer — Plan

Working plan and decision log. Product scope lives in [PRODUCT.md](PRODUCT.md).

## Stack

| Concern       | Choice                                                    |
| ------------- | --------------------------------------------------------- |
| Build / dev   | Vite 8 + React 19 + TypeScript 6                          |
| Server state  | TanStack Query v5 (cache, loading/error, `setQueryData`)  |
| Styles        | Plain CSS + CSS Modules, simple BEM class names           |
| Validation    | Zod (manual validation would also be enough at this size) |
| Tests         | Vitest + Testing Library + MSW (network mocked, jsdom)    |
| Lint / format | ESLint (type-aware typescript-eslint) + Prettier          |
| Routing       | React Router (layout route + nested user route)           |
| Global state  | None at this stage                                        |
| Runtime       | Node 24 (pinned in `mise.toml`)                           |

## Steps

- [x] 1. Project setup: scaffold, tooling, `post-agent` gate
- [x] 2. Layout and UI/UX definition (on fixtures; see decisions 7–10 and DESIGN.md)
- [x] 3. API layer + types (`/users`, `/users/:id/posts`, `POST /posts`)
- [x] 4. Users list with search by name (synced with `?q=`, see decision 15)
- [x] 5. User posts + create-post form (validated, required title and body; see decision 16)
- [x] 6. Loading and error states (see decision 18)
- [x] 7. Tests (at least 3) and add them to the `post-agent` gate. Must cover the
      user-switch cases in decision 17: a delayed publish never lands on the user
      switched to, and a created post shows again only for its author when coming
      back, and only for this session (see decision 19)
- [x] 8. README (run, decisions, next steps, AI usage)

## Agent workflow

After finishing any coding work, agents run:

```sh
npm run post-agent
```

Currently: `prettier --write` → `eslint --fix --max-warnings=0` → `tsc -b` →
`vitest run`.

## Decisions

1. **SDD skipped; a single PLAN.md instead.** A full spec-driven workflow is overkill
   for an app this small. Chat logs are exported separately as evidence of agent usage.
2. **Created posts use negative local IDs.** `POST /posts` always returns `id: 101`,
   so creating several posts would collide on React keys. A decrementing counter
   (-1, -2, …) keeps `Post.id` a `number`, can't clash with server IDs, and stays
   deterministic in tests (unlike `crypto.randomUUID()`). Fine for a demo product.
3. **TypeScript pinned to `~6.0.3`** (Vite's template ships TS 7). typescript-eslint
   (latest and canary) only supports `typescript <6.1.0`, and forcing it with
   `--legacy-peer-deps` would likely break type-aware linting.
4. **ESLint instead of oxlint.** The Vite template now defaults to oxlint; it was
   replaced with ESLint as requested. Uses `recommendedTypeChecked`, react-hooks,
   react-refresh, and `eslint-config-prettier` last.
5. **MSW set to fail on unhandled requests** (`onUnhandledFrame: 'error'`, the v3 name
   for v2's `onUnhandledRequest`), so tests can never hit the real API.
6. **Known audit warning (dev-only):** 7 moderate findings, all from one minimatch ReDoS
   in typescript-eslint's dependency tree. Not shipped to the bundle; the only fix is
   `npm audit fix --force`. Left as is.
7. **Two-panel layout with nested routes (master–detail).** Layout route `/` holds the
   user list with the search bar on top; nested route `/users/:userId` holds that
   user's posts and the create-post form. On desktop both panels sit side by side, so
   switching users is one click and the wide viewport isn't wasted. On mobile only one
   panel shows at a time, driven by the route, and the posts panel has a left-arrow
   back control to `/`. Rejected alternative: two fully separate routes, which leaves
   dead space on desktop and forces back-navigation to change user. Needs React Router.
8. **Theming: light and dark, system by default.** The theme follows
   `prefers-color-scheme` unless the user picks Light or Dark explicitly; the choice is
   remembered per browser. Palette: indigo accent over cool grays.
9. **Visual direction: "Name Badge Directory".** Each user is a conference badge
   (initials monogram, name, @username, company on the lower band); the selected badge
   hangs from an indigo clip and reappears as the posts panel header. Indigo is reserved
   for selection, focus and the primary action. Tokens live in `src/styles/tokens.css`.
   Figtree is self-hosted via `@fontsource-variable/figtree`; icons come from
   `lucide-react`. Mobile navigation uses a View Transition (the badge's monogram morphs
   into the header), disabled under `prefers-reduced-motion`.
10. **Design step runs on fixtures.** `src/fixtures/` held JSONPlaceholder-shaped data,
    and `useFixtureState` forced every UI state from the URL (`?users=loading|error`,
    `?posts=loading|error|empty`, `?publish=error`). Steps 3–6 replace both with
    TanStack Query; components take data and callbacks, so no restyling is needed.
    Since step 5 the app reads only the real API: `useFixtureState` is gone and the
    data moved to `src/test/data.ts`, where it backs the MSW handlers.
11. **Agent tooling is out of lint/format scope.** `.claude`, `.agents`, `.codex` and
    `.impeccable` are in ESLint's `globalIgnores` and `.prettierignore`; the vendored skill
    scripts were failing `post-agent`.
12. **Created posts live in their own cache entry, not in the server list.** Writing
    them into `['users', id, 'posts']` with `setQueryData` breaks in two cases: while
    that list is still loading, the fetch result overwrites the new post; after it has
    failed, the query flips to success and hides the error. So `useCreatePost` writes
    to `['local-posts', id]` (`gcTime`/`staleTime: Infinity`, a no-op `queryFn`) and
    the UI shows local posts above server posts. The server posts query keeps its own
    loading and error states.
13. **Search is client-side, no debounce.** `/users` returns only 10 users, so
    `fetchUsers()` takes no search parameter; the panel filters the cached list on
    each keystroke. There's no request per keystroke, so nothing needs debouncing.
14. **API layer shape.** `src/api/` holds the Zod schemas (types in `src/types.ts`
    are inferred from them), a `request()` helper that throws `ApiError` on non-2xx
    responses and validates every response body, plain endpoint functions, and the
    TanStack Query hooks. The query client sets `staleTime: Infinity` (the data never
    changes) and `retry: 1`, so the error state shows quickly. `src/test/handlers.ts`
    gives MSW a happy-path default for all three endpoints.
15. **Search lives in the URL as `?q=`.** It survives reloads, back/forward and links:
    in-app links carry the current query string. The input keeps exactly what was
    typed; matching trims and lowercases it (partial, case-insensitive), so an empty
    or whitespace-only search shows everyone. The URL gets the trimmed value in the
    user's casing, `q` is removed when that is empty, and other parameters stay.
    Typing uses `replace` (one history entry per search, not per keystroke) and
    `preventScrollReset`. One-character searches are allowed (10 users); `maxLength`
    is 60. `UsersPanel` now reads `useUsers()` instead of the fixture, so its
    loading/error UI is live and "Try again" refetches; the posts panel still uses
    fixtures until step 5. `src/users/UsersPanel/UsersPanel.test.tsx` covers the search rules
    (not yet in the `post-agent` gate; step 7).
16. **Posts panel on live data; create-post rules.** `UserPostsPanel` reads `useUser`,
    `useUserPosts`, `useLocalPosts` and `useCreatePost`. The posts request starts
    alongside the users request instead of waiting for it. A `:userId` that isn't a
    positive integer shows "not found" without any request; an ID missing from the
    list shows it once users load. Posts created while the list is loading or failed
    show above the skeleton or error. Form rules: title and body are required after
    `trim()`, and the title needs at least 2 characters (a product decision: a
    one-character title isn't a real title). There is no maximum length.
    The rules live in `src/posts/Composer/newPostSchema.ts`, so step 7 can test them
    directly. Errors show after the first submit attempt, then update live, and the
    trimmed values are what gets published.
17. **Created posts stay with their author when switching users.** Verified with a
    throwaway test before step 7. `useCreatePost(userId)` sets `onSuccess` in the
    `useMutation` options. TanStack attaches those options to the mutation itself, so
    they still run after the panel unmounts, and the `userId` they hold is the author's.
    The panel is keyed by `userId`, so the user you switch to gets a fresh composer and
    reads only its own `['local-posts', id]`. A late response therefore never changes
    that user's UI: no post, no "Published" notice. The post goes into the author's
    entry, which never expires (`gcTime: Infinity`, decision 12), so it shows when you
    go back to them. It lives only in memory, so a reload clears it.
    If that late request fails, the author's panel shows it when you go back to them
    (decision 18).
18. **Loading and error states (step 6).** Steps 4–5 already had skeletons, error
    messages with retry, empty states and the composer's failure banner. Step 6 closed
    these gaps:
    - **Late publish failures reach the author.** `useCreatePost` tracks whether its panel
      is still mounted. A failure after the panel unmounted is saved to
      `['unsent-posts', id]` (session-only, `gcTime: Infinity`, like decision 12). The
      author's composer then lists each one, with "Restore draft" (reopens the form
      filled in) and "Discard". They show only while no other draft is open, so a
      restore never overwrites what you're typing. A failure while the panel is open
      still shows only in the composer.
    - **Retry keeps its place.** On refetch, TanStack resets a query with no data to
      `pending` with `error: null`, which swapped the error block for a skeleton.
      Keyboard focus fell to the page, and the reason for the failure disappeared.
      `useStickyError` keeps the last error through the retry, and `RetryButton` shows
      "Retrying…" (`aria-disabled`, so it keeps focus) until the retry settles.
    - **Offline.** TanStack pauses requests while offline, which left skeletons running
      forever. A paused request with no data now shows "You're offline… will load when
      your connection comes back", and loads on reconnect. Publishing uses
      `networkMode: 'always'`, so offline it fails at once with the composer's error
      instead of "Publishing…" forever.
    - **Error copy by cause.** `src/api/errors.ts` sorts errors into network
      (`TypeError`; separate copy when `navigator.onLine` is false), server (5xx),
      client (4xx), invalid response (`ZodError`/`SyntaxError`), and unknown. Every
      error state and the publish failure use it.
    - **Crash fallback.** Route `errorElement`s: a crash in the detail panel stays in
      the panel, and the user list keeps working. Navigating clears it, and its main
      action is "Back to all users" rather than reload, since reloading would drop this
      tab's posts. A crash in the layout replaces the page and offers a reload.
      `router.tsx` exports `routes` so tests can mount the real tree in a memory router.
19. **Tests (step 7).** Vitest + Testing Library against MSW; `vitest run` is the last
    `post-agent` step. Apart from the schema unit test, the suites mount the real route
    tree (`renderApp()` in `src/test/renderApp.tsx`), so they exercise the same wiring
    users do. The test query client drops the one automatic retry (decision 14), so an
    error state shows after one failed response instead of a one-second wait.
    - **Search** (`UsersPanel.test.tsx`, from step 4): partial and case-insensitive
      matching, trimming, `?q=` sync.
    - **Create post** (`newPostSchema.test.ts`, `createPost.test.tsx`): the decision 16
      rules on their own, then through the form: errors after the first submit,
      live updates, focus on the first invalid field, no request while invalid, the
      trimmed body sent to `POST /posts`, the new post first and marked "Local only".
      A failed publish keeps the draft and shows the reason.
    - **GET errors** (`loadErrors.test.tsx`): for `/users` and `/users/:id/posts`, each
      cause (5xx, 4xx, network, unexpected shape) shows its copy and "Try again"
      recovers. Opening a user while `/users` fails shows the error in both panels.
      During a retry the error and the focused "Retrying…" button stay put.
    - **User switching** (`userSwitch.test.tsx`, decisions 17–18): a publish held in flight
      while switching users lands only on its author, with no post or notice for
      the other user; the same request failing instead becomes an unsent draft on
      the author's panel only (decision 18), and "Restore draft" reopens it filled in
      and publishes; a created post shows again only for its author, and a fresh
      query client (a reload) no longer has it.
    Each test was checked against a deliberately broken build (no `key` on the panel,
    `gcTime: 0` for local posts, case-sensitive search, no trim, no sticky error,
    late failures not saved as unsent)
    and failed as expected. `setup.ts` stubs `window.scrollTo`, which jsdom lacks and
    `ScrollRestoration` calls on every navigation.
