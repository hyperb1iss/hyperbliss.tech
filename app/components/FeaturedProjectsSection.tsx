"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import styled from "styled-components";
import GlitchSpan from "./GlitchSpan";
import StyledTitle from "./StyledTitle";

const FeaturedProjectsSection = styled.section`
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 2rem 2rem;
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  max-width: 1200px;
  margin: 2rem 0 0 0;
  grid-auto-rows: 1fr;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4);
    transform: translateY(-5px);
    border-color: #00ffff;

    &::before {
      opacity: 1;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(0, 255, 255, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.6rem;
  color: #00ffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 7px #00ffff;
`;

const ProjectDescription = styled.p`
  font-size: 1.3rem;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ProjectLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectLink = styled.div`
  font-size: 1.4rem;
  color: #ff00ff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
  }
`;

const GithubLink = styled.div`
  font-size: 1.4rem;
  color: #00ffff;
  transition: all 0.3s ease;

  &:hover {
    color: #ff00ff;
    text-shadow: 0 0 5px #ff00ff;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Tag = styled.span`
  background: rgba(255, 0, 255, 0.1);
  color: #ff00ff;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 1.2rem;
  text-shadow: 0 0 3px #ff00ff;
`;

interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
    tags: string[]; // Add this line
  };
}

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [projectList, setProjectList] = useState(projects);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    const shuffled = [...projects].sort(() => 0.5 - Math.random());
    setProjectList(shuffled.slice(0, 4));
  }, [projects]);

  useEffect(() => {
    const updateMaxHeight = () => {
      const cards = document.querySelectorAll(".project-card");
      let maxCardHeight = 0;
      cards.forEach((card) => {
        const cardHeight = card.getBoundingClientRect().height;
        if (cardHeight > maxCardHeight) {
          maxCardHeight = cardHeight;
        }
      });
      setMaxHeight(maxCardHeight);
    };

    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, [projectList]);

  return (
    <FeaturedProjectsSection>
      <StyledTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        $isMobile={true}
      >
        <GlitchSpan data-text="Featured Projects">Featured Projects</GlitchSpan>
      </StyledTitle>
      <ProjectsGrid
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {projectList.map((project) => (
          <Link href={`/projects/${project.slug}`} key={project.slug} passHref>
            <ProjectCard
              className="project-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              style={{ height: maxHeight > 0 ? `${maxHeight}px` : "auto" }}
            >
              <ProjectTitle>{project.frontmatter.title}</ProjectTitle>
              <ProjectDescription>
                {project.frontmatter.description}
              </ProjectDescription>
              <TagsContainer>
                {project.frontmatter.tags &&
                  project.frontmatter.tags.length > 0 &&
                  project.frontmatter.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
              </TagsContainer>
              <ProjectLinks>
                <ProjectLink>
                  Learn More
                  <FaArrowRight style={{ marginLeft: "5px" }} />
                </ProjectLink>
                <GithubLink>
                  <FaGithub />
                </GithubLink>
              </ProjectLinks>
            </ProjectCard>
          </Link>
        ))}
      </ProjectsGrid>
    </FeaturedProjectsSection>
  );
}
