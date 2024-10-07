import { getAllMarkdownSlugs, getMarkdownContent } from "@/lib/markdown";
import HomeLayout from "@/components/HomeLayout";

export default async function Home() {
  const postSlugs = await getAllMarkdownSlugs("src/posts");
  const posts = await Promise.all(
    postSlugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent("src/posts", slug);
      return {
        slug,
        frontmatter: {
          title: frontmatter.title as string,
          date: frontmatter.date as string,
          excerpt: frontmatter.excerpt as string,
          author: frontmatter.author as string,
          tags: frontmatter.tags as string[] || [],
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

  // Take only the latest 5 posts for the sidebar
  const latestPosts = posts.slice(0, 5);

  // Fetch real project data
  const projectSlugs = await getAllMarkdownSlugs("src/projects");
  const projects = await Promise.all(
    projectSlugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent("src/projects", slug);
      return {
        slug,
        frontmatter: {
          title: frontmatter.title as string,
          description: frontmatter.description as string,
          github: frontmatter.github as string,
        },
      };
    })
  );

  return <HomeLayout latestPosts={latestPosts} projects={projects} />;
}