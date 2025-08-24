// app/components/LatestBlogPosts.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import styled from 'styled-components'
import Card from './Card'
import GlitchSpan from './GlitchSpan'
import { usePageLoad } from './PageLoadOrchestrator'
import StyledTitle from './StyledTitle'

interface BlogPost {
  slug: string
  frontmatter: {
    title: string
    excerpt: string
    date: string
    author?: string
    tags: string[]
  }
}

interface LatestBlogPostsProps {
  posts: BlogPost[]
  isMobile: boolean
}

const SidebarContainer = styled(motion.div)`
  width: 100%;
  padding: 8rem 16px 2rem; /* Apply horizontal padding here */
  overflow-y: auto;
`

const SidebarContent = styled(motion.div)<{ $isMobile: boolean }>`
  display: ${(props) => (props.$isMobile ? 'grid' : 'flex')};
  flex-direction: column;
  ${(props) =>
    props.$isMobile &&
    `
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  `}
  gap: 2rem;
  max-width: 100%;
  margin: 0 auto;
  /* Removed padding from here to prevent double padding */

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const TitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    cursor: pointer;
  }
`

export default function LatestBlogPosts({ posts, isMobile }: LatestBlogPostsProps) {
  const { isInitialLoad } = usePageLoad()

  return (
    <SidebarContainer
      animate={{ opacity: 1 }}
      initial={{ opacity: isInitialLoad ? 0 : 1 }}
      transition={{ delay: isInitialLoad ? 0.7 : 0, duration: isInitialLoad ? 0.5 : 0, ease: 'easeOut' }}
    >
      <StyledTitle
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: isInitialLoad ? 0 : 1, y: isInitialLoad ? -10 : 0 }}
        transition={{ delay: isInitialLoad ? 0.8 : 0, duration: isInitialLoad ? 0.4 : 0 }}
      >
        <TitleLink href="/blog">
          <GlitchSpan data-text="Latest Posts">Latest Posts</GlitchSpan>
        </TitleLink>
      </StyledTitle>
      <SidebarContent $isMobile={isMobile}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Card
              className="blog-post-card"
              color="255, 0, 255"
              description={post.frontmatter.excerpt}
              index={index}
              key={post.slug}
              link={`/blog/${post.slug}`}
              linkColor="0, 255, 255"
              meta={`${new Date(post.frontmatter.date).toLocaleDateString()} ${
                post.frontmatter.author ? `• ${post.frontmatter.author}` : ''
              }`}
              tags={post.frontmatter.tags}
              title={post.frontmatter.title}
            />
          ))
        ) : (
          <motion.p>No posts available at the moment.</motion.p>
        )}
      </SidebarContent>
    </SidebarContainer>
  )
}
