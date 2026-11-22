# 🌌 hyperbliss.tech — Project Intelligence Brief

## Overview

hyperbliss.tech is the company site for Hyperbliss Technologies LLC, an
independent open source software company. It presents the products
(Hypercolor, Sibyl, unifly), the essays, the lab, and the founder, in a visual
language called Emission. The header carries a living particle system
(CyberScape), and a pull-down terminal console sits on every page.

**Tech Stack**: Next.js (App Router, a canary release), React, TypeScript,
Panda CSS (zero-runtime CSS-in-JS), Canvas2D with gl-matrix. Exact versions
live in `package.json`; do not copy them here. **Deployment**: Netlify

## 🎯 Current State

### CyberScape 1.0 (Production)

- Canvas2D particle system with 3D projections using gl-matrix
- Interactive particles responding to mouse/touch
- Multiple shapes (cubes, pyramids, octahedrons)
- Glitch effects and datastream, all on the SilkCircuit palette
- Time-based stepping (identical motion at 30, 60, or 120Hz) with an
  energy clock that calms the field when nobody is over the band
- Spatial partitioning with Octree for collision detection
- Performance-adaptive particle counts

### Site Structure

```
/(transition)/
├── Home — Hero with the tagline, the three flagship products, the lead essay, the feed
├── About — The company, how it works, then the founder (the CyanogenMod story)
├── Blog — "Writing" in the nav; essays at /blog/<slug>
├── Projects — "Products" in the nav; product lines, live GitHub facts, detail pages
├── Lab — Interactive experiments
├── Archive — The whole feed by year
└── Resume — The founder's resume, linked from About
```

The pull-down terminal console mounts on every route from
`TransitionShell`. Its handle hangs under the header (logo, nav, CyberScape
band).

### One source for repeated facts

The tagline and site description live in `content/pages/home.json`, and the
company name, URL, and contact address in `app/lib/company.ts`, which also
re-exports the tagline. The hero, footer, social card, metadata, and feeds
read from there. Do not retype any of them in a component.

## 🎨 Design System

### Color Palette

```scss
$cosmic-purple: #a259ff; // Primary brand
$neon-pink: #ff75d8; // Accent energy
$digital-cyan: #00fff0; // Tech highlight
$void-black: #0a0a14; // Background depth
$light-gray: #e0e0e0; // Text clarity
```

### Typography

- **Display**: Archivo, set wide and heavy (titles, the hero)
- **Body**: Sora
- **Code and labels**: Geist Mono

Fonts are loaded in `app/styles/fonts.ts`. Root font-size is 62.5%, so 1rem
is 10px.

### Animation Principles

- Framer Motion for page transitions
- GPU-accelerated transforms only
- 60fps target with performance monitoring
- Graceful degradation for lower-end devices

## 🛠️ Development Patterns

### Component Architecture

```typescript
// Prefer composition with TypeScript generics
interface ParticleSystemProps<T extends ParticleType> {
  config: ParticleConfig<T>
  renderer: Renderer
  behaviors: BehaviorSet<T>
}
```

### Performance Guidelines

- Lazy load heavy components
- Use React.memo for pure components
- Implement virtual scrolling for long lists
- Profile with React DevTools regularly

### State Management

- React Context for global state (theme, user preferences)
- Local state for component-specific logic
- URL state for shareable configurations

## 🔧 Key Commands

```bash
# Development
pnpm dev             # Start Next.js dev server

# Testing
pnpm test            # Run test suite
pnpm test:seo        # SEO-specific tests

# Build & Analysis
pnpm build           # Production build
pnpm analyze         # Bundle size analysis

# Code Quality
pnpm lint            # Biome check
pnpm format          # Biome + Prettier formatting
```

## 📁 Important Files

### Core Systems

- `app/cyberscape/CyberScape.ts` — Header particle system
- `app/components/front/` — Front page (hero, product chapters, lead story, feed)
- `app/components/terminal/` — Pull-down console and its commands
- `app/lib/feed.ts` — Merges essays, lab, releases, launches into the feed
- `app/lib/github.ts` — Releases, repo stats, activity. With GITHUB_TOKEN
  or GH_TOKEN (set on Netlify) every repo's facts come from one GraphQL
  request an hour; without a token it falls back to REST per repo, and one
  rate-limit hit parks all calls until GitHub's reset
- `app/lib/navigation.ts` — Nav labels and routes
- `app/lib/company.ts` — Company name, URL, tagline, description (see above)
- `app/components/Header.tsx` — Main navigation

### Configuration

- `next.config.mjs` — Next.js settings
- `netlify.toml` — Deployment config
- `vitest.config.ts` — Test configuration

### Content

- `content/posts/` — Essays (markdown)
- `content/projects/` — Product and project pages (markdown; `featured: N`
  in frontmatter pins the flagships and their order)
- `content/pages/` — Home and About copy (JSON)
- `content/resume/resume.md` — The resume; regenerate `public/resume.pdf`
  after editing it with
  `uv run --project scripts/resume-pdf resume-pdf content/resume/resume.md`
- `docs/` — Design and planning records from earlier rounds (the style
  guides and the `*_PLAN.md` files). They describe the site as it was
  planned at the time, not as it is; trust the code over them

## 🚨 Critical Boundaries

- **Never** auto-commit or push without explicit permission
- **Never** restart Next.js dev server without asking
- **Always** maintain 60fps performance target
- **Always** test responsive behavior on mobile
- **Never** break existing functionality during refactors

## 💫 Style & Tone

### Code Style

- TypeScript-first with strict mode
- Functional components with hooks
- Descriptive variable names
- Comments only when logic is non-obvious

### Git Commits

- Conventional commits (feat:, fix:, perf:, etc.)
- Present tense ("Add feature" not "Added feature")
- Reference issues when applicable

### Communication

- Technical precision with creative flair
- Confident without arrogance
- Fun but not fluffy
- Peer-level collaboration

## 📊 Performance Targets

- **Frame Rate**: 60fps, including with the console open
- **Particle Count**: adapts to the device (`app/cyberscape/CyberScapeConfig.ts`)
- **Motion**: every looping animation honors `prefers-reduced-motion`, and
  anything that animates forever stays on the compositor or pauses off screen

## 🔗 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Motion (Framer Motion)](https://motion.dev/)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
