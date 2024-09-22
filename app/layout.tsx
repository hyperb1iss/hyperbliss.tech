import type { Metadata } from 'next'

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