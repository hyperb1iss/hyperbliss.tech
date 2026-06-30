// app/api/rss/route.ts

import { Feed } from 'feed'
import { NextResponse } from 'next/server'
import { MARKDOWN_COLLECTIONS, type MarkdownDirectory } from '@/lib/contentCollections'
import { getAllMarkdownSlugs, getMarkdownContent } from '@/lib/markdown'

const AUTHOR = {
  email: 'stefanie@hyperbliss.tech',
  link: 'https://hyperbliss.tech/about',
  name: 'Stefanie Jane',
}

export async function GET() {
  const feed = new Feed({
    author: AUTHOR,
    copyright: `All rights reserved ${new Date().getFullYear()}, Stefanie Jane`,
    description: "Stefanie Jane's personal blog, lab experiments, and more.",
    favicon: 'https://hyperbliss.tech/favicon.ico',
    id: 'https://hyperbliss.tech/',
    image: 'https://hyperbliss.tech/images/logo.png',
    language: 'en',
    link: 'https://hyperbliss.tech/',
    title: 'Hyperbliss',
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
      id: `https://hyperbliss.tech/${item.routeSegment}/${item.slug}`,
      link: `https://hyperbliss.tech/${item.routeSegment}/${item.slug}`,
      title: item.frontmatter.title,
    })
  }

  return new NextResponse(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
