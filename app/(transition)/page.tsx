import { notFound } from 'next/navigation'
import HomePageClient from '@/components/HomePageClient'
import client from '../../tina/__generated__/client'

export default async function Home() {
  try {
    // Fetch all data in parallel, preserving raw query results for visual editing
    const [pageResult, siteConfigResult, postsResult, projectsResult] = await Promise.all([
      client.queries.pages({ relativePath: 'home.json' }),
      client.queries.siteConfig({ relativePath: 'site.json' }).catch(() => null),
      client.queries.postsConnection({ sort: 'date' }),
      client.queries.projectsConnection({ sort: 'date' }),
    ])

    return (
      <HomePageClient
        pageData={{
          data: pageResult.data,
          query: pageResult.query,
          variables: { relativePath: 'home.json' },
        }}
        postsData={{
          data: postsResult.data,
          query: postsResult.query,
          variables: { sort: 'date' },
        }}
        projectsData={{
          data: projectsResult.data,
          query: projectsResult.query,
          variables: { sort: 'date' },
        }}
        siteConfigData={
          siteConfigResult
            ? {
                data: siteConfigResult.data,
                query: siteConfigResult.query,
                variables: { relativePath: 'site.json' },
              }
            : null
        }
      />
    )
  } catch {
    notFound()
  }
}
