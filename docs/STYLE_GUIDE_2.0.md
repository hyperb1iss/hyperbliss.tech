# hyperbliss.tech Style Guide 2.0

Sharp code. Stylish magic. Zero chaos.

## Design Philosophy

We build at the intersection of technical precision and creative expression.
Every pixel has purpose. Every animation has intent. This isn't about being
quirky or cosmic—it's about creating experiences that feel inevitable.

### Core Principles

**1. Confident Minimalism** Less decoration, more intention. If it doesn't serve
the experience, it doesn't exist.

**2. Technical Elegance** Our aesthetics emerge from the technology itself.
WebGL shaders create beauty. Performance constraints inspire creativity.

**3. Subtle Sophistication** The magic is in the details you don't immediately
notice—until they're missing.

## Visual Language

### Color System

```scss
// Primary Palette
$primary: #a259ff; // Electric purple — confident, not cute
$accent: #ff75d8; // Hot pink — energy without excess
$tech: #00fff0; // Digital cyan — precision highlight
$void: #0a0a14; // Deep void — grounding depth
$text: #e0e0e0; // Clean gray — clarity first

// Semantic Colors
$success: #00ff88; // Green — accomplishment
$warning: #ffaa00; // Amber — attention
$error: #ff3366; // Red — critical only
$info: $tech; // Cyan — knowledge

// Gradients (use sparingly)
$glow: linear-gradient(135deg, $primary 0%, $accent 100%);
$depth: radial-gradient(circle at center, $void 0%, #000000 100%);
```

### Typography

```scss
// Type Scale
$font-heading: 'Orbitron', monospace; // Technical authority
$font-body: 'Rajdhani', sans-serif; // Clean readability
$font-code: 'Space Mono', monospace; // Code precision

// Sizing (fluid, responsive)
$size-hero: clamp(2.5rem, 8vw, 5rem);
$size-h1: clamp(2rem, 5vw, 3.5rem);
$size-h2: clamp(1.5rem, 4vw, 2.5rem);
$size-body: clamp(1rem, 2vw, 1.125rem);
$size-small: clamp(0.875rem, 1.5vw, 1rem);

// Weights
$weight-regular: 400;
$weight-medium: 500;
$weight-bold: 700;
```

## Component Patterns

### Interactive Elements

```typescript
// Hover states are subtle, not theatrical
.interactive {
  transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($primary, 0.2);
  }
}

// Focus states for accessibility
.focusable {
  &:focus-visible {
    outline: 2px solid $tech;
    outline-offset: 2px;
  }
}
```

### Cards & Containers

```scss
.card {
  background: rgba($void, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba($primary, 0.2);
  border-radius: 8px;

  // Subtle glow on interaction
  &:hover {
    border-color: rgba($primary, 0.4);
    box-shadow: 0 0 20px rgba($primary, 0.1);
  }
}
```

### Animation Principles

```typescript
// Performance first
const animationConfig = {
  duration: 0.3,
  ease: [0.23, 1, 0.32, 1], // Custom easing
  transformOrigin: 'center',
  willChange: 'transform', // GPU acceleration hint
}

// Entrance animations are confident
const entranceVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

// Exit animations are swift
const exitVariants = {
  visible: { opacity: 1, scale: 1 },
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}
```

## Particle System Design

### Behavioral Hierarchy

```typescript
enum ParticlePriority {
  HERO = 1, // Logo and primary interactions
  CONTENT = 2, // Content-aware behaviors
  AMBIENT = 3, // Background atmosphere
  DETAIL = 4, // Performance-scalable extras
}

// Particles respond to context, not randomly
interface ParticleBehavior {
  attraction: number // 0-1 mouse magnetism
  autonomy: number // 0-1 self-direction
  connection: number // 0-1 inter-particle bonds
  responsiveness: number // 0-1 content awareness
}
```

### Visual Hierarchy

```glsl
// Shader uniforms for dynamic control
uniform float u_complexity;    // Content complexity
uniform vec3 u_mood;           // Emotional state from content
uniform float u_interaction;   // User engagement level
uniform float u_performance;   // FPS-based quality scaling
```

## Code Standards

### TypeScript Patterns

