# 🌌 hyperbliss.tech — Project Intelligence Brief

## Overview

hyperbliss.tech is a cutting-edge portfolio site showcasing technical mastery
through interactive cyberpunk aesthetics. The site features a living particle
system (CyberScape) that responds to content, user behavior, and environmental
context.

**Tech Stack**: Next.js 16.0, React 19.2, TypeScript 5.9, Panda CSS
(zero-runtime CSS-in-JS), WebGL/Three.js **Architecture**: App Router, Server
Components, Edge Functions **Deployment**: Netlify with performance optimization

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
├── Home — Front page, one column: intro, pulse line, lead story, Building trio, feed
├── About — Personal narrative (the CyanogenMod story lives here)
├── Blog — "Writing" in the nav; essays at /blog/<slug>
├── Projects — Flagship trio, lanes, live GitHub facts, detail pages
├── Lab — Interactive experiments
└── Resume — Professional summary
```

The pull-down terminal console mounts on every route from
`TransitionShell`; the header (logo, nav, CyberScape band, handle) is the
one piece of chrome that survived the 2026 redesign unchanged in shape.

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

- **Headings**: Orbitron (futuristic, uppercase)
- **Body**: Rajdhani (clean, technical)
- **Code**: Space Mono (monospace precision)

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
- `app/components/front/` — Front page (lead, Building strip, Pulse, feed, entrance)
- `app/components/terminal/` — Pull-down console and its commands
- `app/lib/feed.ts` — Merges essays, lab, releases, launches into the feed
- `app/lib/github.ts` — Releases, repo stats, activity. With GITHUB_TOKEN
  or GH_TOKEN (set on Netlify) every repo's facts come from one GraphQL
  request an hour; without a token it falls back to REST per repo, and one
  rate-limit hit parks all calls until GitHub's reset
- `app/lib/navigation.ts` — Nav labels and routes
- `app/components/Header.tsx` — Main navigation

### Configuration

- `next.config.mjs` — Next.js settings
- `netlify.toml` — Deployment config
- `jest.config.ts` — Test configuration

### Content

- `src/posts/` — Blog markdown files
- `src/projects/` — Project descriptions
- `docs/style-guide.md` — Original design documentation
- `docs/STYLE_GUIDE_2.0.md` — Updated style guide

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

## 📊 Current Performance

- **Particle Count**: ~1000-5000 adaptive based on device
- **Frame Rate**: 60fps on modern devices
- **Lighthouse Scores**: 90+ Performance, 100 Accessibility
- **Load Time**: < 2s on fast connections
- **Bundle Size**: Optimized with code splitting

## 🔗 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
