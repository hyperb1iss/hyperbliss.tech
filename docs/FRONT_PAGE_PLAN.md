# Front Page Redesign — Plan & Ledger

> Status: **Shipped in PR #9 (2026-09-14). Post-launch follow-ups on `nova/post-launch`.** · Branch: `nova/front-page` ·
> Worktree: `~/dev/worktrees/hyperbliss.tech/nova/front-page` ·
> Design: Round 3 on the "hyperbliss.tech Landing Directions" canvas · Updated: 2026-09-14

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
- Color carries meaning, and titles carry color. Page and story titles
  wear the cyan → lavender → pink gradient with a soft purple bloom;
  feed titles are colored by kind (essay pink, release cyan, lab
  lavender, launch purple); project names are cyan; prose h2 cyan, h3
  pink or lavender. Body copy stays steel. Earlier "pink once per
  screen" rule retired 2026-09-05 after Bliss: "most of the text is
  white now and we lost the cyber vibes".
- No captions, tickers, or marginalia (rev hashes, counts, coordinates).
- One mono face. Space Mono stays for the terminal, code, and version
  numbers. Martian Mono from the mock is dropped: a second mono for six
  version strings is not worth a font load.
- The CyanogenMod credential lives on About, not the front page.
- Deleted hero and card components are deleted, not flag-gated.

## Waves

### Wave 1 · Foundation

- [x] **T0** Plan ledger committed (this file).
- [x] **T1** Fonts: Syne + IBM Plex Sans via `next/font`, Space Mono kept.
      Files: `app/styles/fonts.ts`, `app/layout.tsx`,
      `app/styles/silkcircuit/variables.css`.
      Verify: `pnpm typecheck`; `grep -rn "font-jura\|font-exo2" app` empty.
- [x] **T2** Feed model: `app/lib/feed.ts` with `buildFeed()` merging posts,
      lab, releases, launches into `FeedItem[]`; releases carry a one-line
      summary (release name or first line of body) via `app/lib/github.ts`.
      Files: `app/lib/feed.ts`, `app/lib/github.ts`, `tests/lib/feed.test.ts`.
      Verify: `pnpm test -- tests/lib/feed.test.ts`.
- [x] **T3** Releases for every project with a GitHub URL (not the curated 4)
      in `app/(transition)/page.tsx`; in-memory + ISR caching already bounds
      this to one call per repo per hour.
      Verify: `pnpm build` with and without `GITHUB_TOKEN` renders `/`.

### Wave 2 · Front page

- [x] **T4** `app/components/front/` — `FrontPage` (server), `LeadStory`,
      `Feed`, `Rail` (who, now, shipping, elsewhere). Wired into `TerminalHome`
      in place of hero + card sections. `noscript` fallback and
      `TerminalConsole` untouched.
      Verify: `pnpm build`; `pnpm test:seo`; visual at 1440 and 390.
- [x] **T5** Delete `HeroSectionSilk`, `HomePageClient`,
      `LatestBlogPostsSilk`, `FeaturedProjectsSectionSilk`, `homeContent.ts`;
      trim `content/pages/home.json` to what the front page reads.
      Verify: `pnpm typecheck`; `pnpm test`; grep for dead imports empty.
- [x] **T6** Header refresh: nav set in Syne, logo mark calmed (no glitch
      keyframes), CyberScape config tuned (60fps target, fewer shapes, lower
      particle density, softer glow, hairline connections).
      Files: `app/components/NavLinks.tsx`, `app/components/Logo.tsx`,
      `app/cyberscape/CyberScapeConfig.ts`.
      Verify: visual; DevTools FPS on header ≥ 60.

### Wave 3 · Motion and polish

- [x] **T7** Entrance orchestration (client wrapper, Framer variants:
      lead → feed stagger → rail), hover states (version brightens, photo
      duotone warms), reduced-motion path.
      Verify: visual; `prefers-reduced-motion` emulation shows no transforms.
- [x] **T8** Responsive: rail stacks under feed below 1024px; lead headline
      fluid; 390px clean.
      Verify: visual at 390, 768, 1024, 1440.
