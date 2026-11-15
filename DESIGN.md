---
name: Posts Explorer
description: A directory of people drawn as conference name badges, with indigo as the lanyard.
colors:
  lanyard-indigo: '#4f46e5'
  lanyard-indigo-deep: '#4338ca'
  lanyard-soft: '#e6e7fa'
  lanyard-ink: '#3730a3'
  on-lanyard: '#ffffff'
  ground: '#eef0f5'
  rail: '#f6f7fa'
  badge-stock: '#ffffff'
  badge-stock-hover: '#fafbfd'
  hairline: '#e3e6ed'
  hairline-strong: '#cdd2dc'
  ink: '#1a1d26'
  ink-secondary: '#555b6b'
  ink-tertiary: '#646a7a'
  monogram-ground: '#e9eaf3'
  monogram-ink: '#3b3f55'
  danger: '#b42318'
  danger-soft: '#fdecea'
  dark-lanyard-indigo: '#818cf8'
  dark-lanyard-fill: '#5850ec'
  dark-lanyard-fill-hover: '#6a63f0'
  dark-lanyard-soft: '#30356a'
  dark-lanyard-ink: '#c7cbfd'
  dark-ground: '#17191f'
  dark-rail: '#1c1f26'
  dark-badge-stock: '#252a35'
  dark-badge-stock-hover: '#2b303c'
  dark-hairline: '#313643'
  dark-hairline-strong: '#434958'
  dark-ink: '#e8eaf0'
  dark-ink-secondary: '#a6acba'
  dark-ink-tertiary: '#9097a6'
  dark-monogram-ground: '#333846'
  dark-monogram-ink: '#d5d8e2'
  dark-danger: '#f59a90'
  dark-danger-soft: '#3a1e1e'
typography:
  display:
    fontFamily: "'Figtree Variable', 'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: '2.125rem'
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: '-0.02em'
  headline:
    fontFamily: "'Figtree Variable', 'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.25rem'
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: '-0.01em'
  title:
    fontFamily: "'Figtree Variable', 'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.0625rem'
    fontWeight: 700
    lineHeight: 1.45
  badge-name:
    fontFamily: "'Figtree Variable', 'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: '0.9375rem'
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "'Figtree Variable', 'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: '0.9375rem'
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'tnum'"
  label:
    fontFamily: "'Figtree Variable', 'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: '0.875rem'
    fontWeight: 600
    lineHeight: 1
  caption:
    fontFamily: "'Figtree Variable', 'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: '0.8125rem'
    fontWeight: 600
    lineHeight: 1.5
  monogram-hero:
    fontFamily: "'Figtree Variable', 'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.875rem'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '0.01em'
rounded:
  inner: '4px'
  inner-control: '6px'
  control: '8px'
  badge: '10px'
  hero: '14px'
  full: '50%'
spacing:
  '1': '4px'
  '2': '8px'
  '3': '12px'
  '4': '16px'
  '5': '20px'
  '6': '24px'
  '8': '32px'
  '10': '40px'
  '12': '48px'
components:
  button-primary:
    backgroundColor: '{colors.lanyard-indigo}'
    textColor: '{colors.on-lanyard}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: '0 16px'
    height: '40px'
  button-primary-hover:
    backgroundColor: '{colors.lanyard-indigo-deep}'
  button-secondary:
    backgroundColor: '{colors.badge-stock}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: '0 16px'
    height: '40px'
  button-secondary-hover:
    backgroundColor: '{colors.badge-stock-hover}'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.ink-secondary}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: '0 16px'
    height: '40px'
  button-ghost-hover:
    backgroundColor: '{colors.hairline}'
    textColor: '{colors.ink}'
  input-search:
    backgroundColor: '{colors.badge-stock}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.badge}'
    padding: '0 44px 0 40px'
    height: '44px'
  input-field:
    backgroundColor: '{colors.badge-stock}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.control}'
    padding: '10px 12px'
    height: '44px'
  user-badge:
    backgroundColor: '{colors.badge-stock}'
    textColor: '{colors.ink}'
    rounded: '{rounded.badge}'
    height: '92px'
  user-badge-hover:
    backgroundColor: '{colors.badge-stock-hover}'
  hero-badge:
    backgroundColor: '{colors.badge-stock}'
    textColor: '{colors.ink}'
    rounded: '{rounded.hero}'
    padding: '32px 32px 24px'
  monogram:
    backgroundColor: '{colors.monogram-ground}'
    textColor: '{colors.monogram-ink}'
    rounded: '{rounded.full}'
    size: '44px'
  monogram-selected:
    backgroundColor: '{colors.lanyard-indigo}'
    textColor: '{colors.on-lanyard}'
  monogram-hero:
    rounded: '{rounded.full}'
    size: '88px'
  composer-bar:
    backgroundColor: '{colors.badge-stock}'
    textColor: '{colors.ink-secondary}'
    rounded: '{rounded.badge}'
    padding: '8px 8px 8px 16px'
    height: '56px'
  state-message:
    backgroundColor: '{colors.badge-stock}'
    textColor: '{colors.ink}'
    rounded: '{rounded.badge}'
    padding: '20px'
  theme-switch:
    backgroundColor: '{colors.ground}'
    textColor: '{colors.ink-secondary}'
    typography: '{typography.caption}'
    rounded: '{rounded.control}'
    padding: '3px'
  theme-switch-option-checked:
    backgroundColor: '{colors.badge-stock}'
    textColor: '{colors.ink}'
