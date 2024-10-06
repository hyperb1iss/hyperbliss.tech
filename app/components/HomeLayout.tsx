// app/components/HomeLayout.tsx
"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import FeaturedProjectsSection from "./FeaturedProjectsSection";
import HeroSection from "./HeroSection";
import LatestBlogPostsSidebar from "./LatestBlogPostsSidebar";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const MainContent = styled.main<{ $isSidebarCollapsed: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-right 0.3s ease;

  @media (min-width: 768px) {
    margin-right: ${(props) => (props.$isSidebarCollapsed ? "40px" : "300px")};
  }
`;

const HeroWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
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
      <ContentWrapper>
        <MainContent $isSidebarCollapsed={isSidebarCollapsed}>
          <HeroWrapper>
            <HeroSection />
          </HeroWrapper>
          {isMobile && (
            <LatestBlogPostsSidebar
              posts={latestPosts}
              isCollapsed={false}
              onToggle={() => {}}
              isMobile={true}
            />
          )}
          <FeaturedProjectsSection projects={projects} />
        </MainContent>
        {!isMobile && (
          <LatestBlogPostsSidebar
            posts={latestPosts}
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            isMobile={false}
          />
        )}
      </ContentWrapper>
    </MainContainer>
  );
};

export default HomeLayout;
