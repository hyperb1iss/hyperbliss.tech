// The footer's product links are typed by hand in navigation.ts. This holds
// them to the content: the same flagships, in the same order, at slugs that
// exist, so a new product or a rename cannot quietly strand the footer.

import { getAllProjects } from '@/lib/content'
import { FOOTER_COLUMNS } from '@/lib/navigation'

describe('footer product links', () => {
  it('are the flagships from content/projects, in their pinned order', async () => {
    const projects = await getAllProjects()
    const flagships = projects
      .filter((p) => typeof p.featured === 'number')
      .sort((a, b) => (a.featured as number) - (b.featured as number))

    const links = FOOTER_COLUMNS.find((column) => column.title === 'Products')?.links ?? []
    const products = links.filter((link) => link.href !== '/projects/')

    expect(products.map((link) => link.href)).toEqual(flagships.map((p) => `/projects/${p.slug}/`))
    expect(products.map((link) => link.label)).toEqual(flagships.map((p) => p.title.split(':')[0].trim()))
  })
})
