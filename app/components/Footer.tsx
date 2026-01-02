// app/components/Footer.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaRss } from 'react-icons/fa6'
import { styled } from '../../styled-system/jsx'
import { SOCIAL_LINKS } from '../lib/socials'
import { SparklingName } from './SparklingName'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styled Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const FooterContainer = styled.footer`
  position: relative;
  z-index: 1100;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(10, 10, 20, 0.95) 20%,
    rgba(10, 10, 20, 0.98) 100%
  );
  padding: var(--space-8) var(--space-6);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--color-primary) 20%,
      var(--color-secondary) 50%,
      var(--color-accent) 80%,
      transparent 100%
    );
    opacity: 0.5;
  }
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);

  @media (max-width: 900px) {
    flex-direction: column;
    gap: var(--space-6);
  }
`

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);

  .star-icon {
    width: 36px;
    height: auto;
    animation: starGlow 3s ease-in-out infinite;
  }

  @keyframes starGlow {
    0%, 100% {
      filter: drop-shadow(0 0 8px rgba(0, 255, 240, 0.4));
    }
    50% {
      filter: drop-shadow(0 0 16px rgba(162, 89, 255, 0.6));
    }
  }

  @media (max-width: 900px) {
    order: 1;
  }
`

const BrandText = styled.div`
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 1.2rem + 0.4vw, 1.8rem);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.25em;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 50%,
    var(--color-accent) 100%
  );
  background-size: 200% 200%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 4s ease infinite;

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`

const SocialSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);

  @media (max-width: 900px) {
    order: 2;
  }
`

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 1.6rem;
  transition: all var(--duration-normal) var(--ease-silk);

  &:hover {
    color: var(--text-primary);
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(162, 89, 255, 0.2);
  }

  &:nth-child(2n):hover {
    border-color: var(--color-secondary);
    box-shadow: 0 4px 12px rgba(0, 255, 240, 0.2);
  }

  &:nth-child(3n):hover {
    border-color: var(--color-accent);
    box-shadow: 0 4px 12px rgba(255, 117, 216, 0.2);
  }
`

const RSSLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 1.6rem;
  transition: all var(--duration-normal) var(--ease-silk);

  &:hover {
    color: var(--text-primary);
    border-color: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 240, 0.2);
  }
`

const InfoSection = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 900px) {
    order: 3;
  }
`

const Copyright = styled.p`
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 1.2rem + 0.4vw, 1.8rem);
  font-weight: var(--font-medium);
  margin: 0;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
`

const CopyrightYear = styled.span`
  background: linear-gradient(
    90deg,
    var(--color-primary) 0%,
    var(--color-secondary) 50%,
    var(--color-accent) 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 4s ease infinite;

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Footer component (v3.0)
 * A sleek horizontal footer with brand, social links, and copyright info
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <FooterContainer>
      <FooterContent>
        <BrandSection>
          <Image alt="" aria-hidden="true" className="star-icon" height={36} src="/images/star-icon.png" width={36} />
          <BrandText>hyperbliss</BrandText>
        </BrandSection>

        <SocialSection>
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <SocialLink aria-label={label} href={href} key={label} rel="noopener noreferrer" target="_blank">
              <Icon />
            </SocialLink>
          ))}
          <RSSLink aria-label="RSS Feed" href="/api/rss">
            <FaRss />
          </RSSLink>
        </SocialSection>

        <InfoSection>
          <Copyright>
            <CopyrightYear>&copy; {currentYear}</CopyrightYear> <SparklingName name="Stefanie Jane" sparkleCount={4} />
          </Copyright>
        </InfoSection>
      </FooterContent>
    </FooterContainer>
  )
}

export default Footer
