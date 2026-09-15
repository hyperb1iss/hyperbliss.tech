import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Files to exclude
  exclude: [],
  // Where to look for your css declarations
  include: ['./app/**/*.{js,jsx,ts,tsx}'],

  // Generate JS utilities for React
  jsxFramework: 'react',

  // The output directory for your css system
  outdir: 'styled-system',

  // Disable preflight - we have our own base styles in globals.css
  preflight: false,

  // Use template literal syntax for familiar CSS-in-JS authoring
  syntax: 'template-literal',

  // SilkCircuit CSS variables remain the source of design tokens.
  theme: {
    extend: {
      keyframes: {
        silkBorderGlow: {
          '0%, 100%': {
            opacity: '0.5',
          },
          '50%': {
            opacity: '0.8',
          },
        },
        silkCardBorderFlow: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        silkCardGlow: {
          '0%, 100%': { boxShadow: 'var(--glow-purple)' },
          '33%': { boxShadow: 'var(--glow-cyan)' },
          '66%': { boxShadow: 'var(--glow-pink)' },
        },
        silkGlitchPrimary: {
          '0%': {
            clip: 'rect(10px, 9999px, 20px, 0)',
          },
          '50%': {
            clip: 'rect(85px, 9999px, 90px, 0)',
          },
          '100%': {
            clip: 'rect(45px, 9999px, 55px, 0)',
          },
        },
        silkGlitchSecondary: {
          '0%': {
            clip: 'rect(60px, 9999px, 70px, 0)',
          },
          '50%': {
            clip: 'rect(25px, 9999px, 35px, 0)',
          },
          '100%': {
            clip: 'rect(5px, 9999px, 15px, 0)',
          },
        },
        silkGradientShift: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        silkHeroScrollWheel: {
          '0%': {
            opacity: '1',
            transform: 'translateX(-50%) translateY(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(-50%) translateY(10px)',
          },
        },
        silkLogoAnimateGradient: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        silkLogoGlitchText: {
          '0%, 100%': {
            textShadow: '0 0 2px rgba(0, 255, 240, 0.8), -1px 0 rgba(255, 0, 255, 0.5), 1px 0 rgba(0, 255, 240, 0.5)',
          },
          '25%': {
            textShadow:
              '0 0 2px rgba(162, 89, 255, 0.8), -2px 0 rgba(0, 255, 240, 0.5), 2px 0 rgba(255, 117, 216, 0.5)',
          },
          '50%': {
            textShadow:
              '0 0 2px rgba(255, 117, 216, 0.8), -1px 0 rgba(162, 89, 255, 0.5), 1px 0 rgba(0, 255, 240, 0.5)',
          },
          '75%': {
            textShadow:
              '0 0 2px rgba(0, 255, 240, 0.8), -2px 0 rgba(255, 117, 216, 0.5), 1px 0 rgba(162, 89, 255, 0.5)',
          },
        },
        silkLogoScanline: {
          '0%': {
            backgroundPosition: '0 0',
          },
          '100%': {
            backgroundPosition: '0 10px',
          },
        },
        silkLogoSlideIn: {
          from: {
            letterSpacing: '0.5em',
            opacity: '0',
            transform: 'translateX(-12px)',
          },
          to: {
            letterSpacing: '0.26em',
            opacity: '0.85',
            transform: 'translateX(0)',
          },
        },
        silkLogoSubtleGlow: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 8px rgba(162, 89, 255, 0.4))',
          },
          '50%': {
            filter: 'drop-shadow(0 0 12px rgba(0, 255, 240, 0.5))',
          },
        },
        silkNavShimmer: {
          '0%, 100%': { backgroundPosition: '200% 0' },
          '50%': { backgroundPosition: '-200% 0' },
        },
        silkNotFoundPageGlow: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 20px rgba(162, 89, 255, 0.6)) drop-shadow(0 0 40px rgba(0, 255, 240, 0.4))',
            opacity: '0.9',
          },
          '50%': {
            filter: 'drop-shadow(0 0 30px rgba(162, 89, 255, 0.8)) drop-shadow(0 0 60px rgba(0, 255, 240, 0.6))',
            opacity: '1',
          },
        },
        silkNotFoundPageSparkle: {
          '0%, 100%': {
            opacity: '0',
            transform: 'scale(0)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        silkRegexNightmaresGlitch: {
          '0%, 90%, 100%': {
            filter: 'none',
            transform: 'none',
          },
          '92%': {
            filter: 'hue-rotate(90deg)',
            transform: 'skewX(-2deg) translateX(-2px)',
          },
          '94%': {
            filter: 'hue-rotate(-90deg)',
            transform: 'skewX(1deg) translateX(1px)',
          },
          '96%': {
            filter: 'none',
            transform: 'none',
          },
          '98%': {
            filter: 'hue-rotate(45deg) saturate(1.5)',
            transform: 'skewX(-1deg)',
          },
        },
        silkShimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        silkSpin: {
          to: { transform: 'rotate(360deg)' },
        },
        silkSponsorBannerHeartbeat: {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '15%': {
            transform: 'scale(1.15)',
          },
          '30%': {
            transform: 'scale(1)',
          },
          '45%': {
            transform: 'scale(1.1)',
          },
          '60%': {
            transform: 'scale(1)',
          },
        },
        silkStarFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-2px) rotate(3deg)' },
        },
        silkStarGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(0, 255, 240, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 16px rgba(162, 89, 255, 0.6))' },
        },
        silkStatusPulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.2',
          },
        },
        silkStyledTitleShimmer: {
          '0%': {
            backgroundPosition: '100% 0',
          },
          '100%': {
            backgroundPosition: '-100% 0',
          },
        },
        silkTerminalCaretBlink: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0',
          },
        },
      },
    },
  },
})
