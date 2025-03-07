// app/(transition)/blog/[slug]/page.tsx
import { ResolvingMetadata } from "next";
import BlogPost from "../../../components/BlogPost";
import { type BlogFrontmatter, generateBlogMetadata } from "../../../lib/generateMetadata";
import { getAllMarkdownSlugs, getMarkdownContent } from "../../../lib/markdown";
import { PageProps } from "../../../types";

export async function generateStaticParams() {
  const slugs = await getAllMarkdownSlugs("src/posts");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as string;

  const { frontmatter } = await getMarkdownContent<BlogFrontmatter>("src/posts", slug);
  return generateBlogMetadata(frontmatter, slug, parent);
}

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as string;

  const { frontmatter, content } = await getMarkdownContent<BlogFrontmatter>("src/posts", slug);

  return (
    <BlogPost
      title={frontmatter.title}
      date={frontmatter.date}
      content={content}
      author={frontmatter.author}
      tags={frontmatter.tags}
    />
  );
}
