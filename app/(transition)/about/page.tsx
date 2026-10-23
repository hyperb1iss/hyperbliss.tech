import { notFound } from 'next/navigation'
import AboutPageContent from '../../components/AboutPageContent'
import StructuredData from '../../components/StructuredData'
import { getPage } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'
import { generatePersonSchema } from '../../lib/structuredData'

export default async function About() {
  const aboutPage = await getPage('about').catch(() => null)

  if (!aboutPage?.about) {
    notFound()
  }

  return (
    <>
      <StructuredData data={generatePersonSchema()} />
      <AboutPageContent about={aboutPage.about} />
    </>
  )
}

export const metadata = generatePageMetadata(
  'Stefanie Jane, Founder',
  'Stefanie Jane founded Hyperbliss Technologies. Creator of CyanogenMod, open source engineer, and creative technologist.',
  '/about/',
)
