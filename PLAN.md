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
- [ ] 3. API layer + types (`/users`, `/users/:id/posts`, `POST /posts`)
- [ ] 4. Users list with search by name
- [ ] 5. User posts + create-post form (validated, required title and body)
- [ ] 6. Loading and error states
- [ ] 7. Tests (at least 3) and add them to the `post-agent` gate
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
10. **Design step runs on fixtures.** `src/fixtures/` holds JSONPlaceholder-shaped data,
    and `useFixtureState` forces every UI state from the URL (`?users=loading|error`,
    `?posts=loading|error|empty`, `?publish=error`). Steps 3–6 replace both with
    TanStack Query; components take data and callbacks, so no restyling is needed.
11. **Agent tooling is out of lint/format scope.** `.claude`, `.agents`, `.codex` and
    `.impeccable` are in ESLint's `globalIgnores` and `.prettierignore`; the vendored skill
    scripts were failing `post-agent`.
