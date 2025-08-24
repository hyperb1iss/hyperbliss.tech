// app/(transition)/resume/page.tsx
import ResumePageContent from '../../components/ResumePageContent'
import { getMarkdownContent } from '../../lib/markdown'

export default async function ResumePage() {
  // Load resume content from markdown using the helper
  const { content } = await getMarkdownContent('src', 'resume')

  return <ResumePageContent content={content} />
}

export const metadata = {
  description: 'Professional resume of Stefanie Jane, full-stack developer and designer.',
  title: 'Resume | Hyperbliss',
}
