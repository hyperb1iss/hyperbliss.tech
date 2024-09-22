// app/components/Header.tsx

"use client";

import Link from "next/link";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

const Nav = styled.nav`
  background-color: rgba(0, 0, 0, 0.9);
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-family: var(--font-heading);
  font-size: 3rem;
  color: var(--color-primary);
  text-shadow: 0 0 5px var(--color-primary);
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-accent);
    text-shadow: 0 0 10px var(--color-accent);
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)<{ active: boolean }>`
  font-family: var(--font-body);
  font-size: 2rem;
  font-weight: 500;
  color: ${(props) => (props.active ? "#00ffff" : "#f0f0f0")};
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
    content: "";
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

const MobileMenuIcon = styled.div`
  display: none;
  font-size: 2.4rem;
  color: var(--color-text);
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLinks = styled.ul<{ open: boolean }>`
  list-style: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: rgba(0, 0, 0, 0.95);
  width: 200px;
  flex-direction: column;
  display: ${(props) => (props.open ? "flex" : "none")};

  li {
    padding: 1rem;
    text-align: right;
  }
`;

const Header: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Nav>
      <NavContent>
        <Logo href="/">Hyperbliss</Logo>
        <NavLinks>
          {["About", "Blog", "Projects"].map((item) => (
            <NavItem key={item}>
              <NavLink
                href={`/${item.toLowerCase()}`}
                active={pathname === `/${item.toLowerCase()}`}
              >
                {item}
              </NavLink>
            </NavItem>
          ))}
        </NavLinks>
        <MobileMenuIcon onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </MobileMenuIcon>
      </NavContent>
      <MobileNavLinks open={menuOpen}>
        {["About", "Blog", "Projects"].map((item) => (
          <NavItem key={item}>
            <NavLink
              href={`/${item.toLowerCase()}`}
              active={pathname === `/${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </NavLink>
          </NavItem>
        ))}
      </MobileNavLinks>
    </Nav>
  );
};

export default Header;
