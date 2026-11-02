import type { Metadata } from 'next'
import NotFoundPage from './components/NotFoundPage'
import TransitionShell from './components/TransitionShell'
import { getTerminalData } from './lib/terminal/getTerminalData'

export const metadata: Metadata = {
  description: 'This page does not exist. Head back to Hyperbliss Technologies.',
  robots: {
    follow: false,
    index: false,
  },
  title: 'Not found',
}

// Unmatched URLs and notFound() calls both land on this root boundary, which
// sits above the (transition) layout, so it brings the shell itself.
export default async function NotFound() {
  const { manifest, broadcast } = await getTerminalData()
  return (
    <TransitionShell broadcast={broadcast} manifest={manifest}>
      <NotFoundPage />
    </TransitionShell>
  )
}
