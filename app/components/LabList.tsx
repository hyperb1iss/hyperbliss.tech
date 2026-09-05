// app/components/LabList.tsx
// The Lab index: interactive experiments as feed rows, newest first.

import type { LabSummary } from '@/lib/content'
import { labFeed } from '@/lib/feed'
import FeedList from './front/FeedList'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

interface LabListProps {
  experiments: LabSummary[]
}

export default function LabList({ experiments }: LabListProps) {
  return (
    <PageLayout>
      <PageTitle lede="Interactive experiments, deep dives, and weird beautiful things.">The Lab</PageTitle>
      <FeedList heading={null} items={labFeed(experiments)} narrow={true} showKind={false} titleLevel="h2" />
    </PageLayout>
  )
}
