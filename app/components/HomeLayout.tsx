// app/components/HomeLayout.tsx
"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import FeaturedProjectsSection from "./FeaturedProjectsSection";
import { useHeaderContext } from "./HeaderContext";
import HeroSection from "./HeroSection";
import LatestBlogPosts from "./LatestBlogPosts";

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

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const HeroWrapper = styled.div`
  width: 100%;
`;

const SidebarWrapper = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 300px;
    min-width: 300px;
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

  const renderContent = () => {
    if (isMobile) {
      return (
        <>
          <HeroWrapper>
            <HeroSection />
          </HeroWrapper>
          <SidebarWrapper>
            <LatestBlogPosts
              posts={latestPosts}
              isMobile={isMobile}
            />
          </SidebarWrapper>
          <FeaturedProjectsSection projects={projects} />
        </>
      );
    } else {
      return (
        <>
          <MainContent>
            <HeroWrapper>
              <HeroSection />
            </HeroWrapper>
            <FeaturedProjectsSection projects={projects} />
          </MainContent>
          <SidebarWrapper>
            <LatestBlogPosts
              posts={latestPosts}
              isMobile={isMobile}
            />
          </SidebarWrapper>
        </>
      );
    }
  };

  return (
    <MainContainer>
      <ContentWrapper>{renderContent()}</ContentWrapper>
    </MainContainer>
  );
};

export default HomeLayout;
