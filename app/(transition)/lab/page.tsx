import type { Metadata } from 'next'
import LabList from '../../components/LabList'
import { BASE_URL } from '../../lib/company'
import { getAllLab } from '../../lib/content'
import siteMetadata, { SITE_NAME } from '../../lib/metadata'
import { buildOgImageUrl, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '../../lib/ogImage'

const OG_DESCRIPTION = 'Interactive experiments, deep dives, and weird beautiful things on the web.'
const OG_IMAGE = {
  alt: `The Lab: ${OG_DESCRIPTION}`,
  height: OG_IMAGE_HEIGHT,
  url: buildOgImageUrl({ kind: 'lab', subtitle: OG_DESCRIPTION, title: 'The Lab' }),
  width: OG_IMAGE_WIDTH,
}

export const metadata: Metadata = {
  alternates: {
    canonical: `${BASE_URL}/lab/`,
  },
  description:
    'Interactive experiments, deep dives, and weird beautiful things on the web. Explore regex dissections, visual playgrounds, and more.',
  keywords: ['interactive experiments', 'web playground', 'regex', 'deep dive', 'developer tools', 'Stefanie Jane'],
  openGraph: {
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
    locale: 'en_US',
    siteName: SITE_NAME,
    title: 'The Lab',
    type: 'website',
    url: `${BASE_URL}/lab/`,
  },
  title: 'The Lab',
  twitter: {
    ...siteMetadata.twitter,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE.url],
    title: 'The Lab',
  },
}

export default async function Lab() {
  const experiments = await getAllLab()
  return <LabList experiments={experiments} />
}
