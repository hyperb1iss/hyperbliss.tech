/**
 * SilkCircuit Design System - Core Tokens
 * "Where precision meets fluidity"
 *
 * A sophisticated evolution from cyberpunk to quantum elegance
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Color Architecture
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const colors = {
  circuit: {
    cyan: '#00fff0', // Digital cyan (kept from original)
    sky: '#0ea5e9', // Electric sky
    teal: '#14b8a6', // Deeper circuit teal
  },

  glow: {
    cyan: 'rgba(0, 255, 240, 0.3)',
    pink: 'rgba(255, 117, 216, 0.3)',
    purple: 'rgba(162, 89, 255, 0.3)',
  },

  // Special Effects
  hologram: {
    end: '#ff75d8',
    middle: '#00fff0',
    start: '#a259ff',
  },

  plasma: {
    fuchsia: '#d946ef', // Electric fuchsia
    magenta: '#ec4899', // Deeper magenta
    pink: '#ff75d8', // Neon pink energy (refined from original)
  },
  // Core Spectrum - Evolution from original palette
  quantum: {
    indigo: '#6366f1', // Sophisticated purple evolution
    purple: '#a259ff', // Signature cosmic purple (kept from original)
    violet: '#8b5cf6', // Refined pink evolution
  },

  // Semantic Colors
  signal: {
    error: '#ef4444', // Antimatter red
    info: '#3b82f6', // Neutron blue
    success: '#10b981', // Quantum green
    warning: '#f59e0b', // Fusion gold
  },

  silk: {
    pearl: '#f1f5f9', // Pearl shimmer
    platinum: '#e2e8f0', // Platinum shine
    white: '#f8fafc', // Pure silk white
  },

  // Metal Spectrum (Neutrals)
  steel: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Foundation Colors
  void: {
    black: '#0a0a14', // Deep space black
    darker: '#0f0f1a', // Darker void
    darkest: '#050508', // Absolute void
  },
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Typography Scale
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const typography = {
  // Fluid Typography (responsive)
  fluid: {
    '2xl': 'clamp(1.777rem, 1.5rem + 1.2vw, 2.369rem)',
    '3xl': 'clamp(2.369rem, 2rem + 1.8vw, 3.157rem)',
    '4xl': 'clamp(3.157rem, 2.5rem + 2.5vw, 4.209rem)',
    '5xl': 'clamp(4.209rem, 3rem + 3.5vw, 5.611rem)',
    base: 'clamp(1rem, 0.95rem + 0.3vw, 1.125rem)',
    lg: 'clamp(1.125rem, 1rem + 0.5vw, 1.333rem)',
    sm: 'clamp(0.875rem, 0.8rem + 0.3vw, 1rem)',
    xl: 'clamp(1.333rem, 1.2rem + 0.8vw, 1.777rem)',
    xs: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)',
  },
  // Font Families
  fonts: {
    body: '"Inter Variable", system-ui, -apple-system, sans-serif',
    display: '"Inter Variable", system-ui, -apple-system, sans-serif',
    heading: '"Inter Variable", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono Variable", "SF Mono", Consolas, monospace',
  },

  // Letter Spacing
  letterSpacing: {
    normal: '0',
    tight: '-0.025em',
    tighter: '-0.05em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Line Heights
  lineHeights: {
    loose: 2,
    normal: 1.5,
    relaxed: 1.7,
    snug: 1.3,
    tight: 1.1,
  },

  // Type Scale - Perfect Fourth (1.333)
  scale: {
    '2xl': '1.777rem', // ~28px
    '3xl': '2.369rem', // ~38px
    '4xl': '3.157rem', // ~51px
    '5xl': '4.209rem', // ~67px
    '6xl': '5.611rem', // ~90px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    sm: '0.875rem', // 14px
    xl: '1.333rem', // ~21px
    xs: '0.75rem', // 12px
  },

  // Font Weights
  weights: {
    black: 900,
    bold: 700,
    light: 300,
    medium: 500,
    normal: 400,
    semibold: 600,
    thin: 100,
  },
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Spacing System
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const spacing = {
  // Base scale (4px system)
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
  px: '1px',
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Motion & Animation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const motion = {
  // Duration Scale
  duration: {
    epic: '1000ms',
    fast: '150ms',
    instant: '50ms',
    lazy: '750ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  // Timing Functions
  easing: {
    // Quick & Responsive
    circuit: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

    // Standard
    ease: 'ease',
    easeIn: 'ease-in',
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    linear: 'linear',

    // Bouncy & Playful
    quantum: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    // Smooth & Elegant
    silk: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },

  // Spring Presets (for Framer Motion)
  spring: {
    bouncy: { damping: 10, stiffness: 400, type: 'spring' },
    smooth: { damping: 20, stiffness: 100, type: 'spring' },
    snappy: { damping: 30, stiffness: 300, type: 'spring' },
    stiff: { damping: 50, stiffness: 500, type: 'spring' },
  },
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Effects & Shadows
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const effects = {
  // Backdrop Filters
  backdrop: {
    blur: 'blur(16px)',
    blurHeavy: 'blur(24px)',
    blurLight: 'blur(8px)',
    desaturate: 'saturate(50%)',
    saturate: 'saturate(180%)',
  },

  // Blur Values
  blur: {
    '2xl': '40px',
    '3xl': '64px',
    base: '8px',
    lg: '16px',
    md: '12px',
    none: '0',
    sm: '4px',
    xl: '24px',
  },

  // Border Radius
  radius: {
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    base: '0.25rem', // 4px
    full: '9999px',
    lg: '0.5rem', // 8px
    md: '0.375rem', // 6px
    none: '0',
    sm: '0.125rem', // 2px
    xl: '0.75rem', // 12px
  },
  // Box Shadows
  shadows: {
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    glowCyan: '0 0 20px rgba(0, 255, 240, 0.3)',
    glowPink: '0 0 20px rgba(255, 117, 216, 0.3)',

    // Glow Effects
    glowPurple: '0 0 20px rgba(162, 89, 255, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Breakpoints
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const breakpoints = {
  '2xl': '1536px',
  '3xl': '1920px',
  lg: '1024px',
  md: '768px',
  sm: '640px',
  xl: '1280px',
  xs: '475px',
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Z-Index Scale
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const zIndex = {
  base: 0,
  dropdown: 1000,
  hide: -1,
  max: 9999,
  modal: 1300,
  overlay: 1200,
  popover: 1400,
  raised: 10,
  sticky: 1100,
  tooltip: 1500,
} as const

// Export type-safe token getter
export const tokens = {
  breakpoints,
  colors,
  effects,
  motion,
  spacing,
  typography,
  zIndex,
} as const

export type SilkCircuitTokens = typeof tokens
