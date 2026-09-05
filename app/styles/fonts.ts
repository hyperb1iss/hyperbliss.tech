import { IBM_Plex_Sans, Space_Mono, Syne } from 'next/font/google'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Display Font
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Syne - geometric with an editorial edge; headlines, nav, numerals
export const syne = Syne({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Body Font
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// IBM Plex Sans - quiet, technical, reads well light
export const plexSans = IBM_Plex_Sans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-plex-sans',
  weight: ['300', '400', '500', '600'],
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mono Font
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Space Mono - the terminal, code, and version numbers share one mono face
export const spaceMono = Space_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
})
