// app/(transition)/projects/page.tsx
import ProjectsPageContent from "../../components/ProjectsPageContent";
import { getAllMarkdownSlugs, getMarkdownContent } from "../../lib/markdown";

interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
  };
}

export default async function Projects() {
  const slugs = await getAllMarkdownSlugs("src/projects");
  const projects = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent("src/projects", slug);
      return {
        slug,
        frontmatter: frontmatter as Project["frontmatter"],
      };
    })
  );

  return <ProjectsPageContent projects={projects} />;
}

export const metadata = {
  title: "Hyperbliss | Projects",
  description:
    "Discover projects developed by Stefanie Jane, showcasing innovation and creativity in technology.",
};
