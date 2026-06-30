# 🔮 WebMCP — Agent-Ready Terminal Plan

> Status: **REVIEWED — v1 (P0–P2) build-ready; 4 Codex rounds → PASS** · Owner: Stefanie Jane · Updated: 2026-06-05
> Builds on: Terminal-First Homepage (`docs/TERMINAL_HERO_PLAN.md`, BUILT/flag-gated) ·
> Decision record: Sibyl `decision_5badabc910c3` · WebMCP API facts: `error_pattern_54536340cf9e`
> Source receipts: see §11 · Review log: see §12.
>
> **Thesis:** the homepage terminal is already a command surface humans type into.
> WebMCP exposes that _same_ surface to a browser-side AI agent — same data, same
> actions, one codebase — so an agent can read the site and drive it while the human
> watches. This is the exact "human + agent share one interface" scenario WebMCP was
> designed for, and it's a genuine early-adopter flex.
>
> **v1 scope (deliberately bounded after Round 1):** read tools + `navigate` + `set_theme`.
> The cinematic "agent runs a command in your live terminal" (`run_shell`) is a **gated P3
> stretch** with explicit prerequisites (§5.4) — not v1 — because it carries a shared-session
> race, history-pollution, and capture-fidelity problems that the read/action tools don't.

## 1. Vision

A visitor running a WebMCP-capable browser (local Chrome flag today, Chrome 149 origin-trial
path per current Chrome docs) lands on hyperbliss.tech and their in-browser agent **discovers a
toolbox the site published about itself** via `document.modelContext.getTools()`: list the
projects, read a post, ask what
Stefanie is shipping now, navigate to a deep route, switch the theme. The agent doesn't
scrape the DOM or guess what a button does — the page _tells_ it, in structured tools backed
by the same `Manifest`/`Broadcast` data the terminal already renders.

The signature moment (a **P3 stretch**, §5.4): the agent calls `run_shell("neofetch")`, the
command animates into the human's visible terminal attributed to the agent, renders for the
human, and returns its text to the agent. One surface, two operators, shared context.

It must **degrade to nothing**: where the WebMCP API is absent (every browser but recent
Chrome with the trial/flag), the bridge no-ops and the site is byte-for-byte what it is
today. No new heavy bundle, no SSR change, no regression.

## 2. Success Criteria (measurable)

- **Discoverable:** with the flag/trial on in a current Chrome, the site registers its tools;
  an agent (or a test harness using `document.modelContext.getTools()`) enumerates them with
  correct names, descriptions, and input schemas, and invokes them via `executeTool()`.
- **Read tools return data, not markup:** `list_content`, `read_content`, `search_content`,
  `whats_now`, `get_site_status` resolve to clean JSON sourced from the existing
  manifest/broadcast/lazy-FS — never serialized React.
- **Action tools drive the live page (validated):** `navigate` performs in-SPA navigation via
  the router but only to a whitelisted href (manifest hrefs + known routes); `set_theme`
  sets the terminal theme attribute (`data-terminal-theme`, parity with the human `theme`
  command) for a known theme name only. Unknown/hostile inputs return a structured error, never
  a raw redirect or arbitrary attribute write.
- **No-op fallback proven:** with the WebMCP API undefined, `registerAgentTools` returns a
  disposer and registers nothing; a unit test asserts zero side effects.
- **Lifecycle clean:** tools unregister on unmount via the registration `AbortSignal`; no leak
  across client navigations; re-registers on remount. A mount/unmount test proves no leak.
- **Security:** no tool returns a secret (none exist client-side); content bodies are returned
  as data with `untrustedContentHint`; `read_content` only serves manifest paths; `/api/fs` is
  capped and manifest-validated server-side; tools are same-origin (`exposedTo` default).
