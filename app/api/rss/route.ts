// app/api/rss/route.ts

import { Feed } from 'feed'
import { NextResponse } from 'next/server'
import { BASE_URL, COMPANY_LEGAL_NAME, COMPANY_NAME, CONTACT_EMAIL, FOUNDER_NAME } from '@/lib/company'
import { MARKDOWN_COLLECTIONS, type MarkdownDirectory } from '@/lib/contentCollections'
import { getAllMarkdownSlugs, getMarkdownContent } from '@/lib/markdown'

const AUTHOR = {
  email: CONTACT_EMAIL,
  link: `${BASE_URL}/about/`,
  name: FOUNDER_NAME,
}

export async function GET() {
  const feed = new Feed({
    author: AUTHOR,
    copyright: `© ${new Date().getFullYear()} ${COMPANY_LEGAL_NAME}`,
    description: `Essays and lab experiments from ${COMPANY_NAME}.`,
    favicon: `${BASE_URL}/favicon.ico`,
    id: `${BASE_URL}/`,
    image: `${BASE_URL}/images/logo.png`,
    language: 'en',
    link: `${BASE_URL}/`,
    title: COMPANY_NAME,
  })

  const feedDirectories: MarkdownDirectory[] = ['posts', 'lab']
  const allItems = (
    await Promise.all(
      feedDirectories.map(async (directory) => {
        const slugs = await getAllMarkdownSlugs(directory)
        const items = await Promise.all(slugs.map(async (slug) => getMarkdownContent(directory, slug)))
        return items.map((item) => ({ ...item, routeSegment: MARKDOWN_COLLECTIONS[directory].routeSegment }))
      }),
    )
  )
    .flat()
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())

  for (const item of allItems) {
    feed.addItem({
      author: [AUTHOR],
      content: item.content,
      date: new Date(item.frontmatter.date),
      description: item.frontmatter.excerpt,
      id: `${BASE_URL}/${item.routeSegment}/${item.slug}/`,
      link: `${BASE_URL}/${item.routeSegment}/${item.slug}/`,
      title: item.frontmatter.title,
    })
  }

  return new NextResponse(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
