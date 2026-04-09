'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaLightbulb, FaSkull, FaWandMagicSparkles } from 'react-icons/fa6'
import { css } from '../../../styled-system/css'
import { REGEX_NIGHTMARES } from '../../lib/regex-nightmares/data'
import type { RegexNightmareEntry } from '../../lib/regex-nightmares/types'
import PageTitle from '../PageTitle'
import RegexDissector from './RegexDissector'
import RegexTester from './RegexTester'

const CATEGORY_CONFIG = {
  awesome: { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.15)', icon: FaWandMagicSparkles, label: 'Awesome' },
  clever: { color: '#f1fa8c', glow: 'rgba(241, 250, 140, 0.1)', icon: FaLightbulb, label: 'Clever' },
  cursed: { color: '#ff6363', glow: 'rgba(255, 99, 99, 0.12)', icon: FaSkull, label: 'Cursed' },
}

const DANGER_COLORS = ['#50fa7b', '#f1fa8c', '#ffb74d', '#ff6363', '#ff3333']

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const staticPageLayoutStyles = css`
  flex: 1;
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: var(--space-24) var(--space-12) var(--space-16);
  min-height: 100vh;
  position: relative;
  background: transparent;

  @media (max-width: 1200px) {
    padding: var(--space-20) var(--space-6) var(--space-12);
  }

  @media (max-width: 768px) {
    padding: var(--space-16) var(--space-4) var(--space-8);
  }
`

const progressBarContainerStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.3);
`

const layoutStyles = css`
  display: flex;
  gap: var(--space-8);
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

const sidebarTrackStyles = css`
  width: 220px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }
`

const sidebarStyles = css`
  position: -webkit-sticky;
  position: sticky;
  top: 120px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  background: rgba(8, 8, 16, 0.9);
  border: 1px solid rgba(0, 255, 240, 0.08);

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 255, 240, 0.15) transparent;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 240, 0.15);
    border-radius: 2px;
  }

  @media (max-width: 1024px) {
    position: relative;
    top: 0;
    max-height: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    padding: var(--space-2);
  }
`

const sidebarLabelStyles = css`
  font-family: var(--font-mono);
  font-size: 1rem;
  color: rgba(0, 255, 240, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: var(--space-2) var(--space-2);
  margin-bottom: var(--space-1);

  @media (max-width: 1024px) {
    display: none;
  }
`

const sidebarItemStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-2);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: none;
  background: transparent;
  text-align: left;
  width: 100%;

  &:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 1024px) {
    width: auto;
    padding: var(--space-1) var(--space-2);
    font-size: 1.3rem;
  }
`

const sidebarDividerStyles = css`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 117, 216, 0.3), transparent);
  margin: var(--space-2) var(--space-2);

  @media (max-width: 1024px) {
    width: 1px;
    height: auto;
    align-self: stretch;
    margin: 0 var(--space-1);
  }
`

const contentStyles = css`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
`

const introStyles = css`
  font-family: var(--font-body);
  font-size: var(--text-fluid-lg);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  max-width: 720px;
  margin: 0 auto var(--space-8);
  text-align: center;
`

const quoteStyles = css`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  color: rgba(255, 255, 255, 0.35);
  font-style: italic;
  text-align: center;
  max-width: 640px;
  margin: 0 auto var(--space-10);
  padding: var(--space-4) var(--space-6);
  border-left: 2px solid rgba(0, 255, 240, 0.15);
  border-right: 2px solid rgba(0, 255, 240, 0.15);
`

const entryStyles = css`
  scroll-margin-top: 120px;
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(255, 255, 255, 0.01);
  transition: border-color 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 768px) {
    padding: var(--space-4);
  }
`

const entryHeaderStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
`

const entryNumberStyles = css`
  font-family: var(--font-mono);
  font-size: 3.5rem;
  font-weight: var(--font-black);
  line-height: 1;
  min-width: 50px;
  opacity: 0.08;
`

