// `open <name>`: go to a section or to any piece of content by name.

import { registry } from '../registry'
import { text } from '../render'
import { findEntry } from './entries'

const SECTIONS: Record<string, string> = {
  about: '/about/',
  archive: '/archive/',
  blog: '/blog/',
  home: '/',
  lab: '/lab/',
  products: '/projects/',
  projects: '/projects/',
  resume: '/resume/',
  writing: '/blog/',
}

registry.register({
  aliases: ['go'],
  group: 'content',
  name: 'open',
  run: (args, ctx) => {
    const name = args.join(' ').trim()
    if (!name) return text('usage: open <name> (try: open hypercolor, open blog)')
    const href = SECTIONS[name.toLowerCase()] ?? findEntry(ctx.manifest, name)?.href
    if (!href) return text(`open: nothing here is called '${name}' (try: projects)`, 'stderr')
    ctx.navigate(href)
    return text(`opening ${href}`, 'system')
  },
  summary: 'go to a page by name',
  usage: 'open hypercolor',
})
