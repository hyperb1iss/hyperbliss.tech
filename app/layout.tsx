// app/layout.tsx
import { Metadata } from 'next'
import './styles/globals.css'
import './styles/fonts.css'

export const metadata: Metadata = {
  title: 'Hyperbliss',
  description: 'The personal website of Stefanie Kondik—developer, designer, and tech enthusiast.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}