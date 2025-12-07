// app/components/ProjectMarkdownRenderer.tsx
'use client'

import type { Element } from 'hast'
import { toString as hastToString } from 'hast-util-to-string'
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
  ProjectBlockquote,
  ProjectH1,
  ProjectH2,
  ProjectH3,
  ProjectHr,
  ProjectImage,
  ProjectInlineCode,
  ProjectLi,
  ProjectLink,
  ProjectOl,
  ProjectParagraph,
  ProjectUl,
} from './ProjectMarkdownStyles'

// Define the props interface
interface ProjectMarkdownRendererProps {
  content: string
}

// Define a custom interface for the code component props
interface CodeComponentProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

// Function to filter out props that shouldn't be forwarded to DOM elements
const shouldForwardProp = (prop: string): boolean => {
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
    rgba(0, 255, 240, 0.2),
    rgba(0, 229, 255, 0.1)
  );
  border: 1px solid rgba(0, 255, 240, 0.3);
  border-radius: var(--radius-sm);
  padding: 0.5rem;
  color: #00fff0;
  cursor: pointer;
  transition: all 0.3s var(--ease-silk);
  opacity: 0;
  z-index: 1;
  backdrop-filter: blur(10px);

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(0, 255, 240, 0.3),
      rgba(0, 229, 255, 0.2)
    );
    border-color: #00e5ff;
    color: #26c6da;
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(0, 255, 240, 0.3);
  }

  svg {
    width: 1.2em;
    height: 1.2em;
    filter: drop-shadow(0 0 3px currentColor);
  }
`

// Code block wrapper with cyan theme
const CodeBlockPreWrapper = styled.pre`
  position: relative;
  
  /* Add project-syntax class for theme targeting */
  &.project-syntax {
    /* Class added via props */
  }

  &:hover ${CopyButton} {
    opacity: 1;
  }

  /* Apply cyan-dominant silk circuit theme */
  background: linear-gradient(
    135deg,
    rgba(0, 255, 240, 0.08) 0%,
    rgba(0, 229, 255, 0.06) 20%,
    rgba(30, 25, 45, 0.95) 40%,
    rgba(0, 172, 193, 0.04) 80%,
    rgba(38, 198, 218, 0.06) 100%
  ) !important;
  backdrop-filter: blur(15px) saturate(1.1);
  color: rgba(224, 224, 224, 0.95) !important;
  padding: 1.5rem !important;
  border-radius: var(--radius-lg) !important;
  overflow: auto !important;
  font-family: var(--font-mono) !important;
  font-size: 1.3rem !important;
  line-height: 1.6 !important;
  border: 1px solid rgba(0, 255, 240, 0.2);
  box-shadow:
    0 0 40px rgba(0, 229, 255, 0.15),
    0 0 80px rgba(0, 255, 240, 0.08),
    inset 0 0 30px rgba(0, 172, 193, 0.03);
  margin: 2rem 0 !important;
  white-space: pre-wrap !important;
  word-spacing: normal !important;
  word-break: normal !important;
  word-wrap: normal !important;

  /* Target code tag inside */
  code {
    font-family: inherit;
    background: none;
    padding: 0;
    margin: 0;
    display: block;
    color: inherit;
    white-space: inherit;
    word-spacing: inherit;
    word-break: inherit;
    word-wrap: inherit;

    /* Cyan/teal dominant syntax highlighting */
    .hljs-comment,
    .hljs-prolog,
    .hljs-doctype,
    .hljs-cdata {
      color: rgba(0, 172, 193, 0.65);
      font-style: italic;
    }
    .hljs-punctuation {
      color: #26c6da;
      opacity: 0.8;
    }
    .hljs-property,
    .hljs-tag,
    .hljs-boolean,
    .hljs-number,
    .hljs-constant,
    .hljs-symbol,
    .hljs-deleted {
      color: #00fff0;
      text-shadow: 0 0 8px rgba(0, 255, 240, 0.4);
      font-weight: 500;
    }
    .hljs-selector,
    .hljs-attr-name,
    .hljs-string,
    .hljs-char,
    .hljs-builtin,
    .hljs-inserted {
      color: #00e5ff;
      text-shadow: 0 0 6px rgba(0, 229, 255, 0.3);
    }
    .hljs-operator,
    .hljs-entity,
    .hljs-url,
    .language-css .hljs-string,
    .style .hljs-string,
    .hljs-variable {
      color: #26c6da;
      text-shadow: 0 0 5px rgba(38, 198, 218, 0.3);
    }
    .hljs-atrule,
    .hljs-attr-value,
    .hljs-function,
    .hljs-class-name {
      color: #00acc1;
      font-weight: 600;
      text-shadow: 0 0 10px rgba(0, 172, 193, 0.4);
    }
    .hljs-keyword,
    .hljs-regex,
    .hljs-important {
      color: #00fff0;
      font-weight: bold;
      text-shadow: 0 0 12px rgba(0, 255, 240, 0.5);
    }
    .hljs-important {
      font-weight: bold;
    }
  }