const entryEmojiStyles = css`
  font-size: 2.8rem;
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));
`

const entryTitleStyles = css`
  font-family: var(--font-heading);
  font-size: var(--text-fluid-2xl);
  font-weight: var(--font-bold);
  background: linear-gradient(90deg, #e0aaff, #00fff0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: var(--leading-tight);
`

const badgeRowStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
`

const categoryBadgeStyles = css`
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid;
`

const dangerBarStyles = css`
  display: flex;
  align-items: center;
  gap: 3px;
`

const dangerLabelStyles = css`
  font-family: var(--font-mono);
  font-size: 1rem;
  margin-left: var(--space-2);
`

const subtitleStyles = css`
  font-family: var(--font-body);
  font-size: var(--text-fluid-lg);
  font-style: italic;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  line-height: var(--leading-relaxed);
`

const regexDisplayStyles = css`
  font-family: var(--font-mono);
  font-size: 1.3rem;
  padding: var(--space-4) var(--space-5);
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 240, 0.1);
  border-radius: var(--radius-lg);
  overflow-x: auto;
  word-break: break-all;
  white-space: pre-wrap;
  color: #00fff0;
  margin-bottom: var(--space-6);
  line-height: 1.7;
  text-shadow: 0 0 10px rgba(0, 255, 240, 0.3);
  position: relative;

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 255, 240, 0.2) transparent;
`

const glitchStyles = css`
  @keyframes glitch {
    0%, 90%, 100% { transform: none; filter: none; }
    92% { transform: skewX(-2deg) translateX(-2px); filter: hue-rotate(90deg); }
    94% { transform: skewX(1deg) translateX(1px); filter: hue-rotate(-90deg); }
    96% { transform: none; filter: none; }
    98% { transform: skewX(-1deg); filter: hue-rotate(45deg) saturate(1.5); }
  }

  animation: glitch 8s ease-in-out infinite;
  animation-delay: calc(var(--glitch-offset, 0) * 1s);
`

const proseStyles = css`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-6);

  p { margin-bottom: var(--space-4); }
  p:last-child { margin-bottom: 0; }

  code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    padding: 1px 5px;
    background: rgba(0, 255, 240, 0.08);
    border: 1px solid rgba(0, 255, 240, 0.12);
    border-radius: 3px;
    color: #00fff0;
  }

  a {
    color: #ff75d8;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 117, 216, 0.3);
    transition: all 0.2s ease;

    &:hover {
      color: #00fff0;
      border-bottom-color: rgba(0, 255, 240, 0.5);
      text-shadow: 0 0 8px rgba(0, 255, 240, 0.3);
    }
  }
`

const bodyCountStyles = css`
  margin-top: var(--space-6);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  border-left: 3px solid;
  background: rgba(0, 0, 0, 0.3);
`

const bodyCountLabelStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-3);
`

const bodyCountProseStyles = css`
  font-family: var(--font-body);
  font-size: 1.4rem;
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  p { margin-bottom: var(--space-3); }
  p:last-child { margin-bottom: 0; }
`

const dividerContainerStyles = css`
  padding: var(--space-16) 0;
  position: relative;
  text-align: center;
`

const dividerLineStyles = css`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 99, 99, 0.4) 20%,
    rgba(255, 117, 216, 0.6) 50%,
    rgba(255, 99, 99, 0.4) 80%,
    transparent 100%
  );
`

const dividerContentStyles = css`
  position: relative;
  display: inline-block;
  padding: var(--space-6) var(--space-10);
  background: var(--color-bg, #0a0a14);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 99, 99, 0.2);
`

const dividerTitleStyles = css`
  font-family: var(--font-heading);
  font-size: var(--text-fluid-2xl);
  font-weight: var(--font-black);
  background: linear-gradient(135deg, #ff6363 0%, #ff75d8 40%, #c084fc 70%, #ff6363 100%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-2);
  animation: dividerShift 4s ease infinite;

  @keyframes dividerShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`

