// app/components/ProjectDetail.tsx
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import ProjectMarkdownRenderer from './ProjectMarkdownRenderer'

interface ProjectDetailProps {
  title: string
  github: string
  content: string
  author?: string
  tags?: string[]
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
  color: #00ffff;
  margin-bottom: 1rem;
  text-shadow: 0 0 7px #00ffff;
  text-align: center;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 50%;
    height: 2px;
    background: var(--color-primary);
    left: 25%;
    bottom: -10px;
    box-shadow: 0 0 10px var(--color-primary);
  }
`

const metaStyles = css`
  font-size: clamp(1.4rem, 1.5vw, 2rem);
  color: var(--color-muted);
  margin-bottom: 2rem;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;

  span {
    margin: 0 0.5rem;
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
  background-color: rgba(0, 255, 255, 0.2);
  color: var(--color-accent);
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: clamp(1.2rem, 1.2vw, 1.6rem);
  text-shadow: 0 0 5px var(--color-accent);
  cursor: pointer;
`

const contentStyles = css`
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  line-height: 1.6;
  color: var(--color-text);
`

const githubLinkStyles = css`
  display: block;
  margin: 2rem auto 0;
  width: fit-content;
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
  text-align: center;

  &:hover {
    color: var(--color-secondary);
  }
`

const ProjectDetail: React.FC<ProjectDetailProps> = ({ title, github, content, author, tags }) => {
  return (
    <Container>
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className={titleStyles}
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
        {author && <span>Author: {author}</span>}
      </motion.div>
      {tags && tags.length > 0 && (
        <motion.div
          animate={{ opacity: 1 }}
          className={tagsContainerStyles}
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
        initial={{ opacity: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <ProjectMarkdownRenderer content={content} />
      </motion.div>
      <motion.a
        animate={{ opacity: 1 }}
        className={githubLinkStyles}
        href={github}
        initial={{ opacity: 0 }}
        rel="noopener noreferrer"
        target="_blank"
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        View on GitHub
      </motion.a>
    </Container>
  )
}

export default ProjectDetail
