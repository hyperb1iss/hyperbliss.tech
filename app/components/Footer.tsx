'use client';
import styled from 'styled-components';
import {
  FaMastodon,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';

/**
 * FooterContainer styles the footer section.
 */
const FooterContainer = styled.footer`
  background-color: #0e0b16;
  padding: 2rem;
  text-align: center;
  color: #e7dfdd;

  .socials {
    margin-bottom: 1rem;
  }

  a {
    margin: 0 0.5rem;
    color: #e7dfdd;
    font-size: 1.5rem;
    transition: color 0.2s ease-in-out;
  }

  a:hover {
    color: #a239ca;
  }

  p {
    font-size: 0.9rem;
  }
`;

/**
 * Footer component contains social media links and footer text.
 */
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
