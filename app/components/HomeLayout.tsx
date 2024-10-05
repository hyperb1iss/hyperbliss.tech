// app/components/HomeLayout.tsx
"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import FeaturedProjects from "./FeaturedProjects";
import HeroSection from "./HeroSection";
import LatestBlogPostsSidebar from "./LatestBlogPostsSidebar";
import Header from "./Header"; // Make sure to create this component if it doesn't exist

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
    margin-right: ${props => props.$isSidebarCollapsed ? "40px" : "300px"};
  }
`;

const HeroWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeaturedProjectsWrapper = styled.div`
  width: 100vw;
  margin-left: calc(-50vw + 50%);
`;

interface HomeLayoutProps {
  latestPosts: any[]; // Replace 'any' with your actual post type
  projects: {
    slug: string;
    frontmatter: {
      title: string;
      description: string;
      github: string;
    };
  }[];
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ latestPosts, projects }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <MainContainer>
      <Header />
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
      <FeaturedProjectsWrapper>
        <FeaturedProjects projects={projects} />
      </FeaturedProjectsWrapper>
    </MainContainer>
  );
};

export default HomeLayout;