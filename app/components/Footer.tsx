// app/components/Footer.tsx
'use client';
import styled from 'styled-components';
import { SOCIAL_LINKS } from '../lib/socials';

const FooterContainer = styled.footer`
  background-color: rgba(0, 0, 0, 0.95);
  padding: 2rem;
  text-align: center;
  color: var(--color-text);

  .socials {
    margin-bottom: 1rem;

    a {
      margin: 0 1rem;
      color: var(--color-text);
      font-size: 2.4rem;
      transition: color 0.2s ease-in-out;

      &:hover {
        color: var(--color-accent);
        text-shadow: 0 0 10px var(--color-accent);
      }
    }
  }

  p {
    font-size: 1.4rem;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <div className="socials">
        {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon />
          </a>
        ))}
      </div>
      <p>&copy; {new Date().getFullYear()} Hyperbliss</p>
    </FooterContainer>
  );
};

export default Footer;
