// app/(transition)/projects/[slug]/page.tsx
import fs from "fs"; 
import path from "path";
import matter from "gray-matter";
import ProjectDetail from "../../../components/ProjectDetail";
import MainContent from "../../../components/MainContent";

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join("src", "projects"));
  return files.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}

function getProjectContent(slug: string) {
  const folder = path.join("src", "projects");
  const file = `${folder}/${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { data: frontmatter, content } = getProjectContent(slug);

  return (
    <MainContent>
      <ProjectDetail
        title={frontmatter.title}
        github={frontmatter.github}
        content={content}
      />
    </MainContent>
  );
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { data: frontmatter } = getProjectContent(slug);
  return {
    title: `Hyperbliss | ${frontmatter.title}`,
    description: frontmatter.description,
  };
}
