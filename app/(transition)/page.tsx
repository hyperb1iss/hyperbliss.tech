// app/(transition)/page.tsx
import { getAllMarkdownSlugs, getMarkdownContent } from "../lib/markdown";
import HeroSection from "../components/HeroSection";
import FeaturedProjects from "../components/FeaturedProjects";
import LatestBlogPosts from "../components/LatestBlogPosts";

interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
  };
}

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
  };
}

export default async function Home(): Promise<JSX.Element> {
  const projectSlugs = await getAllMarkdownSlugs("src/projects");
  const featuredProjects: Project[] = await Promise.all(
    projectSlugs.slice(0, 3).map(async (slug) => {
      const { frontmatter } = await getMarkdownContent("src/projects", slug);
      return {
        slug,
        frontmatter: {
          title: frontmatter.title as string,
          description: frontmatter.description as string,
        },
      };
    })
  );

  const postSlugs = await getAllMarkdownSlugs("src/posts");
  const latestPosts: BlogPost[] = await Promise.all(
    postSlugs.slice(0, 3).map(async (slug) => {
      const { frontmatter } = await getMarkdownContent("src/posts", slug);
      return {
        slug,
        frontmatter: {
          title: frontmatter.title as string,
          excerpt: frontmatter.excerpt as string,
        },
      };
    })
  );

  return (
    <>
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <LatestBlogPosts posts={latestPosts} />
    </>
  );
}
