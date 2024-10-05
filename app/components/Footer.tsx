// app/components/Footer.tsx
"use client";
import styled from "styled-components";
import { SOCIAL_LINKS } from "../lib/socials";

const FooterContainer = styled.footer`
  background-color: rgba(0, 0, 0, 0.95);
  padding-top: 2rem;
  text-align: center;
  color: var(--color-text);
  position: relative; // Ensure the footer is positioned relative to the document flow
  z-index: 1100; // Set a higher z-index than the sidebar

  .socials {
    a {
      margin: 0 1rem;
      color: var(--color-text);
      font-size: 3rem;
      transition: color 0.2s ease-in-out;

      &:hover {
        color: var(--color-accent);
        text-shadow: 0 0 10px var(--color-accent);
      }
    }
  }
`;

const FooterText = styled.p`
  font-size: 1.5rem;
`;

/**
 * Footer component
 * Renders the footer section of the website with social links and copyright information.
 * @returns {JSX.Element} Rendered footer
 */
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
      <FooterText>
        &copy; {new Date().getFullYear()} Stefanie Jane 🌠
      </FooterText>
    </FooterContainer>
  );
};

export default Footer;
