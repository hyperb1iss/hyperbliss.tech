// app/(transition)/blog/[slug]/page.tsx
import BlogPost from "../../../components/BlogPost";
import {
  getAllMarkdownSlugs,
  getMarkdownContent,
} from "../../../lib/markdown";

interface BlogFrontmatter extends Record<string, unknown> {
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  tags?: string[];
}

export async function generateStaticParams() {
  const slugs = await getAllMarkdownSlugs("src/posts");
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { frontmatter, content } = await getMarkdownContent<BlogFrontmatter>(
    "src/posts",
    slug
  );

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
