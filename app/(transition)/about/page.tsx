import { notFound } from 'next/navigation'
import AboutPageContent from '../../components/AboutPageContent'
import { getPage } from '../../lib/content'

export const metadata = {
  description: 'Learn about Stefanie Jane--software engineer, open source advocate, and creative technologist.',
  title: 'About Me | Hyperbliss',
}

export default async function About() {
  const aboutPage = await getPage('about').catch(() => null)

  if (!aboutPage?.about) {
    notFound()
  }

  return <AboutPageContent about={aboutPage.about} />
}
