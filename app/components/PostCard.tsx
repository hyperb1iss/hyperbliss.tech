// app/components/PostCard.tsx
import React from "react";
import Card from "./Card";

interface PostCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  tags?: string[];
  index: number;
}

export const PostCard: React.FC<PostCardProps> = ({
  slug,
  title,
  date,
  excerpt,
  author,
  tags,
  index,
}) => {
  return (
    <Card
      title={title}
      description={excerpt}
      link={`/blog/${slug}`}
      color="255, 0, 255"
      linkColor="0, 255, 255"
      tags={tags}
      meta={`${new Date(date).toLocaleDateString()} • ${author}`}
      linkText="Read More"
      index={index}
    />
  );
};
