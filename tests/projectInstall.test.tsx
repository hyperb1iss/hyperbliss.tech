// The product call to action links to #install, so detection and the
// rendered anchor have to agree: hasInstallSection decides, and
// ProjectMarkdownRenderer must actually emit the id it promised.

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProjectMarkdownRenderer from '@/components/ProjectMarkdownRenderer'
import { getAllProjects, getProject, hasInstallSection } from '@/lib/content'
import { extractHeadings } from '@/lib/reading'

// Unmount before returning: jsdom resolves '#id' through the document's id
// index, so a second tree with the same id would hide this one's heading.
const rendersInstallAnchor = (markdown: string): boolean => {
  const { container, unmount } = render(
    <ProjectMarkdownRenderer content={markdown} headings={extractHeadings(markdown)} />,
  )
  const found = container.querySelector('#install') !== null
  unmount()
  return found
}

describe('hasInstallSection', () => {
  it.each([
    ['## Install\n\nrun it', true],
    ['## **Install**\n\nrun it', true],
    ['## Install from source\n\nbuild it', false],
    ['Intro\n\n```md\n## Install\n```\n', false],
    ['### Install\n\nnested', true],
  ])('%j -> %s, and the renderer agrees', (markdown, expected) => {
    expect(hasInstallSection(markdown)).toBe(expected)
    expect(rendersInstallAnchor(markdown)).toBe(expected)
  })
})

describe('flagship install sections', () => {
  it('render the #install anchor their call to action links to', async () => {
    const flagships = (await getAllProjects()).filter((p) => typeof p.featured === 'number')
    expect(flagships.map((p) => p.slug).sort()).toEqual(['hypercolor', 'sibyl', 'unifly'])
    for (const project of flagships) {
      expect(project.hasInstall, project.slug).toBe(true)
      const body = (await getProject(project.slug))?.body ?? ''
      expect(rendersInstallAnchor(body), project.slug).toBe(true)
    }
  })
})
