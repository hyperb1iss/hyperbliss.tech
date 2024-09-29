// app/components/ResumePageContent.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import PageLayout from "./PageLayout";
import PageTitle from "./PageTitle";

// Styled components for resume content
const ResumeContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
`;

const ResumeContent = styled(ReactMarkdown)`
  font-size: 1.8rem;
  line-height: 1.6;
  color: var(--color-text);

  h1 {
    font-size: 3.6rem;
    color: var(--color-primary);
    margin-bottom: 1rem;
    text-align: center;
    text-shadow: 0 0 10px var(--color-primary);
  }

  h2 {
    font-size: 2.8rem;
    color: var(--color-secondary);
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-accent);
    padding-bottom: 0.5rem;
    text-shadow: 0 0 5px var(--color-secondary);
  }

  h3 {
    font-size: 2.2rem;
    color: var(--color-accent);
    margin-top: 2rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 5px var(--color-accent);
  }

  h4 {
    font-size: 2rem;
    color: var(--color-text);
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style-type: none;
    margin-left: 0;
    padding-left: 0;
  }

  li {
    margin-bottom: 0.75rem;
    position: relative;
    padding-left: 1.5rem;

    &::before {
      content: "▹";
      position: absolute;
      left: 0;
      color: var(--color-accent);
    }
  }

  a {
    color: var(--color-link);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    padding-bottom: 1px;

    &:hover {
      color: var(--color-secondary);
      border-bottom: 2px solid var(--color-secondary);
      text-shadow: 0px 0px 8px var(--color-secondary);
      text-decoration: none;
    }

    &:active {
      color: var(--color-primary);
    }
  }

  p {
    margin-bottom: 1.5rem;
  }

  strong {
    color: var(--color-secondary);
  }
`;

// Interface for ResumePageContent component props
interface ResumePageContentProps {
  content: string;
}

/**
 * ResumePageContent component
 * Renders the resume content with styling and animations.
 * @param {ResumePageContentProps} props - The component props
 * @returns {JSX.Element} Rendered resume page
 */
const ResumePageContent: React.FC<ResumePageContentProps> = ({ content }) => {
  return (
    <PageLayout>
      <PageTitle>Resume</PageTitle>
      <ResumeContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResumeContent>{content}</ResumeContent>
      </ResumeContainer>
    </PageLayout>
  );
};

export default ResumePageContent;
