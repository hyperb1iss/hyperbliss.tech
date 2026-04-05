// app/components/TinaContent.tsx
// Kept for backwards compatibility — delegates to MarkdownRenderer
'use client'

import MarkdownRenderer from './MarkdownRenderer'

interface TinaContentProps {
  content: string | null | undefined
}

export default function TinaContent({ content }: TinaContentProps) {
  if (!content) return null
  return <MarkdownRenderer content={content} />
}
