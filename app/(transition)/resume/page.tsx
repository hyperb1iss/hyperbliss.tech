// app/(transition)/resume/page.tsx
import { promises as fs } from 'fs'
import path from 'path'
import ResumePageContent from '../../components/ResumePageContent'

export const metadata = {
  description: 'Professional resume of Stefanie Jane, full-stack developer and designer.',
  title: 'Resume | Hyperbliss',
}

export default async function ResumePage() {
  // Read the raw markdown file directly to preserve formatting
  // TinaCMS AST conversion loses complex nested markdown structures
  const resumePath = path.join(process.cwd(), 'content/resume/resume.md')
  const rawContent = await fs.readFile(resumePath, 'utf-8')

  // Remove frontmatter (everything between --- markers at the start)
  const content = rawContent.replace(/^---[\s\S]*?---\n*/, '')

  return <ResumePageContent content={content} />
}
