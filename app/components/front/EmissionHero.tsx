// The front page hero: a full-bleed field of real Hypercolor light (a frame
// of its Cymatics effect) drifting under a slow conic bloom, pulled up under
// the fixed header so the light runs to the top edge. The headline is set
// huge and expanded, with one line in the brand's cyan and pink. Server
// component; the motion is CSS keyframes from globals.css, and the global
// reduced-motion rule collapses each to its final frame.

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'

// Panda extracts these templates statically, so the light's url is written
// out in each rule rather than interpolated.
const heroStyles = css`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 90rem;
  /* Pull up under the fixed header by exactly the layout's current offset,
     which grows while the terminal is open (GlobalLayout sets the variables). */
  margin-top: calc(-1 * var(--layout-pad, 100px));
  padding-top: var(--layout-pad, 100px);
  /* Same timing as GlobalLayout's padding, so the two cancel mid-toggle too. */
  transition:
    margin-top 0.3s ease,
    padding-top 0.3s ease;

  @media (max-width: 768px) {
    min-height: 72rem;
    margin-top: calc(-1 * var(--layout-pad-mobile, 80px));
    padding-top: var(--layout-pad-mobile, 80px);
  }
`

const lightStyles = css`
  position: absolute;
  inset: -8%;
  z-index: -3;
  background-image: url('/images/emission/cymatics.webp');
  background-size: cover;
  background-position: center;
  animation: emission-drift 26s ease-in-out infinite alternate;
  will-change: transform;
`

const bloomStyles = css`
  position: absolute;
  left: 50%;
  top: 38%;
  width: 150rem;
  height: 150rem;
  margin: -75rem 0 0 -75rem;
  z-index: -2;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(225, 53, 255, 0.42),
    rgba(128, 255, 234, 0.22),
    rgba(255, 106, 193, 0.36),
    rgba(120, 90, 255, 0.32),
    rgba(225, 53, 255, 0.42)
  );
  filter: blur(130px);
  mix-blend-mode: screen;
  opacity: 0.55;
  animation: emission-spin 40s linear infinite;
  will-change: transform;

  @media (max-width: 768px) {
    display: none;
  }
`

const Fade = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    180deg,
    rgba(5, 3, 8, 0.7) 0%,
    rgba(5, 3, 8, 0.05) 26%,
    rgba(5, 3, 8, 0.25) 62%,
    #050308 100%
  );
  pointer-events: none;
`

const Content = styled.div`
  margin-top: auto;
  width: 100%;
  max-width: 144rem;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  padding: 0 6.4rem 7.2rem;
  display: flex;
  flex-direction: column;
  gap: 4.4rem;

  @media (max-width: 768px) {
    padding: 0 2rem 5.6rem;
    gap: 3.2rem;
  }
`

const headlineStyles = css`
  margin: 0;
  font-family: var(--font-display);
  font-stretch: 125%;
  font-weight: 900;
  /* Sized so the longest line fills the row: this face sets about 0.9em
     per character, and the row is about 86vw wide on a phone. */
  font-size: clamp(3.4rem, calc(86vw / (var(--fit, 10) * 0.9)), var(--cap, 13.6rem));
  line-height: 0.9;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #f6f2ff;
  display: flex;
  flex-direction: column;

  /* Two lines leave room for taller type than three. */
  &[data-short='true'] {
    --cap: 18rem;
  }
`

/* The face kerns a full stop under the arm of a W or Y; give it air. */
const stopStyles = css`
  margin-left: 0.045em;
`

const riseStyles = css`
  animation: emission-rise 1s cubic-bezier(0.2, 0.75, 0.2, 1) backwards;
`

// One line is the crisp accent on the page: the brand's cyan running
// into pink, bright against the magenta field behind it. It owns its whole
// animation instead of sharing riseStyles, so no two atomic classes compete
// for the animation property: it rises, flicks on like a sign catching, then
// (on wide screens) its gradient slides slowly. Its start comes from
// --rise-delay, since one inline animation-delay would retime all three.
const fillStyles = css`
  /* Positioned so it paints above the glow copy behind it. */
  position: relative;
  background-image: linear-gradient(95deg, #80ffea 0%, #a8e4ff 30%, #ffffff 50%, #ffb3e6 72%, #80ffea 100%);
  background-size: 220% 100%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
    animation: emission-pan 18s ease-in-out 2.4s infinite alternate;
  }
