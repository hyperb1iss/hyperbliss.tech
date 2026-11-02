// app/components/Footer.tsx
// The company footer: brand, legal name and home on the left, product and
// company columns beside it, then the copyright line with the accounts that
// speak for Hyperbliss as an icon row.
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaRss } from 'react-icons/fa6'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import { FOOTER_COLUMNS } from '../lib/navigation'
import { COMPANY_LINKS } from '../lib/socials'

const LEGAL_NAME = 'Hyperbliss Technologies LLC'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Panda CSS Styles
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
  padding: var(--space-10) var(--space-6) var(--space-6);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(244, 240, 255, 0.1);
  }
`

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Top = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr));
  gap: var(--space-8) var(--space-6);
  padding-bottom: var(--space-8);

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    & > :first-child {
      grid-column: 1 / -1;
    }
  }
`

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`

const brandLogoStyles = css`
  display: block;
  height: 36px;
  width: auto;
  align-self: flex-start;
`

const BrandLine = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 300;
  line-height: 1.5;
  color: #b9b0cc;
  max-width: 32rem;
`

const Column = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & h2 {
    font-family: var(--font-mono);
    font-stretch: 100%;
    font-weight: 500;
    font-size: 1.2rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-shadow: none;
    color: #b9b0cc;
    margin: 0 0 0.4rem;
  }

  & a {
    font-size: 1.5rem;
    color: #f4f0ff;
    text-decoration: none;
    width: fit-content;
    transition: color var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--silk-circuit-cyan);
  }
`

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-top: var(--space-5);
  border-top: 1px solid rgba(148, 163, 184, 0.1);

  @media (max-width: 760px) {
    flex-direction: column-reverse;
  }
`

const Copyright = styled.p`
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1.2rem;
  letter-spacing: 0.06em;
  color: var(--silk-steel-400);
`

const SocialSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`

// Kept literal on both: Panda extracts styles statically, so interpolation would drop them.
const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 1.5rem;
  transition: all var(--duration-normal) var(--ease-silk);

  &:hover {
    color: var(--text-primary);
    border-color: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 240, 0.2);
  }
`

const RSSLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 1.5rem;
  transition: all var(--duration-normal) var(--ease-silk);

  &:hover {
    color: var(--text-primary);
    border-color: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 240, 0.2);
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <FooterContainer>
      <FooterInner>
        <Top>
          <BrandSection>
            <Image alt="hyperbliss" className={brandLogoStyles} height={70} src="/images/logo.png" width={350} />
            <BrandLine>Software that puts you in control of your own technology. Made in Seattle.</BrandLine>
          </BrandSection>

          {FOOTER_COLUMNS.map((column) => (
            <Column aria-label={column.title} key={column.title}>
              <h2>{column.title}</h2>
              {column.links.map(({ href, label }) => (
                <Link href={href} key={href}>
                  {label}
                </Link>
              ))}
            </Column>
          ))}
        </Top>

        <Bottom>
          <Copyright>
            &copy; {currentYear} {LEGAL_NAME}
          </Copyright>
          <SocialSection>
            {COMPANY_LINKS.map(({ href, label, icon: Icon }) => (
              <SocialLink
                aria-label={label}
                href={href}
                key={label}
                rel="noopener noreferrer"
                style={label === 'Sponsor' ? { color: '#ff75d8' } : undefined}
                target="_blank"
              >
                <Icon />
              </SocialLink>
            ))}
            <RSSLink aria-label="RSS Feed" href="/api/rss">
              <FaRss />
            </RSSLink>
          </SocialSection>
        </Bottom>
      </FooterInner>
    </FooterContainer>
  )
}

export default Footer
