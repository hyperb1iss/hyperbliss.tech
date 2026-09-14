// app/lib/navigation.ts
export interface NavItem {
  label: string
  href: string
}

/**
 * Main navigation, in display order. Labels and routes are decoupled so the
 * index page, the nav, and the front page can all say "Writing" while the
 * essays keep living at /blog.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/lab', label: 'Lab' },
  { href: '/resume', label: 'Resume' },
]

export const isNavigationActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

export const shouldHandleNavigation = (event: React.MouseEvent<HTMLAnchorElement>) =>
  !event.defaultPrevented &&
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey &&
  (!event.currentTarget.target || event.currentTarget.target === '_self') &&
  !event.currentTarget.hasAttribute('download')