- **Build/quality:** `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all green. No
  measurable initial-route JS growth (bridge is small, client-only, no new deps).

## 3. Non-Goals

- ❌ **Not** a cross-browser feature. This targets Chrome's local flag / **149 origin-trial
  surface**, against a **W3C Draft Community Group Report** that is actively churning — the
  `navigator.modelContext` → `document.modelContext` migration (deprecation in Chrome 150) is
  itself in flight. We ship it gated as a flex, not as a supported integration.
- ❌ **No** server-side MCP endpoint, no Streamable-HTTP MCP server, no auth flows. WebMCP is
  client-side tools on `document.modelContext`; that is the whole surface here.
- ❌ **No** new server-side write/mutation and **no new persistence of agent input**. Action
  tools mutate only client UI state (route, theme) and are reversible.
- ❌ **No** new secrets or tokens reach the client. `GITHUB_TOKEN` et al. stay server-side;
  tools read only already-public manifest/broadcast/content.
- ❌ **Not** a replacement for the terminal or the deep routes. It mirrors them for agents.
- ❌ **Not** shipping `run_shell` in v1 (see §5.4 for why and when).

## 4. Constraints (grounded in the codebase + verified spec)

### WebMCP API (verified 2026-06-05 against W3C spec + Chrome docs; `error_pattern_54536340cf9e`)

- **Entry point is `document.modelContext`.** `navigator.modelContext` is **deprecated in
  Chrome 150**; the docs say use `document.modelContext`. During the Chrome 149 trial window
  both surfaces may coexist, so feature detection prefers `document` and falls back to
  `navigator` (§5.8), removable once on 150+.
- **Site-side W3C draft surface:** `document.modelContext.registerTool(tool, options)` and
  `toolchange`/`ontoolchange`. The current W3C CG IDL does **not** expose replace-all or clear
  methods; unregister by aborting the registration signal.
- **Chrome trial / agent-side surface (used by tests + the `agent` command):** `getTools()`
  (async, lists tools), `executeTool(tool, jsonString, opts?)` (async, runs a discovered tool and
  returns its result), and `addEventListener("toolchange", …)`.
- **`tool`:** `{ name (required), title?, description (required), inputSchema? (JSON Schema
object), execute (required, async), annotations? }`.
- **`execute`:** `async (input, client) => Promise<any>` — `input` is the agent's args;
  `client` exposes `requestUserInteraction(cb)` for human-in-the-loop (spec marks it early).
- **`annotations`:** `{ readOnlyHint = false, untrustedContentHint = false }`. These are
  **advisory client signals to the agent, not browser-enforced** — enforcement is ours (§5.5).
- **`options`:** `{ signal?: AbortSignal, exposedTo?: string[] }` — `signal` unregisters when
  aborted; `exposedTo` restricts origins (default same-origin).
- **SecureContext only** (HTTPS; `localhost` qualifies). Document must be fully active.
- **Status:** **W3C Draft Community Group Report dated 2026-06-02** plus Chrome docs
  (published 2026-05-18; Imperative API updated 2026-06-02). Chrome exposes WebMCP as a local
  dev flag and documents a **Chrome 149 origin-trial path**. Reaching real visitors during that
  trial requires an **origin-trial token** (meta tag or `Origin-Trial` header); a local
  `chrome://flags` toggle covers dev. No other browser yet.

### Codebase (verified by reading the files)

- **Foundation:** terminal hero is BUILT, flag-gated behind `NEXT_PUBLIC_TERMINAL_HERO`
  (`app/(transition)/page.tsx:26`). WebMCP only makes sense with the terminal mounted.
- **Mount point is `TerminalHero.tsx`, NOT `Terminal.tsx`.** `TerminalHero` owns everything
  the bridge needs: `manifest`/`broadcast` props, `handleRef` (`:109`), the session
  `shellRef = createShellRunner({ fetchBodies: fetchFsBodies })` (`:122`), `fetchFsBodies`
  (from `fsClient`), and `onNavigate = router.push` (`:138`). `Terminal.tsx` receives only
  `shellRunner` + `handleRef` and does **not** see `fetchBodies`. (Round-1 finding 2.)
- **`handleRef.current` is populated lazily** inside `Terminal`'s effect
  (`Terminal.tsx:427-430`), after mount. `TerminalHero` already deref's it **at call time**
  (`runChip:133`). So tool
  `execute` callbacks must read `handleRef.current` when the agent calls them, never capture it
  at registration. (Round-1 finding 3.)
- **Data layer is pure + serializable** (`app/lib/terminal/types.ts`): `Manifest.entries[]`
  `{ path, kind ∈ {about,now,resume,project,post,lab,secret}, title, summary, tags[], date,
href, bytes, emoji, github, status, latestVersion }`; `Broadcast` `{ focus, nowBody,
location, nowUpdated, latestPost, latestProject, latestShip, projectCount, postCount,
labCount }`. Read tools map straight off these.
- **Output does NOT all flow through `ctx.print`.** `handleRun` (`Terminal.tsx:345`) pushes the
  input echo via `pushEntry` (`:351`) and calls `history.add(raw)` (`:358`) **before** building
  `ctx` (`:363`); boot/status use `pushEntry` directly; `clear()` (`:331`) bypasses any sink.
  Any capture model must account for this. (Round-1 finding 4.)
- **History persists** (`history.ts:43`, `Terminal` uses `persist:true` at `:320`). Agent
  commands must not write into the human's ↑ history. (Round-1 finding 7.)
- **`/api/fs`** (`app/api/fs/route.ts`): `parsePaths` accepts an arbitrary JSON string array
  with **no length cap and no manifest validation** before `getVirtualFsBodies(paths)`.
  Needs hardening before an agent can drive it. (Round-1 finding 9.)
- **`navigation.ts` exports labels only** (`NAV_ITEMS = ['About','Blog','Projects','Lab',
'Resume']`), **not** route hrefs. The navigate whitelist must be built from manifest `href`s
  plus routes derived from these labels. (Round-1 finding 10.)
- **Shell sandbox + shared session** (`shell.ts`): `createShellRunner({ fetchBodies })` owns one
  `sessionEnv` (`:93`) read/written around `bash.exec` (`:133-149`), `python:false`,
  `javascript:false`, network off. The runner prints via `ctx.print` and returns `void`.
- **Render safety** (`render.tsx`): `OutputText`/`text` sanitize C0 controls + ESC and
  React-escape. For agents, "safe" means returning **text strings** treated as untrusted data.