```typescript
// Prefer composition over inheritance
type ParticleSystem = BaseSystem & Renderable & Interactive

// Use discriminated unions for state
type ParticleState =
  | { type: 'idle'; velocity: Vector3 }
  | { type: 'attracted'; target: Vector3; force: number }
  | { type: 'connected'; peers: Particle[]; strength: number }

// Functional, not imperative
const updateParticles = (particles: Particle[]) =>
  particles.map(evolve).filter(isAlive).slice(0, maxParticles)
```

### Performance Guidelines

```typescript
// Measure, don't guess
const withPerformance = <T>(fn: () => T, label: string): T => {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start

  if (duration > 16.67) {
    // Missed frame budget
    console.warn(`${label} took ${duration}ms`)
  }

  return result
}

// Graceful degradation
const getParticleCount = (): number => {
  const fps = performanceMonitor.averageFPS
  if (fps < 30) return 1000 // Minimum viable
  if (fps < 50) return 5000 // Balanced
  return 10000 // Full experience
}
```

## Content Strategy

### Voice & Tone

**What we are:**

- Direct and clear
- Technically confident
- Subtly playful
- Peer-level

**What we're not:**

- Overly enthusiastic
- Self-deprecating
- Verbose
- Precious

### Writing Examples

```markdown
# Good

"WebGL particle system with 10k+ concurrent instances."

# Not Good

"✨ Magical particle wonderland with cosmic energy! ✨"

# Good

"Performance degrades gracefully on lower-end devices."

# Not Good

"Don't worry if your device is slow, we've got you covered! 😊"

# Good

"AI-driven particle behaviors adapt to content sentiment."

# Not Good

"Watch as our mystical AI brings particles to life with emotion!"
```

## Responsive Design

### Breakpoints

```scss
$mobile: 480px;
$tablet: 768px;
$desktop: 1024px;
$wide: 1440px;

// Mobile-first approach
@mixin responsive($breakpoint) {
  @media (min-width: $breakpoint) {
    @content;
  }
}
```

### Particle Scaling

```typescript
const particleConfig = {
  mobile: {
    count: 1000,
    size: 2,
    connections: false,
    shapes: ['cube'],
  },
  tablet: {
    count: 5000,
    size: 3,
    connections: true,
    shapes: ['cube', 'pyramid'],
  },
  desktop: {
    count: 10000,
    size: 4,
    connections: true,
    shapes: ['cube', 'pyramid', 'octahedron'],
  },
}
```

## Accessibility

### Core Requirements

```typescript
// Respect user preferences
const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const particleIntensity = prefersReducedMotion ? 0.2 : 1.0;

// Keyboard navigation
const handleKeyboard = (e: KeyboardEvent) => {
  switch(e.key) {
    case 'Tab': // Maintain focus order
    case 'Enter': // Activate interactions
    case 'Escape': // Close modals
  }
};

// Screen reader support
<div role="presentation" aria-hidden="true">
  {/* Particle canvas is decorative */}
</div>
```

## Testing Criteria

### Visual Regression

```typescript
// Critical visual checkpoints
const visualTests = [
  'particle density at different viewport sizes',
  'color contrast in light/dark modes',
  'animation smoothness at 60fps',
  'responsive typography scaling',
  'interactive state transitions',
]
```

### Performance Benchmarks

```typescript
const performanceTargets = {
  FCP: 1000, // First Contentful Paint < 1s
  LCP: 2000, // Largest Contentful Paint < 2s
  CLS: 0.1, // Cumulative Layout Shift < 0.1
  FID: 100, // First Input Delay < 100ms
  FPS: 60, // Consistent 60fps animations
}
```

## Implementation Checklist

Before deploying any feature:

- [ ] Performance tested on low-end devices
- [ ] Accessibility validated with screen readers
- [ ] Responsive behavior verified across breakpoints
- [ ] Animation frame budget maintained (<16ms)
- [ ] TypeScript types properly defined
- [ ] Error boundaries implemented
- [ ] Loading states designed
- [ ] SEO metadata configured

## Evolution Philosophy

This style guide evolves with the technology. We don't chase trends—we set them.
Every decision is intentional. Every effect has purpose. We build experiences
that feel like they've always existed, waiting to be discovered.

The goal isn't to impress with complexity. It's to create something so
well-crafted that the technology becomes invisible, leaving only the experience.

---

_Sharp code. Stylish magic. Zero chaos._ _This is the way._