`

// Pre component with copy functionality
interface PreWithCopyProps extends React.ComponentProps<'pre'> {
  node?: Element
  children?: React.ReactNode
}

const PreWithCopy: React.FC<PreWithCopyProps> = ({ node, children, ...rest }) => {
  const [isClipboardApiAvailable, setIsClipboardApiAvailable] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  useEffect(() => {
    setIsClipboardApiAvailable(!!navigator.clipboard?.writeText)
  }, [])

  let codeContent = ''
  if (node && node.type === 'element') {
    codeContent = hastToString(node)
  } else {
    codeContent = React.Children.toArray(children)
      .map((child) => String(child))
      .join('')
  }
  codeContent = codeContent.replace(/\n$/, '')

  const copyToClipboard = async () => {
    if (!isClipboardApiAvailable || isCopying) return

    setIsCopying(true)
    setIsCopied(false)
    try {
      await navigator.clipboard.writeText(codeContent)
      setIsCopied(true)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    } finally {
      setIsCopying(false)
      if (isCopied) {
        setTimeout(() => setIsCopied(false), 2000)
      }
    }
  }

  return (
    <CodeBlockPreWrapper className="project-syntax" {...rest}>
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

  return <ProjectLink {...safeProps}>{children}</ProjectLink>
}

/**
 * ProjectMarkdownRenderer Component
 * Renders Markdown content with custom cyan/teal styled components for projects.
 */
const ProjectMarkdownRenderer: React.FC<ProjectMarkdownRendererProps> = ({ content }) => {
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <ReactMarkdown
        components={{
          // Links
          a: SafeLink,

          // Blockquote
          blockquote: (props) => <ProjectBlockquote {...props} />,

          // Code component
          code: ({ inline, className, children, ...props }: CodeComponentProps) => {
            if (inline) {
              return <ProjectInlineCode {...props}>{children}</ProjectInlineCode>
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },

          // Headings
          h1: (props) => <ProjectH1 {...props} />,
          h2: (props) => <ProjectH2 {...props} />,
          h3: (props) => <ProjectH3 {...props} />,

          // Horizontal Rule
          hr: (props) => <ProjectHr {...props} />,

          // Images
          img: (props) => <ProjectImage {...props} />,
          li: (props) => <ProjectLi {...props} />,
          ol: (props) => <ProjectOl {...props} />,

          // Paragraph
          p: (props) => <ProjectParagraph {...props} />,

          // Pre component with copy button
          pre: (props) => {
            return <PreWithCopy {...props} />
          },

          // Lists
          ul: (props) => <ProjectUl {...props} />,
        }}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema], rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </StyleSheetManager>
  )
}

export default React.memo(ProjectMarkdownRenderer)