- **Testing:** Vitest 4 + jsdom. **jsdom gotcha (`error_pattern_dcd2ba6ba6ab`):** `just-bash/
browser` mis-decodes file bodies under jsdom, so real shell behavior can't be unit-tested
  there. Read/action tools don't touch just-bash and test cleanly; the deferred `run_shell`
  needs manual Canary verification.
- **`Permissions-Policy` today** (`next.config.mjs:45`): `camera=(), microphone=(),
geolocation=()` — does not list `tools`, so the spec default (`self`) already permits
  registration. We add `tools=(self)` explicitly in **P0** and assert the existing header
  survives. (Round-1 finding 12.)
- **No `document.modelContext` in `lib.dom`** → ship an ambient `.d.ts` (§5.6).
- **Multi-agent repo:** scope edits narrowly, prefer new files, branch + flag-gate.

## 5. Architecture

```
            document.modelContext  (Chrome 149 OT / flag; HTTPS; document.modelContext, navigator fallback)
              registerTool ▲           ▲ getTools()/executeTool()  ← agents + tests drive here
                           │           │
        ┌──────────────────┴───────────┴───────────────────────┐
        │  app/components/terminal/webmcp.ts  (CLIENT)           │
        │  registerAgentTools({ manifest, broadcast, fetchBodies,│
        │     handleRef, navigate, setTheme, onToolCall })       │  mounted in TerminalHero.tsx
        └───┬───────────────┬───────────────────┬───────────────┘
            │ read           │ action            │ (P3, gated) run_shell
            ▼                ▼                   ▼
   manifest / broadcast   navigate(href)      handleRef.current → shell-only exec
   /api/fs (read_content) set_theme(name)       (raw stdout/stderr, no React serialize)
   → JSON (no React)      VALIDATED first

   absent document.modelContext  →  registerAgentTools() no-ops, returns disposer
```

### 5.1 Tool taxonomy

**v1 — read tools** (`annotations: { readOnlyHint: true }`):

| Tool              | Input                                    | Returns                                                                               | Source                       |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------- |
| `list_content`    | `{ kind: 'project'\|'post'\|'lab' }`     | array of `{ title, summary, tags, href, date, status?, latestVersion?, emoji? }`      | `manifest.entries` by kind   |
| `search_content`  | `{ query: string, kind? }`               | matching entries                                                                      | manifest, client-side filter |
| `read_content`    | `{ path }` (**must be a manifest path**) | `{ path, title, body }` (body length-capped)                                          | `fetchBodies([path])`        |
| `whats_now`       | —                                        | `{ focus, body, location, updated }`                                                  | `broadcast`                  |
| `get_site_status` | —                                        | `{ focus, projectCount, postCount, labCount, latestPost, latestProject, latestShip }` | `broadcast`                  |

`read_content` → `untrustedContentHint: true` (bodies are data). Metadata tools →
`untrustedContentHint: false`.

**v1 — action tools** (`annotations: { readOnlyHint: false }`):

| Tool        | Input      | Effect                     | Guard                                            |
| ----------- | ---------- | -------------------------- | ------------------------------------------------ |
| `navigate`  | `{ href }` | `router.push(href)`        | href ∈ allowed set (§5.3); else structured error |
| `set_theme` | `{ name }` | sets `data-terminal-theme` | name ∈ theme registry; else structured error     |

**P3 stretch (gated) — `run_shell`** (`{ line }`): shell-only execution returning raw
stdout/stderr. Deferred (§5.4). Read tools cover the rich native commands as JSON, so v1 needs
no shell and no React-to-text.

This split is deliberate (Round-1 finding 6/11): semantic tools describe the site in the
agent's own terms and avoid every hard problem; `run_shell` is the one risky power that earns its
own gate.

### 5.2 The bridge + registration lifecycle — `app/components/terminal/webmcp.ts`

A single client module, `registerAgentTools(deps): () => void`, **mounted in `TerminalHero.tsx`**
(the component that owns `manifest`, `broadcast`, `handleRef`, `fetchFsBodies`, and `router`):

```ts
export interface AgentToolDeps {
  manifest: Manifest
  broadcast: Broadcast
  fetchBodies: (paths?: readonly string[], signal?: AbortSignal) => Promise<FsBodies>
  navigate: (href: string) => void // router.push, post-validation
  setTheme: (name: string) => void
  handleRef?: { current: TerminalHandle | null } // P3 run_shell only; deref at call time
  onToolCall?: (toolName: string) => void // analytics: category only, never args
}

export function registerAgentTools(deps: AgentToolDeps): () => void {
  const mc =
    (typeof document !== 'undefined' && (document as DocWithMC).modelContext) ||
    (typeof navigator !== 'undefined' && (navigator as NavWithMC).modelContext) ||
    null
  if (!mc) return () => {} // no-op everywhere the API is absent
  const ac = new AbortController()
  const opts = { signal: ac.signal } // exposedTo omitted → same-origin default

  mc.registerTool(
    {
      name: 'whats_now',
      description: 'What Stefanie Jane is working on right now.',
      annotations: { readOnlyHint: true },
      execute: async () => {
        deps.onToolCall?.('whats_now')
        const { focus, nowBody, location, nowUpdated } = deps.broadcast
        return { focus, body: nowBody, location, updated: nowUpdated }
      },
    },
    opts,
  )

  // …list_content, search_content, read_content, get_site_status, navigate, set_theme…

  return () => ac.abort() // one abort unregisters every tool
}
```

