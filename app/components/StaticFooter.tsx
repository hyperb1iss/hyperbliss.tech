import Link from 'next/link'
import { FaRss } from 'react-icons/fa6'
import { SOCIAL_LINKS } from '../lib/socials'

/**
 * StaticFooter component
 * A server component version of Footer that can be rendered without client-side JavaScript
 * Improved performance by removing client-side animations that are not critical
 * @returns {JSX.Element} Rendered footer
 */
export default function StaticFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-container">
      <div className="socials">
        {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
          <a aria-label={label} href={href} key={label} rel="noopener noreferrer" target="_blank">
            <Icon />
          </a>
        ))}
        <Link aria-label="RSS Feed" className="rss-link" href="/api/rss">
          <FaRss />
        </Link>
      </div>
      <p className="footer-text">
        &copy; {currentYear} <span className="sparkle-name">Stefanie Jane</span> 🌠
      </p>

      <style jsx={true}>{`
        .footer-container {
          background-color: rgba(0, 0, 0, 0.95);
          padding-top: 2rem;
          text-align: center;
          color: var(--color-text);
          position: relative;
          z-index: 1100;
        }

        .socials {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1rem;
        }

        .socials a,
        .rss-link {
          color: var(--color-text);
          font-size: 3rem;
          transition: color 0.3s ease-in-out;
        }

        .socials a:hover,
        .rss-link:hover {
          color: var(--color-accent);
        }

        .footer-text {
          font-size: 1.6rem;
          color: var(--color-accent);
          margin: 0;
          padding-bottom: 1rem;
          text-shadow: 0 0 3px var(--color-accent);
          letter-spacing: 1px;
        }

        .footer-text::before,
        .footer-text::after {
          content: "[ ";
          color: var(--color-secondary);
        }

        .footer-text::after {
          content: " ]";
        }

        .sparkle-name {
          font-weight: bold;
          background: linear-gradient(
            45deg,
            var(--color-primary) 0%,
            var(--color-secondary) 50%,
            var(--color-accent) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
        }
      `}</style>
    </footer>
  )
}
