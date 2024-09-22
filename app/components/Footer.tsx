// app/components/Footer.tsx

'use client';
import styled from 'styled-components';
import {
  FaMastodon,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';

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
        <a
          href="https://hachyderm.io/@bliss"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Mastodon"
        >
          <FaMastodon />
        </a>
        <a
          href="https://instagram.com/hyperb1iss"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a
          href="https://linkedin.com/in/hyperb1iss"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/hyperb1iss"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
      </div>
      <p>&copy; {new Date().getFullYear()} Hyperbliss</p>
    </FooterContainer>
  );
};

export default Footer;
