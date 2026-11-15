# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience: engineering or hiring reviewers who will evaluate Posts Explorer as a take-home exercise. They will run it locally, try every feature, read the code and README, and judge the craft.

The app is framed as a real customer-facing product: someone who browses a directory of users, opens one, reads their posts, and publishes a new one. Design decisions should hold up for that customer, because the reviewer judges it as if it shipped.

## Product Purpose

A small single-page app that lists users and their posts, backed by the public JSONPlaceholder API (https://jsonplaceholder.typicode.com).

Success means a reviewer can find a user, read their posts, and create a post without friction or confusion, and sees loading, error, empty, and validation states handled deliberately rather than as afterthoughts.

## Operating Context

- Data comes from JSONPlaceholder: `GET /users`, `GET /users/:id/posts`, `POST /posts`.
- The API does not persist writes. `POST /posts` returns `id: 101` every time, so the app gives created posts negative local IDs (-1, -2, …) and adds them to the cached list. Created posts exist only for the session and are lost on reload. Whether to persist them locally is undecided.
- Reviewers also read the README, which covers how to run the app, the decisions made, next steps, and how AI was used (what was asked, accepted, and corrected).

## Capabilities and Constraints

Required MVP features:

- List of users with search by name
- Selecting a user shows their posts and allows creating a new one through a validated form (title and body are required)
- Visible loading and error states

Constraints:

- All code, UI copy, docs, and commits are in English.
- At least 3 tests (Vitest + Testing Library, network mocked with MSW).
- Stack and decision log live in [PLAN.md](PLAN.md): Vite, React 19, TypeScript, TanStack Query, plain CSS with CSS Modules and BEM class names, Zod, no global state.
- Mobile and desktop are equal targets from the start; neither is an adaptation of the other.

## Evidence on Hand

- User and post content is JSONPlaceholder's placeholder data (Latin-like text, fictional names, emails, companies). Do not invent real-looking customers, metrics, or testimonials.
- No logo, brand assets, or brand voice exist beyond the name "Posts Explorer" and `public/favicon.svg`.

## Product Principles

1. **Every state is designed.** Loading, error, empty search, no posts, and form validation are first-class screens, not fallbacks.
2. **Honest about the fake backend.** The UI never implies that created posts were saved to a server or will survive a reload.
3. **Small and finished over broad and rough.** Ship the three required features completely before adding anything else.
4. **Reviewer-legible.** Behaviour and structure should be easy to verify from the UI, the tests, and the README alike.

## Accessibility & Inclusion

Target WCAG 2.2 AA: full keyboard navigation, visible focus, labelled inputs with errors tied to their fields, loading and error states announced to assistive tech, AA contrast, and respect for `prefers-reduced-motion`.
