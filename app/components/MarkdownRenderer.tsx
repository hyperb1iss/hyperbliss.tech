// app/components/MarkdownRenderer.tsx
'use client'

import type { Element } from 'hast' // Re-adding for proper node typing
import { toString as hastToString } from 'hast-util-to-string' // For extracting text content
import React, { useEffect, useState } from 'react'
import { FiCheck, FiCopy } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import styled, { StyleSheetManager } from 'styled-components'
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
} from './MarkdownStyles'

// Define the props interface
interface MarkdownRendererProps {
  content: string
}

// Define a custom interface for the code component props
interface CodeComponentProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
  // Add any other props as needed
}

// Function to filter out props that shouldn't be forwarded to DOM elements
const shouldForwardProp = (prop: string): boolean => {
  // List of props that should not be forwarded to DOM elements
  const invalidProps = ['node']
  return !invalidProps.includes(prop)
}

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
`

// Renamed to CodeBlockPreWrapper and changed tag to pre
const CodeBlockPreWrapper = styled.pre`
  position: relative;

  &:hover ${CopyButton} {
    opacity: 1;
  }

  /* Apply cyberpunk theme styles directly to THIS pre element */
  /* Use CSS Variables, remove !important from colors */
  background: var(--color-code-background) !important; /* Keep important for base override */
  color: var(--color-code-text) !important; /* Keep important for base override */
  padding: 1em !important; /* Keep important for layout */
  border-radius: 0.5rem !important; /* Keep important for layout */
  overflow: auto !important; /* Keep important for layout */
  font-family: var(--font-mono) !important; /* Keep important for base override */
  font-size: 1.2rem !important; /* Keep important for layout */
  line-height: 1.4 !important; /* Keep important for layout */
  box-shadow:
    0 0 10px rgba(0, 255, 255, 0.3),
    0 0 20px rgba(255, 0, 255, 0.3);
  margin: 0.5em 0 !important; // Keep original margin logic
  white-space: pre-wrap !important; /* Keep important for layout */
  word-spacing: normal !important; /* Keep important for layout */
  word-break: normal !important; /* Keep important for layout */
  word-wrap: normal !important; /* Keep important for layout */

  /* Target code tag inside */
  code {
    font-family: inherit; /* Use inherit now that pre is explicitly set */
    background: none;
    padding: 0;
    margin: 0;
    display: block;
    color: inherit;
    white-space: inherit; /* Inherit wrap setting */
    word-spacing: inherit;
    word-break: inherit;
    word-wrap: inherit;

    /* Theme colors for highlight spans within code - Use CSS variables, remove !important */
    .hljs-comment,
    .hljs-prolog,
    .hljs-doctype,
    .hljs-cdata {
      color: var(--color-code-comment);
    }
    .hljs-punctuation {
      color: var(--color-code-punctuation);
    }
    .hljs-property,
    .hljs-tag,
    .hljs-boolean,
    .hljs-number,
    .hljs-constant,
    .hljs-symbol,
    .hljs-deleted {
      color: var(--color-code-property);
    }
    .hljs-selector,
    .hljs-attr-name,
    .hljs-string,
    .hljs-char,
    .hljs-builtin,
    .hljs-inserted {
      color: var(--color-code-selector);
    }
    .hljs-operator,
    .hljs-entity,
    .hljs-url,
    .language-css .hljs-string,
    .style .hljs-string,
    .hljs-variable {
      color: var(--color-code-operator);
    }
    .hljs-atrule,
    .hljs-attr-value,
    .hljs-function,
    .hljs-class-name {
      color: var(--color-code-function);
    }
    .hljs-keyword,
    .hljs-regex,
    .hljs-important {
      color: var(--color-code-keyword);
    }
    .hljs-important {
      font-weight: bold;
    }
  }
`

// --- New Component for Pre Block Logic ---
interface PreWithCopyProps extends React.ComponentProps<'pre'> {
  node?: Element
  children?: React.ReactNode
}

const PreWithCopy: React.FC<PreWithCopyProps> = ({ node, children, ...rest }) => {
  // State for clipboard API availability and copy status
  const [isClipboardApiAvailable, setIsClipboardApiAvailable] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  // Check for Clipboard API on mount
  useEffect(() => {
    setIsClipboardApiAvailable(!!navigator.clipboard?.writeText)
  }, [])

  // Extract code content for copy button
  let codeContent = ''
  if (node && node.type === 'element') {
    codeContent = hastToString(node)
  } else {
    // Fallback logic without warning
    codeContent = React.Children.toArray(children)
      .map((child) => String(child))
      .join('')
  }
  codeContent = codeContent.replace(/\n$/, '')

  const copyToClipboard = async () => {
    if (!isClipboardApiAvailable || isCopying) return

    setIsCopying(true)
    setIsCopied(false) // Reset copied state
    try {
      await navigator.clipboard.writeText(codeContent)
      setIsCopied(true)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      // Optionally: set an error state here to show feedback
    } finally {
      setIsCopying(false)
      // Reset copied check icon after a delay
      if (isCopied) {
        setTimeout(() => setIsCopied(false), 2000)
      }
    }
  }

  return (
    <CodeBlockPreWrapper {...rest}>
      {children}
      <CopyButton
        disabled={!isClipboardApiAvailable || isCopying}
        onClick={copyToClipboard}
        title={isClipboardApiAvailable ? 'Copy code' : 'Clipboard API not available'}
      >
        {isCopying ? '...' : isCopied ? <FiCheck /> : <FiCopy />}
      </CopyButton>
    </CodeBlockPreWrapper>
  )
}

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
        components={{
          // Links
          a: (props) => <MarkdownLink {...props} />,

          // Blockquote
          blockquote: (props) => <StyledBlockquote {...props} />,

          // UPDATED 'code' component: Only handles inline code now
          code: ({ inline, className, children, ...props }: CodeComponentProps) => {
            if (inline) {
              return <StyledInlineCode {...props}>{children}</StyledInlineCode>
            }

            // Block code: Render the plain code tag.
            // Our 'pre' component above will wrap it and add the button/styles.
            // Pass className for language detection by rehype-highlight.
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // Headings
          h1: (props) => <StyledH1 {...props} />,
          h2: (props) => <StyledH2 {...props} />,
          h3: (props) => <StyledH3 {...props} />,

          // Horizontal Rule
          hr: (props) => <StyledHr {...props} />,

          // Images
          img: (props) => <StyledImage {...props} />,
          li: (props) => <StyledLi {...props} />,
          ol: (props) => <StyledOl {...props} />,

          // Paragraph
          p: (props) => <StyledParagraph {...props} />,

          // UPDATED Custom 'pre' component implementation
          pre: (props) => {
            // Render the component that contains the hook logic
            return <PreWithCopy {...props} />
          },

          // Lists
          ul: (props) => <StyledUl {...props} />,
        }}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </StyleSheetManager>
  )
}

export default MarkdownRenderer
