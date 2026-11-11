// Shared building blocks for rich command output. All styling uses SilkCircuit
// colors + the site mono so command cards read as part of the terminal. Links are
// real <a> elements (crawlable, middle-click works) that fall through to SPA
// navigation on a plain left-click.

import type { ReactNode } from 'react'
import { styled } from '../../../../styled-system/jsx'

export const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-1) 0;
  font-family: var(--font-mono);
`

export const Heading = styled.div`
  color: #ff9bdc;
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-wide);
  margin-bottom: var(--space-1);
`

export const Muted = styled.span`
  color: #b9b0cc;
`

export const Accent = styled.span`
  color: #80ffea;
`

export const Pink = styled.span`
  color: #ff9bdc;
`

export const Ok = styled.span`
  color: #b9b0cc;
`

export const ListRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2);
  padding: 1px 0;
`

export const Tag = styled.span`
  font-size: 0.85em;
  color: #b9b0cc;
  border: 1px solid rgba(244, 240, 255, 0.16);
  border-radius: 0.5rem;
  padding: 0 var(--space-2);
`

export const TagRow = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--space-1-5);
`

const Anchor = styled.a`
  color: #80ffea;
  text-decoration: none;
  border-bottom: 1px solid rgba(128, 255, 234, 0.3);
  transition:
    color var(--duration-fast) var(--ease-silk),
    border-color var(--duration-fast) var(--ease-silk);

  &:hover,
  &:focus-visible {
    color: #ffffff;
    border-bottom-color: #ffffff;
    outline: none;
  }
`

export interface TermLinkProps {
  href: string
  navigate: (href: string) => void
  children: ReactNode
}

const isHttp = (href: string): boolean => /^https?:\/\//.test(href)
const isPlainAnchor = (href: string): boolean => /^(https?:|mailto:)/.test(href)

export function TermLink({ href, navigate, children }: TermLinkProps) {
  const http = isHttp(href)
  return (
    <Anchor
      href={href}
      onClick={(e) => {
        // External + mailto links use the browser; only internal routes SPA-navigate.
        if (isPlainAnchor(href)) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        navigate(href)
      }}
      rel={http ? 'noopener noreferrer' : undefined}
      target={http ? '_blank' : undefined}
    >
      {children}
    </Anchor>
  )
}
