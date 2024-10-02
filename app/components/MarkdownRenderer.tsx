// app/components/MarkdownRenderer.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import CyberpunkCodeBlock from "./CyberpunkCodeBlock";
import {
  StyledLink as MarkdownLink,
  StyledBlockquote,
  StyledH1,
  StyledH2,
  StyledH3,
  StyledHr,
  StyledImage,
  StyledInlineCode,
  StyledLi,
  StyledOl,
  StyledParagraph,
  StyledUl,
} from "./MarkdownStyles";

// Define the props interface
interface MarkdownRendererProps {
  content: string;
}

/**
 * MarkdownRenderer Component
 * Renders Markdown content with custom styled components.
 * @param {MarkdownRendererProps} props - The component props
 * @returns {JSX.Element} Rendered Markdown content
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Headings
        h1: (props) => <StyledH1 {...props} />,
        h2: (props) => <StyledH2 {...props} />,
        h3: (props) => <StyledH3 {...props} />,

        // Paragraph
        p: (props) => <StyledParagraph {...props} />,

        // Links
        a: (props) => <MarkdownLink {...props} />,

        // Lists
        ul: (props) => <StyledUl {...props} />,
        ol: (props) => <StyledOl {...props} />,
        li: (props) => <StyledLi {...props} />,

        // Blockquote
        blockquote: (props) => <StyledBlockquote {...props} />,

        // Horizontal Rule
        hr: (props) => <StyledHr {...props} />,

        // Inline Code and Code Blocks
        code: ({ inline, className, children, ...props }: CodeProps) => {
          if (inline) {
            return <StyledInlineCode {...props}>{children}</StyledInlineCode>;
          }

          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <CyberpunkCodeBlock
              language={match[1]}
              code={String(children).replace(/\n$/, "")}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },

        // Images
        img: (props) => <StyledImage {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
