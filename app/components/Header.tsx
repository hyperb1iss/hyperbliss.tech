'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';

/**
 * Nav styles the navigation bar.
 */
const Nav = styled.nav`
  background-color: #0e0b16;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #e7dfdd;
  }

  ul {
    list-style: none;
    display: flex;
    margin: 0;
  }

  li {
    margin-left: 1.5rem;
  }

  a {
    font-size: 1rem;
    color: #e7dfdd;
    text-decoration: none;
    position: relative;
    padding: 0.5rem;
  }

  a.active {
    color: #a239ca;
  }
`;

/**
 * Header component contains the navigation bar.
 */
const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <Nav>
      <Link href="/" className="logo">
        Hyperbliss
      </Link>
      <ul>
        <li>
          <Link 
            href="/about" 
            className={pathname === '/about' ? 'active' : ''}
          >
            About
          </Link>
        </li>
        <li>
          <Link 
            href="/blog"
            className={pathname.startsWith('/blog') ? 'active' : ''}
          >
            Blog
          </Link>
        </li>
        <li>
          <Link 
            href="/projects"
            className={pathname === '/projects' ? 'active' : ''}
          >
            Projects
          </Link>
        </li>
      </ul>
    </Nav>
  );
};

export default Header;