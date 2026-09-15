// One computed line under the intro: pushes and repos over the last two
// weeks, straight from the public events feed. Nothing here is typed by hand,
// so it cannot go stale the way a hand-written "now" did; when GitHub is
// unreachable or quiet it renders nothing at all.

import type { ActivitySummary } from '@/lib/github'
import { styled } from '../../../styled-system/jsx'

const Line = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.2rem;
  margin: -2.4rem 0 4.4rem;
  font-family: var(--font-mono);
  font-size: 1.2rem;
  letter-spacing: 0.06em;
  color: var(--silk-steel-400);
`

const Repos = styled.span`
  color: var(--silk-circuit-cyan);
`

const REPOS_SHOWN = 4

export default function Pulse({ activity }: { activity: ActivitySummary | null }) {
  if (!activity?.ok || activity.totalPushes === 0) return null
  const shown = activity.repos.slice(0, REPOS_SHOWN)
  const more = activity.repos.length - shown.length
  const pushes = activity.totalPushes === 1 ? 'push' : 'pushes'
  return (
    <Line>
      <span>
        last {activity.windowDays} days · {activity.totalPushes} {pushes}
      </span>
      {shown.length > 0 && (
        <Repos>
          {shown.join(', ')}
          {more > 0 && ` +${more}`}
        </Repos>
      )}
    </Line>
  )
}
