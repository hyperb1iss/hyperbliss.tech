// app/api/rss/route.ts

import { Feed } from 'feed'
import { NextResponse } from 'next/server'
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

  const [postSlugs, labSlugs] = await Promise.all([getAllMarkdownSlugs('posts'), getAllMarkdownSlugs('lab')])

  const [posts, labExperiments] = await Promise.all([
    Promise.all(postSlugs.map(async (slug) => getMarkdownContent('posts', slug))),
    Promise.all(labSlugs.map(async (slug) => getMarkdownContent('lab', slug))),
  ])

  const allItems = [
    ...posts.map((post) => ({ ...post, section: 'blog' as const })),
    ...labExperiments.map((exp) => ({ ...exp, section: 'lab' as const })),
  ].sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())

  for (const item of allItems) {
    const prefix = item.section === 'lab' ? 'lab' : 'blog'
    feed.addItem({
      author: [AUTHOR],
      content: item.content,
      date: new Date(item.frontmatter.date),
      description: item.frontmatter.excerpt,
      id: `https://hyperbliss.tech/${prefix}/${item.slug}`,
      link: `https://hyperbliss.tech/${prefix}/${item.slug}`,
      title: item.frontmatter.title,
    })
  }

  return new NextResponse(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
