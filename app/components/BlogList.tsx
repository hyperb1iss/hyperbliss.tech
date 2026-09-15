// app/components/BlogList.tsx
// The Blog index: every essay as a feed row, newest first. Server component.

import type { PostSummary } from '@/lib/content'
import { essayFeed } from '@/lib/feed'
import FeedList from './front/FeedList'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

interface BlogListProps {
  posts: PostSummary[]
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <PageLayout>
      <PageTitle lede="Field notes on developer tools, terminal interfaces, creative coding, and building with AI.">
        Writing
      </PageTitle>
      <FeedList heading={null} items={essayFeed(posts)} narrow={true} showKind={false} titleLevel="h2" />
    </PageLayout>
  )
}
