import type { BlogPosting, Person, WebSite, SoftwareApplication, BreadcrumbList, WithContext } from "schema-dts";
import { TECH_TAGS } from "./constants";

const BASE_URL = "https://hyperbliss.tech";

export function generatePersonSchema(): WithContext<Person> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Stefanie Jane",
    alternateName: "hyperb1iss",
    description:
      "Developer, designer, and tech enthusiast. Open source contributor and creative technologist.",
    url: BASE_URL,
    image: `${BASE_URL}/images/og-default.jpg`,
    sameAs: [
      "https://github.com/hyperb1iss",
      "https://twitter.com/hyperb1iss",
      "https://linkedin.com/in/stefaniejane",
    ],
    jobTitle: "Full Stack Engineer & Creative Technologist",
    knowsAbout: Array.from(TECH_TAGS),
  };
}

export function generateWebsiteSchema(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hyperbliss",
    description: "The personal website of Stefanie Jane—developer, designer, and tech enthusiast.",
    url: BASE_URL,
    author: {
      "@type": "Person",
      name: "Stefanie Jane",
      url: BASE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateArticleSchema(
  title: string,
  description: string,
  author: string,
  datePublished: string,
  url: string,
  tags?: string[],
  image?: string
): WithContext<BlogPosting> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
      url: BASE_URL,
    },
    datePublished,
    dateModified: datePublished,
    url,
    image: image ? `${BASE_URL}/images/${image}` : `${BASE_URL}/images/og-default.jpg`,
    keywords: tags,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function generateProjectSchema(
  title: string,
  description: string,
  github: string,
  tags?: string[]
): WithContext<SoftwareApplication> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    url: github,
    applicationCategory: "DeveloperApplication",
    author: {
      "@type": "Person",
      name: "Stefanie Jane",
    },
    keywords: tags,
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
