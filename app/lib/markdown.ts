// app/lib/markdown.ts
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";

/**
 * Interface for markdown files with a flexible frontmatter type
 */
export interface MarkdownFile<T = Record<string, unknown>> {
  slug: string;
  frontmatter: T;
  content: string;
}

/**
 * Reads the markdown content from the specified directory and filename.
 * @param directory - The directory containing the markdown files.
 * @param slug - The slug (filename without extension) of the markdown file.
 * @returns A Promise resolving to a MarkdownFile object.
 */
export async function getMarkdownContent<T = Record<string, unknown>>(
  directory: string,
  slug: string
): Promise<MarkdownFile<T>> {
  const filePath = path.join(process.cwd(), directory, `${slug}.md`);
  const fileContents = await fs.readFile(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContents);

  return {
    slug,
    frontmatter: frontmatter as T,
    content,
  };
}

/**
 * Retrieves all markdown files in a directory and generates their slugs.
 * @param directory - The directory containing the markdown files.
 * @returns A Promise resolving to an array of slugs.
 */
export async function getAllMarkdownSlugs(
  directory: string
): Promise<string[]> {
  const files = await fs.readdir(path.join(process.cwd(), directory));
  return files.map((filename) => filename.replace(".md", ""));
}
