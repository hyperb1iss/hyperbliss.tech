import type { BlogPosting, BreadcrumbList, Person, SoftwareApplication, WebSite, WithContext } from 'schema-dts'
import { TECH_TAGS } from './constants'
import { buildOgImageUrl } from './ogImage'

const BASE_URL = 'https://hyperbliss.tech'

export function generatePersonSchema(): WithContext<Person> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    alternateName: 'hyperb1iss',
    description:
      'Creative technologist building open source developer tools, terminal interfaces, and infrastructure for AI agents.',
    image: `${BASE_URL}/images/profile-image.jpg`,
    jobTitle: 'Creative Technologist',
    knowsAbout: Array.from(TECH_TAGS),
    name: 'Stefanie Jane',
    sameAs: ['https://github.com/hyperb1iss', 'https://twitter.com/hyperb1iss', 'https://linkedin.com/in/stefaniejane'],
    url: BASE_URL,
  }
}

export function generateWebsiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    author: {
      '@type': 'Person',
      name: 'Stefanie Jane',
      url: BASE_URL,
    },
    description:
      "Stefanie Jane's personal site: open source developer tools, terminal interfaces, and infrastructure for AI agents, plus essays and lab experiments.",
    name: 'Hyperbliss',
    potentialAction: {
      '@type': 'SearchAction',
      query: 'required name=search_term_string',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
    },
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
    dateModified: datePublished,
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

export function generateProjectSchema(
  title: string,
  description: string,
  github: string,
  tags?: string[],
): WithContext<SoftwareApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    author: {
      '@type': 'Person',
      name: 'Stefanie Jane',
    },
    description,
    keywords: tags,
    name: title,
    url: github,
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
