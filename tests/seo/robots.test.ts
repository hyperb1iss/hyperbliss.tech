import { GET } from '@/robots.txt/route'

describe('Robots.txt Generation', () => {
  it('should generate correct robots.txt content', async () => {
    const response = await GET()
    const content = await response.text()

    // Check content type
    expect(response.headers.get('Content-Type')).toBe('text/plain')

    // Check content structure
    const lines = content.split('\n')
    expect(lines).toEqual([
      'User-agent: *',
      'Allow: /',
      'Allow: /api/og',
      'Disallow: /api/*',
      'Disallow: /_next/*',
      'Disallow: /static/*',
      'Sitemap: https://hyperbliss.tech/sitemap.xml',
      'Host: https://hyperbliss.tech',
    ])
  })

  it('keeps the og card renderer fetchable by card scrapers', async () => {
    const response = await GET()
    const content = await response.text()

    // Twitterbot honors robots.txt for og:image fetches — if /api/og is not
    // explicitly allowed, cards silently render without images on X.
    const allowIndex = content.indexOf('Allow: /api/og')
    const disallowIndex = content.indexOf('Disallow: /api/*')
    expect(allowIndex).toBeGreaterThan(-1)
    expect(disallowIndex).toBeGreaterThan(-1)
    expect(allowIndex).toBeLessThan(disallowIndex)
  })
})
