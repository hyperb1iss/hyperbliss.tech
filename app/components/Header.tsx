'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const Nav = styled.nav`
  background-color: rgba(10, 10, 20, 0.8);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 2px solid #ff00ff;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-family: var(--font-heading);
  font-size: 3.2rem;
  font-weight: 700;
  color: #ff00ff;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.7);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 2rem;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)<{ active: boolean }>`
  font-family: var(--font-body);
  font-size: 2rem;
  font-weight: 500;
  color: ${props => props.active ? '#00ffff' : '#f0f0f0'};
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #00ffff;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #00ffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
`;

const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <Nav>
      <NavContent>
        <Logo href="/">
          Hyperbliss
        </Logo>
        <NavLinks>
          {['About', 'Blog', 'Projects'].map((item) => (
            <NavItem key={item}>
              <NavLink href={`/${item.toLowerCase()}`} active={pathname === `/${item.toLowerCase()}`}>
                {item}
                {pathname === `/${item.toLowerCase()}` && (
                  <ActiveIndicator layoutId="activeIndicator" />
                )}
              </NavLink>
            </NavItem>
          ))}
        </NavLinks>
      </NavContent>
    </Nav>
  );
};

export default Header;