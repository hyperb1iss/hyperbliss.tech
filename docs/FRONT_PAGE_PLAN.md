# Front Page Redesign — Plan & Ledger

> Status: **Wave 1 in progress** · Branch: `nova/front-page` ·
> Worktree: `~/dev/worktrees/hyperbliss.tech/nova/front-page` ·
> Design: Round 3 on the "hyperbliss.tech Landing Directions" canvas · Updated: 2026-09-04

## Why

The landing page today is a full-bleed name hero, 32 skill chips, and two
card grids that duplicate `/blog` and `/projects`. Nothing a visitor would
actually want (the newest essay, what shipped this week) is above the fold,
and the most hyperbliss thing on the site (the terminal) hides behind a pill.
The header everyone likes stays. Everything under it becomes a front page:
the newest thing first, then a unified feed, with a quiet rail for who, now,
shipping, and elsewhere.

## Success criteria

- `/` renders header, lead story, feed, rail with real content, server-side,
  crawlable (`pnpm test:seo` green with updated assertions).
- No hero, no skill chips, no home card grids, no second particle canvas.
- Feed merges essays, lab experiments, releases, and project launches, newest
  first, from existing loaders plus GitHub releases.
- Type: Syne (display), IBM Plex Sans (body), Space Mono (data + terminal).
- Motion: one orchestrated entrance, GPU transforms only, honors
  `prefers-reduced-motion`, 60fps on the header canvas.
- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` green.
- Independent review (cross-model) passes before merge.

## Non-goals (the fence)

- Redesigning About, Projects, Blog, Lab, Resume, or the mobile menu.
- Changing terminal behavior or commands.
- WebGL CyberScape rewrite. This round tunes the existing Canvas2D config.
- New written content beyond refreshing `content/now.md`.

## Pinned invariants

- Header collapsed/expanded heights stay 110px/200px (96/180 mobile).
  `TerminalConsole` and `GlobalLayout` derive offsets from them.
- CyberScape lives in the header band and nowhere else.
- Pink appears once per screen: the name. Purple is structure, cyan is
  interactive.
- No captions, tickers, or marginalia (rev hashes, counts, coordinates).
- One mono face. Space Mono stays for the terminal, code, and version
  numbers. Martian Mono from the mock is dropped: a second mono for six
  version strings is not worth a font load.
- The CyanogenMod credential lives on About, not the front page.
- Deleted hero and card components are deleted, not flag-gated.

## Waves

### Wave 1 · Foundation

- [x] **T0** Plan ledger committed (this file).
- [ ] **T1** Fonts: Syne + IBM Plex Sans via `next/font`, Space Mono kept.
  Files: `app/styles/fonts.ts`, `app/layout.tsx`,
  `app/styles/silkcircuit/variables.css`.
  Verify: `pnpm typecheck`; `grep -rn "font-jura\|font-exo2" app` empty.
- [ ] **T2** Feed model: `app/lib/feed.ts` with `buildFeed()` merging posts,
  lab, releases, launches into `FeedItem[]`; releases carry a one-line
  summary (release name or first line of body) via `app/lib/github.ts`.
  Files: `app/lib/feed.ts`, `app/lib/github.ts`, `tests/lib/feed.test.ts`.
  Verify: `pnpm test -- tests/lib/feed.test.ts`.
- [ ] **T3** Releases for every project with a GitHub URL (not the curated 4)
  in `app/(transition)/page.tsx`; in-memory + ISR caching already bounds
  this to one call per repo per hour.
  Verify: `pnpm build` with and without `GITHUB_TOKEN` renders `/`.

### Wave 2 · Front page

- [ ] **T4** `app/components/front/` — `FrontPage` (server), `LeadStory`,
  `Feed`, `Rail` (who, now, shipping, elsewhere). Wired into `TerminalHome`
  in place of hero + card sections. `noscript` fallback and
  `TerminalConsole` untouched.
  Verify: `pnpm build`; `pnpm test:seo`; visual at 1440 and 390.
- [ ] **T5** Delete `HeroSectionSilk`, `HomePageClient`,
  `LatestBlogPostsSilk`, `FeaturedProjectsSectionSilk`, `homeContent.ts`;
  trim `content/pages/home.json` to what the front page reads.
  Verify: `pnpm typecheck`; `pnpm test`; grep for dead imports empty.
- [ ] **T6** Header refresh: nav set in Syne, logo mark calmed (no glitch
  keyframes), CyberScape config tuned (60fps target, fewer shapes, lower
  particle density, softer glow, hairline connections).
  Files: `app/components/NavLinks.tsx`, `app/components/Logo.tsx`,
  `app/cyberscape/CyberScapeConfig.ts`.
  Verify: visual; DevTools FPS on header ≥ 60.

### Wave 3 · Motion and polish

- [ ] **T7** Entrance orchestration (client wrapper, Framer variants:
  lead → feed stagger → rail), hover states (version brightens, photo
  duotone warms), reduced-motion path.
  Verify: visual; `prefers-reduced-motion` emulation shows no transforms.
- [ ] **T8** Responsive: rail stacks under feed below 1024px; lead headline
  fluid; 390px clean.
  Verify: visual at 390, 768, 1024, 1440.
- [ ] **T9** Tests: `homepage-content.test.tsx` updated to the new SSR
  markup; render test for `FrontPage`.
  Verify: `pnpm test`.
- [ ] **T10** Gates + independent review: `pnpm typecheck && pnpm lint &&
  pnpm test && pnpm build`, then `cross-model-review`. Refresh
  `content/now.md` (draft for Bliss to approve).

## Decisions

- Front page over hero: the work is the product; the name is a byline.
- Header kept and refreshed rather than replaced (Bliss, Round 3).
- Syne + IBM Plex Sans chosen from three type systems on the canvas
  (Bliss picked T2). Space Mono kept over Martian Mono (see invariants).
- No ticker or metadata line under the header (Bliss, Round 3b).
