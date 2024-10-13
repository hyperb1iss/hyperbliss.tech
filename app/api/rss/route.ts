// app/api/rss/route.ts
import {
    getAllMarkdownSlugs,
    getMarkdownContent,
    MarkdownFile
} from "@/lib/markdown";
import { Feed } from "feed";
import { NextResponse } from "next/server";

export async function GET() {
  const feed = new Feed({
    title: "Hyperbliss Blog",
    description:
      "Stefanie Jane's personal blog about tech, development, and more.",
    id: "https://hyperbliss.tech/",
    link: "https://hyperbliss.tech/",
    language: "en",
    image: "https://hyperbliss.tech/images/logo.png",
    favicon: "https://hyperbliss.tech/favicon.ico",
    copyright: `All rights reserved ${new Date().getFullYear()}, Stefanie Jane`,
    author: {
      name: "Stefanie Jane",
      email: "stefanie@hyperbliss.tech",
      link: "https://hyperbliss.tech/about",
    },
  });

  const slugs = await getAllMarkdownSlugs("src/posts");
  const posts: MarkdownFile[] = await Promise.all(
    slugs.map(async (slug) => getMarkdownContent("src/posts", slug))
  );

  // Sort posts by date
  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  posts.forEach((post) => {
    feed.addItem({
      title: post.frontmatter.title,
      id: `https://hyperbliss.tech/blog/${post.slug}`,
      link: `https://hyperbliss.tech/blog/${post.slug}`,
      description: post.frontmatter.excerpt,
      content: post.content,
      author: [
        {
          name: "Stefanie Jane",
          email: "stefanie@hyperbliss.tech",
          link: "https://hyperbliss.tech/about",
        },
      ],
      date: new Date(post.frontmatter.date),
    });
  });

  return new NextResponse(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
