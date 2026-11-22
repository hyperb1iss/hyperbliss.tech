import type { BlogPosting, BreadcrumbList, Organization, Person, WebSite, WithContext } from 'schema-dts'
import { BASE_URL, COMPANY_LEGAL_NAME, COMPANY_NAME, FOUNDER_NAME, SITE_DESCRIPTION } from './company'
import { TECH_TAGS } from './constants'
import { buildOgImageUrl } from './ogImage'
import { COMPANY_LINKS, SOCIAL_LINKS } from './socials'

/** Profile URLs for sameAs: the accounts themselves, not the sponsor page. */
const profiles = (links: readonly { href: string; label: string }[]) =>
  links.filter(({ label }) => label !== 'Sponsor').map(({ href }) => href)

const ORGANIZATION_ID = `${BASE_URL}/#organization`

export function generateOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@id': ORGANIZATION_ID,
    '@type': 'Organization',
    description:
      'Independent software company making open source tools that put people in control of their own technology.',
    founder: {
      '@type': 'Person',
      name: FOUNDER_NAME,
      url: `${BASE_URL}/about/`,
    },
    legalName: COMPANY_LEGAL_NAME,
    location: {
      '@type': 'Place',
      name: 'Seattle, Washington',
    },
    logo: `${BASE_URL}/images/logo.png`,
    name: COMPANY_NAME,
    sameAs: profiles(COMPANY_LINKS),
    url: BASE_URL,
  }
}

export function generatePersonSchema(): WithContext<Person> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    alternateName: 'hyperb1iss',
    description:
      'Creative technologist building open source developer tools, terminal interfaces, and infrastructure for AI agents.',
    image: `${BASE_URL}/images/profile-image.jpg`,
    jobTitle: 'Founder',
    knowsAbout: Array.from(TECH_TAGS),
    name: FOUNDER_NAME,
    sameAs: profiles(SOCIAL_LINKS),
    url: `${BASE_URL}/about/`,
    worksFor: { '@id': ORGANIZATION_ID },
  }
}

export function generateWebsiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: SITE_DESCRIPTION,
    name: COMPANY_NAME,
    publisher: { '@id': ORGANIZATION_ID },
    url: BASE_URL,
  }
}

export function generateArticleSchema(
  title: string,
  description: string,
  author: string,
  datePublished: string,
  url: string,
  tags?: string[],
  image?: string,
): WithContext<BlogPosting> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    author: {
      '@type': 'Person',
      name: author,
      url: BASE_URL,
    },
    datePublished,
    description,
    headline: title,
    image: image ? `${BASE_URL}/images/${image}` : buildOgImageUrl({ kind: 'blog', title }),
    keywords: tags,
    mainEntityOfPage: {
      '@id': url,
      '@type': 'WebPage',
    },
    url,
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      item: item.url,
      name: item.name,
      position: index + 1,
    })),
  }
}
