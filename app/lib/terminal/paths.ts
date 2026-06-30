// Single source of truth for the virtual filesystem path scheme. Both the
// manifest builder and the lazy-body server use these so the tree the native
// commands see always matches the tree the shell mounts.

import { MARKDOWN_COLLECTIONS, type MarkdownDirectory } from '../contentCollections'
import type { ContentKind } from './types'

export const VFS_ABOUT = '/about.md'
export const VFS_NOW = '/now.md'
export const VFS_RESUME = '/resume.md'

const KIND_TO_DIRECTORY: Partial<Record<ContentKind, MarkdownDirectory>> = {
  lab: 'lab',
  post: 'posts',
  project: 'projects',
}

/** Virtual absolute path for a content item. */
export function virtualPath(kind: ContentKind, slug: string): string {
  if (kind === 'about') return VFS_ABOUT
  if (kind === 'now') return VFS_NOW
  if (kind === 'resume') return VFS_RESUME
  const directory = KIND_TO_DIRECTORY[kind]
  return directory ? `${MARKDOWN_COLLECTIONS[directory].virtualDir}/${slug}.md` : `/${slug}.md`
}

/** Deep route an item links into (trailing slash to match trailingSlash:true). */
export function deepHref(kind: ContentKind, slug: string): string | null {
  switch (kind) {
    case 'about':
      return '/about/'
    case 'resume':
      return '/resume/'
    case 'project':
      return `/${MARKDOWN_COLLECTIONS.projects.routeSegment}/${slug}/`
    case 'post':
      return `/${MARKDOWN_COLLECTIONS.posts.routeSegment}/${slug}/`
    case 'lab':
      return `/${MARKDOWN_COLLECTIONS.lab.routeSegment}/${slug}/`
    default:
      return null
  }
}
