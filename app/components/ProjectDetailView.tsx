'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { FaGithub } from 'react-icons/fa6'
import ProjectMarkdownRenderer from './ProjectMarkdownRenderer'
import { StarDivider } from './StarComponents'

interface ProjectDetailViewProps {
  title: string
  github: string
  body: string | null
  tags?: string[]
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ title, github, body, tags }) => {
  return (
    <article className="project-detail">
      <header className="project-detail__hero">
        <div className="project-detail__decoration" />
        <div className="project-detail__decoration" />

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="project-detail__title-wrap"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="project-detail__title">{title}</h1>
        </motion.div>

        {tags && tags.length > 0 && (
          <motion.div
            animate={{ opacity: 1 }}
            className="project-detail__tags"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {tags.map((tag) => (
              <span className="project-detail__tag" key={tag}>
                {tag}
              </span>
            ))}
          </motion.div>
        )}
      </header>

      <motion.div
        animate={{ opacity: 1 }}
        className="project-detail__divider"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <StarDivider compact={true} />
      </motion.div>

      <motion.div
        animate={{ opacity: 1 }}
        className="project-detail__content"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {body && <ProjectMarkdownRenderer content={body} />}
      </motion.div>

      {github && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="project-detail__actions"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <a className="project-detail__github" href={github} rel="noopener noreferrer" target="_blank">
            <FaGithub />
            <span>View on GitHub</span>
          </a>
        </motion.div>
      )}
    </article>
  )
}

export default ProjectDetailView
