import { Noto_Sans, Orbitron, Rajdhani, Space_Mono } from 'next/font/google'

// Define Orbitron font
export const orbitron = Orbitron({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-orbitron', // CSS variable name
  weight: ['400', '500', '700'],
})

// Define Rajdhani font
export const rajdhani = Rajdhani({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-rajdhani', // CSS variable name
  weight: ['300', '400', '500', '700'],
})

// Define Space Mono font
export const spaceMono = Space_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-space-mono', // CSS variable name
  weight: ['400'], // Assuming default weight is 400
})

// Define Noto Sans font for the logo
export const notoSans = Noto_Sans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-noto-sans', // CSS variable name
  weight: ['400'], // Assuming default weight is 400
})

// CSS variables to use in styled-components
export const fontVariables = {
  notoSans: notoSans.variable,
  orbitron: orbitron.variable,
  rajdhani: rajdhani.variable,
  spaceMono: spaceMono.variable,
}

// Class names to add to elements
export const fontClassNames = {
  notoSans: notoSans.className,
  orbitron: orbitron.className,
  rajdhani: rajdhani.className,
  spaceMono: spaceMono.className,
}
