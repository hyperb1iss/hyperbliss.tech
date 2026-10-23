import { notFound } from 'next/navigation'
import AboutPageContent from '../../components/AboutPageContent'
import StructuredData from '../../components/StructuredData'
import { getAllProjects, getPage } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'
import { pickFeatured } from '../../lib/projectLanes'
import { generatePersonSchema } from '../../lib/structuredData'

export default async function About() {
  const [aboutPage, projects] = await Promise.all([getPage('about').catch(() => null), getAllProjects()])

  if (!aboutPage?.about) {
    notFound()
  }

  // The pinned flagships need no GitHub facts, so the page stays fully static.
  const flagships = pickFeatured(
    projects.map((project) => ({ project, releaseDate: null, releaseUrl: null, stats: null, version: null })),
    3,
  ).map((entry) => entry.project)

  return (
    <>
      <StructuredData data={generatePersonSchema()} />
      <AboutPageContent about={aboutPage.about} company={aboutPage.company} products={flagships} />
    </>
  )
}

export const metadata = generatePageMetadata(
  'About',
  'Hyperbliss Technologies LLC is an independent software company in Seattle, founded by Stefanie Jane, making open source software that puts people in control of their own technology.',
  '/about/',
)
