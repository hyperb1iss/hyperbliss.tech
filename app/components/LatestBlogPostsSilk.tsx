// app/components/LatestBlogPostsSilk.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
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
}

const sectionWrapperStyles = css`
  padding: var(--space-16) var(--space-4);
  width: 100%;
`

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
`

const sidebarHeaderStyles = css`
  margin-bottom: var(--space-8);
`

const titleStyles = css`
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

const postsGridStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--space-10);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  }
`

const emptyStateStyles = css`
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

const floatingShapeStyles = css`
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

export default function LatestBlogPostsSilk({ posts }: LatestBlogPostsSilkProps) {
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
    <motion.section animate="visible" className={sectionWrapperStyles} initial="hidden" variants={containerVariants}>
      {/* Floating decorative shape */}
      <motion.div
        animate={{
          rotate: [0, 180, 360],
          y: [0, 30, 0],
        }}
        className={floatingShapeStyles}
        initial={{ right: -100, top: -100 }}
        style={{ right: -100, top: -100 }}
        transition={{
          duration: 20,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <Container>
        <motion.div className={sidebarHeaderStyles} variants={itemVariants}>
          <motion.h2 className={titleStyles}>
            <TitleLink href="/blog">
              <TitleGradient>Latest Posts</TitleGradient>
            </TitleLink>
          </motion.h2>
        </motion.div>

        <motion.div className={postsGridStyles}>
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
            <motion.div className={emptyStateStyles} variants={itemVariants}>
              <EmptyStateText>
                No posts available yet. Check back soon for exciting content about web development, design systems, and
                creative coding!
              </EmptyStateText>
              <EmptyStateText>
                <EmptyStateLink href="/about">Learn more about me</EmptyStateLink>
              </EmptyStateText>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </motion.section>
  )
}
