// app/(transition)/blog/[slug]/page.tsx
import BlogPost from "../../../components/BlogPost";
import { getAllMarkdownSlugs, getMarkdownContent } from "../../../lib/markdown";

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
  const { frontmatter, content } = await getMarkdownContent("src/posts", slug);

  return (
    <BlogPost
      title={frontmatter.title}
      date={frontmatter.date}
      content={content}
    />
  );
}
