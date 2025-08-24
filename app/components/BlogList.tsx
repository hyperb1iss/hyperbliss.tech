// app/components/BlogList.tsx
'use client'

import { motion } from 'framer-motion'
import styled from 'styled-components'
import Card from './Card'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

const PostList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
          <Card
            color="255, 0, 255"
            description={frontmatter.excerpt}
            index={index}
            key={slug}
            link={`/blog/${slug}`}
            linkColor="0, 255, 255"
            linkText="Read More"
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
