// src/types/index.ts

/**
 * Post represents a blog post.
 */
export interface Post {
    slug: string;
    frontmatter: {
      title: string;
      date: string;
      excerpt: string;
    };
  }
  
  /**
   * Project represents a project entry.
   */
  export interface Project {
    slug: string;
    frontmatter: {
      title: string;
      description: string;
      github: string;
    };
  }
  