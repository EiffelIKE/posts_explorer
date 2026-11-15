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
- [ ] 6. Loading and error states
- [ ] 7. Tests (at least 3) and add them to the `post-agent` gate. Must cover the
      user-switch cases in decision 17: a delayed publish never lands on the user
      switched to, and a created post shows again only for its author when coming
      back, and only for this session
- [ ] 8. README (run, decisions, next steps, AI usage)

## Agent workflow

After finishing any coding work, agents run:

```sh
npm run post-agent
```

Currently: `prettier --write` → `eslint --fix --max-warnings=0` → `tsc -b`.
Test gates get appended once tests exist (step 7).

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
    Known limit: if that late request fails, nobody sees the error, because the composer
    that would show it has unmounted and its draft is gone.
