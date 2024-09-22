// app/layout.tsx
import { Metadata } from 'next'
import './styles/globals.css'
import './styles/fonts.css'
import StyledComponentsRegistry from './lib/registry'

export const metadata: Metadata = {
  title: {
    default: 'Hyperbliss | Stefanie Jane',
    template: '%s | Hyperbliss'
  },
  description: 'The personal website of Stefanie Jane—developer, designer, and tech enthusiast.',
  keywords: ['Stefanie Jane', 'hyperb1iss', 'hyperbliss','web development', 'design', 'technology', 'blog'],
  authors: [{ name: 'Stefanie Jane' }],
  creator: 'Stefanie Jane',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a14' },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}