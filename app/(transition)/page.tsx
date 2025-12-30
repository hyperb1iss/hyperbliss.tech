import HomeLayout from '@/components/HomeLayout'
import { getAllPosts, getAllProjects, getPage, getSiteConfig } from '@/lib/tina'

export default async function Home() {
  // Fetch all data in parallel
  const [allPosts, allProjects, homePage, siteConfig] = await Promise.all([
    getAllPosts(),
    getAllProjects(),
    getPage('home').catch(() => null),
    getSiteConfig().catch(() => null),
  ])

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

  return (
    <HomeLayout hero={homePage?.hero} latestPosts={latestPosts} projects={projects} techTags={siteConfig?.techTags} />
  )
}
