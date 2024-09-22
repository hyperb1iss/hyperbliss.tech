import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join("app", "blog", "posts"));

  return files.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}

function getPostData() {
  const files = fs.readdirSync(path.join("app", "blog", "posts"));

  const posts = files.map((filename) => {
    const slug = filename.replace(".md", "");
    const markdownWithMeta = fs.readFileSync(
      path.join("app", "blog", "posts", filename),
      "utf-8"
    );
    const { data: frontmatter } = matter(markdownWithMeta);

    return {
      slug,
      frontmatter,
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

  return (
    <>
      <Header />
      <main>
        <h1>Blog</h1>
        {posts.map(({ slug, frontmatter }) => (
          <article key={slug}>
            <h2>
              <Link href={`/blog/${slug}`}>{frontmatter.title}</Link>
            </h2>
            <p>{frontmatter.excerpt}</p>
            <p>{frontmatter.date}</p>
          </article>
        ))}
      </main>
      <Footer />
    </>
  );
}
