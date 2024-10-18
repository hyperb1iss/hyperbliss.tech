// app/components/HomeLayout.tsx
"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import FeaturedProjectsSection from "./FeaturedProjectsSection";
import HeroSection from "./HeroSection";
import LatestBlogPosts from "./LatestBlogPosts";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto; /* Center the content */
  width: 100%;
  padding: 0 16px; /* Use consistent padding */

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    max-width: 1200px; /* Set a max-width to prevent content from stretching */
  }

  @media (min-width: 1400px) {
    max-width: 1366px;
  }
`;

const MainContent = styled.main`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Allow flex item to shrink */
`;

const SidebarWrapper = styled.div`
  flex: 0 1 300px; /* Sidebar has an initial width of 300px but can shrink */
  margin-top: 2rem;
  min-width: 200px; /* Prevent sidebar from becoming too narrow */

  @media (min-width: 768px) {
    margin-top: 0;
    margin-left: 2rem; /* Space between main content and sidebar */
  }

  @media (max-width: 1024px) {
    flex-basis: 250px; /* Adjust sidebar width on smaller desktops */
  }

  @media (min-width: 1400px) {
    flex-basis: 350px; /* Increase sidebar width on larger screens */
  }
`;

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    date: string;
    tags: string[];
  };
}

interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
    tags: string[];
  };
}

interface HomeLayoutProps {
  latestPosts: BlogPost[];
  projects: Project[];
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ latestPosts, projects }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <ContentWrapper>
      {isMobile ? (
        <>
          <HeroSection />
          <SidebarWrapper>
            <LatestBlogPosts posts={latestPosts} isMobile={isMobile} />
          </SidebarWrapper>
          <FeaturedProjectsSection projects={projects} />
        </>
      ) : (
        <>
          <MainContent>
            <HeroSection />
            <FeaturedProjectsSection projects={projects} />
          </MainContent>
          <SidebarWrapper>
            <LatestBlogPosts posts={latestPosts} isMobile={isMobile} />
          </SidebarWrapper>
        </>
      )}
    </ContentWrapper>
  );
};

export default HomeLayout;
