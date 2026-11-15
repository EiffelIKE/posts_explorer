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
| Global state  | None at this stage                                        |
| Runtime       | Node 24 (pinned in `mise.toml`)                           |

## Steps

- [x] 1. Project setup: scaffold, tooling, `post-agent` gate
- [ ] 2. Layout and UI/UX definition
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