---

# Design System: Posts Explorer

## Overview

**Creative North Star: "The Name Badge Directory"**

Every person in the directory is a conference name badge: an initials monogram, a bold name, a quiet @username, and the company printed on a lower band below a perforation. The rack of badges sits on a cool-gray rail; picking one clips it to the top of the reading panel, where it reappears as a larger hero badge hanging from an indigo clip tab. Indigo is the lanyard. It marks what is held (the selected badge, its monogram), where the keyboard is (focus), and the one thing to do next (the primary action). Everything else is cool gray.

The system is compact and quiet. Density comes from a strict 4px rhythm, one sans family in five weights, and flat surfaces separated by hairlines rather than heavy containers. Posts are not cards: they are flat entries ruled by hairlines at one reading measure, so the badges stay the only objects on the page. Light and dark are equal themes, with System as the default; dark is graphite ground under raised slate stock, not an inversion.

Motion is authored once. The badge handoff morphs the clicked badge's monogram and name into the hero badge through a View Transition, and the hero's clip tab drops in once per selection. Nothing else moves on its own; state changes are short color and border fades.

**Key Characteristics:**

- Conference badge as the one object: monogram, name, @username, perforated company band.
- Indigo only for selection, focus, and the primary action.
- One cool-gray ramp feeds every neutral, in both themes.
- Figtree throughout, tabular numerals globally.
- Posts as hairline-ruled entries, never cards.
- Skeletons hold the loaded geometry exactly; every badge is the same height.
- One authored motion (the badge handoff), cut to an instant change under reduced motion.

## Colors

A cool-gray paper world with a single saturated indigo used as a functional signal, never as decoration.

### Primary

- **Lanyard Indigo** (lanyard-indigo): the clip tab on the selected badge and hero, the selected monogram fill, the 2px focus outline, the text caret, and the primary button fill. In dark, this role splits in two (see the Two Indigos Rule).
- **Lanyard Indigo Deep** (lanyard-indigo-deep): primary button hover only.
- **Lanyard Soft** (lanyard-soft): the 3px focus halo around inputs and the text-selection background.
- **Lanyard Ink** (lanyard-ink): text set on Lanyard Soft (text selection).

### Neutral

- **Ground** (ground): the page behind the reading panel; also the disabled input fill and the theme switch track.
- **Rail** (rail): the badge rack column and its sticky search header, one step lighter than Ground so the rack reads as a separate surface.
- **Badge Stock** (badge-stock): every badge, the hero, the composer, state messages, inputs, and the top bar. White in light; raised slate in dark.
- **Badge Stock Hover** (badge-stock-hover): hover fill for badges and secondary buttons.
- **Hairline** (hairline): default 1px borders, post separators, ghost-button hover fill, skeleton bones.
- **Hairline Strong** (hairline-strong): input borders, the dashed perforation above company bands, the rule above the post list, the empty-state slot outline, and the scrollbar thumb.
- **Ink** (ink): primary text.
- **Ink Secondary** (ink-secondary): @usernames, company bands, post bodies, counts, hints.
- **Ink Tertiary** (ink-tertiary): placeholders, leading icons in inputs, the middot separator, and hover borders on inputs and secondary buttons.
- **Monogram Ground / Monogram Ink** (monogram-ground, monogram-ink): the unselected initials disc and the neutral state-message icon disc.

### Status

- **Danger / Danger Soft** (danger, danger-soft): field error text and borders, the error halo, the failure banner, and the error state-message icon. Status color appears only for errors.

### Dark theme

Dark applies when the system prefers it and the user has not forced Light, or when the user forces Dark. Every semantic role above has a `dark-` counterpart in the frontmatter; the gray ramp shifts to graphite ground (dark-ground) and slate stock (dark-badge-stock), and shadows deepen to plain black alpha.

### Named Rules

**The Lanyard Rule.** Indigo appears only on the selected badge (clip tab, border, monogram), on focus, and on the primary action. If a new element wants indigo and is none of those three, it gets gray.

**The Two Indigos Rule.** In dark, strokes and marks (clip tab, selected border, focus outline) use dark-lanyard-indigo, while filled surfaces carrying white text (primary button, selected monogram) use dark-lanyard-fill. Never put white text on the light stroke indigo.

