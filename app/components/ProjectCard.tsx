// app/components/ProjectCard.tsx
import styled from "styled-components";
import { motion } from "framer-motion";
import Link from "next/link";

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 255, 255, 0.3);
  }
`;

const ProjectTitle = styled.h2`
  font-size: 2.4rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-text);
  margin-bottom: 2rem;
`;

const ProjectLink = styled(Link)`
  font-size: 1.6rem;
  color: var(--color-accent);
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: var(--color-secondary);
    text-decoration: underline;
  }
`;

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  github: string;
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
}) => {
  return (
    <Card
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div>
        <ProjectTitle>{title}</ProjectTitle>
        <ProjectDescription>{description}</ProjectDescription>
      </div>
      <div>
        <ProjectLink href={`/projects/${slug}`}>Learn More</ProjectLink>
        {" | "}
        <ProjectLink href={github} target="_blank" rel="noopener noreferrer">
          GitHub
        </ProjectLink>
      </div>
    </Card>
  );
};
