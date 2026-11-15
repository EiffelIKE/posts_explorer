# Posts Explorer

A small React + TypeScript app on the public
[JSONPlaceholder](https://jsonplaceholder.typicode.com) API: browse a directory of
users, search them by name, read a user's posts, and publish a new one.

**Live demo:** <https://posts-explorer-five.vercel.app/>

- **Users list with search by name.** Partial and case-insensitive, synced to the URL
  as `?q=` so it survives reloads and back/forward.
- **User posts and a validated create-post form.** Title and body are required
  (after trimming), and the title needs at least 2 characters. New posts show at the
  top of the list, marked "Local only".
- **Loading, error, empty and offline states.** Every request has a skeleton, an
  error message that names the cause (network, server, client, invalid response)
  and a "Try again" button that keeps focus while it retries.
- **Two-panel layout.** On desktop the users list and the posts panel sit side by
  side. On mobile one panel shows at a time, driven by the route.
- Light and dark themes (system by default) and WCAG 2.2 AA as the accessibility
  target.

## Running it

Requires **Node 24** (pinned in [mise.toml](mise.toml); with [mise](https://mise.jdx.dev)
installed, `mise install` sets it up).

```sh
npm ci
npm run dev        # http://localhost:5173
```

| Script               | What it does                                                   |
| -------------------- | -------------------------------------------------------------- |
| `npm run dev`        | Vite dev server                                                |
| `npm run build`      | Type-check and build to `dist/`                                |
| `npm run preview`    | Serve the production build                                     |
| `npm test`           | Vitest in watch mode                                           |
| `npm run test:run`   | Run the tests once (5 files, 25 tests)                         |
| `npm run lint`       | ESLint, zero warnings allowed                                  |
| `npm run typecheck`  | `tsc -b`                                                       |
| `npm run post-agent` | Full gate: Prettier → ESLint `--fix` → `tsc -b` → `vitest run` |

The tests never touch the real API: MSW mocks every request and fails on any request
without a handler. [vercel.json](vercel.json) holds the Vercel deploy config,
including the rewrite to `index.html` that lets deep links like `/users/3` survive a
reload.

## Stack

Vite 8, React 19, TypeScript 6, TanStack Query v5 (server state), React Router
(layout route + nested user route), Zod (response and form validation), plain CSS
with CSS Modules and BEM class names, Vitest + Testing Library + MSW. No global
state library.

## Project layout

```
src/
  api/        Zod schemas, request() helper, endpoints, TanStack Query hooks, error copy
  users/      Users panel, search, user badge
  posts/      Posts panel, post list, composer (create-post form) and its schema
  layout/     Root layout, route error fallbacks, not-found
  ui/         Shared pieces: avatar, logo, state messages, retry button
  theme/      Light/dark/system theme switch
  styles/     Design tokens
  test/       MSW server and handlers, fixture data, renderApp() helper
```

Tests sit next to the code they cover (`*.test.ts(x)`).

## Decisions

The full log, with the reasoning behind each one, is in [PLAN.md](PLAN.md#decisions).
The numbers below point there.

- **Created posts get negative local IDs** (-1, -2, …) (decision 2).
  `POST /posts` always returns `id: 101`, so several new posts would collide on React
  keys. A counter keeps `id` a number, can't clash with server IDs and stays
  deterministic in tests, unlike `crypto.randomUUID()`.
- **Created posts live in their own cache entry** (decision 12). Writing them into the
  server list with `setQueryData` broke in two cases: a list still loading overwrote
  the new post, and a failed list flipped to success and hid its error. They go to
  `['local-posts', userId]` instead and render above the server posts. They are kept
  in memory for the session only, and the UI says so ("Local only").
- **Master–detail layout with nested routes** (decision 7). `/` holds the users list,
  `/users/:userId` the posts. Two separate pages would leave dead space on desktop and
  force a back navigation to change user.
- **Search is client-side with no debounce** (decisions 13 and 15). `/users` returns
  only 10 users, so the panel filters the cached list on each keystroke. The query
  lives in the URL.
- **Created posts stay with their author when you switch users** (decisions 17–18).
  A publish still in flight when you switch never changes the other user's panel. If it
  succeeds, the post shows when you go back to the author. If it fails, the author's
  composer offers it as an unsent draft you can restore or discard.
- **Error handling by cause** (decision 18). Errors are sorted into network, offline,
  5xx, 4xx and invalid response, each with its own copy. A retry keeps the error and the
  focused button in place instead of swapping them for a skeleton. Crashes are caught
  per route, so a broken posts panel leaves the users list working.
- **Every API response is validated with Zod** (decision 14). A response with an
  unexpected shape shows an error state instead of crashing a component.
- **TypeScript pinned to `~6.0.3`** (decision 3). typescript-eslint doesn't support
  TypeScript 6.1+ yet, and type-aware linting was worth more than the newer compiler.

## Tests

25 tests in 5 files. Apart from the schema unit test, they mount the real route tree
in a memory router against MSW, so they go through the same wiring a user does.

| File                                                                | Covers                                                                                          |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [UsersPanel.test.tsx](src/users/UsersPanel/UsersPanel.test.tsx)     | Partial, case-insensitive, trimmed search and `?q=` sync                                        |
| [newPostSchema.test.ts](src/posts/Composer/newPostSchema.test.ts)   | Form rules on their own                                                                         |
| [createPost.test.tsx](src/posts/UserPostsPanel/createPost.test.tsx) | The form end to end: errors, focus, no request while invalid, trimmed body sent, failed publish |
| [loadErrors.test.tsx](src/posts/UserPostsPanel/loadErrors.test.tsx) | Each error cause for both GET endpoints, recovery with "Try again", focus during retry          |
| [userSwitch.test.tsx](src/posts/UserPostsPanel/userSwitch.test.tsx) | Switching users with a publish in flight (success and failure) and session-only persistence     |

Each test was also run against a deliberately broken build (for example, no `key` on
the panel or a case-sensitive search) to check that it fails when it should.

## Known limits

- Created posts are lost on reload, because the API doesn't persist writes and the app
  keeps them in memory only.
- `npm audit` reports 7 moderate findings, all from one dev-only dependency inside
  typescript-eslint. Nothing reaches the bundle; the only fix offered is
  `npm audit fix --force` (decision 6).

## With more time

- Persist created posts and unsent drafts in `localStorage`, so they survive a reload.
- Add a few end-to-end tests with Playwright on real browsers, including mobile
  navigation and the view transition.
- Add automated accessibility checks (axe) to the test suite, alongside the manual
  keyboard and screen-reader checks.
- Run `post-agent` in CI on every pull request.
- Move to TypeScript 6.1+ once typescript-eslint supports it.

## AI usage

I built this with coding agents (Claude Code, plus the Impeccable design skill for
the UI step).
I set the stack, the scope of each step and the product rules; the agents wrote most
of the code under that direction.

**Full conversations are in [coding_agents/](coding_agents/)**, exported one file per
session:

| File                         | Session                                               |
| ---------------------------- | ----------------------------------------------------- |
| [1.txt](coding_agents/1.txt) | Brief, stack, project setup and the `post-agent` gate |
| [2.txt](coding_agents/2.txt) | Product context, layout and visual design (DESIGN.md) |
| [3.txt](coding_agents/3.txt) | API layer                                             |
| [4.txt](coding_agents/4.txt) | Users list and search                                 |
| [5.txt](coding_agents/5.txt) | User posts and the create-post form                   |
| [6.txt](coding_agents/6.txt) | Checking the user-switching edge cases                |
| [7.txt](coding_agents/7.txt) | Test suite                                            |

### How the work was organised

- **[PLAN.md](PLAN.md) is the spec and decision log.** A full spec-driven workflow
  would have been overkill for an app this size, so a single file tracks the steps,
  the features and requirements of each one, and every decision with its reason,
  including the ones I made myself. Each agent session started from it and updated it.
- **[PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md)** hold the product scope and
  the design system, so later sessions didn't have to rediscover them.
- **Every agent finished with `npm run post-agent`** (format, lint, type-check, tests).
- **I made every commit myself, after reviewing the changes.** Agents never
  committed.

### What I asked for, accepted and corrected

**What I decided and asked for**

- The stack, and skipping spec-driven development in favour of PLAN.md.
- Negative local IDs over `crypto.randomUUID()`, which would have made tests
  non-deterministic.
- ESLint instead of the oxlint that Vite's template now ships, and a `post-agent`
  gate for every agent to run.
- The master–detail layout, the theme (light and dark, system default, indigo over cool
  grays) and the user badge contents (initials, name, username, company).
- Client-side search with no debounce, since there are only 10 users.
- Form rules: required after `trim()`, plus a 2-character minimum on the title as a
  product decision.
- The two user-switching edge cases. I asked the agent to verify them before moving
  on and made them required in the test step.
- The test plan: search, post creation with validation, GET error states and the
  switching cases.

**What I accepted from the agents**

- The "Name Badge Directory" visual direction, the collapsed composer at the top of
  the posts panel, and the design tokens.
- Keeping created posts in their own cache entry instead of my original idea of
  writing them into the server list with `setQueryData`. The agent showed the two
  cases where that breaks (decision 12).
- Pinning TypeScript to 6.0 to keep type-aware linting (decision 3).
- Showing late publish failures to the author as unsent drafts. The agent flagged
  this gap while checking the edge cases, and it was closed in step 6. I also accepted
  its proposal to add a third switching test for that failure path.
