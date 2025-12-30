import { Orbitron, Rajdhani, Space_Mono } from 'next/font/google'

// Define Orbitron font
export const orbitron = Orbitron({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-orbitron', // CSS variable name
  weight: ['400', '500', '600', '700', '800', '900'],
})

// Define Rajdhani font
export const rajdhani = Rajdhani({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-rajdhani', // CSS variable name
  weight: ['300', '400', '500', '600', '700'],
})

// Define Space Mono font
export const spaceMono = Space_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-space-mono', // CSS variable name
  weight: ['400', '700'],
})

// CSS variables to use in styled-components
export const fontVariables = {
  orbitron: orbitron.variable,
  rajdhani: rajdhani.variable,
  spaceMono: spaceMono.variable,
}

// Class names to add to elements
export const fontClassNames = {
  orbitron: orbitron.className,
  rajdhani: rajdhani.className,
  spaceMono: spaceMono.className,
}
