---
version: 1
slug: "src-layout-rootlayout-tsx"
primary_target: "src/layout/RootLayout.tsx"
related_targets: ["src/router.tsx","src/main.tsx"]
---

# Surface brief: Posts Explorer app shell (`/` and `/users/:userId`), src/layout/RootLayout.tsx

Mode: Operate. Code-led (operate surface). Chosen sketch: `.impeccable/mocks/decision/model-pick.html`.

## Scope
Layout route `/` (badge rack: search on top, user list) with nested `/users/:userId` (selected user's hero badge, collapsed composer, posts). Desktop: both panels side by side. Mobile: one panel per route, posts route has a left-arrow back to `/`. Theme: System (default) / Light / Dark, remembered per browser.

## Audience, task, constraints
Reviewers judging it as a shipped customer product. Task: find a user by name, read their posts, publish a post (title + body required). States: users loading/error/empty search; posts loading/error/empty; composer closed/open/invalid/submitting/failed; no user selected (desktop). Created posts are local only and must say so. WCAG 2.2 AA. Avoid: generic template look, over-decoration, too dense, too sparse.

## Direction contract
THESIS: Every user is a conference name badge: initials monogram, name, @username, and company on the badge's lower band. Selecting a user clips that badge to the top of the posts panel. Refuses the category default of avatar rows beside a grid of rounded post cards.

OWN-WORLD: Cool-gray ground with white badge stock (dark theme: graphite ground, raised slate stock), one cool-gray ramp for every neutral. Indigo is the lanyard and nothing else: the clip tab on the selected badge, the selected monogram fill, focus rings, the primary button. Badges: 10px radius, 1px border, a dashed rule above the company band. Figtree throughout (400/600/700/800). Posts are not cards: flat entries on hairlines at one reading measure.

STORY: The visitor scans the badge rack, narrows it by name, picks a badge, and watches it become the panel header. They read the posts, open the composer, publish, and see their post land on top tagged "Local only". Switching people is one click on desktop and one back-arrow on mobile.

FIRST VIEWPORT: Desktop: 56px top bar, wordmark left, System/Light/Dark segmented control right. A 400px badge rack on the left with sticky search over 8px-spaced badges. On the right, the hero badge (88px monogram, 34px name, @username · email, company band, indigo clip tab), then the composer bar ("Write a new post as Leanne", primary "New post"), then posts. With no user selected, the right panel invites a pick. Mobile: rack full width; posts route opens with a back-arrow bar and a compact hero badge.

FORM: Name Badge Directory (conference badges and lanyards), position 1 of 7 on the ordered list (IMPECCABLE'S PICK card). seed:cc90696b80e0f370. Signature interaction: the badge handoff, where a View Transition morphs the selected badge's monogram and name into the hero badge (crossfade under reduced motion). Motion grammar: 200-250ms ease-out, the clip tab drops in once, nothing else moves on its own. Build disciplines carried from the round: skeletons hold the loaded geometry exactly; every badge row is the same height; indigo is never decoration.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Whether created posts persist across reloads (currently session-only).
