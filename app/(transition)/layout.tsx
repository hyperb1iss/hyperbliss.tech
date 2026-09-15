import TransitionShell from '../components/TransitionShell'
import { getTerminalData } from '../lib/terminal/getTerminalData'

// Hourly, matching the home page: the broadcast's counts and latest ship stay
// fresh and the GitHub lookups stay inside their cache window.
export const revalidate = 3600

export default async function TransitionLayout({ children }: { children: React.ReactNode }) {
  const { manifest, broadcast } = await getTerminalData()
  return (
    <TransitionShell broadcast={broadcast} manifest={manifest}>
      {children}
    </TransitionShell>
  )
}
