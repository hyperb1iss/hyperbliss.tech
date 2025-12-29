// app/(transition)/blog/[slug]/page.tsx
import { ResolvingMetadata } from 'next'
import BlogPostTina from '../../../components/BlogPostTina'
import StructuredData from '../../../components/StructuredData'
import { type BlogFrontmatter, generateBlogMetadata } from '../../../lib/generateMetadata'
import { generateArticleSchema, generateBreadcrumbSchema } from '../../../lib/structuredData'
import { getAllPostSlugs, getPost } from '../../../lib/tina'
import { PageProps } from '../../../types'

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata) {
  const resolvedParams = await params
  const slug = resolvedParams.slug as string

  const post = await getPost(slug)

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

  const post = await getPost(slug)

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
      <BlogPostTina
        author={post.author ?? undefined}
        body={post.body}
        date={post.date ?? ''}
        tags={(post.tags ?? []).filter((t): t is string => t !== null)}
        title={post.displayTitle}
      />
    </>
  )
}
