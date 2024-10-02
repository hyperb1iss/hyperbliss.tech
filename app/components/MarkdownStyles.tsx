// app/components/MarkdownStyles.tsx
import styled from "styled-components";

// Headings
export const StyledH1 = styled.h1`
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 0 0 10px var(--color-primary);
  text-align: left; /* Main titles handled separately */

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const StyledH2 = styled.h2`
  font-size: 2rem;
  color: var(--color-secondary);
  margin-top: 2rem; /* Added top padding */
  margin-bottom: 0.75rem;
  text-shadow: 0 0 8px var(--color-secondary);
  text-align: left; /* Left-aligned */

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const StyledH3 = styled.h3`
  font-size: 1.75rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  text-shadow: 0 0 6px var(--color-primary);
  text-align: left; /* Left-aligned */

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Paragraph
export const StyledParagraph = styled.p`
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--color-text);
  margin-bottom: 1rem;
`;

// Links
export const StyledLink = styled.a`
  color: #36f9f6;
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover {
    color: #ff00ff;
  }
`;

// Lists
export const StyledUl = styled.ul`
  list-style-type: disc;
  padding-left: 2rem; /* Increased left padding */
  margin-bottom: 1rem;
`;

export const StyledOl = styled.ol`
  list-style-type: decimal;
  padding-left: 2rem; /* Increased left padding */
  margin-bottom: 1rem;
`;

export const StyledLi = styled.li`
  margin-bottom: 0.5rem;
`;

// Blockquote
export const StyledBlockquote = styled.blockquote`
  border-left: 4px solid var(--color-primary);
  padding-left: 1rem;
  color: #f0f0f0;
  background: #1a1a2e;
  margin: 1.5rem 0; /* Increased top and bottom margin */
  font-style: italic;
`;

// Horizontal Rule
export const StyledHr = styled.hr`
  border: none;
  border-top: 1px solid #36f9f6;
  margin: 2rem 0;
`;

// Inline Code
export const StyledInlineCode = styled.code`
  background: #1a1a2e;
  color: #36f9f6;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
`;

// Image
export const StyledImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
`;
