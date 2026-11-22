import { Archivo, Geist_Mono, Sora } from 'next/font/google'

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

// Sora - wide and geometric, with enough character to carry the regular text
// beside the expanded headlines
export const sora = Sora({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sora',
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
