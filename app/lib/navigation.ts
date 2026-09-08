// app/lib/navigation.ts
/**
 * Array of navigation item labels
 * Used to generate the main navigation menu
 */
export const NAV_ITEMS = ['About', 'Blog', 'Projects', 'Lab', 'Resume']

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
