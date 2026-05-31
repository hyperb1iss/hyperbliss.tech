// Shared building blocks for rich command output. All styling uses SilkCircuit
// tokens + Space Mono so command cards read as part of the terminal. Links are
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
  color: var(--silk-quantum-purple);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-wide);
  text-shadow: 0 0 12px rgba(162, 89, 255, 0.5);
  margin-bottom: var(--space-1);
`

export const Muted = styled.span`
  color: var(--text-muted);
`

export const Accent = styled.span`
  color: var(--silk-circuit-cyan);
`

export const Pink = styled.span`
  color: var(--silk-plasma-pink);
`

export const Ok = styled.span`
  color: var(--silk-success);
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
  color: var(--text-secondary);
  border: 1px solid rgba(162, 89, 255, 0.3);
  border-radius: var(--radius-full);
  padding: 0 var(--space-2);
`

export const TagRow = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--space-1-5);
`

const Anchor = styled.a`
  color: var(--silk-circuit-cyan);
  text-decoration: none;
  border-bottom: 1px dotted rgba(0, 255, 240, 0.4);
  transition: all var(--duration-fast) var(--ease-silk);

  &:hover,
  &:focus-visible {
    color: var(--silk-plasma-pink);
    border-bottom-color: var(--silk-plasma-pink);
    text-shadow: 0 0 10px rgba(255, 117, 216, 0.5);
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
