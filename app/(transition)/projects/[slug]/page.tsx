// app/(transition)/projects/[slug]/page.tsx
import ProjectDetail from "../../../components/ProjectDetail";
import {
  getAllMarkdownSlugs,
  getMarkdownContent,
} from "../../../lib/markdown";

interface ProjectFrontmatter extends Record<string, unknown> {
  title: string;
  description: string;
  github: string;
  author?: string;
  tags?: string[];
}

export async function generateStaticParams() {
  const slugs = await getAllMarkdownSlugs("src/projects");
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { frontmatter, content } = await getMarkdownContent<ProjectFrontmatter>(
    "src/projects",
    slug
  );

  return (
    <ProjectDetail
      title={frontmatter.title}
      github={frontmatter.github}
      content={content}
      author={frontmatter.author}
      tags={frontmatter.tags}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { frontmatter } = await getMarkdownContent<ProjectFrontmatter>(
    "src/projects",
    slug
  );
  return {
    title: `Hyperbliss | ${frontmatter.title}`,
    description: frontmatter.description,
  };
}
