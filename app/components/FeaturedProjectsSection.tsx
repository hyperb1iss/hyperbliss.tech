// app/components/FeaturedProjectsSection.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import GlitchSpan from "./GlitchSpan";
import StyledTitle from "./StyledTitle";
import Card from "./Card";

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

interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
    tags: string[];
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
      setMaxHeight(0);
      setTimeout(() => {
        const cards = document.querySelectorAll(".project-card");
        let maxCardHeight = 0;
        cards.forEach((card) => {
          (card as HTMLElement).style.height = "auto";
          const cardHeight = card.getBoundingClientRect().height;
          if (cardHeight > maxCardHeight) {
            maxCardHeight = cardHeight;
          }
        });
        setMaxHeight(maxCardHeight);
      }, 0);
    };

    updateMaxHeight();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateMaxHeight, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
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
        {projectList.map((project, index) => (
          <Card
            key={project.slug}
            title={project.frontmatter.title}
            description={project.frontmatter.description}
            link={`/projects/${project.slug}`}
            color="0, 255, 255"
            tags={project.frontmatter.tags}
            githubLink={project.frontmatter.github}
            linkText="Learn More"
            index={index}
            className="project-card"
            style={{ height: maxHeight > 0 ? `${maxHeight}px` : "auto" }}
          />
        ))}
      </ProjectsGrid>
    </FeaturedProjectsSection>
  );
}
