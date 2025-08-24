// app/robots.txt/route.ts

type RobotsRule = {
  userAgent: string | string[]
  allow: string | string[]
  disallow: string[]
  crawlDelay?: number
}

/**
 * Generates robots.txt content
 * @returns {Response} The robots.txt response
 */
export async function GET(): Promise<Response> {
  const robotsTxt = {
    host: 'https://hyperbliss.tech',
    rules: [
      {
        allow: '/',
        disallow: [
          '/api/*', // Prevent crawling of API routes
          '/_next/*', // Prevent crawling of Next.js system files
          '/static/*', // Prevent crawling of static assets
        ],
        userAgent: '*',
      },
    ] as RobotsRule[],
    sitemap: 'https://hyperbliss.tech/sitemap.xml',
  }

  const firstRule = robotsTxt.rules[0]

  // Convert the robots config to text format manually
  const content = [
    `User-agent: ${firstRule.userAgent}`,
    `Allow: ${firstRule.allow}`,
    ...firstRule.disallow.map((path: string) => `Disallow: ${path}`),
    `Sitemap: ${robotsTxt.sitemap}`,
    `Host: ${robotsTxt.host}`,
  ].join('\n')

  // Return response with correct content type
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
