import { notFound } from 'next/navigation'
import HomePageClient from '@/components/HomePageClient'
import { getAllPosts, getAllProjects, getPage, getSiteConfig } from '../lib/content'

export default async function Home() {
  try {
    // Fetch all data in parallel
    const [pageData, siteConfig, posts, projects] = await Promise.all([
      getPage('home'),
      getSiteConfig().catch(() => null),
      getAllPosts(),
      getAllProjects(),
    ])

    return <HomePageClient pageData={pageData} posts={posts} projects={projects} siteConfig={siteConfig} />
  } catch {
    notFound()
  }
}