**Mount (in `TerminalHero`):** a flag-gated `useEffect` keyed on `manifest`/`broadcast`,
returning the disposer. Because `execute` callbacks run later (when the agent calls a tool),
reading `handleRef.current` inside them is safe — by then `Terminal` has populated it (the
fix for Round-1 finding 3). The registration effect itself does not depend on the handle.

```ts
useEffect(() => {
  if (!WEBMCP_ENABLED) return
  return registerAgentTools({
    manifest,
    broadcast,
    fetchBodies: fetchFsBodies,
    navigate: onNavigate, // = router.push
    setTheme: (name) => document.documentElement.setAttribute('data-terminal-theme', name),
    handleRef, // P3 only
    onToolCall: (name) => trackTerminalCommand(`agent:${name}`),
  })
}, [manifest, broadcast, onNavigate]) // onNavigate is router-memoized; in deps so a router change re-registers
```

`toolchange` is unused in v1 (static tool set). Teardown is the `AbortController`; remount
re-registers via the effect. `onNavigate` is listed in the deps (Round-2 finding 4) — it is
`useCallback`-memoized on `router`, so this re-registers only if the router instance changes.

### 5.3 Read & action tools — straight off the data layer, validated

Read tools are pure functions of `manifest`/`broadcast` (+ `fetchBodies` for bodies): no
executor, no React, no shell. This is the "one source of truth, two presentations" payoff —
`content.tsx` renders these same entries as React for humans, the tools return them as JSON.
`read_content` accepts **only paths present in the manifest** and caps returned body length;
the `/api/fs` route is independently hardened (§5.5, T0.3).

**`navigate` validation** (Round-1 finding 10 — `navigation.ts` has labels, not hrefs):
build the allowed set as `{ '/' } ∪ { manifest.entries[].href } ∪ { '/'+label.toLowerCase()+'/'
for label in NAV_ITEMS }`. Normalize trailing slashes, then accept only exact members. Reject
external URLs, protocol-relative (`//host`), `javascript:`/`data:` schemes, and hash-only
spoofs. **`set_theme`** accepts only names from the **shared theme list** — currently the private
`const THEMES = ['silk','matrix','amber']` (`commands/meta.tsx:32`), which T2.1 promotes to an
exported `TERMINAL_THEMES` so the `theme` command and the WebMCP validator can't drift (Round-2
finding 6). Anything else → a structured `{ error }` result, never the side effect.

> **Pre-existing gap (Round-3 finding 1):** `set_theme` has **parity with the human `theme`
> command** — both set `data-terminal-theme` on `<html>`. But **no CSS rule consumes that
> attribute today** (verified: only the setter exists), so theme switching is currently a visual
> no-op for humans _and_ agents. Wiring `data-terminal-theme` to actual SilkCircuit theme CSS is
> a separate terminal-hero task, not owned by this plan. `set_theme` ships with the honest
> parity contract; if/when the CSS lands, it lights up for free.

### 5.4 DEFERRED (P3, second gate) — `run_shell`: agent drives the live shell

This is the cinematic demo, and it is **not v1**. Round 1 showed the naive "tee on
`ctx.print` + serialize ReactNodes" approach is unsound: output doesn't all flow through
`ctx.print` (echo/clear/boot bypass it), and rich command nodes (`ProjectsView`/`BlogView` are
function components; `TermLink` hides hrefs; fragments lose separators) can't be reverse-derived
to text. The correct design, gated behind a **second flag `NEXT_PUBLIC_WEBMCP_SHELL`**, is:

- **Shell-only, raw text — no React serialization.** Refactor `shell.ts` from a bare
  `createShellRunner` into a session factory `createShellSession({ fetchBodies }) -> { runShell,
execShell }` so both paths share one closure-owned just-bash instance + `sessionEnv` (today
  these are private to `createShellRunner`, `shell.ts:91-157`, and a free `execShell` couldn't
  reach them — Round-2 finding 2). `runShell` is today's human path (prints via `ctx.print`,
  returns void); `execShell(line, ctx): Promise<{ stdout, stderr, exitCode }>` returns the strings
  for the agent and optionally prints an agent-attributed echo. Rich native commands stay
  human-only; agents use the JSON read tools. This sidesteps `transcriptToText` entirely.
- **One session lock over the whole critical section, immediate human echo** (Round-1 finding 6 +
  Round-2 finding 3): the race isn't only `bash.exec` — `exactPathsToMaterialize(line, manifest,