`

/* The lit line: the crisp fill above, and behind it a blurred copy of the
   word that warms up after the rise and then breathes. The copy is blurred
   once and only its opacity animates, so the glow stays on the compositor. */
const glowStyles = css`
  position: relative;
  animation: emission-rise 1s cubic-bezier(0.2, 0.75, 0.2, 1) var(--rise-delay, 0ms) backwards;

  &::before {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    white-space: nowrap;
    pointer-events: none;
    background-image: linear-gradient(95deg, #2dfff0 0%, #5ce1ff 55%, #a9c7ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    /* A tight halo from the blur, and a wide bloom from its shadow. */
    filter: blur(0.07em) saturate(1.6) drop-shadow(0 0 0.3em rgba(60, 240, 255, 0.9));
    will-change: opacity;
    animation:
      emission-glow-on 1.8s ease-out calc(var(--rise-delay, 0ms) + 0.7s) backwards,
      emission-breathe 4.5s ease-in-out calc(var(--rise-delay, 0ms) + 2.5s) infinite alternate;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 3.2rem;
`

const Intro = styled.p`
  margin: 0;
  max-width: 46ch;
  font-size: clamp(1.8rem, 1.5rem + 0.5vw, 2.2rem);
  line-height: 1.5;
  font-weight: 300;
  color: #e2dcf0;
  text-wrap: pretty;
`

const Ctas = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem;
`

const Primary = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 1.6rem 2.8rem;
  border-radius: 999px;
  background: #f4f0ff;
  color: #0b0712;
  font-weight: 600;
  font-size: 1.6rem;
  text-decoration: none;
  transition:
    transform var(--duration-normal) var(--ease-silk),
    box-shadow var(--duration-normal) var(--ease-silk);

  &:hover {
    color: #0b0712;
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.4),
      0 18px 50px rgba(225, 53, 255, 0.45);
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover,
    &:active {
      transform: none;
    }
  }
`

const Secondary = styled(Link)`
  color: #f4f0ff;
  font-size: 1.6rem;
  text-decoration: none;
  border-bottom: 1px solid rgba(244, 240, 255, 0.4);
  padding-bottom: 2px;

  &:hover {
    color: #ffffff;
    border-bottom-color: #ffffff;
  }
`

interface EmissionHeroProps {
  headline: string[]
  /** The line set in the accent colors, counted from 0. Defaults to the last. */
  accent?: number
  intro: ReactNode
  /** Link for the secondary action: the newest essay, when there is one. */
  essayHref: string | null
}

/** Sets a closing full stop, question or exclamation mark off from the word. */
function splitStop(line: string): ReactNode {
  const stop = line.match(/[.!?]$/)?.[0]
  if (!stop) return line
  return (
    <>
      {line.slice(0, -1)}
      <span className={stopStyles}>{stop}</span>
    </>
  )
}

export default function EmissionHero({ headline, accent, intro, essayHref }: EmissionHeroProps) {
  const accentLine = accent !== undefined && accent >= 0 && accent < headline.length ? accent : headline.length - 1
  const longest = Math.max(...headline.map((line) => line.length))
  return (
    <section aria-labelledby="hero-title" className={heroStyles}>
      <div aria-hidden="true" className={lightStyles} />
      <div aria-hidden="true" className={bloomStyles} />
      <Fade aria-hidden="true" />
      <Content>
        <h1
          className={headlineStyles}
          data-short={headline.length <= 2}
          id="hero-title"
          style={{ '--fit': longest } as CSSProperties}
        >
          {headline.map((line, index) => (
            <span
              className={index === accentLine ? glowStyles : riseStyles}
              data-text={index === accentLine ? line : undefined}
              key={line}
              style={
                index === accentLine
                  ? ({ '--rise-delay': `${120 + index * 120}ms` } as CSSProperties)
                  : { animationDelay: `${120 + index * 120}ms` }
              }
            >
              {index === accentLine ? <span className={fillStyles}>{splitStop(line)}</span> : splitStop(line)}{' '}
            </span>
          ))}
        </h1>
        <Row className={riseStyles} style={{ animationDelay: '560ms' }}>
          <Intro>{intro}</Intro>
          <Ctas>
            <Primary href="#products">See the products</Primary>
            {essayHref && <Secondary href={essayHref}>Read the latest essay</Secondary>}
          </Ctas>
        </Row>
      </Content>
    </section>
  )
}
