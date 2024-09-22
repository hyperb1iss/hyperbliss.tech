// app/projects/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProjectsPageContent from "../components/ProjectsPageContent";

interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
  };
}

function getProjects(): Project[] {
  const projectsDirectory = path.join(process.cwd(), "src", "projects");
  const filenames = fs.readdirSync(projectsDirectory);

  const projects = filenames.map((filename) => {
    const filePath = path.join(projectsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data: frontmatter } = matter(fileContents);
    return {
      slug: filename.replace(".md", ""),
      frontmatter: frontmatter as Project["frontmatter"],
    };
  });

  return projects;
}

export default function Projects() {
  const projects = getProjects();

  return (
    <>
      <Header />
      <ProjectsPageContent projects={projects} />
      <Footer />
    </>
  );
}

export function generateMetadata() {
  return {
    title: "Hyperbliss | Projects",
    description: "Discover projects developed by Stefanie Jane, showcasing innovation and creativity in technology.",
  };
}