// app/(transition)/blog/[slug]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import BlogPost from "../../../components/BlogPost";
import MainContent from "../../../components/MainContent";

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
    <MainContent>
      <BlogPost
        title={frontmatter.title}
        date={frontmatter.date}
        content={content}
      />
    </MainContent>
  );
}
