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
  height: 56rem;
  transform: translateX(-50%);
  z-index: -1;
  pointer-events: none;
  /* The render's bright upper band, zoomed past its dark beam, under a scrim
     that keeps the title side calm so the type stays crisp. */
  background-image:
    linear-gradient(90deg, rgba(5, 3, 8, 0.62) 0%, rgba(5, 3, 8, 0.28) 46%, transparent 78%),
    url('/images/emission/cymatics.webp');
  background-repeat: no-repeat;
  /* At least 118rem wide, so the frame is always taller than the band: on a
     phone, 190% of the viewport left it shorter and it tiled into a hard edge. */
  background-size:
    100% 100%,
    max(190%, 118rem) auto;
  background-position:
    0 0,
    92% 0%;
  filter: hue-rotate(var(--band-hue, 0deg)) saturate(1.25);
  opacity: 0.9;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.72) 38%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.72) 38%, transparent 100%);

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
