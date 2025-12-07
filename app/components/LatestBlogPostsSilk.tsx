// app/components/LatestBlogPostsSilk.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import styled from 'styled-components'
import BlogCard from './BlogCard'
import { usePageLoad } from './PageLoadOrchestrator'

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

interface LatestBlogPostsSilkProps {
  posts: BlogPost[]
  isMobile: boolean
}

const SidebarContainer = styled(motion.aside)`
  width: 100%;
  padding: var(--space-20) var(--space-4) var(--space-8);
  overflow-y: auto;
`

const SidebarHeader = styled(motion.div)`
  margin-bottom: var(--space-8);
`

const Title = styled(motion.h2)`
  font-family: var(--font-display);
  font-size: var(--text-fluid-2xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  position: relative;
  display: inline-block;
`

const TitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  position: relative;
  
  &::after {
    content: '→';
    position: absolute;
    right: -1.5em;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    font-size: 0.8em;
    transition: all var(--duration-normal) var(--ease-silk);
  }
  
  &:hover {
    &::after {
      opacity: 1;
      right: -1.2em;
    }
  }
`

const TitleGradient = styled.span`
  background: linear-gradient(
    135deg,
    var(--silk-plasma-pink) 0%,
    var(--silk-quantum-purple) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const PostsGrid = styled(motion.div)<{ $isMobile: boolean }>`
  display: ${(props) => (props.$isMobile ? 'grid' : 'flex')};
  flex-direction: column;
  ${(props) =>
    props.$isMobile &&
    `
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  `}
  gap: var(--space-6);
  
  @media (max-width: 768px) {
    gap: var(--space-4);
  }
`

const EmptyState = styled(motion.div)`
  padding: var(--space-12) var(--space-8);
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-lg));
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  text-align: center;
`

const EmptyStateText = styled.p`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
`

const EmptyStateLink = styled(Link)`
  color: var(--silk-quantum-purple);
  text-decoration: none;
  font-weight: var(--font-semibold);
  transition: all var(--duration-fast) var(--ease-silk);
  
  &:hover {
    text-decoration: underline;
    text-decoration-color: var(--silk-quantum-purple);
    text-underline-offset: 4px;
  }
`

const FloatingShape = styled(motion.div)`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    var(--silk-plasma-pink-alpha-20),
    transparent 60%
  );
  filter: blur(40px);
  pointer-events: none;
  z-index: -1;
`

export default function LatestBlogPostsSilk({ posts, isMobile }: LatestBlogPostsSilkProps) {
  const { isInitialLoad } = usePageLoad()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: isInitialLoad ? 0.7 : 0,
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1] as const,
      },
      x: 0,
    },
  }

  const _formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  return (
    <SidebarContainer animate="visible" initial="hidden" variants={containerVariants}>
      {/* Floating decorative shape */}
      <FloatingShape
        animate={{
          rotate: [0, 180, 360],
          y: [0, 30, 0],
        }}
        initial={{ right: -100, top: -100 }}
        transition={{
          duration: 20,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <SidebarHeader variants={itemVariants}>
        <Title>
          <TitleLink href="/blog">
            <TitleGradient>Latest Posts</TitleGradient>
          </TitleLink>
        </Title>
      </SidebarHeader>

      <PostsGrid $isMobile={isMobile}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <motion.div key={post.slug} variants={itemVariants}>
              <BlogCard
                author={post.frontmatter.author}
                date={post.frontmatter.date}
                description={post.frontmatter.excerpt}
                index={index}
                link={`/blog/${post.slug}`}
                tags={post.frontmatter.tags}
                title={post.frontmatter.title}
              />
            </motion.div>
          ))
        ) : (
          <EmptyState variants={itemVariants}>
            <EmptyStateText>
              No posts available yet. Check back soon for exciting content about web development, design systems, and
              creative coding!
            </EmptyStateText>
            <EmptyStateText>
              <EmptyStateLink href="/about">Learn more about me</EmptyStateLink>
            </EmptyStateText>
          </EmptyState>
        )}
      </PostsGrid>
    </SidebarContainer>
  )
}
