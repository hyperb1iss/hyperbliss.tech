// app/lib/og/card.tsx

import type { ReactElement } from 'react'

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export type OgKind = 'site' | 'blog' | 'project'

export interface OgCardProps {
  kind: OgKind
  title: string
  subtitle?: string
  meta?: string
  path?: string
  logoSrc?: string
}

const COSMIC_PURPLE = '#a259ff'
const NEON_PINK = '#ff75d8'
const DIGITAL_CYAN = '#00fff0'
const TEXT_GRAY = '#c9c7d6'

const clamp = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value)

function titleSize(title: string): number {
  if (title.length <= 24) return 72
  if (title.length <= 48) return 58
  if (title.length <= 72) return 48
  return 40
}

function promptLine({ kind, path }: OgCardProps): string {
  if (path) return `$ ${path}`
  if (kind === 'blog') return '$ cat blog/latest.md'
  if (kind === 'project') return '$ hyperbliss projects --show'
  return '$ hyperbliss --hello'
}

function TitleBar({ label }: { label: string }): ReactElement {
  return (
    <div
      style={{
        alignItems: 'center',
        borderBottom: '1px solid rgba(162, 89, 255, 0.35)',
        display: 'flex',
        gap: 20,
        padding: '22px 36px',
      }}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ backgroundColor: NEON_PINK, borderRadius: 8, height: 16, width: 16 }} />
        <div style={{ backgroundColor: '#f1fa8c', borderRadius: 8, height: 16, width: 16 }} />
        <div style={{ backgroundColor: '#50fa7b', borderRadius: 8, height: 16, width: 16 }} />
      </div>
      <div style={{ color: TEXT_GRAY, display: 'flex', fontFamily: 'Space Mono', fontSize: 22 }}>{label}</div>
    </div>
  )
}

function Pill({ text, color }: { text: string; color: string }): ReactElement {
  return (
    <div
      style={{
        border: `1.5px solid ${color}`,
        borderRadius: 999,
        color,
        display: 'flex',
        fontFamily: 'Exo 2',
        fontSize: 22,
        fontWeight: 600,
        padding: '6px 20px',
      }}
    >
      {text}
    </div>
  )
}

function SiteBody({ logoSrc }: OgCardProps): ReactElement {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 48,
      }}
    >
      {logoSrc ? <img alt="" height={96} src={logoSrc} width={312} /> : null}
      <div
        style={{
          color: '#ffffff',
          display: 'flex',
          fontFamily: 'Jura',
          fontSize: 88,
          fontWeight: 700,
          letterSpacing: 14,
          marginTop: 40,
          textShadow: `0 0 32px ${NEON_PINK}, 0 0 90px rgba(255, 117, 216, 0.55)`,
        }}
      >
        STEFANIE JANE
      </div>
      <div
        style={{
          color: TEXT_GRAY,
          display: 'flex',
          fontFamily: 'Exo 2',
          fontSize: 32,
          marginTop: 28,
          textAlign: 'center',
        }}
      >
        I build software that gives people control over their technology.
      </div>
      <div
        style={{
          color: DIGITAL_CYAN,
          display: 'flex',
          fontFamily: 'Space Mono',
          fontSize: 30,
          letterSpacing: 8,
          marginTop: 34,
          textShadow: '0 0 24px rgba(0, 255, 240, 0.6)',
        }}
      >
        @HYPERBLISS
      </div>
    </div>
  )
}

function ContentBody(props: OgCardProps): ReactElement {
  const { kind, title, subtitle, meta, logoSrc } = props
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        padding: '40px 56px 44px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            color: DIGITAL_CYAN,
            display: 'flex',
            fontFamily: 'Space Mono',
            fontSize: 24,
            textShadow: '0 0 18px rgba(0, 255, 240, 0.45)',
          }}
        >
          {promptLine(props)}
        </div>
        <div
          style={{
            color: '#ffffff',
            display: 'flex',
            fontFamily: 'Jura',
            fontSize: titleSize(title),
            fontWeight: 700,
            lineHeight: 1.15,
            marginTop: 28,
            textShadow: '0 0 28px rgba(162, 89, 255, 0.75), 0 0 70px rgba(255, 117, 216, 0.35)',
          }}
        >
          {clamp(title, 90)}
        </div>
        {subtitle ? (
          <div
            style={{
              color: TEXT_GRAY,
              display: 'flex',
              fontFamily: 'Exo 2',
              fontSize: 30,
              lineHeight: 1.4,
              marginTop: 26,
            }}
          >
            {clamp(subtitle, 140)}
          </div>
        ) : null}
      </div>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
          <Pill color={NEON_PINK} text={kind === 'blog' ? 'BLOG' : 'PROJECT'} />
          {meta ? <Pill color={COSMIC_PURPLE} text={clamp(meta, 40)} /> : null}
        </div>
        <div style={{ alignItems: 'center', display: 'flex', gap: 18 }}>
          {logoSrc ? <img alt="" height={40} src={logoSrc} width={130} /> : null}
          <div style={{ color: DIGITAL_CYAN, display: 'flex', fontFamily: 'Space Mono', fontSize: 24 }}>
            hyperbliss.tech
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Renders an OG card as a SilkCircuit terminal window — the same design
 * language as the site's terminal-first hero.
 */
export function OgCard(props: OgCardProps): ReactElement {
  const { kind } = props
  return (
    <div
      style={{
        backgroundColor: '#0a0a14',
        backgroundImage:
          'radial-gradient(circle at 12% 0%, rgba(162, 89, 255, 0.32) 0%, rgba(10, 10, 20, 0) 46%), ' +
          'radial-gradient(circle at 88% 100%, rgba(0, 255, 240, 0.18) 0%, rgba(10, 10, 20, 0) 42%), ' +
          'radial-gradient(circle at 78% 8%, rgba(255, 117, 216, 0.2) 0%, rgba(10, 10, 20, 0) 38%)',
        display: 'flex',
        height: '100%',
        padding: 44,
        width: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(13, 11, 26, 0.86)',
          border: '1.5px solid rgba(162, 89, 255, 0.55)',
          borderRadius: 22,
          boxShadow: '0 0 60px rgba(162, 89, 255, 0.35), 0 0 120px rgba(0, 255, 240, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <TitleBar label="guest@hyperbliss:~$" />
        {kind === 'site' ? <SiteBody {...props} /> : <ContentBody {...props} />}
      </div>
    </div>
  )
}
