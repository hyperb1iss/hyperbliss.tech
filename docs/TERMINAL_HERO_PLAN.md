# 🖥️ Terminal-First Homepage — Implementation Plan

> Status: **BUILT — flag-gated, awaiting ship toggle** · Owner: Stefanie Jane · Updated: 2026-05-31
> Decision record: Sibyl `decision_5badabc910c3` · Engine facts: `claim_d06912f0c6b5` · Architecture: `idea_501cd92cc30d`
> Review log: see §11.
>
> **Progress:** P0 ✅ de-risk · P1 ✅ spine (SEO/a11y verified, review passed) ·
> P2 ✅ real just-bash shell (lazy FS, conflict table, session) · P3 ✅ cinematic
> (boot, auto-neofetch, single backdrop + CRT) · P4 ✅ delight (⌘K palette, share
> URLs, ssh/sudo/theme/matrix eggs). Both adversarial reviews PASS. 187 tests
> green; `pnpm build` green (44 pages); just-bash async chunk 365KB gzip.
> Verified live: boot, neofetch, real shell, mobile, a11y (axe 0), palette.
> **Remaining (human call): the §6 ship toggle** — set
> `NEXT_PUBLIC_TERMINAL_HERO=true` in the deploy env (or remove the flag) to make
> the terminal the live homepage. just-bash facts: `claim_dc349dd3d194`.
> Deferred YAGNI: T3.4 sound, T4.4 xterm modal, a full interactive game,
> `.secrets/` eggs.

## 1. Vision

The hyperbliss.tech homepage **boots into a real, interactive terminal**. It is the
hero. Visitors can type — `help`, `neofetch`, `projects`, `ls projects | grep rust`,
`cat blog/how-i-ai.md` — and actually explore everything Stefanie is building, writing,
and shipping. The terminal is the broadcast tower: it announces _everything I'm doing_,
and stays fresh automatically because it reads the existing content tree.

It must feel **SICK** (SilkCircuit neon, glow, a cinematic boot) while degrading
gracefully: real crawlable HTML underneath, tap-navigable on mobile, fully keyboard- and
screen-reader-operable, and respectful of `prefers-reduced-motion`.

### The thesis command

`neofetch` (auto-run on first boot) paints an ASCII sigil + a live stat panel — current
focus, latest ship, latest post, repo/star counts. That single screen is the "announce
everything" pitch and the most screenshot-shareable artifact on the site.

## 2. Success Criteria (measurable)

- **Interactive:** `help`, `neofetch`, `about`, `projects`, `blog`, `now`, `clear`, plus
  real shell `ls`/`cat`/`grep`/pipes work. `↑`/`↓` history, `Tab` completion, "did you
  mean" all function.
- **SEO:** a new homepage-HTML test asserts the rendered `/` markup contains all real
  content (project titles, post titles, about prose, social links) as crawlable text — not
  an empty terminal mount. Existing `pnpm test:seo` stays green.
- **Mobile:** fully navigable via clickable command chips _without_ the soft keyboard;
  clean layout at 390px.
- **a11y:** keyboard-only operation end to end; output announced via an ARIA live region;
  `prefers-reduced-motion` disables boot/blink/scanlines; axe reports no serious
  violations on `/`.
- **Performance:** just-bash ships in an **async chunk** (proven by inspecting the real
  Next build output, not a `/tmp` esbuild); initial route JS grows within the P0 budget;
  Lighthouse Performance ≥ current; boot animation holds 60fps; **one** particle backdrop
  on mobile.
- **Resilience:** if the just-bash chunk fails to load, native commands still work and a
  shell command prints a friendly retryable error.