sessionEnv.PWD)` (`shell.ts:123`) reads `sessionEnv.PWD` _before_ exec, so a lock around
  `bash.exec` alone still races the cwd snapshot. The lock must cover **snapshot cwd/env → decide
  materialization → `bash.exec` → write back `sessionEnv`** as one unit. Do **not** put a global
  queue in front of human echo (echo fires before exec). Add per-call cancellation + a timeout,
  and a deadlock test for re-entrant `ctx.run`.
- **No history pollution** (Round-1 finding 7): the agent path must not call `history.add`.
- **Caps + structured errors** (Round-1 finding 8): max input length, max output bytes with a
  `truncated` flag, and errors returned as `{ error }` — never raw shell/stack text.
- **Flooding** (Round-1 finding 9): bounded by the mutex + the hardened `/api/fs`; agent tool
  calls are tracked by category for observability (not throttled — see §5.5).

Prerequisite tasks are spelled out in §8 P3. Until all land, `run_shell` stays off.

### 5.5 Security model

- **No new server mutations, no persisted agent input.** Tools read only already-public
  manifest/broadcast/content and perform only reversible client UI actions (route, theme). No
  server write path. The agent path never writes localStorage history.
- **Hints are advisory; enforcement is ours.** `untrustedContentHint: true` on `read_content`
  (and `run_shell`) tells the agent body text is data, but the browser enforces nothing — so we
  add: manifest-path validation (`read_content`), allowed-set validation (`navigate`), theme
  registry validation (`set_theme`), input/output caps, and structured `{ error }` results with
  no raw error/stack leakage.
- **`/api/fs` hardening (T0.3, Round-1 finding 9 + Round-2 finding 5):** the route accepts an
  uncapped arbitrary string array (`route.ts:10`) and the server has no path enumerator to
  validate against (`fsBodies.ts` exposes only `getVirtualFsBody`/`getVirtualFsBodies`). Add a
  server-side `getVirtualFsPaths()` (in `fsBodies.ts`/`paths.ts`) listing the known virtual
  paths, then cap the array length and validate each requested path against it **before**
  `getVirtualFsBodies`; structured 400 otherwise. This is correctness/defense for a public
  endpoint (a human/script can hit it too), not agent-throttling.
- **Prompt injection:** a post body containing "ignore previous instructions" is returned as
  data with `untrustedContentHint: true`; the site never acts on body content. A test asserts
  `read_content` returns such payloads inert (as text, no execution, no tool re-dispatch).
- **Same-origin only:** `exposedTo` omitted → spec default `['self']`.
- **`Permissions-Policy`:** add `tools=(self)` explicitly in P0 and assert the existing
  `camera=()/microphone=()/geolocation=()` header is preserved.
- **No secrets:** `GITHUB_TOKEN` etc. never reach the client; no tool can surface one.
- **Analytics (mirrors terminal §5.11):** record tool _category_ only (`agent:list_content`),
  never raw `input` (could be anything an agent passes).

### 5.6 TypeScript ambient types — `app/types/webmcp.d.ts`

`document.modelContext` isn't in `lib.dom`. Ship an ambient declaration covering the **full
surface used here**: `registerTool`, `getTools()`, `executeTool()`, the `toolchange` event,
`ModelContextTool`, `ToolExecuteCallback`, `ToolAnnotations`, `ModelContextRegisterToolOptions`,
`ModelContextClient`, plus `DocWithMC`/`NavWithMC` helpers for the document/navigator detection.
Keep it isolated so a future `lib.dom` update is a one-file delete.

### 5.7 Discoverability & delight (SilkCircuit)

- **`agent` native command:** reports whether WebMCP is available, and uses
  `document.modelContext.getTools()` to print the live count + one-line list. Humans get to
  _see_ the site went agent-ready.
- **StatusBoard line:** a subtle `WebMCP ▍ ready · N tools` row in `StatusBoard.tsx` (cyan when
  live, muted when unsupported).
- **Optional boot line:** a single `[OK] agent interface online` when supported, reduced-motion-safe.

### 5.8 Feature detection, SSR safety, dev/prod

- `TerminalHero`'s `Terminal` is `dynamic ssr:false`, and the bridge is client-only and
  feature-detected, so there is **no SSR/hydration surface**.
- **Detection order:** prefer `document.modelContext`, fall back to `navigator.modelContext`
  for the Chrome 149 trial window; remove the navigator fallback once targeting 150+.
- **SecureContext:** production is HTTPS (Netlify); `localhost` is secure, so dev works with the
  `chrome://flags` toggle. Reaching real visitors during the trial needs an **origin-trial
  token** (§6).
- Everywhere the API is absent → `registerAgentTools` returns the no-op disposer.

## 6. Rollout / Safety

- Build on `feat/terminal-hero` (or a child branch). Gate v1 behind `NEXT_PUBLIC_WEBMCP`, which
  additionally requires `NEXT_PUBLIC_TERMINAL_HERO` (the bridge needs the mounted terminal).
  Default off. `run_shell` sits behind a **second** flag `NEXT_PUBLIC_WEBMCP_SHELL`, also off.
- **Dev/demo:** `chrome://flags` WebMCP toggle. **Real visitors during the trial:** register a
  Chrome **origin-trial token** for the origin and inject it (meta tag or `Origin-Trial`
  header in `next.config.mjs`). Decide per OQ7 whether we bother with the token or keep it
  flag/dev-only for funsies.
- The bridge no-ops without the API, so shipping dark is risk-free. **Remove the flags on ship**
  (explicit, tracked). Each phase ships something verifiable; **P0 is a hard go/no-go gate** —
  the spec is churning, so we confirm the live API shape (incl. `getTools`/`executeTool`) before
  building on it.

## 7. Open Questions / Unknowns

