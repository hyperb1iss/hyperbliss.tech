// app/components/Footer.tsx
"use client";

import styled from "styled-components";
import { SOCIAL_LINKS } from "../lib/socials";
import { FaRss } from "react-icons/fa";
import Link from "next/link";

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
      transition: all 0.3s ease-in-out;
      position: relative;
      display: inline-block;

      &:hover {
        color: var(--color-accent);
      }

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        background: var(--color-accent);
        opacity: 0;
        border-radius: 50%;
        filter: blur(15px);
        transition: all 0.3s ease-in-out;
        transform: translate(-50%, -50%) scale(0.5);
      }

      &:hover::before {
        opacity: 0.3;
        animation: pulseGlow 2s infinite alternate;
      }
    }
  }

  @keyframes pulseGlow {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0.2;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0.4;
    }
  }
`;

const FooterText = styled.p`
  font-size: 1.6rem;
  color: var(--color-accent);
  margin: 0;
  padding-bottom: 1rem;
  text-shadow: 0 0 3px var(--color-accent);
  letter-spacing: 1px;
  &::before, &::after {
    content: "[ ";
    color: var(--color-secondary);
  }

  &::after {
    content: " ]";
  }
`;

const RSSLink = styled(Link)`
  margin: 0 1rem;
  color: var(--color-text);
  font-size: 3rem;
  transition: all 0.3s ease-in-out;
  position: relative;
  display: inline-block;

  &:hover {
    color: var(--color-accent);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: var(--color-accent);
    opacity: 0;
    border-radius: 50%;
    filter: blur(15px);
    transition: all 0.3s ease-in-out;
    transform: translate(-50%, -50%) scale(0.5);
  }

  &:hover::before {
    opacity: 0.3;
    animation: pulseGlow 2s infinite alternate;
  }
`;

/**
 * Footer component
 * Renders the footer section of the website with social links, RSS feed link, and copyright information.
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
        <RSSLink href="/api/rss" aria-label="RSS Feed">
          <FaRss />
        </RSSLink>
      </div>
      <FooterText>
        &copy; {new Date().getFullYear()} Stefanie Jane 🌠
      </FooterText>
    </FooterContainer>
  );
};

export default Footer;
