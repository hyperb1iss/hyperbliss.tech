// Section primitives shared by the Company and founder pages: a quiet
// uppercase marker over a hairline, prose at reading width, a two-column
// definition grid, and small print with an inline mono link.

import { styled } from '../../styled-system/jsx'

export const Prose = styled.div`
  max-width: 72rem;

  & .markdown-prose__paragraph {
    font-size: 1.7rem;
    line-height: 1.6;
    font-weight: 300;
    letter-spacing: 0;
    color: var(--text-secondary);
    margin-bottom: 1.6rem;
  }
  & .markdown-prose__paragraph strong {
    color: var(--silk-steel-50);
    text-shadow: none;
    font-weight: 500;
  }
  & .markdown-prose__paragraph a,
  & .markdown-prose__link {
    color: var(--silk-circuit-cyan);
    text-shadow: none;
  }
`

export const Section = styled.section`
  padding: 0;
  margin-top: 4.8rem;
  max-width: 72rem;
`

export const Heading = styled.h2`
  font-family: var(--font-mono);
  font-stretch: 100%;
  font-weight: 500;
  font-size: 1.3rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: none;
  color: #b9b0cc;
  margin: 0 0 2rem;
  padding-top: 2.4rem;
  border-top: 1px solid rgba(244, 240, 255, 0.12);
`

export const Reasons = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem 3.2rem;
  margin: 0;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }

  & dt {
    font-family: var(--font-display);
    font-stretch: 112%;
    font-weight: 800;
    font-size: 1.9rem;
    letter-spacing: -0.015em;
    color: #f6f2ff;
    margin: 0 0 0.4rem;
  }
  & dd {
    font-size: 1.55rem;
    font-weight: 300;
    line-height: 1.55;
    color: #cfc8de;
    margin: 0;
  }
`

export const Quiet = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;

  & a {
    font-family: var(--font-mono);
    font-size: 1.2rem;
    letter-spacing: 0.04em;
    color: var(--silk-circuit-cyan);
    text-decoration: none;
    margin-left: 0.8rem;
  }
  & a:hover {
    color: var(--silk-steel-50);
  }
`
