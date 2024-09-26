// app/lib/markdown.ts
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";

// Define the interface for markdown files with a flexible frontmatter type
export interface MarkdownFile {
  slug: string;
  frontmatter: Record<string, any>; // Using a flexible dictionary for frontmatter
  content: string;
}

/**
 * Reads the markdown content from the specified directory and filename.
 * This version uses a flexible frontmatter type to accommodate various structures.
 */
export async function getMarkdownContent(
  directory: string,
  slug: string
): Promise<MarkdownFile> {
  const filePath = path.join(process.cwd(), directory, `${slug}.md`);
  const fileContents = await fs.readFile(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContents);

  return {
    slug,
    frontmatter,
    content,
  };
}

/**
 * Retrieves all markdown files in a directory and generates their slugs.
 */
export async function getAllMarkdownSlugs(
  directory: string
): Promise<string[]> {
  const files = await fs.readdir(path.join(process.cwd(), directory));
  return files.map((filename) => filename.replace(".md", ""));
}
