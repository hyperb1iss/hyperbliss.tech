// app/components/BlogPost.tsx
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { formatPostDate } from '../lib/formatPostDate'
import MarkdownRenderer from './MarkdownRenderer'
import { BlogContent } from './MarkdownStyles'
import { SparklingName } from './SparklingName'

interface BlogPostProps {
  title: string
  date: string
  content: string
  author?: string
  tags?: string[]
}

const BlogPost: React.FC<BlogPostProps> = ({ title, date, content, author, tags }) => {
  return (
    <article className="blog-post">
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="blog-post__title"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h1>
      <motion.div
        animate={{ opacity: 1 }}
        className="blog-post__meta"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <time className="blog-post__date" dateTime={date}>
          {formatPostDate(date)}
        </time>
        {author && (
          <>
            <span className="blog-post__separator">•</span>
            <span className="blog-post__author">
              <SparklingName name={author} sparkleCount={3} />
            </span>
          </>
        )}
      </motion.div>
      {tags && tags.length > 0 && (
        <motion.div
          animate={{ opacity: 1 }}
          className="blog-post__tags"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {tags.map((tag) => (
            <span className="blog-post__tag" key={tag}>
              {tag}
            </span>
          ))}
        </motion.div>
      )}
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
        <BlogContent>
          <MarkdownRenderer content={content} />
        </BlogContent>
      </motion.div>
    </article>
  )
}

export default BlogPost