- **Build/quality:** `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all green.

## 3. Non-Goals

- ❌ No WebContainers / server-side bash / v86 (rejected: COOP/COEP breakage, licensing,
  RCE surface, boot time, mobile — see decision record).
- ❌ No arbitrary code execution: just-bash runs `python:false`, `javascript:false`, network **off**.
- ❌ Not replacing the deep routes (`/about`, `/projects`, `/blog`, `/lab`, `/resume`) —
  the terminal _links into_ them.
- ❌ No writable persistence of visitor input server-side; no analytics on raw typed input (§5.11).

## 4. Constraints (grounded in the codebase)

- **Stack:** Next 16.2 (App Router, Turbopack), React 19.2, Framer Motion 12, Panda CSS
  1.10 (zero-runtime `styled-system/`), TypeScript 6, **pnpm 11.5.0**
  (`packageManager` pin moved 10.33→11.5 mid-session — repo is actively shared; re-check before edits).
- **Testing:** Vitest 4 + Testing Library + jsdom + Playwright. Tests in `tests/`, setup
  `tests/setup.ts`, CyberScape mocked (`tests/mocks/CyberScape.ts`). _(Project CLAUDE.md
  says Jest — it's Vitest; docs fix queued.)_
- **No COOP/COEP today** (`next.config.mjs`) — keep it; just-bash needs nothing.
- **Fonts:** Jura (`--font-jura`), Exo 2 (`--font-exo2`), Space Mono (`--font-space-mono`).
  Terminal uses **Space Mono**.
- **Tokens:** `app/styles/silkcircuit/variables.css` — `--silk-quantum-purple #a259ff`,
  `--silk-plasma-pink #ff75d8`, `--silk-circuit-cyan #00fff0`, `--silk-void-black #0a0a14`,
  `--silk-success #10b981` (boot `[OK]`), `--surface-glass`, `--text-*`, `--border-*`.
- **just-bash API (verified from README):** `const bash = new Bash({ fs, cwd, env, python:false, javascript:false })`;
  `await bash.exec(line, { cwd, env, signal })`. **Each `exec()` resets cwd/env/functions;
  the filesystem is shared across calls.** Supports `customCommands` (participate in pipes)
  and an `AbortSignal`. → our wrapper owns session state (see §5.4).
- **Layout chain:** `app/layout.tsx` → `app/(transition)/layout.tsx` (`PageLoadProvider` →
  `HeaderProvider` → `ClientComponents` + `Header` + `HyperspaceLoader` + `GlobalLayout`).
- **Two particle systems exist today:** `Header.tsx` lazy-loads `app/cyberscape/CyberScape`
  via `requestIdleCallback`; `HeroSectionSilk.tsx` runs its _own_ separate canvas. The new
  hero must consolidate to **one backdrop owner** (§5.9).
- **Content API** (`app/lib/content.ts`): `getAll{Posts,Projects,Lab}`, `getPage`,
  `getSiteConfig` — filesystem markdown/JSON. Raw corpus is ~205KB and grows (drives §5.5).
- **GitHub releases** (`app/lib/github.ts`): `getReleasesForProjects()` → `{version,
  publishedAt, url}`, in-memory cache 1h + ISR `revalidate:3600`, uses `GITHUB_TOKEN`.
  Unauthenticated GitHub = 60 req/hr; 24 repos × routes can exhaust it (§5.10).
- **Multi-agent repo:** scope edits narrowly; prefer new files; build on a branch; flag-gate.

## 5. Architecture

Layered, so it's a _real_ terminal **and** every command can be a designed moment.

```
┌─────────────────────────────────────────────────────────────────┐
│ app/(transition)/page.tsx  (SERVER)                               │
│  • fetch content + curated release(s)  • build FS MANIFEST (small)│
│  • build broadcast data                • render SSR fallback HTML  │
└───────────────┬───────────────────────────────────────┬──────────┘
                │ props (manifest, broadcast)             │ SSR HTML (crawlable)
                ▼                                         ▼
┌──────────────────────────────────────────┐   ┌────────────────────┐
│ TerminalHero (CLIENT, dynamic ssr:false)   │   │ SSR sections below: │
│  ┌────────────────────────────────────┐   │   │  • Projects grid    │
│  │ Terminal renderer (custom DOM)      │   │   │  • Latest posts     │
│  │  output(React nodes) · input · glow │   │   │  • About teaser     │
│  └───────────────┬────────────────────┘   │   │ (existing Silk      │
│   parser → executor → ctx                  │   │  components reused) │
│   ┌─────────┴──────────┐                   │   │ = crawlable + no-JS │
│  native (rich React)   shell (lazy)         │   │   + mobile path     │
│  neofetch/projects  → just-bash + session   │   └────────────────────┘
│  /blog/now/about    over manifest+lazy FS   │
└────────────────────────────────────────────┘
        backdrop: ONE owner — CyberScape behind glass (P3)
```

### 5.1 SSR content layer (server) — `app/(transition)/page.tsx`

A server component (already fetches content in parallel). Extend to:

- Fetch only a **curated handful** of "currently shipping" releases for the broadcast (not
  all 24 repos — §5.10).
- Build the **FS manifest** (small): paths + titles + summaries + metadata, NOT full
  bodies (§5.5).
- Build the **broadcast object**: `{ now, latestShip, latestPost, projectCount, … }`.
- Render the **SSR fallback sections** (real HTML) so crawlers/mobile/no-JS get everything.
  These must be visible/styled without JS (no `display:none` that JS later reveals).

