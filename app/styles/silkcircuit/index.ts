/**
 * SilkCircuit Design System
 * Main export file for all design system components and utilities
 */

// Export components
export * from './components'
// Export theme provider
export * from './theme'
// Export tokens
export * from './tokens'

// CSS imports should be done in the app layout
export const cssImports = ['/app/styles/silkcircuit/variables.css', '/app/styles/silkcircuit/utilities.css'] as const
