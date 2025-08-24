import HomeLayout from '@/components/HomeLayout'
import { getAllMarkdownSlugs, getMarkdownContent } from '@/lib/markdown'

export default async function Home() {
  const postSlugs = await getAllMarkdownSlugs('src/posts')
  const posts = await Promise.all(
    postSlugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent('src/posts', slug)
      return {
        frontmatter: {
          author: frontmatter.author as string,
          date: frontmatter.date as string,
          excerpt: frontmatter.excerpt as string,
          tags: (frontmatter.tags as string[]) || [],
          title: frontmatter.title as string,
        },
        slug,
      }
    }),
  )

  // Sort posts by date
  posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())

  // Take only the latest 5 posts for the sidebar
  const latestPosts = posts.slice(0, 5)

  // Fetch real project data
  const projectSlugs = await getAllMarkdownSlugs('src/projects')
  const projects = await Promise.all(
    projectSlugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent('src/projects', slug)
      return {
        frontmatter: {
          description: frontmatter.description as string,
          github: frontmatter.github as string,
          tags: (frontmatter.tags as string[]) || [],
          title: frontmatter.title as string,
        },
        slug,
      }
    }),
  )

  return <HomeLayout latestPosts={latestPosts} projects={projects} />
}
