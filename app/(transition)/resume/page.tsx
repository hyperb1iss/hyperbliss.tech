// app/(transition)/resume/page.tsx
import ResumePageContent from '../../components/ResumePageContent'
import { getResume, tinaMarkdownToString } from '../../lib/tina'

export const metadata = {
  description: 'Professional resume of Stefanie Jane, full-stack developer and designer.',
  title: 'Resume | Hyperbliss',
}

export default async function ResumePage() {
  // Fetch resume content from TinaCMS
  const resume = await getResume()

  // Convert TinaMarkdown AST to raw markdown string for the resume parser
  const content = tinaMarkdownToString(resume.body)

  return <ResumePageContent content={content} />
}
