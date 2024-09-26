// app/components/ResumePageContent.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import PageLayout from "./PageLayout";
import PageTitle from "./PageTitle";

const ResumeContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  }

  h2 {
    font-size: 2.8rem;
    color: var(--color-secondary);
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-accent);
    padding-bottom: 0.5rem;
  }

  h3 {
    font-size: 2.2rem;
    color: var(--color-accent);
    margin-top: 2rem;
    margin-bottom: 1rem;
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
    color: var(--color-link); /* Updated to a distinct link color */
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* Subtle underline */
    transition: all 0.3s ease;
    padding-bottom: 1px;

    &:hover {
      color: var(--color-secondary);
      border-bottom: 2px solid var(--color-secondary); /* Bolder on hover */
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

interface ResumePageContentProps {
  content: string;
}

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
