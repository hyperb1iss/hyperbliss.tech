// app/components/HomeLayout.tsx
"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import FeaturedProjectsSection from "./FeaturedProjectsSection";
import Header from "./Header";
import { useHeaderContext } from "./HeaderContext";
import HeroSection from "./HeroSection";
import LatestBlogPosts from "./LatestBlogPosts";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000; // Ensure the header is always on top
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100vh - 100px); // Adjust this value based on your header height

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 2rem; // Add padding to align with sidebar
`;

const HeroWrapper = styled.div`
  width: 100%;
`;

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    date: string;
    author: string;
    tags: string[];
  };
}

interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
  };
}

interface HomeLayoutProps {
  latestPosts: BlogPost[];
  projects: Project[];
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ latestPosts, projects }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isExpanded } = useHeaderContext();

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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <MainContainer>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <ContentWrapper>
        <MainContent>
          <HeroWrapper>
            <HeroSection />
          </HeroWrapper>
          {isMobile && (
            <LatestBlogPosts
              posts={latestPosts}
              isCollapsed={false}
              onToggle={() => {}}
              isMobile={true}
              isHeaderExpanded={isExpanded}
            />
          )}
          <FeaturedProjectsSection projects={projects} />
        </MainContent>
        {!isMobile && (
          <LatestBlogPosts
            posts={latestPosts}
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            isMobile={false}
            isHeaderExpanded={isExpanded}
          />
        )}
      </ContentWrapper>
    </MainContainer>
  );
};

export default HomeLayout;
