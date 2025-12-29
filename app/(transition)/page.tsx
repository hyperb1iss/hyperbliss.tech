import HomeLayout from '@/components/HomeLayout'
import { getAllPosts, getAllProjects } from '@/lib/tina'

export default async function Home() {
  const allPosts = await getAllPosts()
  const allProjects = await getAllProjects()

  // Transform posts to the format HomeLayout expects
  const latestPosts = allPosts.slice(0, 5).map((post) => ({
    frontmatter: {
      author: post.author ?? '',
      date: post.date ?? '',
      excerpt: post.excerpt ?? '',
      tags: (post.tags ?? []).filter((t): t is string => t !== null),
      title: post.displayTitle,
    },
    slug: post.slug,
  }))

  // Transform projects to the format HomeLayout expects
  const projects = allProjects.map((project) => ({
    frontmatter: {
      description: project.description ?? '',
      github: project.github ?? '',
      tags: (project.tags ?? []).filter((t): t is string => t !== null),
      title: project.displayTitle,
    },
    slug: project.slug,
  }))

  return <HomeLayout latestPosts={latestPosts} projects={projects} />
}
