// app/layout.tsx
import { Metadata } from 'next'
import StructuredData from './components/StructuredData'
import siteMetadata from './lib/metadata'
import { generatePersonSchema, generateWebsiteSchema } from './lib/structuredData'
import { exo2, jura, spaceMono } from './styles/fonts'
import '../styled-system/styles.css'
import './styles/globals.css'
import './styles/silkcircuit-syntax.css'

export const metadata: Metadata = siteMetadata

/**
 * RootLayout component
 * The main layout component that wraps the entire application.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = [generateWebsiteSchema(), generatePersonSchema()]

  return (
    <html className={`${jura.variable} ${exo2.variable} ${spaceMono.variable}`} lang="en">
      <head>
        <StructuredData data={structuredData} />
      </head>
      <body>{children}</body>
    </html>
  )
}
