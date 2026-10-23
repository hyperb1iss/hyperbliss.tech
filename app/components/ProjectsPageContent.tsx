// app/components/ProjectsPageContent.tsx
// Products: a jump bar, then each product line with its flagship as an
// Emission chapter (screenshot, pitch, call to action) and the rest of the
// line as rows under it. The last line collects the open source work outside
// the products.

import { groupByLine, type ProjectEntry } from '@/lib/projectLanes'
import { styled } from '../../styled-system/jsx'
import Reveal from './front/Reveal'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'
import ProjectRows from './ProjectRows'
import LaneNav from './projects/LaneNav'
import ProductChapter from './projects/ProductChapter'

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
  padding-top: 2.8rem;
  margin-bottom: 0.4rem;
  border-top: 1px solid rgba(244, 240, 255, 0.12);

  @media (max-width: 760px) {
    flex-direction: column;
    gap: 0.6rem;
  }
`

const LaneTitle = styled.h2`
  font-family: var(--font-display);
  font-stretch: 112%;
  font-weight: 800;
  font-size: clamp(2.6rem, 2rem + 1vw, 3.4rem);
  line-height: 1;
  letter-spacing: -0.02em;
  color: #f6f2ff;
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 1.2rem;

  & span {
    font-family: var(--font-mono);
    font-stretch: 100%;
    font-weight: 400;
    font-size: 1.3rem;
    letter-spacing: 0.08em;
    color: #b9b0cc;
  }
`

const LaneBlurb = styled.p`
  font-size: 1.6rem;
  font-weight: 300;
  color: #b9b0cc;
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
  const lines = groupByLine(entries)
  const firstFlagship = lines.find((line) => line.flagship)?.lane.id
  let flagshipIndex = 0
  let order = 2

  return (
    <PageLayout>
      <PageTitle lede="Three product lines, each led by a flagship, and the open source tools around them.">
        Products
      </PageTitle>
      <Reveal order={1}>
        <LaneNav
          groups={lines.map(({ lane, flagship, entries: rest }) => ({
            count: rest.length + (flagship ? 1 : 0),
            lane,
          }))}
        />
      </Reveal>
      {lines.map(({ lane, flagship, entries: rest }) => {
        const start = order
        order += 1 + (flagship ? 1 : 0) + rest.length * 0.5
        return (
          <LaneSection aria-labelledby={`lane-${lane.id}`} id={lane.id} key={lane.id}>
            <Reveal order={start}>
              <LaneHeader>
                <LaneTitle id={`lane-${lane.id}`}>
                  {lane.label}
                  <span>{rest.length + (flagship ? 1 : 0)}</span>
                </LaneTitle>
                <LaneBlurb>{lane.blurb}</LaneBlurb>
              </LaneHeader>
            </Reveal>
            {flagship && (
              <ProductChapter
                compact={true}
                entry={flagship}
                flip={flagshipIndex++ % 2 === 1}
                priority={lane.id === firstFlagship}
              />
            )}
            {rest.length > 0 && <ProjectRows entries={rest} now={now} startOrder={start + (flagship ? 1.5 : 0.5)} />}
          </LaneSection>
        )
      })}
    </PageLayout>
  )
}
