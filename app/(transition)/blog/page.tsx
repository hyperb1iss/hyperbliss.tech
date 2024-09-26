// app/(transition)/blog/page.tsx
import BlogList from "../../components/BlogList";
import { getAllMarkdownSlugs, getMarkdownContent } from "../../lib/markdown";

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
  };
}

export default async function Blog() {
  const slugs = await getAllMarkdownSlugs("src/posts");
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent("src/posts", slug);
      return {
        slug,
        frontmatter: {
          title: frontmatter.title as string,
          date: frontmatter.date as string,
          excerpt: frontmatter.excerpt as string,
        },
      };
    })
  );

  // Sort posts by date
  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return <BlogList posts={posts} />;
}
