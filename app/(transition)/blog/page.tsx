// app/(transition)/blog/page.tsx
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import BlogList from "../../components/BlogList";

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join("src", "posts"));
  return files.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}

function getPostData(): Post[] {
  const files = fs.readdirSync(path.join("src", "posts"));
  const posts = files.map((filename) => {
    const slug = filename.replace(".md", "");
    const markdownWithMeta = fs.readFileSync(
      path.join("src", "posts", filename),
      "utf-8"
    );
    const { data: frontmatter } = matter(markdownWithMeta);
    return {
      slug,
      frontmatter: {
        title: frontmatter.title as string,
        date: frontmatter.datZe as string,
        excerpt: frontmatter.excerpt as string,
      },
    };
  });

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export default function Blog() {
  const posts = getPostData();

  return <BlogList posts={posts} />;
}
