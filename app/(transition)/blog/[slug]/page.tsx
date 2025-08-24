// app/(transition)/blog/[slug]/page.tsx
import { ResolvingMetadata } from "next";
import BlogPost from "../../../components/BlogPost";
import StructuredData from "../../../components/StructuredData";
import { type BlogFrontmatter, generateBlogMetadata } from "../../../lib/generateMetadata";
import { generateArticleSchema, generateBreadcrumbSchema } from "../../../lib/structuredData";
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

  const articleSchema = generateArticleSchema(
    frontmatter.title,
    frontmatter.excerpt,
    frontmatter.author || "Stefanie Jane",
    frontmatter.date,
    `https://hyperbliss.tech/blog/${slug}/`,
    frontmatter.tags
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://hyperbliss.tech/" },
    { name: "Blog", url: "https://hyperbliss.tech/blog/" },
    { name: frontmatter.title, url: `https://hyperbliss.tech/blog/${slug}/` },
  ]);

  return (
    <>
      <StructuredData data={[articleSchema, breadcrumbSchema]} />
      <BlogPost
        title={frontmatter.title}
        date={frontmatter.date}
        content={content}
        author={frontmatter.author}
        tags={frontmatter.tags}
      />
    </>
  );
}
