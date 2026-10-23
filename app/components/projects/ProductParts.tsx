// The pieces a product carries wherever it appears: the primary call to
// action, a quiet secondary link beside it, and the framed 16:10 screenshot.
// Shared by the flagship panels on Products and the product pages.

import { styled } from '../../../styled-system/jsx'

export const PrimaryAction = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 2.2rem;
  border-radius: 6px;
  background: linear-gradient(110deg, var(--silk-quantum-purple) 0%, var(--silk-circuit-cyan) 100%);
  color: #0a0a14;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.01em;
  text-decoration: none;
  box-shadow: 0 0 0 1px rgba(0, 255, 240, 0.2), 0 10px 30px rgba(162, 89, 255, 0.25);
  transition:
    box-shadow var(--duration-normal) var(--ease-silk),
    transform var(--duration-normal) var(--ease-silk);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 0 1px rgba(0, 255, 240, 0.45), 0 14px 38px rgba(0, 255, 240, 0.25);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`

export const SecondaryAction = styled.span`
  font-family: var(--font-mono);
  font-size: 1.25rem;
  letter-spacing: 0.04em;

  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
  }
  & a:hover {
    color: var(--silk-steel-50);
  }
`

export const ProductShot = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(162, 89, 255, 0.3);
  background: #05050c;
  box-shadow:
    0 0 0 1px rgba(0, 255, 240, 0.06),
    0 24px 60px rgba(0, 0, 0, 0.55),
    0 0 70px rgba(162, 89, 255, 0.16);

  & img {
    object-fit: cover;
    object-position: top left;
  }
`
