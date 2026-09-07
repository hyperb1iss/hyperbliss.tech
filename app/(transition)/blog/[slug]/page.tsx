// app/(transition)/blog/[slug]/page.tsx
import { ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPost, { type PostNeighbor } from '../../../components/BlogPost'
import StructuredData from '../../../components/StructuredData'
import { getAllPostSlugs, getAllPosts, getPost } from '../../../lib/content'
import { type BlogFrontmatter, generateBlogMetadata } from '../../../lib/generateMetadata'
import { extractHeadings, readingTime } from '../../../lib/reading'
import { generateArticleSchema, generateBreadcrumbSchema } from '../../../lib/structuredData'
import { PageProps } from '../../../types'

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Content ships with the build, so any slug we didn't pre-render is a 404.
export const dynamicParams = false

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata) {
  const resolvedParams = await params
  const slug = resolvedParams.slug as string

  const post = await getPost(slug)
  if (!post) notFound()

  const frontmatter: BlogFrontmatter = {
    author: post.author ?? undefined,
    date: post.date ?? '',
    excerpt: post.excerpt ?? '',
    tags: (post.tags ?? []).filter((t): t is string => t !== null),
    title: post.displayTitle,
  }

  return generateBlogMetadata(frontmatter, slug, parent)
}

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug as string

  const [post, allPosts] = await Promise.all([getPost(slug), getAllPosts()])
  if (!post) notFound()

  // Neighbors in publication order: older on the left, newer on the right.
  const ordered = [...allPosts].sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
  const at = ordered.findIndex((p) => p.slug === slug)
  const neighbor = (p: (typeof ordered)[number] | undefined): PostNeighbor | null =>
    p ? { date: p.date, slug: p.slug, title: p.title } : null
  const prev = at > 0 ? neighbor(ordered[at - 1]) : null
  const next = at >= 0 && at < ordered.length - 1 ? neighbor(ordered[at + 1]) : null
  const body = post.body ?? ''

  const articleSchema = generateArticleSchema(
    post.displayTitle,
    post.excerpt ?? '',
    post.author ?? 'Stefanie Jane',
    post.date ?? '',
    `https://hyperbliss.tech/blog/${slug}/`,
    (post.tags ?? []).filter((t): t is string => t !== null),
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://hyperbliss.tech/' },
    { name: 'Blog', url: 'https://hyperbliss.tech/blog/' },
    { name: post.displayTitle, url: `https://hyperbliss.tech/blog/${slug}/` },
  ])

  return (
    <>
      <StructuredData data={[articleSchema, breadcrumbSchema]} />
      <BlogPost
        content={body}
        date={post.date ?? ''}
        headings={extractHeadings(body)}
        next={next}
        prev={prev}
        readingMinutes={readingTime(body)}
        tags={(post.tags ?? []).filter((t): t is string => t !== null)}
        title={post.title}
      />
    </>
  )
}
