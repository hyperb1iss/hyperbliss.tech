// app/lib/navigation.ts
export interface NavItem {
  label: string
  href: string
  /** Other sections that light this item up, like the founder page under Company. */
  also?: readonly string[]
}

/**
 * Main navigation, in display order. Labels and routes are decoupled so the
 * nav can say "Products" and "Writing" while the pages keep living at
 * /projects and /blog.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/projects', label: 'Products' },
  { href: '/blog', label: 'Writing' },
  { href: '/lab', label: 'Lab' },
  { also: ['/about', '/resume'], href: '/company', label: 'Company' },
]

export const isNavigationActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

export const isNavItemActive = (pathname: string, item: NavItem) =>
  [item.href, ...(item.also ?? [])].some((href) => isNavigationActive(pathname, href))

export const shouldHandleNavigation = (event: React.MouseEvent<HTMLAnchorElement>) =>
  !event.defaultPrevented &&
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey &&
  (!event.currentTarget.target || event.currentTarget.target === '_self') &&
  !event.currentTarget.hasAttribute('download')
