// app/components/ResumePageContent.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import PageLayout from "./PageLayout";
import PageTitle from "./PageTitle";

const ResumeContent = styled(ReactMarkdown)`
  font-size: 1.8rem;
  line-height: 1.6;
  color: var(--color-text);

  h1,
  h2,
  h3,
  h4 {
    color: var(--color-primary);
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: disc;
    margin-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: var(--color-accent);
    text-decoration: underline;
    &:hover {
      color: var(--color-secondary);
    }
  }
`;

// Define the props interface with 'content'
interface ResumePageContentProps {
  content: string;
}

const ResumePageContent: React.FC<ResumePageContentProps> = ({ content }) => {
  return (
    <PageLayout>
      <PageTitle>Resume</PageTitle>
      <ResumeContent>{content}</ResumeContent>
    </PageLayout>
  );
};

export default ResumePageContent;
