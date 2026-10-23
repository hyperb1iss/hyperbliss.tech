import { Archivo, Geist, Geist_Mono } from 'next/font/google'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Display Font
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Archivo - variable weight and width; headlines run expanded (font-stretch
// 110 to 125%) and heavy, the voice of the Emission direction
export const archivo = Archivo({
  axes: ['wdth'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-archivo',
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Body Font
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Geist - neutral, precise, reads well light on black
export const geist = Geist({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-geist',
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mono Font
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Geist Mono - the terminal, code, labels, and version numbers
export const geistMono = Geist_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-geist-mono',
})
