// A band of Hypercolor's light behind a page's title, fading into the page:
// the same light as the front page hero, tinted per page (a static hue
// rotation) so each section reads in its own color and the title area stands
// apart from the content under it. It spans the viewport and pulls up under
// the header, so its container must be horizontally centered and positioned;
// it sits behind content and never takes pointer events.

import type { CSSProperties } from 'react'
import { css } from '../../styled-system/css'

export type LightTint = 'magenta' | 'pink' | 'violet' | 'cyan'

/** Hue rotations of the Cymatics render: magenta and blue at 0deg. */
const TINT_HUE: Record<LightTint, string> = {
  cyan: '-60deg',
  magenta: '0deg',
  pink: '40deg',
  violet: '22deg',
}

// Panda extracts this template statically, so the url is written out.
const bandStyles = css`
  position: absolute;
  left: 50%;
  top: -14rem;
  width: 100vw;
  height: 62rem;
  transform: translateX(-50%);
  z-index: -1;
  pointer-events: none;
  background-image: url('/images/emission/cymatics.webp');
  background-size: cover;
  background-position: 50% 18%;
  filter: hue-rotate(var(--band-hue, 0deg)) saturate(1.1);
  opacity: 0.55;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.55) 45%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.55) 45%, transparent 100%);

  @media (max-width: 768px) {
    top: -10rem;
    height: 46rem;
  }
`

interface TitleLightProps {
  /** The page's tint. Omit it to inherit --band-hue from the container (product pages set it per line). */
  tint?: LightTint
}

export default function TitleLight({ tint }: TitleLightProps) {
  const style = tint ? ({ '--band-hue': TINT_HUE[tint] } as CSSProperties) : undefined
  return <div aria-hidden="true" className={bandStyles} style={style} />
}
