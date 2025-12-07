// app/components/MarkdownRenderer.tsx
'use client'

import type { Element } from 'hast' // Re-adding for proper node typing
import { toString as hastToString } from 'hast-util-to-string' // For extracting text content
import React, { useEffect, useState } from 'react'
import { FiCheck, FiCopy } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

// Custom schema that allows code highlighting classes
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), 'className'],
    span: [...(defaultSchema.attributes?.span || []), 'className'],
  },
}

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
  top: 0.8rem;
  right: 0.8rem;
  background: linear-gradient(
    135deg,
    rgba(162, 89, 255, 0.2),
    rgba(255, 117, 216, 0.1)
  );
  border: 1px solid rgba(224, 170, 255, 0.3);
  border-radius: var(--radius-sm);
  padding: 0.5rem;
  color: var(--silk-lavender);
  cursor: pointer;
  transition: all 0.3s var(--ease-silk);
  opacity: 0;
  z-index: 1;
  backdrop-filter: blur(10px);

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(162, 89, 255, 0.3),
      rgba(255, 117, 216, 0.2)
    );
    border-color: var(--silk-plasma-pink);
    color: var(--silk-circuit-cyan);
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 117, 216, 0.3);
  }

  svg {
    width: 1.2em;
    height: 1.2em;
    filter: drop-shadow(0 0 3px currentColor);
  }
`

// Renamed to CodeBlockPreWrapper and changed tag to pre
const CodeBlockPreWrapper = styled.pre`
  position: relative;
  
  /* Add blog-syntax class for theme targeting */
  &.blog-syntax {
    /* Class added via props */
  }

  &:hover ${CopyButton} {
    opacity: 1;
  }

  /* Apply purple/magenta silk circuit theme */
  background: linear-gradient(
    135deg,
    rgba(255, 117, 216, 0.08) 0%,
    rgba(217, 70, 239, 0.06) 20%,
    rgba(30, 25, 45, 0.95) 40%,
    rgba(236, 72, 153, 0.04) 80%,
    rgba(224, 170, 255, 0.06) 100%
  ) !important;
  backdrop-filter: blur(15px) saturate(1.1);
  color: rgba(224, 224, 224, 0.95) !important;
  padding: 1.5rem !important;
  border-radius: var(--radius-lg) !important;
  overflow: auto !important;
  font-family: var(--font-mono) !important;
  font-size: 1.3rem !important;
  line-height: 1.6 !important;
  border: 1px solid rgba(255, 117, 216, 0.2);
  box-shadow:
    0 0 40px rgba(217, 70, 239, 0.15),
    0 0 80px rgba(255, 117, 216, 0.08),
    inset 0 0 30px rgba(236, 72, 153, 0.03);
  margin: 2rem 0 !important;
  white-space: pre-wrap !important;
  word-spacing: normal !important;
  word-break: normal !important;
  word-wrap: normal !important;

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

    /* Purple/magenta dominant syntax highlighting */
    .hljs-comment,
    .hljs-prolog,
    .hljs-doctype,
    .hljs-cdata {
      color: rgba(168, 85, 247, 0.65);
      font-style: italic;
    }
    .hljs-punctuation {
      color: #e0aaff;
      opacity: 0.8;
    }
    .hljs-property,
    .hljs-tag,
    .hljs-boolean,
    .hljs-number,
    .hljs-constant,
    .hljs-symbol,
    .hljs-deleted {
      color: #ff75d8;
      text-shadow: 0 0 8px rgba(255, 117, 216, 0.4);
      font-weight: 500;
    }
    .hljs-selector,
    .hljs-attr-name,
    .hljs-string,
    .hljs-char,
    .hljs-builtin,
    .hljs-inserted {
      color: #ec4899;
      text-shadow: 0 0 6px rgba(236, 72, 153, 0.3);
    }
    .hljs-operator,
    .hljs-entity,
    .hljs-url,
    .language-css .hljs-string,
    .style .hljs-string,
    .hljs-variable {
      color: #e0aaff;
      text-shadow: 0 0 5px rgba(224, 170, 255, 0.3);
    }
    .hljs-atrule,
    .hljs-attr-value,
    .hljs-function,
    .hljs-class-name {
      color: #d946ef;
      font-weight: 600;
      text-shadow: 0 0 10px rgba(217, 70, 239, 0.4);
    }
    .hljs-keyword,
    .hljs-regex,
    .hljs-important {
      color: #a855f7;
      font-weight: bold;
      text-shadow: 0 0 12px rgba(168, 85, 247, 0.5);
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
    <CodeBlockPreWrapper className="blog-syntax" {...rest}>
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

// Safe link wrapper component
const SafeLink: React.FC<any> = ({ children, href, ...rest }) => {
  // Create a new props object that's extensible
  const safeProps = {
    href,
    rel: 'noopener noreferrer',
    target: '_blank',
    ...rest,
  }

  // For internal links, don't open in new tab
  if (href && (href.startsWith('/') || href.startsWith('#'))) {
    delete safeProps.target
    delete safeProps.rel
  }

  return <MarkdownLink {...safeProps}>{children}</MarkdownLink>
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
          a: SafeLink,

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
        rehypePlugins={[[rehypeSanitize, sanitizeSchema], rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </StyleSheetManager>
  )
}

export default React.memo(MarkdownRenderer)
