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
  ProjectMarkdownContent,
  ProjectOl,
  ProjectParagraph,
  ProjectTable,
  ProjectTbody,
  ProjectTd,
  ProjectTh,
  ProjectThead,
  ProjectTr,
  ProjectUl,
} from './ProjectMarkdownStyles'

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

function isInlineCode(node?: Element): boolean {
  return node?.position?.start.line === node?.position?.end.line
}

interface ProjectMarkdownRendererProps {
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
    <pre className={classNames('project-code project-syntax', className)} {...domProps}>
      {children}
      <button
        aria-label={isCopied ? 'Code copied' : 'Copy code'}
        className="project-code__copy"
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

  return <ProjectLink {...safeProps}>{children}</ProjectLink>
}

const ProjectMarkdownRenderer: React.FC<ProjectMarkdownRendererProps> = ({ content }) => {
  return (
    <ProjectMarkdownContent>
      <ReactMarkdown
        components={{
          a: SafeLink,
          blockquote: ({ node: _node, ...props }) => <ProjectBlockquote {...props} />,
          code: ({ className, children, node, ...props }: CodeComponentProps & { node?: Element }) => {
            if (isInlineCode(node)) {
              return <ProjectInlineCode {...props}>{children}</ProjectInlineCode>
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          h1: ({ node: _node, ...props }) => <ProjectH1 {...props} />,
          h2: ({ node: _node, ...props }) => <ProjectH2 {...props} />,
          h3: ({ node: _node, ...props }) => <ProjectH3 {...props} />,
          hr: ({ node: _node, ...props }) => <ProjectHr {...props} />,
          img: ({ node: _node, ...props }) => <ProjectImage {...props} />,
          li: ({ node: _node, ...props }) => <ProjectLi {...props} />,
          ol: ({ node: _node, ...props }) => <ProjectOl {...props} />,
          p: ({ node: _node, ...props }) => <ProjectParagraph {...props} />,
          pre: (props) => <PreWithCopy {...props} />,
          table: ({ node: _node, ...props }) => <ProjectTable {...props} />,
          tbody: ({ node: _node, ...props }) => <ProjectTbody {...props} />,
          td: ({ node: _node, ...props }) => <ProjectTd {...props} />,
          th: ({ node: _node, ...props }) => <ProjectTh {...props} />,
          thead: ({ node: _node, ...props }) => <ProjectThead {...props} />,
          tr: ({ node: _node, ...props }) => <ProjectTr {...props} />,
          ul: ({ node: _node, ...props }) => <ProjectUl {...props} />,
        }}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema], rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </ProjectMarkdownContent>
  )
}

export default React.memo(ProjectMarkdownRenderer)
