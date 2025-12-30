// app/components/TinaContent.tsx
'use client'

import styled from 'styled-components'
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text'
import MarkdownRenderer from './MarkdownRenderer'

interface TinaContentProps {
  content: TinaMarkdownContent | string | null | undefined
}

const ContentWrapper = styled.div`
  /* Styling for TinaMarkdown rendered content */

  h1, h2, h3, h4, h5, h6 {
    color: var(--color-secondary);
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  h1 {
    font-size: clamp(2rem, 3vw, 3rem);
    text-shadow: 0 0 10px var(--color-secondary);
  }

  h2 {
    font-size: clamp(1.8rem, 2.5vw, 2.5rem);
    text-shadow: 0 0 8px var(--color-secondary);
  }

  h3 {
    font-size: clamp(1.5rem, 2vw, 2rem);
  }

  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: var(--color-secondary);
      text-shadow: 0 0 8px var(--color-primary);
    }
  }

  ul, ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.7;
  }

  blockquote {
    border-left: 4px solid var(--color-primary);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: var(--color-muted);
    background: rgba(139, 92, 246, 0.1);
    padding: 1rem 1.5rem;
    border-radius: 0 8px 8px 0;
  }

  code {
    background: rgba(0, 255, 240, 0.1);
    color: var(--color-accent);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-family: var(--font-space-mono, ui-monospace), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    font-size: 0.9em;
  }

  pre {
    background: rgba(10, 10, 20, 0.8);
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2rem 0;
    border: 1px solid rgba(139, 92, 246, 0.3);

    code {
      background: none;
      padding: 0;
      color: var(--color-text);
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2rem 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
  }

  th, td {
    border: 1px solid rgba(139, 92, 246, 0.3);
    padding: 0.75rem 1rem;
    text-align: left;
  }

  th {
    background: rgba(139, 92, 246, 0.2);
    color: var(--color-secondary);
  }

  hr {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
    margin: 3rem 0;
  }
`

export default function TinaContent({ content }: TinaContentProps) {
  if (!content) return null

  // If it's a raw markdown string (extracted at data layer), use MarkdownRenderer
  if (typeof content === 'string') {
    return <MarkdownRenderer content={content} />
  }

  // Otherwise it's a proper TinaCMS AST - render with TinaMarkdown
  return (
    <ContentWrapper>
      <TinaMarkdown content={content as TinaMarkdownContent} />
    </ContentWrapper>
  )
}
