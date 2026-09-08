// app/(transition)/blog/page.tsx
import BlogList from '../../components/BlogList'
import { getAllPosts } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'

export default async function Blog() {
  const posts = await getAllPosts()

  // Transform to the format BlogList expects
  const blogPosts = posts.map((post) => ({
    frontmatter: {
      author: post.author ?? undefined,
      date: post.date ?? '',
      excerpt: post.excerpt ?? '',
      tags: (post.tags ?? []).filter((t): t is string => t !== null),
      title: post.displayTitle,
    },
    slug: post.slug,
  }))

  return <BlogList posts={blogPosts} />
}

export const metadata = generatePageMetadata(
  'Blog',
  'Articles by Stefanie Jane on software engineering, open source, and creative technology.',
  '/blog/',
)
