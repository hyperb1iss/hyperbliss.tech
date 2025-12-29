// app/components/ProjectDetailTina.tsx
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'
import { TinaMarkdownContent } from 'tinacms/dist/rich-text'
import TinaContent from './TinaContent'

interface ProjectDetailTinaProps {
  title: string
  github: string
  body: TinaMarkdownContent | string | null
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

const Title = styled(motion.h1)`
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

const Meta = styled(motion.div)`
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

const TagsContainer = styled(motion.div)`
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

const Content = styled(motion.div)`
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  line-height: 1.6;
  color: var(--color-text);
`

const GitHubLink = styled(motion.a)`
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

const ProjectDetailTina: React.FC<ProjectDetailTinaProps> = ({ title, github, body, author, tags }) => {
  return (
    <Container>
      <Title animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
        {title}
      </Title>
      <Meta animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
        {author && <span>Author: {author}</span>}
      </Meta>
      {tags && tags.length > 0 && (
        <TagsContainer animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsContainer>
      )}
      <Content animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
        <TinaContent content={body} />
      </Content>
      {github && (
        <GitHubLink
          animate={{ opacity: 1 }}
          href={github}
          initial={{ opacity: 0 }}
          rel="noopener noreferrer"
          target="_blank"
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          View on GitHub
        </GitHubLink>
      )}
    </Container>
  )
}

export default ProjectDetailTina
