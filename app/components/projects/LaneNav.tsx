// Jump bar across the lanes with counts. Plain anchors: no client state.

import type { Lane } from '@/lib/projectLanes'
import { styled } from '../../../styled-system/jsx'

const Bar = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem 2.8rem;
  padding: 1.6rem 0;
  margin-bottom: 3.2rem;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  & a {
    color: var(--text-secondary);
    text-decoration: none;
    display: inline-flex;
    align-items: baseline;
    gap: 0.8rem;
    transition: color var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--silk-circuit-cyan);
  }
  & a span {
    font-family: var(--font-mono);
    font-weight: 400;
    font-size: 1.1rem;
    letter-spacing: 0.04em;
    color: var(--silk-quantum-purple);
  }
`

export default function LaneNav({ groups }: { groups: Array<{ lane: Lane; count: number }> }) {
  return (
    <Bar aria-label="Project lanes">
      {groups.map(({ lane, count }) => (
        <a href={`#${lane.id}`} key={lane.id}>
          {lane.label}
          <span>{count}</span>
        </a>
      ))}
    </Bar>
  )
}
