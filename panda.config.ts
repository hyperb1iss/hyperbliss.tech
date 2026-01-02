import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Where to look for your css declarations
  include: ['./app/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Generate JS utilities for React
  jsxFramework: 'react',

  // The output directory for your css system
  outdir: 'styled-system',

  // Disable preflight - we have our own base styles in globals.css
  preflight: false,

  // Use template literal syntax (closest to styled-components)
  syntax: 'template-literal',

  // No tokens - we use SilkCircuit CSS variables directly
  theme: {},
})
