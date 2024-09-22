import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Project } from '../types';

async function getProjects(): Promise<Project[]> {
  const projectsDirectory = path.join(process.cwd(), 'app', 'projects');
  const filenames = fs.readdirSync(projectsDirectory);

  const projects = filenames.map((filename) => {
    const filePath = path.join(projectsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContents);
    return {
      slug: filename.replace('.md', ''),
      frontmatter: frontmatter as Project['frontmatter'],
    };
  });

  return projects;
}

export default async function Projects() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main>
        <h1>Projects</h1>
        {projects.map(({ slug, frontmatter }) => (
          <article key={slug}>
            <h2>{frontmatter.title}</h2>
            <p>{frontmatter.description}</p>
            <a
              href={frontmatter.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </article>
        ))}
      </main>
      <Footer />
    </>
  );
}

export function generateMetadata() {
  return {
    title: 'Hyperbliss | Projects',
    description: 'Discover the projects developed by Stefanie Kondik, showcasing innovation and creativity in technology.',
  };
}