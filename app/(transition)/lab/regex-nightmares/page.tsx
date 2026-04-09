import type { Metadata } from 'next'
import RegexNightmares from '../../../components/lab/RegexNightmares'
import StructuredData from '../../../components/StructuredData'
import { generateArticleSchema, generateBreadcrumbSchema } from '../../../lib/structuredData'

const BASE_URL = 'https://hyperbliss.tech'
const TITLE = 'Regex Nightmares'
const DESCRIPTION =
  '21 regular expressions dissected down to the molecular level. Interactive step-throughs, live testers, and the real-world disasters they caused.'

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
    locale: 'en_US',
    publishedTime: '2026-04-08',
    siteName: 'Hyperbliss',
    tags: ['regex', 'interactive', 'deep-dive', 'security', 'ReDoS'],
    title: TITLE,
    type: 'article',
    url: `${BASE_URL}/lab/regex-nightmares/`,
  },
  title: TITLE,
  twitter: {
    card: 'summary_large_image',
    creator: '@hyperb1iss',
    description: DESCRIPTION,
    title: `${TITLE} | The Lab | Hyperbliss`,
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
