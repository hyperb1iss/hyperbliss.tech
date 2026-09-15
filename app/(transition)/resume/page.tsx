// app/(transition)/resume/page.tsx
import { promises as fs } from 'node:fs'
import path from 'node:path'
import ResumePageContent from '../../components/ResumePageContent'
import { generatePageMetadata } from '../../lib/generateMetadata'

export default async function ResumePage() {
  // Read the raw markdown file directly to preserve formatting
  const resumePath = path.join(process.cwd(), 'content/resume/resume.md')
  const rawContent = await fs.readFile(resumePath, 'utf-8')

  // Remove frontmatter (everything between --- markers at the start)
  const content = rawContent.replace(/^---[\s\S]*?---\n*/, '')

  return <ResumePageContent content={content} />
}

export const metadata = generatePageMetadata(
  'Resume',
  'Professional resume of Stefanie Jane, creative technologist and open source builder.',
  '/resume/',
)
