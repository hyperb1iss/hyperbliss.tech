// app/components/ProjectsPageContent.tsx
// Projects: the flagship trio, a jump bar, then every project in its lane.

import { groupByLane, type ProjectEntry, pickFeatured } from '@/lib/projectLanes'
import { styled } from '../../styled-system/jsx'
import Reveal from './front/Reveal'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'
import ProjectRows from './ProjectRows'
import FeaturedProjects from './projects/FeaturedProjects'
import LaneNav from './projects/LaneNav'

const LaneSection = styled.section`
  padding: 0;
  margin-bottom: 5.6rem;
  scroll-margin-top: 14rem;
`

const LaneHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 2.4rem;
  padding-bottom: 1.4rem;
  margin-bottom: 0.4rem;
  border-bottom: 1px solid rgba(162, 89, 255, 0.28);

  @media (max-width: 760px) {
    flex-direction: column;
    gap: 0.6rem;
  }
`

const LaneTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.6rem;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: none;
  text-shadow: 0 0 18px rgba(162, 89, 255, 0.35);
  color: var(--silk-lavender);
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 1.2rem;

  & span {
    font-family: var(--font-mono);
    font-weight: 400;
    font-size: 1.2rem;
    letter-spacing: 0.1em;
    color: var(--silk-quantum-purple);
    text-shadow: none;
  }
`

const LaneBlurb = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--text-secondary);
  margin: 0;
  max-width: 48rem;
  text-align: right;

  @media (max-width: 760px) {
    text-align: left;
  }
`

interface ProjectsPageContentProps {
  entries: ProjectEntry[]
  /** Render-time clock for relative timestamps, fixed by the caller so SSR output is stable. */
  now: number
}

export default function ProjectsPageContent({ entries, now }: ProjectsPageContentProps) {
  const featured = pickFeatured(entries, 3)
  const groups = groupByLane(entries)
  let order = 3

  return (
    <PageLayout>
      <PageTitle lede="Things I have built, broken, and shipped. Open source tools, creative experiments, and systems that do real work.">
        Projects
      </PageTitle>
      <FeaturedProjects entries={featured} now={now} />
      <Reveal order={3}>
        <LaneNav groups={groups.map(({ lane, entries: laneEntries }) => ({ count: laneEntries.length, lane }))} />
      </Reveal>
      {groups.map(({ lane, entries: laneEntries }) => {
        const start = order
        order += 1 + laneEntries.length * 0.5
        return (
          <LaneSection aria-labelledby={`lane-${lane.id}`} id={lane.id} key={lane.id}>
            <Reveal order={start}>
              <LaneHeader>
                <LaneTitle id={`lane-${lane.id}`}>
                  {lane.label}
                  <span>{laneEntries.length}</span>
                </LaneTitle>
                <LaneBlurb>{lane.blurb}</LaneBlurb>
              </LaneHeader>
            </Reveal>
            <ProjectRows entries={laneEntries} now={now} startOrder={start + 0.5} />
          </LaneSection>
        )
      })}
    </PageLayout>
  )
}
