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
      'Disallow: /api/*',
      'Disallow: /_next/*',
      'Disallow: /static/*',
      'Sitemap: https://hyperbliss.tech/sitemap.xml',
      'Host: https://hyperbliss.tech',
    ])
  })
})
