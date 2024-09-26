// app/(transition)/projects/[slug]/page.tsx
import ProjectDetail from "../../../components/ProjectDetail";
import { getAllMarkdownSlugs, getMarkdownContent } from "../../../lib/markdown";

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
  const { frontmatter, content } = await getMarkdownContent(
    "src/projects",
    slug
  );

  return (
    <ProjectDetail
      title={frontmatter.title}
      github={frontmatter.github}
      content={content}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { frontmatter } = await getMarkdownContent("src/projects", slug);
  return {
    title: `Hyperbliss | ${frontmatter.title}`,
    description: frontmatter.description,
  };
}
