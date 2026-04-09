import type { Metadata } from 'next'
import LabList from '../../components/LabList'

const BASE_URL = 'https://hyperbliss.tech'

export const metadata: Metadata = {
  alternates: {
    canonical: `${BASE_URL}/lab/`,
  },
  description:
    'Interactive experiments, deep dives, and weird beautiful things on the web. Explore regex dissections, visual playgrounds, and more.',
  keywords: ['interactive experiments', 'web playground', 'regex', 'deep dive', 'developer tools', 'Stefanie Jane'],
  openGraph: {
    description: 'Interactive experiments, deep dives, and weird beautiful things on the web.',
    locale: 'en_US',
    siteName: 'Hyperbliss',
    title: 'The Lab',
    type: 'website',
    url: `${BASE_URL}/lab/`,
  },
  title: 'The Lab',
  twitter: {
    card: 'summary_large_image',
    creator: '@hyperb1iss',
    description: 'Interactive experiments, deep dives, and weird beautiful things on the web.',
    title: 'The Lab | Hyperbliss',
  },
}

export default function Lab() {
  return <LabList />
}
