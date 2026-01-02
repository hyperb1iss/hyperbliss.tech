import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Use CSS variables for theming (matches your existing system)
  cssVarRoot: ':root',

  // Files to exclude
  exclude: [],

  // Where to look for your css declarations
  include: ['./app/**/*.{js,jsx,ts,tsx}'],

  // Generate JS utilities
  jsxFramework: 'react',

  // The output directory for your css system
  outdir: 'styled-system',
  // Use css reset
  preflight: true,

  // Use template literal syntax (closest to styled-components)
  syntax: 'template-literal',

  // SilkCircuit Design System
  theme: {
    tokens: {
      // ═══════════════════════════════════════════════════════════════
      // Blur
      // ═══════════════════════════════════════════════════════════════
      blurs: {
        '2xl': { value: '24px' },
        '3xl': { value: '40px' },
        lg: { value: '12px' },
        md: { value: '8px' },
        sm: { value: '4px' },
        xl: { value: '16px' },
      },
      // ═══════════════════════════════════════════════════════════════
      // Colors - SilkCircuit Palette
      // ═══════════════════════════════════════════════════════════════
      colors: {
        accent: { value: '{colors.silk.plasma.pink}' },
        // Border colors
        border: {
          default: { value: 'rgba(203, 213, 225, 0.2)' },
          emphasis: { value: '{colors.silk.circuit.cyan}' },
          subtle: { value: 'rgba(203, 213, 225, 0.1)' },
        },
        // Semantic mappings
        primary: { value: '{colors.silk.quantum.purple}' },
        secondary: { value: '{colors.silk.circuit.cyan}' },
        // Core Spectrum
        silk: {
          circuit: {
            cyan: { value: '#00fff0' },
            sky: { value: '#0ea5e9' },
            teal: { value: '#14b8a6' },
          },
          error: { value: '#ef4444' },
          info: { value: '#3b82f6' },
          // Soft Pastels
          lavender: { value: '#e0aaff' },
          lilac: { value: '#c77dff' },
          pearl: { value: '#f1f5f9' },
          periwinkle: { value: '#9d4edd' },
          plasma: {
            fuchsia: { value: '#d946ef' },
            magenta: { value: '#ec4899' },
            pink: { value: '#ff75d8' },
          },
          platinum: { value: '#e2e8f0' },
          quantum: {
            indigo: { value: '#8b5cf6' },
            purple: { value: '#a259ff' },
            violet: { value: '#a78bfa' },
          },
          // Steel Spectrum
          steel: {
            50: { value: '#f8fafc' },
            100: { value: '#f1f5f9' },
            200: { value: '#e2e8f0' },
            300: { value: '#cbd5e1' },
            400: { value: '#94a3b8' },
            500: { value: '#64748b' },
            600: { value: '#475569' },
            700: { value: '#334155' },
            800: { value: '#1e293b' },
            900: { value: '#0f172a' },
            950: { value: '#020617' },
          },
          // Semantic
          success: { value: '#10b981' },
          // Foundation
          void: {
            black: { value: '#0a0a14' },
            darker: { value: '#0f0f1a' },
            darkest: { value: '#050508' },
          },
          warning: { value: '#f59e0b' },
          white: { value: '#f8fafc' },
        },
        // Surface colors
        surface: {
          base: { value: '{colors.silk.void.black}' },
          glass: { value: 'rgba(30, 41, 59, 0.8)' },
          overlay: { value: 'rgba(15, 15, 26, 0.95)' },
          raised: { value: '{colors.silk.steel.900}' },
        },
        // Text colors
        text: {
          inverse: { value: '{colors.silk.steel.900}' },
          muted: { value: '{colors.silk.steel.500}' },
          primary: { value: '{colors.silk.steel.50}' },
          secondary: { value: '{colors.silk.steel.300}' },
        },
      },

      // ═══════════════════════════════════════════════════════════════
      // Durations & Easings
      // ═══════════════════════════════════════════════════════════════
      durations: {
        epic: { value: '1000ms' },
        fast: { value: '150ms' },
        instant: { value: '50ms' },
        lazy: { value: '750ms' },
        normal: { value: '250ms' },
        slow: { value: '350ms' },
        slower: { value: '500ms' },
      },
      easings: {
        circuit: { value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
        quantum: { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
        silk: { value: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      },
      fontSizes: {
        '2xl': { value: '1.777rem' },
        '3xl': { value: '2.369rem' },
        '4xl': { value: '3.157rem' },
        '5xl': { value: '4.209rem' },
        '6xl': { value: '5.611rem' },
        base: { value: '1rem' },
        'fluid-2xl': { value: 'clamp(2.6rem, 2.4rem + 1vw, 3.2rem)' },
        'fluid-3xl': { value: 'clamp(3.2rem, 2.8rem + 2vw, 4.2rem)' },
        'fluid-4xl': { value: 'clamp(4.2rem, 3.6rem + 2vw, 5.4rem)' },
        'fluid-5xl': { value: 'clamp(5.4rem, 4.5rem + 3vw, 7rem)' },
        'fluid-6xl': { value: 'clamp(6.4rem, 5.4rem + 4vw, 8.5rem)' },
        'fluid-base': { value: 'clamp(1.3rem, 1.2rem + 0.35vw, 1.6rem)' },
        'fluid-lg': { value: 'clamp(1.9rem, 1.8rem + 0.5vw, 2.2rem)' },
        'fluid-sm': { value: 'clamp(1.4rem, 1.3rem + 0.5vw, 1.6rem)' },
        'fluid-xl': { value: 'clamp(2.2rem, 2rem + 1vw, 2.6rem)' },
        // Fluid sizes
        'fluid-xs': { value: 'clamp(1.2rem, 1.1rem + 0.5vw, 1.4rem)' },
        lg: { value: '1.125rem' },
        sm: { value: '0.875rem' },
        xl: { value: '1.333rem' },
        xs: { value: '0.75rem' },
      },

      // ═══════════════════════════════════════════════════════════════
      // Typography
      // ═══════════════════════════════════════════════════════════════
      fonts: {
        body: { value: 'var(--font-exo2, system-ui), system-ui, sans-serif' },
        display: { value: 'var(--font-jura, system-ui), system-ui, sans-serif' },
        heading: { value: 'var(--font-jura, system-ui), system-ui, sans-serif' },
        mono: { value: 'var(--font-space-mono, ui-monospace), ui-monospace, monospace' },
      },
      fontWeights: {
        black: { value: '900' },
        bold: { value: '800' },
        light: { value: '300' },
        medium: { value: '600' },
        normal: { value: '500' },
        semibold: { value: '700' },
        thin: { value: '100' },
      },
      letterSpacings: {
        normal: { value: '0' },
        tight: { value: '-0.025em' },
        tighter: { value: '-0.05em' },
        wide: { value: '0.025em' },
        wider: { value: '0.05em' },
        widest: { value: '0.1em' },
      },
      lineHeights: {
        loose: { value: '2' },
        none: { value: '1' },
        normal: { value: '1.5' },
        relaxed: { value: '1.625' },
        snug: { value: '1.375' },
        tight: { value: '1.25' },
      },

      // ═══════════════════════════════════════════════════════════════
      // Radii
      // ═══════════════════════════════════════════════════════════════
      radii: {
        '2xl': { value: '1rem' },
        '3xl': { value: '1.5rem' },
        full: { value: '9999px' },
        lg: { value: '0.5rem' },
        md: { value: '0.375rem' },
        none: { value: '0' },
        sm: { value: '0.25rem' },
        xl: { value: '0.75rem' },
      },

      // ═══════════════════════════════════════════════════════════════
      // Shadows
      // ═══════════════════════════════════════════════════════════════
      shadows: {
        base: { value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
        'glow-cyan': { value: '0 0 20px rgba(0, 255, 240, 0.5), 0 0 40px rgba(0, 255, 240, 0.3)' },
        'glow-pink': { value: '0 0 20px rgba(255, 117, 216, 0.5), 0 0 40px rgba(255, 117, 216, 0.3)' },
        // Glow effects
        'glow-purple': { value: '0 0 20px rgba(162, 89, 255, 0.5), 0 0 40px rgba(162, 89, 255, 0.3)' },
        lg: { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
        md: { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
        sm: { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
        xl: { value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
      },

      // ═══════════════════════════════════════════════════════════════
      // Sizes
      // ═══════════════════════════════════════════════════════════════
      sizes: {
        container: {
          '2xl': { value: '1536px' },
          lg: { value: '1024px' },
          md: { value: '768px' },
          sm: { value: '640px' },
          xl: { value: '1280px' },
        },
      },

      // ═══════════════════════════════════════════════════════════════
      // Spacing
      // ═══════════════════════════════════════════════════════════════
      spacing: {
        0: { value: '0' },
        1: { value: '0.25rem' },
        '1.5': { value: '0.375rem' },
        2: { value: '0.5rem' },
        '2.5': { value: '0.625rem' },
        3: { value: '0.75rem' },
        '3.5': { value: '0.875rem' },
        4: { value: '1rem' },
        5: { value: '1.25rem' },
        6: { value: '1.5rem' },
        7: { value: '1.75rem' },
        8: { value: '2rem' },
        9: { value: '2.25rem' },
        10: { value: '2.5rem' },
        12: { value: '3rem' },
        14: { value: '3.5rem' },
        16: { value: '4rem' },
        20: { value: '5rem' },
        24: { value: '6rem' },
        28: { value: '7rem' },
        32: { value: '8rem' },
        36: { value: '9rem' },
        40: { value: '10rem' },
      },
    },
  },
})
