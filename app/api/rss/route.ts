// app/api/rss/route.ts

import { Feed } from 'feed'
import { NextResponse } from 'next/server'
import { getAllMarkdownSlugs, getMarkdownContent, MarkdownFile } from '@/lib/markdown'

export async function GET() {
  const feed = new Feed({
    author: {
      email: 'stefanie@hyperbliss.tech',
      link: 'https://hyperbliss.tech/about',
      name: 'Stefanie Jane',
    },
    copyright: `All rights reserved ${new Date().getFullYear()}, Stefanie Jane`,
    description: "Stefanie Jane's personal blog about tech, development, and more.",
    favicon: 'https://hyperbliss.tech/favicon.ico',
    id: 'https://hyperbliss.tech/',
    image: 'https://hyperbliss.tech/images/logo.png',
    language: 'en',
    link: 'https://hyperbliss.tech/',
    title: 'Hyperbliss Blog',
  })

  const slugs = await getAllMarkdownSlugs('src/posts')
  const posts: MarkdownFile[] = await Promise.all(slugs.map(async (slug) => getMarkdownContent('src/posts', slug)))

  // Sort posts by date
  posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())

  posts.forEach((post) => {
    feed.addItem({
      author: [
        {
          email: 'stefanie@hyperbliss.tech',
          link: 'https://hyperbliss.tech/about',
          name: 'Stefanie Jane',
        },
      ],
      content: post.content,
      date: new Date(post.frontmatter.date),
      description: post.frontmatter.excerpt,
      id: `https://hyperbliss.tech/blog/${post.slug}`,
      link: `https://hyperbliss.tech/blog/${post.slug}`,
      title: post.frontmatter.title,
    })
  })

  return new NextResponse(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
