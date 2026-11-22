// app/(transition)/blog/page.tsx
import BlogList from '../../components/BlogList'
import { getAllPosts } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'

export default async function Blog() {
  const posts = await getAllPosts()
  return <BlogList posts={posts} />
}

export const metadata = generatePageMetadata(
  'Writing',
  'Field notes on developer tools, terminal interfaces, creative coding, and building with AI.',
  '/blog/',
)