**The One Ramp Rule.** Every neutral derives from the single cool-gray ramp (white through #0f1117). No warm grays, no pure black text.

## Typography

**Display Font:** Figtree Variable (with Figtree, ui-sans-serif, system-ui)
**Body Font:** the same family

**Character:** One friendly geometric sans carries the whole system; hierarchy comes from weight (400 / 500 / 600 / 700 / 800) and a tight size ramp of 12, 13, 14, 15, 17, 20, 24 and 34px, like the printing on a badge.

### Hierarchy

- **Display** (800, 34px, 1.15, -0.02em): the hero badge name only. Steps down to 24px / 1.2 / -0.015em below 768px.
- **Headline** (800, 20px, 1.3, -0.01em): panel headings such as "Posts" and the empty-panel invitation.
- **Title** (700, 17px, 1.45): post titles and the open composer heading. The wordmark uses the same size at 800 with -0.015em.
- **Badge Name** (700, 15px, 1.4): the name on a rack badge, single line, ellipsized.
- **Body** (400, 15px, 1.6): base text, post bodies (capped at 68ch), input text. Tabular numerals are on globally.
- **Label** (600, 14px, 1): buttons and field labels. Secondary text in badges and hero meta also sits at 14px, weight 400.
- **Caption** (600, 13px, 1.5): counts, hints, theme-switch options, field errors. The rack badge company band uses this size at weight 500.

### Named Rules

**The One Family Rule.** Figtree is the only face. Hierarchy is weight and size, never a second family.

**The Sentence Case Rule.** Labels and headings are sentence case at normal tracking. No uppercase letterspaced labels.

## Layout

A two-pane directory. Desktop: a sticky 56px top bar (wordmark left, theme switch right) over a grid of a badge rack (clamp(340px, 28vw, 400px): 340px on small desktops, 400px from about 1430px) and a flexible reading panel; each pane scrolls on its own with a stable scrollbar gutter. Below 768px the layout becomes one pane at a time, chosen by the route: the rack fills the width on the index route, and the posts route shows a back-arrow link above a compact hero.

The reading panel content is capped at an 820px measure plus 48px gutters each side and centered in the panel (margin-inline: auto), so wide screens get equal margins and the no-user-selected prompt shares the same axis; post bodies cap at 68ch inside it. Panel padding steps down from 32/48/48 to 24/32/40 below 1024px and 8/16/40 below 768px.

Spacing is a 4px-based scale (4, 8, 12, 16, 20, 24, 32, 40, 48). Badges stack 8px apart; the rack's sticky header pads 20px (16px on mobile).

### Named Rules

**The Same Height Rule.** Every rack badge is exactly 92px tall, and every skeleton holds its loaded counterpart's exact geometry (badge, hero, composer bar, post lines) so nothing shifts when data lands.

## Elevation & Depth

A mostly flat, tonal system with three quiet shadows. Badge stock sits on Rail or Ground and is lifted by a 1px border plus a near-invisible contact shadow. Larger objects that are "held" (the hero badge, the open composer form) get a soft raised shadow. The selected rack badge gets an indigo-tinted glow under a doubled indigo border. In dark, all three shadows switch to black alpha.

### Shadow Vocabulary

- **Stock** (`box-shadow: 0 1px 2px rgb(22 25 40 / 0.06)`): rack badges, the collapsed composer bar, the checked theme-switch option.
- **Raised** (`box-shadow: 0 1px 2px rgb(22 25 40 / 0.06), 0 12px 32px -16px rgb(22 25 40 / 0.22)`): the hero badge and the open composer form.
- **Selected** (`box-shadow: 0 0 0 1px <lanyard>, 0 6px 16px -8px rgb(79 70 229 / 0.45)`): the selected rack badge only.

### Named Rules

**The Stock-and-Lift Rule.** Badge stock rests on the Stock shadow. Only what the visitor is holding (the hero, the open form) is Raised, and only the selected badge glows indigo.

## Shapes

A three-step radius ladder: controls (buttons, fields, theme switch) at 8px, badge-sized surfaces (rack badges, search, composer, state messages) at 10px, and the hero badge and empty slot at 14px. Monograms are full circles. Two inner steps sit below the ladder: `inner` 4px for skeleton bones, clip-tab bottoms and the inline "Local only" tag, and `inner-control` 6px for controls nested inside a control (theme-switch options, the search clear button, the hero clip tab). The 88px hero monogram sets its initials in the `monogram-hero` role (30px/700).

The badge silhouette carries two marks: a clip tab, a short indigo bar centered on the top edge with rounded bottom corners (40 by 5px on rack badges, 64 by 7px on the hero); and a perforation, a 1px dashed Hairline Strong rule above the company band.

### Named Rules

**The Perforation Rule.** A dashed rule means "this is a badge". It belongs above the company band, and as a 1.5px dashed outline it draws the unclaimed badge slot in the empty panel. Do not use dashed lines for anything else.

## Components

### Buttons

- **Shape:** gently rounded (8px), 40px minimum height, 16px side padding, 16px icons with an 8px gap.
- **Primary:** Lanyard Indigo fill, white label at 600/14px. Used once per view: "New post" and "Publish post".
- **Hover / Focus:** hover deepens the fill; focus is the global 2px indigo outline offset 2px. Fades run 120ms ease-out. Disabled primary drops to 70% opacity; a spinning loader icon shows while publishing.
- **Secondary:** Badge Stock fill, Hairline Strong border, Ink label; hover moves the border to Ink Tertiary.
- **Ghost:** transparent, Ink Secondary label; hover fills with Hairline. Used for retry and cancel.

### User Badge (signature)

- **Structure:** 92px tall, a 56px monogram column and a name column, with the company on a full-width lower band below the perforation.
- **Surface:** Badge Stock, 1px Hairline border, 10px radius, Stock shadow. Hover moves to Badge Stock Hover and Hairline Strong.
- **Selected:** indigo border doubled with a 1px ring, Selected shadow, monogram fills indigo, and the clip tab appears top center.
- **Handoff:** on click, the badge's monogram and name carry the `hero-avatar` and `hero-name` transition names so they morph into the hero.

### Hero Badge (signature)

- The selected person, clipped to the top of the reading panel: 14px radius, Raised shadow, 88px indigo monogram (56px on mobile), Display name, @username and mailto email separated by a middot, and the company band below a perforation. The clip tab drops in over 260ms on each new selection.

### Monogram

- Initials in a circle, 44px (88px on the hero), 700 weight. Neutral disc by default; indigo fill with white initials when selected. Decorative; the name is always rendered beside it.

### Inputs / Fields

- **Search:** 44px tall, 10px radius, leading search icon and a trailing 32px clear button; Hairline Strong border, Ink Tertiary on hover.
- **Fields:** 44px minimum height (132px multiline, vertically resizable), 8px radius, 600/14px label above with 6px gap.
- **Focus:** border turns indigo with a 3px Lanyard Soft halo; no outline.
- **Error:** Danger border, Danger Soft halo on focus, and a 13px Danger message with an alert icon tied to the field.

### Composer

- Collapsed: a 56px bar on Badge Stock with a pen icon, the prompt "Write a new post as <first name>", and the primary button on the right; hovering the bar also hovers its button. Open: a Raised form card (20px / 24px padding, 16px on mobile) with a Title heading, fields, a hint on the left and actions on the right (stacked full-width below 640px).

### Post Entry

- Flat, not a card: a Title, a 68ch Body in Ink Secondary, 20px above and 24px below, separated by Hairlines under a Hairline Strong top rule.

### State Message

- Loading, error, and empty states share one block: Badge Stock, 1px Hairline, 10px radius, 20px padding, a 40px icon disc (neutral, or Danger Soft with Danger for errors), a 700/15px title, a 14px Ink Secondary explanation, and an optional action.

### Navigation

- **Top bar:** sticky, Badge Stock with a bottom Hairline, 800-weight wordmark led by the 28px logo mark (`src/ui/Logo`, disc painted with the primary fill via `--posts-explorer-primary`, 10px gap).
- **Theme switch:** a segmented control on Ground with a Hairline border; options are 600/13px with a 15px icon; the checked option lifts to Badge Stock with the Stock shadow. Below 640px, labels collapse to icons (36 by 32px targets) with the label kept for screen readers.
- **Mobile back link:** 44px tall, arrow plus label, Hairline hover fill.

## Do's and Don'ts

### Do:

- **Do** keep indigo to the selected badge, focus, and the single primary action per view (the Lanyard Rule).
- **Do** use dark-lanyard-fill, not dark-lanyard-indigo, under white text in dark (the Two Indigos Rule).
- **Do** keep every rack badge 92px tall and make every skeleton match its loaded geometry to the pixel.
- **Do** draw posts as hairline-ruled entries at the 820px measure with bodies capped at 68ch.
- **Do** give every interactive surface the global 2px indigo focus outline, or the indigo border plus Lanyard Soft halo on fields.
- **Do** keep state transitions to 120ms ease-out color and border fades, and reserve the 220ms ease-out View Transition for the badge handoff.
- **Do** design both themes together; System is the default.

### Don't:

- **Don't** put posts in rounded cards; the badges are the only objects.
- **Don't** use indigo for decoration, category color, or emphasis.
- **Don't** add a second typeface or uppercase letterspaced labels.
- **Don't** use dashed lines anywhere except the badge perforation and the unclaimed badge slot.
- **Don't** add ambient or looping motion; under reduced motion, transitions and animations are cut.