### 5.2 Terminal renderer (client) — `app/components/terminal/Terminal.tsx`

Custom DOM terminal (NOT xterm.js — its 16-slot ANSI theme can't do neon glow, gradients,
Orbitron-class type, or render React cards, and it fights mobile; xterm is for full PTY/
curses emulation we don't need). We get:

- Append-only **output log**: each entry is `string | ReactNode`. **All output is rendered
  as React text nodes / typed components — never `dangerouslySetInnerHTML`** (§5.3 security).
- **Input line**: a real focusable `<input>` with a styled glowing caret.
- Click-to-focus; visible focus ring; auto-scroll on new output.
- Theming via SilkCircuit tokens + Space Mono; output styled by stream (stdout/stderr/ok).

### 5.3 Command system + security — `app/components/terminal/{registry,parser,executor}.ts`

- **Registry:** `Command = { name, aliases?, summary, usage?, hidden?, run(args, ctx) }`.
- **Precedence (resolved):** exact match on a **native** command name/alias → native
  handler; else → hand the whole line to just-bash. **Escapes are app-parser sentinels,
  stripped before just-bash ever sees the line** (do NOT use `\` — bash treats it as an
  escape/continuation — nor `sh -c`/`bash -c`, which may not exist inside just-bash): a
  leading `!` **forces shell**, a leading `:` **forces native**. The parser removes the
  sentinel and sets a force flag. `help` documents this.
- **Conflict table (native wins; shell reachable via escape):**

  | Token | Resolves to | Notes |
  |---|---|---|
  | `help`, `clear`, `history`, `theme` | native | UI/meta commands |
  | `neofetch`, `projects`, `blog`, `lab`, `now`, `about`, `contact`, `resume` | native (rich React) | designed output |
  | `ls`, `cat`, `grep`, `pwd`, `cd`, `echo`, `find`, `head`, `tail`, `wc`, `env`, `which` | **shell** (just-bash) | real coreutils over the FS |

  Text-producing "native" commands that should compose in pipes (e.g. a plain `now`) may
  alternatively be registered as just-bash `customCommands` so `now | grep sibyl` works.
  Every row above gets a collision test.
- **Executor:** dispatch, capture output → log, unknown → fuzzy "did you mean `<nearest>`?".
  Streams async output via `ctx.print`.
- **Security (blocker-class, do first — see T-SEC):** output is React text by default; if
  ANSI styling is supported, parse via a **whitelist** SGR→token mapper that emits styled
  `<span>`s (never HTML). Markdown shown in-terminal renders as plain text or via the
  existing sanitized `MarkdownRenderer` (rehype-sanitize) — not raw HTML. Hostile-input
  tests: `echo "<img src=x onerror=alert(1)>"`, `cat` of a body containing `<script>`,
  ANSI escape injection — all must render inert.
- **ctx:** `{ manifest, fs, navigate, print, clear, setTheme, history, broadcast }` —
  handlers read from ctx (testable), never import data directly.

### 5.4 just-bash engine (lazy + session) — `app/components/terminal/shell.ts`

- **Dynamic `import('just-bash')`** on first shell command (idle-prefetch optional) → async chunk.
- One `Bash` instance with the FS, `python:false`, `javascript:false`, network off,
  iteration/recursion limits.
- **Session state in the wrapper** (just-bash resets per `exec`): a whole typed line runs
  in **one** `exec()`, so `cd`, `export`, and compound forms (`cd x && pwd`, `(cd x)`,
  `cd a | cat`) behave correctly _within_ that call. To carry cwd/env to the **next** line,
  capture **`result.env`** (verified P0: carries final `PWD`/`OLDPWD`/exports) and re-feed it
  as the next `exec`'s `{ env: sessionEnv, cwd: sessionEnv.PWD, replaceEnv: true }`, then set
  `sessionEnv = result.env`. (U4 ✅ — `getCwd()`/`getEnv()` reflect instance base state, not
  post-exec; use `result.env`.) **Do NOT JS-parse `cd` out of a compound line** — that is wrong
  for subshells, pipes, `&&`/`||`. FS is shared and effectively read-only for visitors.
- **Chunk-load failure** → catch the dynamic import; native commands keep working; shell
  commands print `shell unavailable — tap to retry` (re-attempts the import).

### 5.5 Virtual FS — manifest + lazy bodies (no truncation)

Shipping all bodies as props would duplicate ~205KB+ into the RSC/HTML payload _and_
truncating bodies would nerf `cat`/`grep`. Instead:

- **Initial payload = manifest only:** for each path, `{ title, summary, tags, date,
  href, bytes }`. Powers native commands, `neofetch`, `ls`, tab-completion. Small.
- **Full bodies = lazy:** on first `cat`/`grep`/shell access of a file, fetch its body
  from a static per-file JSON chunk or a `GET /api/fs?path=…` route, then mount it into the
  just-bash FS and **cache client-side**. `grep -r` triggers a batched fetch of the
  matching subtree. No body is truncated; it's just loaded on demand.
- **Correctness (the lazy-FS trap):** the **manifest is the authoritative file tree** —
  every path is known up front, before any body loads. Recursive/global operations
  (`grep -r`, `ls -R`, `*` globs, `wc` over a set) **pre-materialize the matching subtree
  from the manifest** before handing off to just-bash, so they can never silently miss an
  unfetched file. Single-file ops fetch that one file. Concurrent fetches dedupe; aborts,
  404s, and stale-cache/version mismatches are handled explicitly (tests in T2.3).

```
/
├── about.md  now.md  resume.md
├── projects/<slug>.md   (24)
├── blog/<slug>.md       (6)
├── lab/<slug>.md
└── .secrets/            (easter eggs; ls -a to discover)
```

### 5.6 Boot — single state machine — `app/components/terminal/bootState.ts`

One source of truth (no competing flags). Inputs: first-ever visit
(`localStorage('hb:term:v1')`, behind a safe try/catch wrapper for private mode),
`prefers-reduced-motion`, and the existing `PageLoadProvider.isInitialLoad`. Output: one of
`pending | full-boot | skip-to-end`. **`pending` is the SSR / pre-hydration state**: render
a deterministic, animation-free skeleton; only resolve to `full-boot` or `skip-to-end`
**after** the client reads storage + `prefers-reduced-motion` (no hydration flash, no
animating before reduced-motion is known). **Reduced-motion or repeat visit ⇒
`skip-to-end`** (banner + `neofetch` already printed). Full boot is skippable
(any key/click/tap). The machine — not scattered `if`s — decides, and it
**supersedes/reconciles** `PageLoadProvider`'s eager `isInitialLoad=true` default through
shared safe-storage wrappers, so localStorage and sessionStorage can't disagree. Hydration
tests cover the `pending → resolved` transition.

### 5.7 Discoverability & input affordances

- Self-typing hint: `try 'help' · or tap a command ▍`.
- **Clickable command chips** below the terminal (`help` `projects` `blog` `now` `contact`
  `ssh`) — execute on click. **Primary mobile navigation.**
- `↑`/`↓` history (localStorage), `Tab` completion (commands → args → FS paths via
  manifest then bash FS), fuzzy "did you mean".

### 5.8 a11y / SEO / mobile (mandatory)

- Output container `role="log"` `aria-live="polite"`; input has a real `<label>`.
- Chips are `<button>`s; full keyboard operation; focus visible at 200% zoom.
- `<noscript>` block + the SSR sections give crawlers/no-JS the full content, visible
  without JS.
- **New SEO proof:** a test that renders `/` to HTML (or curls the built route) and asserts
  project/post/about text is present (Q4). `prefers-reduced-motion` collapses
  boot/blink/scanlines to static. Terminal must **not** trap page scroll.

### 5.9 Visual juice + single backdrop (P3)

- **One backdrop owner.** Consolidate to a single particle system behind the terminal:
  reuse the existing CyberScape (Header-owned) or a single hero-owned instance, and
  **remove `HeroSectionSilk`'s separate canvas** when that component is retired. Never run
  two. Measure mobile FPS with the one system; add a teardown-on-unmount test.
- CRT layer: subtle bloom (layered `text-shadow`, intensity 0.5–1.0) + faint scanlines.
  **No** screen curvature, **no** constant flicker. Glass panel (`backdrop-filter: blur`)
  over the backdrop. An effects toggle + reduced-motion both disable shaders.
- Sound: opt-in, off by default.

### 5.10 Data freshness + GitHub budget

- Build-time + ISR. The broadcast fetches only a **curated few** "currently shipping"
  repos (a `now`-list), not all 24 — keeps GitHub calls tiny.
- **`GITHUB_TOKEN` documented as required** for build headroom; dedupe/share the
  `github.ts` cache across homepage + projects routes; design an **empty latest-ship
  fallback** (broadcast still renders if the API is down/rate-limited).
- `now.md` is a content file Stefanie edits. Counts computed at build.

### 5.11 Analytics & privacy

- Track **command categories** and **chip clicks** (e.g. `cmd:projects`, `chip:now`) — never
  the raw typed string (could contain anything a visitor types). Document this policy.

## 6. Rollout / Safety

- Build on a feature branch off `dev`. Gate behind `NEXT_PUBLIC_TERMINAL_HERO` so the
  current homepage stays the fallback until P1 is solid; **remove the flag on ship**
  (explicit, tracked — not a permanent toggle). Each phase ships something verifiable.

## 7. Resolved Decisions & Remaining Unknowns

Resolved (this round): **Q2 just-bash API** — verified stateless-per-exec + shared FS;
wrapper owns session (§5.4). **Q3 precedence** — native-wins + conflict table + `!`/`:` parser-sentinel
escapes (§5.3). **Q4 SSR** — prove via homepage-HTML test (§5.8). **Q5 backdrop** — single
owner, retire Hero canvas (§5.9). **Q6 scroll/focus** — intercept `↑`/`↓`/keys only when
the input is focused and the caret is in the line; otherwise the page scrolls normally.
**Q7 payload** — manifest + lazy bodies, no truncation (§5.5).

~~Remaining unknowns for **P0** to close:~~ **ALL CLOSED 2026-05-31 (see T0.1/T0.2 + §11 round 4).**
- **U1 — async-chunk size** ✅ ~298KB gzipped core, single file, no wasm; lazy → no
  initial-JS impact. Async-ness proven in real build at T2.6.
- **U2 — ANSI in output?** ✅ **No** — plain text. SGR whitelist parser descoped.
- **U3 — lazy-FS transport** ✅ **`GET /api/fs?path=…` route** + client cache; manifest is
  authoritative tree, recursive ops pre-materialize the subtree (§5.5).
- **U4 — `exec()` final-state exposure** ✅ `result.env` carries final PWD/OLDPWD/exports;
  wrapper re-feeds it as next `exec`'s `{env, cwd, replaceEnv:true}`. Full compound/subshell
  `cd`/`export` support, **no JS-parsing of `cd`**.

## 8. Phased Task Plan

Verify abbreviations: `tc`=`pnpm typecheck`, `lint`=`pnpm lint`, `test`=`pnpm test`,
`build`=`pnpm build`, `seo`=`pnpm test:seo`, `visual`=agent-browser (desktop+mobile),
`bundle`=inspect real Next build output / async chunks (NOT the mutating `pnpm analyze`
script — it runs `pnpm add` and rewrites `next.config.mjs`; wire `@next/bundle-analyzer`
(already a devDep) behind `ANALYZE=true` idempotently, or read `.next` chunk sizes).
Every phase ends green on `tc`+`lint`+`test`.

### Phase 0 — De-risk & Decide  _(hard gate)_ ✅ CLOSED 2026-05-31

- [x] **T0.1 Browser proof + real chunk measure.** Spiked just-bash in a throwaway dir.
  **Findings:** `just-bash/browser` = single self-contained `dist/bundle/browser.js`,
  1.07MB raw / **~298KB gzipped**, **zero wasm refs** when `python:false,javascript:false`
  (cpython/sqlite/quickjs are separate chunks, not pulled in). `exec()` returns
  `{stdout,stderr,exitCode,env}`; **session carried via `result.env` (PWD/OLDPWD/exports)**
  — instance does NOT persist cwd across calls, but `result.env` does. Verified compound
  (`cd x && pwd`→`/projects`), subshell isolation (`(cd x); pwd`→`/`), relative `cd`,
  `export` persistence, `grep -r` over mounted FS, globs, pipes, `customCommands` in pipes,
  `writeFile`→`grep` (lazy-mount). **No ANSI/SGR in output** (U2 negative). Async-chunk
  proof deferred to real build at T2.6 (more representative than a throwaway fixture).
  Closed U1/U2/U4. Facts → Sibyl `claim_dc349dd3d194`, §4/§5.4/§5.5/§7. **Depends:** —
- [x] **T0.2 Lock decisions.** Bundle: ~298KB gzipped lazy chunk (acceptable; async, no
  initial-JS impact). Lazy-FS transport (U3): **`GET /api/fs?path=…` route** (single source
  of truth = `content/`, client-cached, manifest pre-materializes subtrees) over static
  per-file JSON (avoids duplicating ~205KB into the build). ANSI whitelist parser
  **descoped** (U2 negative). Conflict table unchanged (§5.3). **Depends:** T0.1

### Phase 1 — The Spine (curated DOM terminal + SSR layout)  _flag: `NEXT_PUBLIC_TERMINAL_HERO`_

**Wave 1 — foundation** _(parallel)_
- [ ] **T1.1 Types + registry scaffold** (each command group **self-registers** in its own
  file so Wave 3 is truly parallel). **Files:** `terminal/types.ts`, `registry.ts`.
  **Verify:** `tc`. **Depends:** T0.2 **Parallel:** yes
- [ ] **T1.2 Manifest + broadcast builders (server).** **Files:** `app/lib/terminal/
  buildManifest.ts`, `buildBroadcast.ts`, `tests/terminal/buildManifest.test.ts`.
  **Verify:** `test` (manifest shape, no full bodies, path mapping), `tc`. **Depends:** T0.2
  **Parallel:** yes
- [ ] **T-SEC Security policy + harness** (output-render policy, ANSI whitelist scaffold,
  hostile-content tests). **Files:** `terminal/render.tsx`, `ansi.ts`,
  `tests/terminal/security.test.tsx`. **Verify:** `test` (XSS payloads render inert).
  **Depends:** T0.2 **Parallel:** yes

**Wave 2 — core** _(depends Wave 1)_
- [ ] **T1.3 Terminal renderer** (output log of React nodes, input, glowing caret, focus,
  autoscroll). **Files:** `Terminal.tsx`, styles, `tests/terminal/Terminal.test.tsx`.
  **Verify:** `test`, `visual`. **Depends:** T1.1, T-SEC
- [ ] **T1.4 Parser + executor + ctx** (dispatch, parser-sentinel escapes `!`/`:`, unknown→"did you mean").
  **Files:** `parser.ts`, `executor.ts`, `context.ts`, tests. **Verify:** `test`.
  **Depends:** T1.1
- [ ] **T1.5 History + completion** (`↑`/`↓` localStorage; prefix completion over
  commands+manifest). **Files:** `history.ts`, `complete.ts`, tests. **Verify:** `test`.
  **Depends:** T1.2, T1.3, T1.4

**Wave 3 — commands** _(parallel; each self-registers)_
- [ ] **T1.6 Native A (text):** `help` (incl. precedence/escape docs), `clear`, `about`,
  `contact`/`social`, `resume`. **Verify:** `test`. **Depends:** T1.4 **Parallel:** yes
- [ ] **T1.7 Native B (rich React):** `projects`, `blog`, `lab`, `now`. **Verify:** `test`,
  `visual`. **Depends:** T1.4 **Parallel:** yes
- [ ] **T1.8 `neofetch`** + ASCII sigil + broadcast panel (money shot). **Verify:** `test`,
  `visual`. **Depends:** T1.2, T1.4 **Parallel:** yes

**Wave 4 — integration**
- [ ] **T1.9 Terminal-first page composition.** Restructure `page.tsx` + `HomePageClient`;
  terminal is hero (`dynamic ssr:false` over a stable skeleton); reuse
  `FeaturedProjectsSectionSilk`/`LatestBlogPostsSilk` + About teaser as SSR sections;
  chips + hint; behind flag. **Files:** `page.tsx`, `HomePageClient.tsx`,
  `TerminalHero.tsx`, `CommandChips.tsx`. **Verify:** `visual`, `build`. **Depends:** T1.6–T1.8
- [ ] **T1.10 SEO/no-JS proof.** Homepage-HTML test asserts content present; fallback
  visible without JS. **Files:** `tests/seo/homepage-content.test.ts`. **Verify:** `seo`+new test.
  **Depends:** T1.9
- [ ] **T1.11 a11y baseline** (aria-live log, labeled input, button chips, focus ring,
  `<noscript>`, reduced-motion skip, no scroll-trap). **Verify:** Playwright+axe, keyboard
  manual. **Depends:** T1.9
- [ ] **T1.12 Mobile pass** (chips-first, soft keyboard, 390px). **Verify:** `visual` mobile.
  **Depends:** T1.9
- [ ] **T1.13 Empty/loading/error states** (no releases, missing `now.md`, empty content,
  shell-loading). **Verify:** `test`, `visual`. **Depends:** T1.9
- [ ] **T1.14 Analytics policy** (categories/chips only, never raw input — §5.11).
  **Verify:** `test` (no raw input in events). **Depends:** T1.9
- [ ] **🔍 Cross-model review of P1** (full ceremony); iterate to green. **Depends:** T1.9–T1.14

### Phase 2 — Real Shell (just-bash)

- [ ] **T2.1 Shell engine wrapper** (lazy import, session state §5.4, safe config,
  chunk-load failure handling). **Files:** `shell.ts`, `tests/terminal/shell.test.ts`.
  **Verify:** `test` (`ls /`, `cat about.md`, `cd`+`ls` via session, `echo x | cat`,
  import-failure path), `tc`. **Depends:** T0.2, T1.4
- [ ] **T2.2 Route shell into executor** with §5.3 precedence + conflict-table tests
  (every row) + parser-sentinel escapes (`!`/`:` stripped pre-dispatch — never `\`/`sh -c`).
  **Verify:** `test`. **Depends:** T2.1, T-SEC
- [ ] **T2.3 Lazy-FS transport + recursive correctness** (U3): per-file fetch + client
  cache + **manifest-driven subtree pre-materialization** for `grep -r`/globs/`ls -R`.
  **Files:** `fsClient.ts` (+ `app/api/fs/route.ts` if chosen), tests. **Verify:** `test`
  (cold `grep -r` finds all matches, glob, pipe, `wc`, concurrent-fetch dedupe, abort, 404,
  stale-cache/version mismatch). **Depends:** T2.1, T1.2
- [ ] **T2.4 Render shell output** (stdout/stderr/exit-code styling; ANSI via whitelist if
  U2 positive). **Verify:** `test`, `visual`. **Depends:** T2.2, T-SEC
- [ ] **T2.5 FS-path completion** via bash FS. **Verify:** `test`. **Depends:** T2.1, T1.5
- [x] **T2.6 Bundle gate** ✅ Real `next build` (isolated worktree) confirms just-bash
  lands in a dedicated async chunk (`07l3zj480dvrz.js`, **365KB gzip**) loaded lazily via
  the Turbopack dynamic-import loader (`Promise.all(["…07l3zj480dvrz.js"])`); it appears in
  **no route's initial chunk list**, so initial route JS is unaffected. `pnpm build` green
  (44 pages). **Depends:** T2.2, T2.4
- [ ] **🔍 Cross-model review of P2** (full ceremony). **Depends:** T2.1–T2.6

### Phase 3 — Cinematic

- [ ] **T3.1 Boot state machine + sequence** (BIOS/POST + typewriter), §5.6, skippable,
  reduced-motion, safe-storage. **Files:** `bootState.ts`, `TerminalBoot.tsx`, gate test.
  **Verify:** `visual`, `test`. **Depends:** T1.9
- [ ] **T3.2 Auto-run `neofetch`** post-boot. **Verify:** `visual`. **Depends:** T3.1, T1.8
- [ ] **T3.3 Single backdrop + CRT** (consolidate to one particle owner, retire Hero
  canvas, bloom + scanlines, glass, effects toggle, FPS measure, teardown test).
  **Files:** styles, `EffectsToggle.tsx`, backdrop wiring. **Verify:** `visual`, FPS,
  reduced-motion off, `test`. **Depends:** T1.9
- [ ] **T3.4 Sound** (opt-in, off by default). **Verify:** manual. _(YAGNI — defer if weak.)_

### Phase 4 — Delight & Share

- [ ] **T4.1 ⌘K command palette** (fuzzy + grouped + ARIA combobox/listbox). **Verify:**
  `test`, axe. **Depends:** T1.6
- [ ] **T4.2 Shareable session URLs** (`/#neofetch;projects;now` encode + replay).
  **Verify:** `test` (encode/decode), manual replay. **Depends:** T1.4
- [ ] **T4.3 Easter eggs** (`ssh hyperbliss.tech` banner, `sudo`, `theme <name>`, a game).
  **Verify:** `test`/`visual`. **Depends:** T1.4
- [ ] **T4.4 (optional) xterm.js real-shell modal** — only if future curses/full-terminal
  scope appears. **YAGNI: defer.**

## 9. Verification Strategy

- **Unit (Vitest):** parser, executor, escapes, fuzzy, history, completion, manifest
  builder, shell session (`cd` persistence via wrapper), lazy-FS, session encode/decode.
- **Security:** hostile-content suite (XSS/ANSI/markdown) renders inert; just-bash stays
  sandboxed (python/js/network off asserted).
- **Component (Testing Library):** renders/echoes; rich commands render cards/lists; chips
  dispatch; a11y roles present.
- **a11y (Playwright + axe):** no serious violations on `/`; keyboard-only walkthrough.
- **SEO:** new homepage-HTML content test + existing `test:seo`.
- **Visual (agent-browser):** desktop+mobile at each integration gate; `neofetch` reviewed.
- **Bundle:** non-mutating async-chunk check.
- **Resilience:** chunk-load-failure path; empty-release/missing-`now` fallbacks.
- **Cross-model review:** full ceremony after P1 and P2; standard thereafter (trust gradient).

## 10. Estimated Shape

~30 tasks across 5 phases. P0 is a hard gate (real browser proof, not a `/tmp` number).
P1 is a shippable curated terminal behind a flag, SSR-safe and accessible. P2 makes it a
genuine shell. P3/P4 are juice and delight, independently shippable. Command groups
self-register so Wave 3 parallelizes cleanly.

## 11. Cross-Model Review Log

**Round 1 — Codex `gpt-5.5`, reasoning xhigh (2026-05-31). Verdict: NEEDS REVISION.**
Confirmed direction (custom DOM over xterm.js is right for a branded content terminal).
Findings + resolution:

1. _(blocker §5.4)_ just-bash `exec()` is stateless per call → **verified from README**;
   resolved via wrapper-owned session (§5.4), not an architecture blocker.
2. _(blocker §5.2/5.3)_ XSS underspecified → added security policy + harness **T-SEC**
   (React text nodes, ANSI whitelist, no `dangerouslySetInnerHTML`, hostile-content tests).
3. _(major §5.5)_ FS-as-props bloats payload; truncation nerfs `grep`/`cat` → **manifest +
   lazy bodies, no truncation** (§5.5, T2.3).
4. _(major §5.1)_ SSR fallback unproven → **homepage-HTML SEO test** + no-JS visibility
   (§5.8, T1.10).
5. _(major §7)_ `/tmp` esbuild ≠ Next chunking; `pnpm analyze` mutates config + runs
   `pnpm add` → **real Next dynamic-import fixture** in T0.1 + **non-mutating bundle**
   verify (§8). _(Verified the analyze script mutates next.config.mjs and installs.)_
6. _(major §5.3)_ native/bash collisions → **conflict table + `!`/`:` parser-sentinel escapes + per-row
   tests** (§5.3, T2.2).
7. _(major §5.9)_ CyberScape under-scoped → **verified two systems exist**; single backdrop
   owner, retire Hero canvas, FPS + teardown (§5.9, T3.3).
8. _(major §5.10)_ GitHub rate budget → curated-few fetch, `GITHUB_TOKEN` required, shared
   cache, empty fallback (§5.10).
9. _(major §5.6)_ boot-flag disagreement → **single boot state machine** (§5.6, T3.1).
10. _(minor §8)_ DAG/parallelism → fixed deps (T1.5←T1.2/3/4; T2.6←T2.2/2.4); command
    groups self-register so Wave 3 is genuinely parallel.

Missing tasks added: T-SEC (security), T2.1 chunk-failure handling, T1.14 analytics policy,
T1.13 empty/loading/error states, T1.10 no-JS/mobile SEO proof. Fact fixes: **pnpm 11.5.0**.

**Round 2 — Codex `gpt-5.5`, xhigh (2026-05-31). Verdict: NEEDS REVISION (much stronger).**
6/10 round-1 findings RESOLVED; 4 PARTIAL. Codex confirmed **"P0 is ready to build"** as a
de-risk phase. Four new findings, all folded into this revision:

1. _(blocker §5.5/T2.3)_ cold `grep -r` could miss unfetched bodies → **manifest is the
   authoritative tree; recursive ops pre-materialize the subtree** + correctness tests.
2. _(major §5.4/T2.1)_ JS `cd` interception breaks on compound/subshell/pipe lines →
   **capture final cwd/env after the single `exec()`** (whole line runs in one exec); U4
   added to prove final-state exposure in P0; never JS-parse `cd`.
3. _(major §5.6/T3.1)_ boot machine lacked SSR/pre-hydration modeling → **added `pending`
   state + deterministic SSR skeleton + reconcile with `PageLoadProvider`** + hydration tests.
4. _(major §5.3)_ `\`/`sh -c` escapes unsafe → **app-parser sentinels `!`/`:` stripped
   before dispatch**; `sh -c` only if P0 proves it exists.

**Round 3 — Codex `gpt-5.5`, xhigh (2026-05-31). Verdict: PASS WITH CONCERNS → resolved.**
All three substantive round-2 findings RESOLVED (lazy-FS authority §5.5, no-JS-`cd` + U4
§5.4, boot `pending` state §5.6). One doc-consistency nit — stale `\` escape references in
§7/T1.4 — **fixed in this revision** (`!`/`:` everywhere now). **Build-readiness: P0 — start
immediately; P1 — proceed once P0 closes U1–U4.** Plan converged after 3 adversarial rounds.
