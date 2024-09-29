// app/components/FeaturedProjects.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import Link from "next/link";

/**
 * Styled components for the Featured Projects section
 */

// Wrapper for the Featured Projects section
const FeaturedProjectsSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(
    135deg,
    rgba(10, 10, 20, 0.9) 0%,
    rgba(20, 20, 40, 0.9) 100%
  );
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
`;

// Animated background elements (e.g., moving particles)
const BackgroundElement = styled(motion.div)<{
  top: number;
  left: number;
  size: number;
}>`
  position: absolute;
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: radial-gradient(circle, rgba(255, 0, 255, 0.3), transparent 70%);
  border-radius: 50%;
  opacity: 0.6;
`;

// Section title
const SectionTitle = styled(motion.h2)`
  font-size: 3.6rem;
  color: #ff00ff;
  margin-bottom: 3rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 10px #ff00ff;
`;

// Grid container for project cards
const ProjectGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

// Individual project card
const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 0, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(255, 0, 255, 0.2),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

// Project title
const ProjectTitle = styled.h3`
  font-size: 2.4rem;
  color: #00ffff;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px #00ffff;
`;

// Project description
const ProjectDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-text);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

// Link to view the project
const ViewProjectLink = styled(Link)`
  font-size: 1.6rem;
  color: #ff00ff;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0%;
    height: 2px;
    background-color: #00ffff;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

// Interface for project data
interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
  };
}

// Interface for component props
interface FeaturedProjectsProps {
  projects: Project[];
}

/**
 * FeaturedProjects component
 * Displays a section with featured projects, styled with animations.
 * @param {FeaturedProjectsProps} props - The component props
 * @returns {JSX.Element} Rendered featured projects section
 */
export default function FeaturedProjects({
  projects,
}: FeaturedProjectsProps): JSX.Element {
  return (
    <FeaturedProjectsSection>
      {/* Animated background elements */}
      {[...Array(15)].map((_, index) => (
        <BackgroundElement
          key={index}
          top={Math.random() * 100}
          left={Math.random() * 100}
          size={Math.random() * 80 + 20}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}

      <SectionTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Featured Projects
      </SectionTitle>
      <ProjectGrid
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.2,
              staggerChildren: 0.15,
            },
          },
          hidden: { opacity: 0 },
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: index * 0.1,
            }}
          >
            <ProjectTitle>{project.frontmatter.title}</ProjectTitle>
            <ProjectDescription>
              {project.frontmatter.description}
            </ProjectDescription>
            <ViewProjectLink href={`/projects/${project.slug}`}>
              View Project →
            </ViewProjectLink>
          </ProjectCard>
        ))}
      </ProjectGrid>
    </FeaturedProjectsSection>
  );
}
