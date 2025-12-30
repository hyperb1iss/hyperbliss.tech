import { notFound } from 'next/navigation'
import AboutPageContent from '../../components/AboutPageContent'
import { getPage } from '../../lib/tina'

export const metadata = {
  description: 'Learn about Stefanie Jane—software engineer, open source advocate, and creative technologist.',
  title: 'About Me | Hyperbliss',
}

export default async function About() {
  // Fetch about page content from TinaCMS
  const aboutPage = await getPage('about').catch(() => null)

  // All content must come from TinaCMS
  if (!aboutPage?.about) {
    notFound()
  }

  return <AboutPageContent about={aboutPage.about} />
}
