'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import type { LabSummary } from '../lib/content'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

const gridStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: var(--space-10);
  padding: var(--space-12) 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
`

const cardStyles = css`
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.08) 0%,
    rgba(30, 41, 59, 0.5) 40%,
    rgba(0, 255, 240, 0.05) 100%
  );
  backdrop-filter: blur(20px) saturate(1.2);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all var(--duration-normal) var(--ease-silk);
  cursor: pointer;
  box-shadow:
    0 0 25px rgba(139, 92, 246, 0.2),
    0 0 40px rgba(0, 255, 240, 0.1),
    inset 0 0 20px rgba(224, 170, 255, 0.05);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    padding: 2px;
    background: linear-gradient(135deg, #8b5cf6, #00fff0, #e0aaff);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.4;
    transition: opacity var(--duration-normal) var(--ease-silk);
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    background: linear-gradient(
      135deg,
      rgba(255, 117, 216, 0.15) 0%,
      rgba(217, 70, 239, 0.12) 25%,
      rgba(30, 41, 59, 0.55) 50%,
      rgba(236, 72, 153, 0.1) 75%,
      rgba(255, 117, 216, 0.12) 100%
    );
    box-shadow:
      0 10px 40px rgba(255, 117, 216, 0.35),
      0 20px 60px rgba(217, 70, 239, 0.25),
      inset 0 0 30px rgba(236, 72, 153, 0.1);

    &::before { opacity: 0.7; }

    .card-title {
      background-position: 100% 50%;
      filter: drop-shadow(0 0 15px rgba(0, 255, 240, 0.6));
    }
  }
`

const emojiStyles = css`
  font-size: 4rem;
  margin-bottom: var(--space-4);
  filter: drop-shadow(0 0 12px rgba(0, 255, 240, 0.4));
`

const titleStyles = css`
  font-family: var(--font-heading);
  font-size: var(--text-fluid-xl);
  font-weight: var(--font-bold);
  background: linear-gradient(90deg, #e0aaff 0%, #00fff0 50%, #e0aaff 100%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--space-3);
  line-height: var(--leading-tight);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  filter: drop-shadow(0 0 10px rgba(224, 170, 255, 0.4));
  transition: all var(--duration-normal) var(--ease-silk);
`

const descStyles = css`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  line-height: var(--leading-relaxed);
  flex-grow: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`

const tagsStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
`

const tagStyles = css`
  background: linear-gradient(135deg, rgba(255, 117, 216, 0.15), rgba(217, 70, 239, 0.1));
  color: #ff75d8;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 1.2rem;
  font-weight: var(--font-medium);
  border: 1px solid rgba(255, 117, 216, 0.3);
  text-shadow: 0 0 8px rgba(255, 117, 216, 0.5);
`

const footerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: var(--space-4);
`

const buttonStyles = css`
  font-family: var(--font-body);
  font-size: 1.5rem;
  font-weight: var(--font-semibold);
  color: #1e1b2e;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: linear-gradient(135deg, #ff75d8, #ec4899);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 117, 216, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all var(--duration-normal) var(--ease-silk);
`

const subtitleStyles = css`
  font-family: var(--font-body);
  font-size: var(--text-fluid-lg);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--space-4);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: var(--leading-relaxed);
`

interface LabListProps {
  experiments: LabSummary[]
}

export default function LabList({ experiments }: LabListProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <PageLayout>
        <PageTitle>The Lab</PageTitle>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageTitle>The Lab</PageTitle>
      <p className={subtitleStyles}>Interactive experiments, deep dives, and weird beautiful things.</p>
      <motion.div
        animate="visible"
        className={gridStyles}
        initial="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delayChildren: 0.2, staggerChildren: 0.15 },
          },
        }}
      >
        {experiments.map((exp, index) => (
          <StyledLink href={`/lab/${exp.slug}`} key={exp.slug}>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className={cardStyles}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>
                <div className={emojiStyles}>{exp.emoji}</div>
                <h3 className={`${titleStyles} card-title`}>{exp.displayTitle}</h3>
                <p className={descStyles}>{exp.excerpt}</p>
                {exp.tags && (
                  <div className={tagsStyles}>
                    {exp.tags.filter(Boolean).map((tag) => (
                      <span className={tagStyles} key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className={footerStyles}>
                <div className={buttonStyles}>
                  Explore <FaArrowRight />
                </div>
              </div>
            </motion.div>
          </StyledLink>
        ))}
      </motion.div>
    </PageLayout>
  )
}
