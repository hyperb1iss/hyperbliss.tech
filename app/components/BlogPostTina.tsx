// app/components/BlogPostTina.tsx
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdownContent } from 'tinacms/dist/rich-text'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import { Posts } from '../../tina/__generated__/types'
import { useTinaSafe } from '../lib/useTinaSafe'
import { SparklingName } from './SparklingName'
import TinaContent from './TinaContent'

interface BlogPostTinaProps {
  title: string
  date: string
  body: TinaMarkdownContent | string | null
  author?: string
  tags?: string[]
  // Visual editing props
  query: string
  variables: { relativePath: string }
  data: object
}

const Container = styled.div`
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 2rem;

  @media (max-width: 1200px) {
    width: 90%;
  }

  @media (max-width: 768px) {
    padding: 6rem 1rem 1rem;
  }
`

const titleStyles = css`
  font-size: clamp(2.5rem, 3.5vw, 4.5rem);
  color: var(--color-secondary);
  margin-bottom: 1rem;
  text-shadow: 0 0 10px var(--color-secondary);
  text-align: center;
`

const metaStyles = css`
  font-size: clamp(1.4rem, 1.5vw, 2rem);
  color: var(--color-muted);
  margin: 2rem 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;

  .date {
    color: var(--color-primary);
    font-weight: 700;
    text-shadow: 0 0 3px var(--color-primary);
  }

  .separator {
    color: var(--color-accent);
    margin: 0 0.2rem;
    font-weight: 300;
    text-shadow: 0 0 3px var(--color-accent);
  }

  .author-wrapper {
    display: flex;
    align-items: center;
    color: var(--color-primary);
    text-shadow: 0 0 3px var(--color-primary);

    span {
      color: var(--color-primary);
    }
  }
`

const tagsContainerStyles = css`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`

const Tag = styled.span`
  background-color: rgba(255, 0, 255, 0.2);
  color: var(--color-secondary);
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: clamp(1.2rem, 1.2vw, 1.6rem);
  text-shadow: 0 0 5px var(--color-secondary);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 0, 255, 0.3);
    transform: translateY(-1px);
  }
`

const contentStyles = css`
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  line-height: 1.6;
  color: var(--color-text);
`

const BlogPostTina: React.FC<BlogPostTinaProps> = ({
  title: initialTitle,
  date: initialDate,
  body: initialBody,
  author: initialAuthor,
  tags: initialTags,
  query,
  variables,
  data: initialData,
}) => {
  // Use TinaCMS hook for live editing in visual editor
  const { data } = useTinaSafe({
    data: initialData,
    query,
    variables,
  })

  // Extract live data from the response (falls back to initial data when not in editor)
  const post = (data as { posts: Posts })?.posts
  const title = post?.title ?? initialTitle
  const date = post?.date ?? initialDate
  const author = post?.author ?? initialAuthor
  const tags = (post?.tags?.filter((t): t is string => t !== null) ?? initialTags) || []
  // Note: body requires special handling since we pre-process it server-side
  // For live editing of body content, we'd need to handle the AST directly
  const body = initialBody

  return (
    <Container>
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className={titleStyles}
        data-tina-field={post ? tinaField(post, 'title') : undefined}
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h1>
      <motion.div
        animate={{ opacity: 1 }}
        className={metaStyles}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {date && (
          <span className="date" data-tina-field={post ? tinaField(post, 'date') : undefined}>
            {new Date(date).toLocaleDateString()}
          </span>
        )}
        {author && (
          <>
            <span className="separator">•</span>
            <span className="author-wrapper" data-tina-field={post ? tinaField(post, 'author') : undefined}>
              <SparklingName name={author} sparkleCount={3} />
            </span>
          </>
        )}
      </motion.div>
      {tags && tags.length > 0 && (
        <motion.div
          animate={{ opacity: 1 }}
          className={tagsContainerStyles}
          data-tina-field={post ? tinaField(post, 'tags') : undefined}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </motion.div>
      )}
      <motion.div
        animate={{ opacity: 1 }}
        className={contentStyles}
        data-tina-field={post ? tinaField(post, 'body') : undefined}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <TinaContent content={body} />
      </motion.div>
    </Container>
  )
}

export default BlogPostTina
