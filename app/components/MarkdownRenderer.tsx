// app/components/MarkdownRenderer.tsx
'use client'

import type { Element } from 'hast'
import { toString as hastToString } from 'hast-util-to-string'
import React, { useEffect, useState } from 'react'
import { FiCheck, FiCopy } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import MarkdownFigure from './MarkdownFigure'
import {
  StyledLink as MarkdownLink,
  StyledBlockquote,
  StyledH1,
  StyledH2,
  StyledH3,
  StyledHr,
  StyledInlineCode,
  StyledLi,
  StyledOl,
  StyledParagraph,
  StyledTable,
  StyledTbody,
  StyledTd,
  StyledTh,
  StyledThead,
  StyledTr,
  StyledUl,
} from './MarkdownStyles'

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), 'className'],
    span: [...(defaultSchema.attributes?.span || []), 'className'],
  },
  tagNames: [...(defaultSchema.tagNames || []), 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr'],
}

function classNames(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(' ')
}

/**
 * A paragraph whose only meaningful child is an image is unwrapped so the
 * resulting <figure> lands as a direct grid child of BlogContent. Wrapping a
 * <figure> in a <p> is invalid HTML and triggers a hydration mismatch, so we
 * detect the lone-image case from the hast node and drop the paragraph.
 */
function isLoneImageParagraph(node?: Element): boolean {
  if (!node || !Array.isArray(node.children)) return false
  const meaningful = node.children.filter((child) => !(child.type === 'text' && child.value.trim() === ''))
  return meaningful.length === 1 && meaningful[0].type === 'element' && meaningful[0].tagName === 'img'
}

function isInlineCode(node?: Element): boolean {
  return node?.position?.start.line === node?.position?.end.line
}

interface MarkdownRendererProps {
  content: string
}

interface CodeComponentProps {
  className?: string
  children?: React.ReactNode
}

interface PreWithCopyProps extends React.ComponentProps<'pre'> {
  node?: Element
  children?: React.ReactNode
}

const PreWithCopy: React.FC<PreWithCopyProps> = ({ node, children, className, ...rest }) => {
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
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    } finally {
      setIsCopying(false)
    }
  }

  const { node: _node, ...domProps } = rest as PreWithCopyProps & { node?: Element }

  return (
    <pre className={classNames('blog-code blog-syntax', className)} suppressHydrationWarning={true} {...domProps}>
      {children}
      <button
        aria-label={isCopied ? 'Code copied' : 'Copy code'}
        className="blog-code__copy"
        disabled={!isClipboardApiAvailable || isCopying}
        onClick={copyToClipboard}
        title={isClipboardApiAvailable ? 'Copy code' : 'Clipboard API not available'}
        type="button"
      >
        {isCopying ? '...' : isCopied ? <FiCheck /> : <FiCopy />}
      </button>
    </pre>
  )
}

const SafeLink: React.FC<any> = ({ children, href, node: _node, ...rest }) => {
  const safeProps = {
    href,
    rel: 'noopener noreferrer',
    target: '_blank',
    ...rest,
  }

  if (href && (href.startsWith('/') || href.startsWith('#'))) {
    delete safeProps.target
    delete safeProps.rel
  }

  return <MarkdownLink {...safeProps}>{children}</MarkdownLink>
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        a: SafeLink,
        blockquote: ({ node: _node, ...props }) => <StyledBlockquote {...props} />,
        code: ({ className, children, node, ...props }: CodeComponentProps & { node?: Element }) => {
          if (isInlineCode(node)) {
            return <StyledInlineCode {...props}>{children}</StyledInlineCode>
          }

          return (
            <code className={className} suppressHydrationWarning={true} {...props}>
              {children}
            </code>
          )
        },
        h1: ({ node: _node, ...props }) => <StyledH1 {...props} />,
        h2: ({ node: _node, ...props }) => <StyledH2 {...props} />,
        h3: ({ node: _node, ...props }) => <StyledH3 {...props} />,
        hr: ({ node: _node, ...props }) => <StyledHr {...props} />,
        img: ({ node: _node, ...props }) => <MarkdownFigure {...props} />,
        li: ({ node: _node, ...props }) => <StyledLi {...props} />,
        ol: ({ node: _node, ...props }) => <StyledOl {...props} />,
        p: ({ node, children, ...props }) => {
          if (isLoneImageParagraph(node)) {
            return <>{children}</>
          }
          return <StyledParagraph {...props}>{children}</StyledParagraph>
        },

        pre: (props) => <PreWithCopy {...props} />,
        table: ({ node: _node, ...props }) => <StyledTable {...props} />,
        tbody: ({ node: _node, ...props }) => <StyledTbody {...props} />,
        td: ({ node: _node, ...props }) => <StyledTd {...props} />,
        th: ({ node: _node, ...props }) => <StyledTh {...props} />,
        thead: ({ node: _node, ...props }) => <StyledThead {...props} />,
        tr: ({ node: _node, ...props }) => <StyledTr {...props} />,

        ul: ({ node: _node, ...props }) => <StyledUl {...props} />,
      }}
      rehypePlugins={[[rehypeSanitize, sanitizeSchema], rehypeHighlight]}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  )
}

export default React.memo(MarkdownRenderer)
