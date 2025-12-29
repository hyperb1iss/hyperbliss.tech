// app/(transition)/blog/page.tsx
import BlogList from '../../components/BlogList'
import { getAllPosts } from '../../lib/tina'

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
