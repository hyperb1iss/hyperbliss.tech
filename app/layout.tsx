// app/layout.tsx
import { Metadata } from 'next'
import StructuredData from './components/StructuredData'
import siteMetadata from './lib/metadata'
import { generatePersonSchema, generateWebsiteSchema } from './lib/structuredData'
import { notoSans, orbitron, rajdhani, spaceMono } from './styles/fonts'
import './styles/globals.css'

export const metadata: Metadata = siteMetadata

/**
 * RootLayout component
 * The main layout component that wraps the entire application.
 * Provides global context, headers, and scripts.
 * @param {React.ReactNode} children - Child components
 * @returns {JSX.Element} Rendered root layout
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = [generateWebsiteSchema(), generatePersonSchema()]

  return (
    <html className={`${orbitron.variable} ${rajdhani.variable} ${spaceMono.variable} ${notoSans.variable}`} lang="en">
      <head>
        <StructuredData data={structuredData} />
      </head>
      <body>{children}</body>
    </html>
  )
}
