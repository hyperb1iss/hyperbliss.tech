import { Exo_2, Jura, Space_Mono } from 'next/font/google'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Heading Font
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Jura - light, airy, sci-fi elegance
export const jura = Jura({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-jura',
  weight: ['300', '400', '500', '600', '700'],
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Body Font
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Exo 2 - futuristic but softer
export const exo2 = Exo_2({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-exo2',
  weight: ['300', '400', '500', '600', '700'],
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mono Font
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const spaceMono = Space_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
})