const dividerSubStyles = css`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  max-width: 500px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
`

const dividerEmojiStyles = css`
  font-size: 2rem;
  display: block;
  margin-bottom: var(--space-3);
  filter: drop-shadow(0 0 12px rgba(255, 99, 99, 0.5));
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderProse(text: string) {
  return text.split('\n\n').map((para, i) => {
    const processed = para
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\\([nrt])/g, (_, c) => (c === 'n' ? '\n' : c === 't' ? '\t' : '\r'))
    return <p dangerouslySetInnerHTML={{ __html: processed }} key={i} />
  })
}

function DangerBar({ level }: { level: number }) {
  const labels = ['Safe', 'Mild', 'Spicy', 'Dangerous', 'Catastrophic']
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <div className={dangerBarStyles} title={`Danger: ${level}/5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            animate={{
              boxShadow: i < level ? `0 0 ${4 + i * 2}px ${DANGER_COLORS[level - 1]}50` : 'none',
            }}
            key={i}
            style={{
              background: i < level ? DANGER_COLORS[level - 1] : 'rgba(255,255,255,0.08)',
              borderRadius: 2,
              height: 6,
              width: 16,
            }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          />
        ))}
      </div>
      <span className={dangerLabelStyles} style={{ color: `${DANGER_COLORS[level - 1]}99` }}>
        {labels[level - 1]}
      </span>
    </div>
  )
}

function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { damping: 30, stiffness: 100 })

  return (
    <div className={progressBarContainerStyles}>
      <motion.div
        style={{
          background: 'linear-gradient(90deg, #00fff0, #ff75d8, #c084fc)',
          height: '100%',
          scaleX,
          transformOrigin: '0%',
        }}
      />
    </div>
  )
}

