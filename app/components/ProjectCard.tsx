// app/components/ProjectCard.tsx
import styled from "styled-components";
import { motion } from "framer-motion";
import Link from "next/link";

// Styled components for the project card
const Card = styled(motion.div)`
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

const ProjectTitle = styled.h2`
  font-size: 2.4rem;
  color: #00ffff;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px #00ffff;
`;

const ProjectDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-text);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectLink = styled(Link)`
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

// Props interface for ProjectCard component
interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  github: string;
  index: number;
}

/**
 * ProjectCard component
 * Renders a single project card with title, description, and links.
 * @param {ProjectCardProps} props - The component props
 * @returns {JSX.Element} Rendered project card
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  title,
  description,
  github,
  index,
}) => {
  return (
    <Card
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
    >
      <div>
        <ProjectTitle>{title}</ProjectTitle>
        <ProjectDescription>{description}</ProjectDescription>
      </div>
      <ProjectLinks>
        <ProjectLink href={`/projects/${slug}`}>Learn More</ProjectLink>
        <ProjectLink href={github} target="_blank" rel="noopener noreferrer">
          GitHub
        </ProjectLink>
      </ProjectLinks>
    </Card>
  );
};