- [x] **T9** Tests: `homepage-content.test.tsx` updated to the new SSR
      markup; render test for `FrontPage`.
      Verify: `pnpm test`.
- [x] **T10** Gates + independent review: `pnpm typecheck && pnpm lint &&
pnpm test && pnpm build`, then `cross-model-review`. Refresh
      `content/now.md` (draft for Bliss to approve).

## Decisions

- Front page over hero: the work is the product; the name is a byline.
- Header kept and refreshed rather than replaced (Bliss, Round 3).
- Syne + IBM Plex Sans chosen from three type systems on the canvas
  (Bliss picked T2). Space Mono kept over Martian Mono (see invariants).
- No ticker or metadata line under the header (Bliss, Round 3b).
- Entrance animation is CSS, not Framer: an inline `opacity:0` from a
  motion component survives hydration under reduced motion and leaves
  the page invisible. Keyframe plus `prefers-reduced-motion` has no such
  failure mode.
- Panda `styled(Component)` swallows the `as` prop, so `Reveal` takes a
  `className` instead of being wrapped by `styled()`.
- Never animate `transform` on a page-level wrapper: while the animation
  fills, the wrapper is a containing block for `position: fixed`
  descendants (Chrome reports an identity matrix even for a `to {
transform: none }` frame). Wrappers fade; rows and blocks inside lift.
- Front-page headings opt out of the global uppercase + glow heading
  rule locally. Retiring that rule site-wide is a follow-up, not this
  round (non-goal: other pages).
- `@keyframes` written inside a Panda `css` template compile to an
  empty rule. Keyframes live in `globals.css`; templates only reference
  them by name.
- Release rows link to the GitHub release page (external), not the
  project page: the row says what shipped, the link goes to the notes.
  Launch rows stay internal.

## Review history

- Round 1 (Codex, executed + traced): FAIL. 2 blockers (empty keyframes,
  nested main), 8 should-fix, 4 nits. All taken in `2cdf3f8` except the
  OG font follow-up. 30fps kept over time-based stepping for this round.
- Round 2 (Codex, executed + compiled-artifact inspection at `2cdf3f8`):
  NEEDS_CHANGES. All 10 round-1 items verified landed; two new parser
  regressions in `summarizeRelease` (descriptive titles dropped, fence
  widths ignored). Fixed in `1fd15a8` with tests.
- Round 3 (Codex, executed, narrow): NEEDS_CHANGES. Both round-2 fixes
  verified; one new edge (a fence closer with trailing text). Fixed in
  `2b96e67` with tests.
- Round 4 (Codex, executed, narrow): PASS. Eight probes on the fence
  scanner, no new findings.
- Pages wave round 1 (Codex, traced + tsc): FAIL. Blocker: the page
  wrapper's animated transform became the containing block for the
  Resume's fixed download button. Should-fix: legacy media rules
  overriding the new detail layouts on phones; Writing/Lab outline
  skipping h2. Nits: dead SparklingName, StarDivider, keyframes, author
  prop. All fixed in `d24b423`; PageLayout now fades without moving.
- Pages wave round 2 (Codex, executed + traced): PASS, no new findings.

### Wave 4 · Inner pages (2026-09-05)

- [x] **P1** Shared `PageTitle` (sentence case, lede) and `PageLayout`
      (plain wrapper, CSS entrance, no nested main). Writing, Lab, and
      Projects indexes as rows; card grids, BlogCard, ProjectList, SilkCard
      deleted. `46fa683`
- [x] **P2** Essay and project detail headers; body headings in the
      display face without gradient or glow; project route fetches the
      latest release. `b41e9c5`
- [x] **P3** About as rail + column (bio and CyanogenMod story live
      here); Resume headings calmed. `0964083`
- [x] **P4** Independent review of the pages wave (round 1 fixed in
      `d24b423`, round 2 pending).

### Ship-readiness pass (2026-09-14)

