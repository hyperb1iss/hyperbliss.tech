import { notFound } from 'next/navigation'
import CompanyPageContent from '../../components/CompanyPageContent'
import { getAllProjects, getPage } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'
import { pickFeatured } from '../../lib/projectLanes'

export default async function Company() {
  const [companyPage, projects] = await Promise.all([getPage('company').catch(() => null), getAllProjects()])

  if (!companyPage?.company) {
    notFound()
  }

  // The pinned flagships need no GitHub facts, so the page stays fully static.
  const flagships = pickFeatured(
    projects.map((project) => ({ project, releaseDate: null, releaseUrl: null, stats: null, version: null })),
    3,
  ).map((entry) => entry.project)

  return <CompanyPageContent company={companyPage.company} products={flagships} />
}

export const metadata = generatePageMetadata(
  'Company',
  'Hyperbliss Technologies LLC is an independent software company in Seattle making open source software that puts people in control of their own technology.',
  '/company/',
)
