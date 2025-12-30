// app/(transition)/resume/page.tsx
import ResumePageContent from '../../components/ResumePageContent'
import { getResume } from '../../lib/tina'

export const metadata = {
  description: 'Professional resume of Stefanie Jane, full-stack developer and designer.',
  title: 'Resume | Hyperbliss',
}

export default async function ResumePage() {
  // Fetch resume content from TinaCMS
  const resume = await getResume()

  // The resume body can be TinaMarkdown AST or raw markdown string
  // The parser expects a raw markdown string
  const content = typeof resume.body === 'string' ? resume.body : ''

  return <ResumePageContent content={content} />
}