Gates green at `e30c8eb` (lint, typecheck, 320 tests, build); Playwright
sweep of all 44 sitemap routes at 1440 and 390 clean. Codex was out of
quota, so a fresh-context Claude reviewer covered the unreviewed range
`c1f4d8c..e30c8eb` (context independence only): NEEDS_CHANGES on two
counts, both confirmed and fixed here along with the smaller items.

- Rate-limited builds ranked whichever repos answered before the budget
  ran out and shipped them as the flagship trio. `pickFeatured` now needs
  majority coverage; GitHub calls share one backoff after the first hit
  and honor `GH_TOKEN` as well as `GITHUB_TOKEN`.
- The terminal handle's Framer box-shadow loop ran on every route and
  ignored reduced motion; it is a CSS keyframe now, and Escape returns
  focus to the handle.
- Heading order on Projects and Resume; project h1 accessible name; lab
  pages get an og:image (new `lab` card kind); one site description;
  nav says Writing (route stays `/blog`); CyberScape clock and energy
  clamps; `now.md` no longer says the front page is being rebuilt.
- The emoji-to-Feather `ProjectIcon` swap that sat uncommitted since
  2026-09-08 is committed as its own checkpoint.

PR #9 merged 2026-09-14 as `8a07a9c`; `GITHUB_TOKEN` is set on Netlify.

### Post-launch follow-ups (2026-09-14, branch `nova/post-launch`)

- `pnpm audit --prod` had failed CI on main since 2026-08-06 (15
  advisories). Mermaid 11.16.1 plus pnpm overrides bounded to each
  package's major clear it. Gotcha: an open-ended `js-yaml >=3.15.2`
  override resolved 5.x and broke gray-matter's `safeLoad`.
- OG cards render in Syne 700 and IBM Plex Sans 400/600 (vendored static
  woff); the site card's name drops to 84px with 6px tracking.
- Essay URLs lose the date prefix. The collection layer derives slugs
  from filenames and keeps a slug-to-file index; a next.config redirect
  308s `/blog/<date>_<slug>` to `/blog/<slug>/`. Gotcha: a bare `:slug`
  after a literal `_` compiles to exclude underscores in Next's
  path-to-regexp, so the pattern is `:slug([^/]+)`.
- `/archive/` lists the whole feed under year markers; the front page
  foot links there instead of splitting to Writing and Projects.
- Resume containers, contact rows, and skill pills replaced with the
  hairline row language; entrances moved to Reveal.
- Sidequest logged in Sibyl: retire the global uppercase heading rule.

## Open taste items

- Bliss (2026-09-05): not sure about the "squished" large display type
  (Syne 800, tracking -0.03em on the lead headline, day numerals, name).
  Knobs: weight 700/600, tracking toward 0, or a lighter numeral column.
  Play once the other pages exist so the change lands site-wide.

## Follow-ups (not this round)

- Resume still wears its glass-card chrome (bordered panels, pill
  skills, boxed contact rows). Headings are done; the containers are a
  later pass.
- Blog slugs are the filenames (`2026.04.04_terminal-renaissance`), so
  essay URLs carry the date prefix. Pre-existing; a slug field or a
  redirect map would clean the URLs.
- Terminal `help` still lists `blog`; nav says Blog while the index page
  is titled Writing. Pick one word.
- GitHub calls per hour are now up to 48 (24 releases + 24 repo stats)
  plus the events feed; fine with a token, tight without one.
- The terminal's manifest and broadcast now ship with every route's
  layout payload. It is small (bodies load lazily), but worth a look at
  the RSC payload size if the content corpus grows.
- CyberScape steps per frame, not per elapsed time, so a 60fps budget
  doubles every speed. Make the update loop time-based, then raise
  `targetFPS` to 60 (the plan's original motion target).
- Deploy env needs `GITHUB_TOKEN`; without it 24 repos consume 40% of
  the unauthenticated hourly budget per revalidation. Rate-limit
  responses are logged and uncached, but a token is the real fix.
- Global `h1..h6` uppercase + text-shadow rule; the other pages still
  inherit it.
- A unified archive route for the feed ("Older →" currently splits to
  /blog and /projects).
- `now.md` copy is a draft; Bliss to approve or rewrite.
