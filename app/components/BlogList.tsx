// app/components/BlogList.tsx
'use client'

import { motion } from 'framer-motion'
import styled from 'styled-components'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'
import SilkCard from './SilkCard'

const PostList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: var(--space-10);
  padding: var(--space-12) 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  }
`

interface Post {
  slug: string
  frontmatter: {
    title: string
    date: string
    excerpt: string
    author?: string
    tags?: string[]
  }
}

interface BlogListProps {
  posts: Post[]
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <PageLayout>
      <PageTitle>Blog</PageTitle>
      <PostList
        animate="visible"
        initial="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.2,
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {posts.map(({ slug, frontmatter }, index) => (
          <SilkCard
            description={frontmatter.excerpt}
            index={index}
            key={slug}
            link={`/blog/${slug}`}
            linkText="Read Post"
            meta={`${new Date(frontmatter.date).toLocaleDateString()} ${
              frontmatter.author ? `• ${frontmatter.author}` : ''
            }`}
            tags={frontmatter.tags}
            title={frontmatter.title}
          />
        ))}
      </PostList>
    </PageLayout>
  )
}
