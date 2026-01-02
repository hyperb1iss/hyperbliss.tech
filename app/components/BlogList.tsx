// app/components/BlogList.tsx
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { css } from '../../styled-system/css'
import BlogCard from './BlogCard'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

const postListStyles = css`
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
  // Force re-render on mount to ensure styles are applied
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <PageLayout>
        <PageTitle>Blog</PageTitle>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageTitle>Blog</PageTitle>
      <motion.div
        animate="visible"
        className={postListStyles}
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
          <BlogCard
            author={frontmatter.author}
            date={frontmatter.date}
            description={frontmatter.excerpt}
            index={index}
            key={slug}
            link={`/blog/${slug}`}
            linkText="Read Post"
            tags={frontmatter.tags}
            title={frontmatter.title}
          />
        ))}
      </motion.div>
    </PageLayout>
  )
}