function EntryCard({ entry }: { entry: RegexNightmareEntry }) {
  const config = CATEGORY_CONFIG[entry.category]
  const Icon = config.icon
  const isDanger5 = entry.dangerLevel === 5

  return (
    <motion.article
      className={`${entryStyles} ${isDanger5 ? glitchStyles : ''}`}
      id={`entry-${entry.id}`}
      initial={{ opacity: 0, y: 30 }}
      style={{
        ['--glitch-offset' as string]: entry.id % 5,
        borderColor: `${config.color}10`,
        boxShadow: `inset 0 0 60px ${config.glow}`,
      }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ margin: '-80px', once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className={entryHeaderStyles}>
        <span className={entryNumberStyles}>{String(entry.id).padStart(2, '0')}</span>
        <span className={entryEmojiStyles}>{entry.emoji}</span>
        <h2 className={entryTitleStyles}>{entry.title}</h2>
      </div>

      <div className={badgeRowStyles}>
        <span
          className={categoryBadgeStyles}
          style={{
            background: `${config.color}08`,
            borderColor: `${config.color}40`,
            color: config.color,
          }}
        >
          <Icon /> {config.label}
        </span>
        <DangerBar level={entry.dangerLevel} />
      </div>

      <p className={subtitleStyles}>{entry.subtitle}</p>

      <div className={regexDisplayStyles}>{entry.regex}</div>

      <RegexDissector regex={entry.regex} segments={entry.segments} />

      <div className={proseStyles}>{renderProse(entry.explanation)}</div>

      <RegexTester
        flags={entry.flags}
        jsCompatible={entry.jsCompatible}
        jsRegex={entry.jsRegex}
        jsValidator={entry.jsValidator}
        regex={entry.regex}
        testCases={entry.testCases}
      />

      {entry.bodyCount && (
        <motion.div
          className={bodyCountStyles}
          initial={{ opacity: 0 }}
          style={{
            borderColor: entry.bodyCount.emoji === '🪦' ? '#ff6363' : '#c084fc',
          }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <div
            className={bodyCountLabelStyles}
            style={{
              color: entry.bodyCount.emoji === '🪦' ? '#ff6363' : '#c084fc',
            }}
          >
            <span>{entry.bodyCount.emoji}</span> {entry.bodyCount.label}
          </div>
          <div className={bodyCountProseStyles}>{renderProse(entry.bodyCount.content)}</div>
        </motion.div>
      )}
    </motion.article>
  )
}

export default function RegexNightmares() {
  const [mounted, setMounted] = useState(false)
  const [activeId, setActiveId] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = Number(entry.target.id.replace('entry-', ''))
            setActiveId(id)
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )

    const sections = document.querySelectorAll('[id^="entry-"]')
    for (const s of sections) observer.observe(s)
    return () => observer.disconnect()
  }, [mounted])

  const scrollToEntry = useCallback((id: number) => {
    document.getElementById(`entry-${id}`)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const mainEntries = useMemo(() => REGEX_NIGHTMARES.filter((e) => e.section === 'main'), [])
  const appendixEntries = useMemo(() => REGEX_NIGHTMARES.filter((e) => e.section === 'appendix'), [])

  if (!mounted) {
    return (
      <main className={staticPageLayoutStyles}>
        <PageTitle>Regex Nightmares</PageTitle>
      </main>
    )
  }

  return (
    <>
      <ProgressBar />
      <main className={staticPageLayoutStyles}>
        <PageTitle>Regex Nightmares</PageTitle>
        <p className={introStyles}>
          21 regular expressions dissected down to the molecular level. Step through each one piece by piece, test them
          live, and read the stories of the production outages they caused.
        </p>
        <blockquote className={quoteStyles}>
          "Some people, when confronted with a problem, think 'I know, I'll use regular expressions.' Now they have two
          problems."
          <br />— Jamie Zawinski, 1997
        </blockquote>

        <div className={layoutStyles}>
          <div className={sidebarTrackStyles}>
            <nav className={sidebarStyles}>
              <div className={sidebarLabelStyles}>Entries</div>
              {mainEntries.map((e) => (
                <button
                  className={sidebarItemStyles}
                  key={e.id}
                  onClick={() => scrollToEntry(e.id)}
                  style={
                    activeId === e.id
                      ? {
                          background: 'rgba(0, 255, 240, 0.08)',
                          color: '#00fff0',
                          textShadow: '0 0 10px rgba(0, 255, 240, 0.4)',
                        }
                      : undefined
                  }
                  type="button"
                >
                  <span>{e.emoji}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</span>
                </button>
              ))}
              <div className={sidebarDividerStyles} />
              <div className={sidebarLabelStyles}>Cursed Appendix</div>
              {appendixEntries.map((e) => (
                <button
                  className={sidebarItemStyles}
                  key={e.id}
                  onClick={() => scrollToEntry(e.id)}
                  style={
                    activeId === e.id
                      ? {
                          background: 'rgba(255, 117, 216, 0.08)',
                          color: '#ff75d8',
                          textShadow: '0 0 10px rgba(255, 117, 216, 0.4)',
                        }
                      : undefined
                  }
                  type="button"
                >
                  <span>{e.emoji}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className={contentStyles} ref={contentRef}>
            {mainEntries.map((entry) => (
              <EntryCard entry={entry} key={entry.id} />
            ))}

            <motion.div
              className={dividerContainerStyles}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1 }}
            >
              <div className={dividerLineStyles} />
              <div className={dividerContentStyles}>
                <span className={dividerEmojiStyles}>🧪</span>
                <div className={dividerTitleStyles}>The Cursed Appendix</div>
                <div className={dividerSubStyles}>
                  The first twelve are functional horrors. Things people ship in production. The following nine push
                  regex engines into territories their creators never intended.
                </div>
              </div>
            </motion.div>

            {appendixEntries.map((entry) => (
              <EntryCard entry={entry} key={entry.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
