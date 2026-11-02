// app/lib/og/card.tsx
// OG cards in the Emission language: the words on flat void, a field of
// Hypercolor's real light on the right tinted per kind, the expanded Archivo
// title, a Sora subtitle, and mono labels. Satori renders this, so every
// element is flex and every style is inline. Keeping the type side flat and
// the frames' blacks crushed holds the PNG near 250KB; a full-bleed light
// wash weighed twice that.

import type { ReactElement } from 'react'

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export type OgKind = 'site' | 'blog' | 'project' | 'lab'

/** The light frame each kind uses, matching the site's title bands. */
export const KIND_TINT: Record<OgKind, 'magenta' | 'pink' | 'violet' | 'cyan'> = {
  blog: 'pink',
  lab: 'cyan',
  project: 'violet',
  site: 'magenta',
}

export interface OgCardProps {
  kind: OgKind
  title: string
  subtitle?: string
  meta?: string
  logoSrc?: string
  /** A data URI of the kind's tinted light frame. */
  lightSrc?: string
}

const VOID = '#050308'
const INK = '#f6f2ff'
const SOFT = '#d6cfe6'
const MUTED = '#b9b0cc'

const LABEL: Record<OgKind, string> = {
  blog: 'ESSAY',
  lab: 'LAB',
  project: 'PRODUCT',
  site: 'HYPERBLISS TECHNOLOGIES',
}

/** The label ink per kind: each tint's lightest readable tone. */
const LABEL_INK: Record<OgKind, string> = {
  blog: '#ffb3e6',
  lab: '#80ffea',
  project: '#c3b3ff',
  site: '#ff9bdc',
}

const SITE_HEADLINE = ['SOFTWARE', 'THAT PUTS YOU', 'IN CONTROL.']
const SITE_SUBTITLE = 'Open source tools for light, memory, and the terminal.'

const clamp = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value)

/** Archivo at 125% width runs wide, so the size steps down early. */
function titleSize(title: string): number {
  if (title.length <= 18) return 88
  if (title.length <= 36) return 70
  if (title.length <= 60) return 56
  return 46
}

export function OgCard({ kind, title, subtitle, meta, logoSrc, lightSrc }: OgCardProps): ReactElement {
  const isSite = kind === 'site'
  const shownTitle = clamp(title, 90)
  return (
    <div style={{ backgroundColor: VOID, display: 'flex', height: '100%', position: 'relative', width: '100%' }}>
      {lightSrc ? (
        <img
          alt=""
          height={OG_HEIGHT}
          src={lightSrc}
          style={{ height: OG_HEIGHT, left: 0, objectFit: 'cover', position: 'absolute', top: 0, width: OG_WIDTH }}
          width={OG_WIDTH}
        />
      ) : null}
      <div
        style={{
          backgroundImage: `linear-gradient(90deg, ${VOID} 0%, ${VOID} 58%, rgba(5, 3, 8, 0.72) 74%, rgba(5, 3, 8, 0.15) 100%)`,
          display: 'flex',
          height: OG_HEIGHT,
          left: 0,
          position: 'absolute',
          top: 0,
          width: OG_WIDTH,
        }}
      />
      <div
        style={{
          backgroundImage: 'linear-gradient(180deg, rgba(5, 3, 8, 0) 58%, rgba(5, 3, 8, 0.86) 100%)',
          display: 'flex',
          height: OG_HEIGHT,
          left: 0,
          position: 'absolute',
          top: 0,
          width: OG_WIDTH,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: OG_HEIGHT,
          justifyContent: 'space-between',
          left: 0,
          padding: '56px 64px 52px',
          position: 'absolute',
          top: 0,
          width: OG_WIDTH,
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 26 }}>
          {logoSrc ? <img alt="" height={46} src={logoSrc} width={150} /> : null}
          <div
            style={{
              color: LABEL_INK[kind],
              display: 'flex',
              fontFamily: 'Geist Mono',
              fontSize: 20,
              letterSpacing: 2,
            }}
          >
            {LABEL[kind]}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000 }}>
          {isSite ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SITE_HEADLINE.map((line) => (
                <div
                  key={line}
                  style={{
                    color: INK,
                    display: 'flex',
                    fontFamily: 'Archivo Expanded',
                    fontSize: 84,
                    fontWeight: 900,
                    letterSpacing: -1.5,
                    lineHeight: 0.92,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                color: INK,
                display: 'flex',
                fontFamily: 'Archivo Expanded',
                fontSize: titleSize(shownTitle),
                fontWeight: 900,
                letterSpacing: -1,
                lineHeight: 1,
                wordBreak: 'break-word',
              }}
            >
              {shownTitle}
            </div>
          )}
          {(isSite ? SITE_SUBTITLE : subtitle) ? (
            <div
              style={{
                color: SOFT,
                display: 'flex',
                fontFamily: 'Sora',
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1.4,
                maxWidth: 900,
                wordBreak: 'break-word',
              }}
            >
              {isSite ? SITE_SUBTITLE : clamp(subtitle ?? '', 140)}
            </div>
          ) : null}
        </div>

        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ color: MUTED, display: 'flex', fontFamily: 'Geist Mono', fontSize: 22 }}>hyperbliss.tech</div>
          {meta ? (
            <div style={{ color: LABEL_INK[kind], display: 'flex', fontFamily: 'Geist Mono', fontSize: 22 }}>
              {clamp(meta, 40)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