- **OQ1 — `run_shell` in or out of v1?** _Resolved (Round 1):_ OUT. v1 = read + navigate +
  set_theme; `run_shell` is a gated P3 stretch with the §5.4 prerequisites.
- **OQ2 — `document` vs `navigator` detection.** _Lean:_ prefer `document`, fall back to
  `navigator` during the 149 trial; drop the fallback at 150.
- **OQ3 — Origin-trial token vs flag-only.** Do we register an OT token so real visitors get it,
  or keep it dev/flag-only as a flex? _Lean:_ flag/dev-only for v1; token is a later toggle.
- **OQ4 — Human-in-the-loop via `client.requestUserInteraction`** for action tools? Spec is
  early. _Lean:_ v1 frictionless (validated + reversible); revisit for `run_shell`.
- **OQ5 — `read_content` body cap size** and whether to strip frontmatter. _Lean:_ cap at a few
  KB, return body as-authored; decide in T1.2.
- **OQ6 — P0 API drift.** The draft moves monthly. P0 must re-verify `registerTool`/`getTools`/
  `executeTool` against the actual Chrome build before P1, and update `error_pattern_54536340cf9e`.

## 8. Phased Task Plan

Verify abbreviations: `tc`=`pnpm typecheck`, `lint`=`pnpm lint`, `test`=`pnpm test`,
`build`=`pnpm build`, `manual`=current Chrome (149 OT or flag) with WebMCP enabled. Every phase
ends green on `tc`+`lint`+`test`.

### Phase 0 — Spike, verify, harden _(hard gate)_

- [ ] **T0.1 Live API proof.** In a current Chrome (149 OT / flag), register one trivial
      `whats_now` tool behind the flag; confirm the surface (`document.modelContext`, navigator
      fallback), discover it via `getTools()`, invoke via `executeTool()`. **Re-verify the
      object shapes AND the exact `executeTool(tool, json, opts?)` signature against the live
      build** (OQ6) and update `error_pattern_54536340cf9e`.
      Output: go/no-go + corrected API facts.
- [ ] **T0.2 Ambient types + flags.** `app/types/webmcp.d.ts` (full surface, §5.6);
      `NEXT_PUBLIC_WEBMCP` AND-gated with the terminal flag; `NEXT_PUBLIC_WEBMCP_SHELL` scaffold
      (off). **Verify:** `tc`.
- [ ] **T0.3 Harden `/api/fs`** (Round-1 finding 9 + Round-2 finding 5): add a server-side
      `getVirtualFsPaths()` (known virtual paths); cap array length; validate each path against it
      before `getVirtualFsBodies`; structured 400 on violation. **Files:** `app/api/fs/route.ts`,
      `app/lib/terminal/fsBodies.ts` (or `paths.ts`), `tests/terminal/fs-route.test.ts`.
      **Verify:** `test` (huge array rejected; off-manifest path rejected; valid still served).
- [ ] **T0.4 `Permissions-Policy: tools=(self)`** in `next.config.mjs` (Round-1 finding 12);
      assert existing header preserved. **Verify:** header test / built response.

### Phase 1 — Read tools + bridge

- [ ] **T1.1 Bridge skeleton + no-op fallback.** `webmcp.ts`: detection (§5.8), AbortSignal
      disposer, `onToolCall` analytics. **Verify:** `test` (no-op when API absent; disposer aborts).
- [ ] **T1.2 Read tools.** `list_content`, `search_content`, `read_content` (manifest-path
      validation + body cap), `whats_now`, `get_site_status`. **Verify:** `test` against a
      **fake `ModelContext`** (registerTool + `getTools()` + object-based `executeTool(tool,
json)`, §9): assert names/descriptions/`inputSchema`; drive `getTools()` →
      `executeTool(tool, json)` and assert JSON output vs a fixture manifest/broadcast;
      `read_content` rejects off-manifest paths; prompt-injection payload returned inert.
- [ ] **T1.3 Mount in `TerminalHero.tsx`** via flag-gated `useEffect`; lazy `handleRef` deref
      pattern (§5.2). **Verify:** `test` (mount registers, unmount disposes — no leak), `build`.
- [ ] **🔍 Cross-model review of P1** (full ceremony); iterate to green.

### Phase 2 — Action tools

- [ ] **T2.1 `navigate` + `set_theme`** with strict validation (§5.3: manifest hrefs + routes
      from `NAV_ITEMS`; theme registry; reject external/protocol-relative/`javascript:`/hash
      spoofs). **Verify:** `test` (valid drives router/attribute; each hostile input → structured
      error, no side effect).

### Phase 3 — DEFERRED stretch: `run_shell` _(behind `NEXT_PUBLIC_WEBMCP_SHELL`)_

- [ ] **T3.1 `execShell` refactor** in `shell.ts`: extract the just-bash exec into a function
      returning `{ stdout, stderr, exitCode }`; the human `ShellRunner` wraps it (prints), the
      agent path returns the strings. **Verify:** `test` with a **mocked just-bash** (jsdom
      mis-decode gotcha — `error_pattern_dcd2ba6ba6ab`).
- [ ] **T3.2 Session mutex** around the `sessionEnv`/`bash.exec` critical section only
      (immediate human echo preserved); per-call cancellation + timeout; re-entrancy/deadlock
      test. **Verify:** `test`.
