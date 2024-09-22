// src/pages/projects.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Header from './components/Header';
import Footer from './components/Footer';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { Project } from './types';

/**
 * ProjectsProps defines the props for the Projects component.
 */
interface ProjectsProps {
  projects: Project[];
}

/**
 * Projects component lists all projects.
 */
const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <>
      <Head>
        <title>Hyperbliss | Projects</title>
        <meta
          name="description"
          content="Discover the projects developed by Stefanie Kondik, showcasing innovation and creativity in technology."
        />
      </Head>
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
};

/**
 * getStaticProps fetches the list of projects at build time.
 */
export const getStaticProps: GetStaticProps = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'src', 'projects'));

  const projects = files.map((filename) => {
    const slug = filename.replace('.md', '');

    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), 'src', 'projects', filename),
      'utf-8'
    );

    const { data: frontmatter } = matter(markdownWithMeta);

    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      projects,
    },
  };
};

export default Projects;
