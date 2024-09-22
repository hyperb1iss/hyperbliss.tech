// app/blog/[slug]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join("src", "posts"));

  return files.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}

function getPostContent(slug: string) {
  const folder = path.join("src", "posts");
  const file = `${folder}/${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { data: frontmatter, content } = getPostContent(slug);

  return (
    <>
      <Header />
      <main>
        <article>
          <h1>{frontmatter.title}</h1>
          <p>{frontmatter.date}</p>
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </main>
      <Footer />
    </>
  );
}
