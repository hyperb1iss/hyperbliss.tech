import { notFound } from 'next/navigation'
import HomePageClient from '@/components/HomePageClient'
import { getAllLab, getAllPosts, getAllProjects, getPage, getSiteConfig } from '../lib/content'

export default async function Home() {
  try {
    // Fetch all data in parallel
    const [pageData, siteConfig, posts, projects, labExperiments] = await Promise.all([
      getPage('home'),
      getSiteConfig().catch(() => null),
      getAllPosts(),
      getAllProjects(),
      getAllLab(),
    ])

    return (
      <HomePageClient
        labExperiments={labExperiments}
        pageData={pageData}
        posts={posts}
        projects={projects}
        siteConfig={siteConfig}
      />
    )
  } catch {
    notFound()
  }
}