- [ ] **T3.3 `run_shell` tool** + agent-attributed echo, input/output caps + `truncated`, no
      history write, structured errors. **Verify:** `test` (mocked shell), `manual` (agent runs
      `ls`/`cat`; echoes attributed; text returned).
- [ ] **🔍 Cross-model review of P3** (full ceremony).

### Phase 4 — Discoverability & delight

- [ ] **T4.1 `agent` command** (support + `getTools()` count/list). **Verify:** `test`, `manual`.
- [ ] **T4.2 StatusBoard `WebMCP` line** + optional boot `[OK]`. **Verify:** `manual`, reduced-motion.

## 9. Verification Strategy

- **Fake `ModelContext` (the key harness):** a test double mirroring Chrome's agent-side
  contract — `registerTool`, `getTools()` returning **tool-info objects**, `executeTool(tool,
argsJsonString, opts?)` that runs a returned tool object (object-based, **not** a name-based
  call — Round-2 finding 1), and the `toolchange` event — so tests exercise the **real
  agent-side path**, not just registration. Assert each tool's `name`/`description`/`annotations`
  and that `inputSchema` is valid JSON Schema; drive `getTools()` → `executeTool(tool, json)` and
  assert output shapes against fixture manifest/broadcast. (T0.1 confirms the exact live
  `executeTool` signature, which is churning.)
- **No-op + lifecycle:** API-absent path registers nothing; mount registers then unmount
  disposes with no leak across navigations.
- **Validation:** `navigate` accepts whitelisted hrefs and rejects external/protocol-relative/
  `javascript:`/hash spoofs; `set_theme` rejects unknown names; `read_content` rejects
  off-manifest paths; `/api/fs` rejects huge arrays + off-manifest paths.
- **Security:** prompt-injection body returned inert; no secret in any output; structured errors
  carry no raw shell/stack text; `exposedTo` same-origin; `Permissions-Policy` includes `tools`.
- **`run_shell` (P3, mocked shell):** `execShell` returns raw text; mutex serializes the session
  critical section without delaying human echo; caps + `truncated`; no history write. Real shell
  parity is **manual** in Chrome (jsdom gotcha).
- **Manual checklist (tied to the current Chrome doc version):** agent `getTools()` lists the
  tools; `getTools()` → `executeTool(tool, '{}')` for `whats_now` returns JSON; `navigate`
  animates the SPA; `set_theme` sets `data-terminal-theme` (parity with `theme`); (P3)
  `run_shell` echoes attributed and returns text. Screenshot.
- **Build/bundle:** `tc`+`lint`+`test`+`build` green; bridge adds no meaningful initial-route JS
  and stays client-only.

## 10. Estimated Shape

~13 tasks across 5 phases. **P0 is a hard gate** (verify the churning live API; harden `/api/fs`
and the header first). **P1** (read tools) is the safe, high-value core. **P2** (validated
actions) is small. **P3** (`run_shell`) is the deferred stretch carrying the only real
engineering risk (shell refactor + session mutex + caps), behind its own flag. **P4** is
delight. The whole thing no-ops where unsupported, so v1 blast radius is a new `webmcp.ts`, a
`webmcp.d.ts`, a hardened `/api/fs` + one header line, a flag-gated `useEffect` in `TerminalHero`,
and the two action validators.

## 11. Source Receipts

Primary sources verified on 2026-06-05:

