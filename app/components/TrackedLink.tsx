"use client";

import Link from "next/link";
import { ReactNode, MouseEvent } from "react";
import { trackExternalLink, trackNavigation } from "../lib/analytics";
import { usePathname } from "next/navigation";

interface TrackedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  title?: string;
  id?: string;
  trackingId?: string;
}

/**
 * A Link component that automatically tracks clicks with analytics
 * Handles both internal and external links
 */
export default function TrackedLink({
  href,
  children,
  className,
  ariaLabel,
  title,
  id,
  trackingId,
}: TrackedLinkProps) {
  const pathname = usePathname();
  const isExternal = href.startsWith("http") || href.startsWith("//");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Get link text for analytics
    let linkText = "";
    if (typeof children === "string") {
      linkText = children;
    } else if (e.currentTarget.textContent) {
      linkText = e.currentTarget.textContent.trim();
    }

    // Track based on link type
    if (isExternal) {
      trackExternalLink(href, linkText);
    } else {
      trackNavigation(pathname, href);
    }
  };

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        title={title}
        id={id}
        data-tracking-id={trackingId}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      title={title}
      id={id}
      data-tracking-id={trackingId}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
