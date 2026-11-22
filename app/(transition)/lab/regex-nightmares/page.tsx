import type { Metadata } from 'next'
import RegexNightmares from '../../../components/lab/RegexNightmares'
import StructuredData from '../../../components/StructuredData'
import { BASE_URL } from '../../../lib/company'
import siteMetadata, { SITE_NAME } from '../../../lib/metadata'
import { buildOgImageUrl, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '../../../lib/ogImage'
import { generateArticleSchema, generateBreadcrumbSchema } from '../../../lib/structuredData'

const TITLE = 'Regex Nightmares'
const DESCRIPTION =
  '21 regular expressions dissected down to the molecular level. Interactive step-throughs, live testers, and the real-world disasters they caused.'
const OG_IMAGE = {
  alt: `${TITLE}: ${DESCRIPTION}`,
  height: OG_IMAGE_HEIGHT,
  url: buildOgImageUrl({
    kind: 'lab',
    meta: 'April 8, 2026',
    subtitle: DESCRIPTION,
    title: TITLE,
  }),
  width: OG_IMAGE_WIDTH,
}

export const metadata: Metadata = {
  alternates: {
    canonical: `${BASE_URL}/lab/regex-nightmares/`,
  },
  authors: [{ name: 'Stefanie Jane' }],
  description: DESCRIPTION,
  keywords: [
    'regex',
    'regular expressions',
    'ReDoS',
    'backtracking',
    'interactive',
    'regex tutorial',
    'regex playground',
    'catastrophic backtracking',
    'email validation regex',
    'PCRE',
    'regex engine',
    'CVE',
    'Cloudflare outage',
    'regex dissection',
  ],
  openGraph: {
    authors: ['Stefanie Jane'],
    description: DESCRIPTION,
    images: [OG_IMAGE],
    locale: 'en_US',
    publishedTime: '2026-04-08',
    siteName: SITE_NAME,
    tags: ['regex', 'interactive', 'deep-dive', 'security', 'ReDoS'],
    title: TITLE,
    type: 'article',
    url: `${BASE_URL}/lab/regex-nightmares/`,
  },
  title: TITLE,
  twitter: {
    ...siteMetadata.twitter,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
    title: TITLE,
  },
}

export default function RegexNightmaresPage() {
  return (
    <>
      <StructuredData
        data={[
          generateArticleSchema(
            TITLE,
            DESCRIPTION,
            'Stefanie Jane',
            '2026-04-08',
            `${BASE_URL}/lab/regex-nightmares/`,
            ['regex', 'interactive', 'deep-dive', 'security', 'ReDoS'],
          ),
          generateBreadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'The Lab', url: `${BASE_URL}/lab/` },
            { name: 'Regex Nightmares', url: `${BASE_URL}/lab/regex-nightmares/` },
          ]),
        ]}
      />
      <RegexNightmares />
    </>
  )
}