- [W3C WebMCP Draft Community Group Report](https://webmachinelearning.github.io/webmcp/)
  (dated 2026-06-02): `Document.modelContext` is SecureContext-only; `ModelContext` exposes
  `registerTool()` and `ontoolchange`; tool definitions include `name`, `title`, `description`,
  `inputSchema`, `execute`, and `annotations`; registration options are `signal` and `exposedTo`;
  the `tools` Permissions Policy default allowlist is `'self'`.
- [Chrome WebMCP overview](https://developer.chrome.com/docs/ai/webmcp?hl=en) (published
  2026-05-18, updated 2026-05-28): WebMCP is a proposed web standard and progressive
  enhancement; local development uses `chrome://flags/#enable-webmcp-testing`; Chrome documents
  the origin-trial path for Chrome 149.
- [Chrome Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api?hl=en)
  (published 2026-05-18, updated 2026-06-02): prefer `document.modelContext`; `navigator` is
  deprecated in Chrome 150; `getTools()` returns same-origin tools by default; `executeTool(tool,
jsonString, opts?)` runs a discovered tool; `toolchange`, `tools` iframe policy, and `exposedTo`
  define the cross-origin story.
- [Chrome WebMCP best practices](https://developer.chrome.com/docs/ai/webmcp/best-practices?hl=en)
  (published 2026-05-18): keep tools single-purpose, register only when useful, prefer static
  registration for simple apps, validate strictly in code, return useful errors, and test/evaluate
  tool behavior.

## 12. Cross-Model Review Log

**Round 1 — Codex `codex-cli 0.137.0`, reasoning high (2026-06-04). Verdict: NEEDS REVISION.**
Confirmed direction; found 2 blockers, 9 major, 2 minor, all grounded in the real files.
Resolutions folded into this revision:

1. _(blocker §4/T0.1)_ Stale API facts → **updated to Chrome 149 origin-trial docs;
   `navigator` deprecated in Chrome 150 → `document.modelContext`; agent-side `getTools()`/
   `executeTool()`/`toolchange` added; dates 2026-05-18/06-02.** Verified vs W3C spec + Chrome
   docs.
2. _(blocker §5.2)_ Wrong mount point (`Terminal.tsx` lacks `fetchBodies`) → **mount in
   `TerminalHero.tsx`**, which owns `fetchFsBodies`, `handleRef`, `shellRef`, `router`.
3. _(major §5.2)_ `handleRef.current` not reactive → **deref inside `execute` at call time**
   (matches `runChip`); registration doesn't depend on the handle.
4. _(major §5.4)_ "all output flows through `ctx.print`" false (echo/clear/boot bypass) →
   problem retired by cutting `run_terminal`; `run_shell` uses raw `execShell` strings, no print-tee.
5. _(major §5.4)_ `transcriptToText` reverse-engineers React → **dropped**; `run_shell` is
   shell-only raw text via `execShell` (§5.4); rich commands stay JSON read tools.
6. _(major §5.4)_ Queue too broad → **mutex on the `sessionEnv`/`bash.exec` critical section
   only; immediate human echo; cancellation + deadlock test** (P3).
7. _(major §5.5)_ "No new mutations" inaccurate + history pollution → reworded to **no new
   _server_ mutations / no persisted agent input**; agent path skips `history.add`.
8. _(major §5.5)_ Hints aren't enforcement → **added input/output caps, structured errors, no
   raw leakage, prompt-injection test**; hints documented as advisory.
9. _(major §5.5/T0.3)_ `/api/fs` under-modeled → **cap + manifest-validate paths server-side**
   before `getVirtualFsBodies` (new T0.3).
10. _(major §5.3/T2.1)_ `navigate` cited `navigation.ts` (labels only) → **allowed set = manifest
    hrefs + routes derived from `NAV_ITEMS`**, strict URL rejection.
11. _(major §5.1/OQ1)_ `run_terminal` overpowered → **cut from v1**; semantic + navigate/theme
    ship first; `run_shell` behind a second flag (P3).
12. _(minor §8)_ `tools=(self)` mis-phased → **moved to P0 (T0.4)**, assert existing header kept.
13. _(minor §9)_ Mock-only tests insufficient → **fake `ModelContext` with `getTools()`/
    `executeTool()`/`toolchange`**, mount/unmount leak tests, header + route tests, manual checklist.

**Round 2 — Codex `codex-cli 0.137.0`, reasoning high (2026-06-04). Verdict: NEEDS REVISION
(much stronger).** 10/13 Round-1 findings RESOLVED; 3 PARTIAL (closed below). Six new findings,
all refinements (no blockers), folded into this revision:

1. _(major §9/T1.2; closes R1 #13)_ Chrome's agent API is `executeTool(tool, jsonString, opts?)`
   (object-based), with `getTools()` returning tool-info objects — not name-based. **Fake
   `ModelContext` contract corrected**; T0.1 confirms the live signature.
2. _(major §5.4/T3.1)_ A free `execShell` can't reach `createShellRunner`'s closure-owned
   `init`/`fetchBodies`/`sessionEnv` → **refactored to `createShellSession({fetchBodies}) ->
{ runShell, execShell }`** sharing one session.
3. _(major §5.4/T3.2; closes R1 #6)_ A mutex around `bash.exec` alone still races the pre-exec
   `sessionEnv.PWD` read (`shell.ts:123`) → **the lock now spans snapshot → materialize → exec →
   write-back** as one unit.
4. _(minor §5.2/T1.3)_ Mount effect used `onNavigate` but omitted it from deps → **added**.
5. _(minor §5.5/T0.3; closes R1 #9)_ The route can't see the client manifest → **add a
   server-side `getVirtualFsPaths()`** to validate against before reads.
6. _(minor §5.3/T2.1)_ Theme list is a private `const THEMES` in `meta.tsx:32` → **export a
   shared `TERMINAL_THEMES`** so command + validator can't drift.

**Round 3 — Codex `codex-cli 0.137.0`, reasoning high (2026-06-04). Verdict: PASS WITH CONCERNS.**
5/6 Round-2 findings RESOLVED; 1 partial + 1 new, both fixed in this revision:

1. _(major §5.1/§5.3/T2.1)_ `set_theme` over-claimed "switches theme," but `data-terminal-theme`
   is set by nothing-reads-it (verified: only the setter exists, no CSS consumes it). →
   **Narrowed to honest parity with the `theme` command + flagged the unwired theme CSS as a
   pre-existing terminal-hero gap** out of scope here.
2. _(minor §9)_ Manual checklist still showed name-based `executeTool('whats_now')` → **fixed to
   object-based `getTools()` → `executeTool(tool, '{}')`.**

Codex confirmed **v1 (P0–P2) is build-ready.**

**Round 4 — Codex `codex-cli 0.137.0`, reasoning high (2026-06-04). Verdict: PASS.** Both
Round-3 fixes confirmed resolved; no remaining findings. **Plan converged after 4 adversarial
rounds — v1 (P0–P2) ready to implement.**
