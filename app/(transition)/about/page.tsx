import { notFound } from 'next/navigation'
import AboutPageContent from '../../components/AboutPageContent'
import { getPage } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'

export default async function About() {
  const aboutPage = await getPage('about').catch(() => null)

  if (!aboutPage?.about) {
    notFound()
  }

  return <AboutPageContent about={aboutPage.about} />
}

export const metadata = generatePageMetadata(
  'About Me',
  'Learn about Stefanie Jane, software engineer, open source advocate, and creative technologist.',
  '/about/',
)
