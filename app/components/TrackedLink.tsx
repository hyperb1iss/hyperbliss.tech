'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MouseEvent, ReactNode } from 'react'
import { trackExternalLink, trackNavigation } from '../lib/analytics'

interface TrackedLinkProps {
  href: string
  children: ReactNode
  className?: string
  ariaLabel?: string
  title?: string
  id?: string
  trackingId?: string
}

/**
 * A Link component that automatically tracks clicks with analytics
 * Handles both internal and external links
 */
export default function TrackedLink({ href, children, className, ariaLabel, title, id, trackingId }: TrackedLinkProps) {
  const pathname = usePathname()
  const isExternal = href.startsWith('http') || href.startsWith('//')

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Get link text for analytics
    let linkText = ''
    if (typeof children === 'string') {
      linkText = children
    } else if (e.currentTarget.textContent) {
      linkText = e.currentTarget.textContent.trim()
    }

    // Track based on link type
    if (isExternal) {
      trackExternalLink(href, linkText)
    } else {
      trackNavigation(pathname, href)
    }
  }

  if (isExternal) {
    return (
      <a
        aria-label={ariaLabel}
        className={className}
        data-tracking-id={trackingId}
        href={href}
        id={id}
        onClick={handleClick}
        rel="noopener noreferrer"
        target="_blank"
        title={title}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      data-tracking-id={trackingId}
      href={href}
      id={id}
      onClick={handleClick}
      title={title}
    >
      {children}
    </Link>
  )
}
