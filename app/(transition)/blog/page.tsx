// app/(transition)/blog/page.tsx
import BlogList from '../../components/BlogList'
import { getAllPosts } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'

export default async function Blog() {
  const posts = await getAllPosts()
  return <BlogList posts={posts} />
}

export const metadata = generatePageMetadata(
  'Blog',
  'Articles by Stefanie Jane on software engineering, open source, and creative technology.',
  '/blog/',
)
