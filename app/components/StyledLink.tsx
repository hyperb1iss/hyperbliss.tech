// app/components/StyledLink.tsx
import Link from 'next/link'
import React from 'react'
import { css } from '../../styled-system/css'

const linkStyles = css`
  text-decoration: none;
  color: inherit;
`

/**
 * StyledLinkProps interface
 * Extends the default anchor props with a required href and children.
 */
type StyledLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  href: string
  children: React.ReactNode
}

/**
 * StyledLink component
 * Wraps the Next.js Link component with minimal styling.
 * @param {StyledLinkProps} props - The component props
 * @returns {JSX.Element} Rendered styled link
 */
const StyledLink = React.forwardRef<HTMLAnchorElement, StyledLinkProps>(
  ({ href, children, className, ...props }, ref) => {
    return (
      <Link className={`${linkStyles} ${className || ''}`} href={href} ref={ref} {...props}>
        {children}
      </Link>
    )
  },
)

StyledLink.displayName = 'StyledLink'

export default StyledLink
