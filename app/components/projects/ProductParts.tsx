// The pieces a product page carries: the primary call to action (a pill filled
// with its line's light), a quiet underlined secondary link beside it, and the
// framed 16:10 screenshot glowing in the same light. The light comes from the
// line's custom properties (lineLight.ts) set on the page; the fallbacks are
// the agent line's.

import { styled } from '../../../styled-system/jsx'

export const PrimaryAction = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2.6rem;
  border-radius: 999px;
  background: linear-gradient(110deg, var(--cta-a, #8f6bff), var(--cta-b, #e135ff));
  color: var(--cta-ink, #0d0618);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 1.6rem;
  text-decoration: none;
  transition:
    box-shadow var(--duration-normal) var(--ease-silk),
    transform var(--duration-normal) var(--ease-silk);

  &:hover {
    color: var(--cta-ink, #0d0618);
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.4),
      0 18px 50px var(--shot-glow, rgba(120, 90, 255, 0.4));
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`

export const SecondaryAction = styled.span`
  font-size: 1.5rem;

  & a {
    color: #f4f0ff;
    text-decoration: none;
    border-bottom: 1px solid rgba(244, 240, 255, 0.35);
    padding-bottom: 2px;
  }
  & a:hover {
    color: #ffffff;
    border-bottom-color: #ffffff;
  }
`

export const ProductShot = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: 1.4rem;
  overflow: hidden;
  background: #05050c;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.14),
    0 40px 120px var(--shot-glow, rgba(120, 90, 255, 0.4)),
    0 20px 50px rgba(0, 0, 0, 0.6);

  & img {
    object-fit: cover;
    object-position: top left;
  }
`
