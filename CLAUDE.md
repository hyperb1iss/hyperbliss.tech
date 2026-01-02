# 🌌 hyperbliss.tech — Project Intelligence Brief

## Overview

hyperbliss.tech is a cutting-edge portfolio site showcasing technical mastery
through interactive cyberpunk aesthetics. The site features a living particle
system (CyberScape) that responds to content, user behavior, and environmental
context.

**Tech Stack**: Next.js 16.0, React 19.2, TypeScript 5.9, Styled Components,
WebGL/Three.js **Architecture**: App Router, Server Components, Edge Functions
**Deployment**: Netlify with performance optimization

## 🎯 Current State

### CyberScape 1.0 (Production)

- Canvas2D particle system with 3D projections using gl-matrix
- Interactive particles responding to mouse/touch
- Multiple shapes (cubes, pyramids, octahedrons)
- Glitch effects, datastream, chromatic aberration
- Spatial partitioning with Octree for collision detection
- Performance-adaptive particle counts

### Site Structure

```
/(transition)/
├── Home — Interactive hero with CyberScape
├── About — Personal narrative
├── Blog — Technical articles with syntax highlighting
├── Projects — GitHub-integrated portfolio pieces
└── Resume — Professional summary
```

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

- `app/cyberscape/CyberScape.tsx` — Current particle system
- `app/cyberscape2/` — WebGL migration (in progress)
- `app/lib/navigation.ts` — Route configuration
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
