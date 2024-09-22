// src/pages/blog/[slug].tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Post } from '../../types';

/**
 * PostProps defines the props for the PostPage component.
 */
interface PostProps {
  frontmatter: Post['frontmatter'];
  content: string;
}

/**
 * PostPage component renders an individual blog post.
 */
const PostPage: React.FC<PostProps> = ({ frontmatter, content }) => {
  return (
    <>
      <Head>
        <title>{frontmatter.title} | Hyperbliss Blog</title>
        <meta name="description" content={frontmatter.excerpt} />
      </Head>
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
};

/**
 * getStaticPaths generates the paths for all blog posts.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'src', 'posts'));

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

/**
 * getStaticProps fetches the data for a single blog post.
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'src', 'posts', slug + '.md'),
    'utf-8'
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);

  return {
    props: {
      frontmatter,
      content,
    },
  };
};

export default PostPage;
