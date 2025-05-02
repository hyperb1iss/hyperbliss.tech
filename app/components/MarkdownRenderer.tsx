// app/components/MarkdownRenderer.tsx
"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { StyleSheetManager } from "styled-components";
import rehypeHighlight from "rehype-highlight";
import styled from "styled-components";
import { FiCheck, FiCopy } from "react-icons/fi";
import { toString } from "hast-util-to-string"; // For extracting text content
import type { Element } from "hast"; // Re-adding for proper node typing
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

// Define a custom interface for the code component props
interface CodeComponentProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  // Add any other props as needed
}

// Function to filter out props that shouldn't be forwarded to DOM elements
const shouldForwardProp = (prop: string): boolean => {
  // List of props that should not be forwarded to DOM elements
  const invalidProps = ["node"];
  return !invalidProps.includes(prop);
};

// Styled components for the copy button and wrapper
const CopyButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  color: #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  z-index: 1; // Ensure button is clickable

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    width: 1.2em;
    height: 1.2em;
  }
`;

// Renamed to CodeBlockPreWrapper and changed tag to pre
const CodeBlockPreWrapper = styled.pre`
  position: relative;
  margin: 0.5em 0; // Replicates margin from original pre style

  &:hover ${CopyButton} {
    opacity: 1;
  }

  /* Apply cyberpunk theme styles directly to THIS pre element */
  background: #1a1a2e !important;
  color: #f0f0f0 !important;
  padding: 1em !important;
  border-radius: 0.5rem !important;
  overflow: auto !important;
  font-family: var(--font-mono) !important; /* Explicitly use CSS variable */
  font-size: 1.2rem !important; /* Use explicit rem unit for consistency */
  line-height: 1.4 !important;
  box-shadow:
    0 0 10px rgba(0, 255, 255, 0.3),
    0 0 20px rgba(255, 0, 255, 0.3) !important;
  margin: 0.5em 0 !important; // Keep original margin logic
  white-space: pre-wrap !important;
  word-spacing: normal !important;
  word-break: normal !important;
  word-wrap: normal !important;

  /* Target code tag inside for specific adjustments if needed */
  code {
    font-family: var(--font-mono) !important; /* Explicitly use CSS variable here too */
    background: none !important; /* Ensure code tag itself isn't styled */
    padding: 0 !important;
    margin: 0 !important;
    display: block; /* Ensure code takes block space within pre */
    color: inherit; /* Inherit color */

    /* Theme colors for highlight spans within code */
    .hljs-comment,
    .hljs-prolog,
    .hljs-doctype,
    .hljs-cdata {
      color: #4a9fb1 !important;
    }
    .hljs-punctuation {
      color: #f0f0f0 !important;
    }
    .hljs-property,
    .hljs-tag,
    .hljs-boolean,
    .hljs-number,
    .hljs-constant,
    .hljs-symbol,
    .hljs-deleted {
      color: #f92aad !important;
    }
    .hljs-selector,
    .hljs-attr-name,
    .hljs-string,
    .hljs-char,
    .hljs-builtin,
    .hljs-inserted {
      color: #36f9f6 !important;
    }
    .hljs-operator,
    .hljs-entity,
    .hljs-url,
    .language-css .hljs-string,
    .style .hljs-string,
    .hljs-variable {
      color: #ff7edb !important;
    }
    .hljs-atrule,
    .hljs-attr-value,
    .hljs-function,
    .hljs-class-name {
      color: #fede5d !important;
    }
    .hljs-keyword,
    .hljs-regex,
    .hljs-important {
      color: #f97e72 !important;
    }
    .hljs-important {
      font-weight: bold !important;
    }
  }
`;

// --- New Component for Pre Block Logic ---
// Use React.ComponentProps to get standard <pre> attributes and add our specific node prop
interface PreWithCopyProps extends React.ComponentProps<"pre"> {
  node?: Element; // Type the node prop correctly
  children?: React.ReactNode;
}

const PreWithCopy: React.FC<PreWithCopyProps> = ({ node, children, ...rest }) => {
  // Extract code content for copy button
  let codeContent = "";
  if (node && node.type === "element") {
    codeContent = toString(node);
  } else {
    // Fallback for unexpected node types
    console.warn("Could not extract code content accurately for copy button.");
    codeContent = React.Children.toArray(children)
      .map((child) => String(child))
      .join("");
  }
  // Simple cleanup
  codeContent = codeContent.replace(/\n$/, "");

  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Render our styled <pre> wrapper, passing original children (the <code> tag)
  // Pass original pre props (like className if any) down using ...rest
  return (
    <CodeBlockPreWrapper {...rest}>
      {children}
      {/* This should render the <code...> element processed by rehype-highlight */}
      <CopyButton onClick={copyToClipboard}>{isCopied ? <FiCheck /> : <FiCopy />}</CopyButton>
    </CodeBlockPreWrapper>
  );
};

/**
 * MarkdownRenderer Component
 * Renders Markdown content with custom styled components.
 * @param {MarkdownRendererProps} props - The component props
 * @returns {JSX.Element} Rendered Markdown content
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
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

          // UPDATED Custom 'pre' component implementation
          pre: (props) => {
            // Render the component that contains the hook logic
            return <PreWithCopy {...props} />;
          },

          // UPDATED 'code' component: Only handles inline code now
          code: ({ inline, className, children, ...props }: CodeComponentProps) => {
            if (inline) {
              return <StyledInlineCode {...props}>{children}</StyledInlineCode>;
            }

            // Block code: Render the plain code tag.
            // Our 'pre' component above will wrap it and add the button/styles.
            // Pass className for language detection by rehype-highlight.
            return (
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
    </StyleSheetManager>
  );
};

export default MarkdownRenderer;
