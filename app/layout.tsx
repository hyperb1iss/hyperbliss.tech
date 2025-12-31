// app/layout.tsx
import { Metadata } from 'next'
import SilkCircuitSyntaxTheme from './components/SilkCircuitSyntaxTheme'
import StructuredData from './components/StructuredData'
import siteMetadata from './lib/metadata'
import StyledComponentsRegistry from './lib/registry'
import { generatePersonSchema, generateWebsiteSchema } from './lib/structuredData'
import { exo2, jura, spaceMono } from './styles/fonts'
import './styles/globals.css'

export const metadata: Metadata = siteMetadata

/**
 * RootLayout component
 * The main layout component that wraps the entire application.
 * Provides global context, headers, and scripts.
 * CRITICAL: StyledComponentsRegistry must wrap the entire app for SSR
 * @param {React.ReactNode} children - Child components
 * @returns {JSX.Element} Rendered root layout
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = [generateWebsiteSchema(), generatePersonSchema()]

  return (
    <html className={`${jura.variable} ${exo2.variable} ${spaceMono.variable}`} lang="en">
      <head>
        <StructuredData data={structuredData} />
      </head>
      <body>
        <StyledComponentsRegistry>
          <SilkCircuitSyntaxTheme />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
