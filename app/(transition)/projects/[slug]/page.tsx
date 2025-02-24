// app/(transition)/projects/[slug]/page.tsx
import { ResolvingMetadata } from "next";
import ProjectDetail from "../../../components/ProjectDetail";
import {
  type ProjectFrontmatter,
  generateProjectMetadata,
} from "../../../lib/generateMetadata";
import { getAllMarkdownSlugs, getMarkdownContent } from "../../../lib/markdown";

export async function generateStaticParams() {
  const slugs = await getAllMarkdownSlugs("src/projects");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const { frontmatter } = await getMarkdownContent<ProjectFrontmatter>(
    "src/projects",
    slug
  );
  return generateProjectMetadata(frontmatter, slug, parent);
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
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
