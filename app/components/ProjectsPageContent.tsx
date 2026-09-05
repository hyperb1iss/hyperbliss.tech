// app/components/ProjectsPageContent.tsx
// The Projects index: title, one-line lede, and the project rows.

import PageLayout from './PageLayout'
import PageTitle from './PageTitle'
import ProjectRows, { type ProjectRow } from './ProjectRows'

interface ProjectsPageContentProps {
  rows: ProjectRow[]
}

export default function ProjectsPageContent({ rows }: ProjectsPageContentProps) {
  return (
    <PageLayout>
      <PageTitle lede="Things I have built, broken, and shipped. Open source tools, creative experiments, and systems that do real work.">
        Projects
      </PageTitle>
      <ProjectRows rows={rows} />
    </PageLayout>
  )
}
