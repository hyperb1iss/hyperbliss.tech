// app/components/CyberpunkCodeBlock.tsx
import type { CSSProperties } from "react";
import React, { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import styled from "styled-components";

// Define the shape of the props
interface CyberpunkCodeBlockProps {
  code: string;
  language: string;
}

// Define a type for the cyberpunk theme
type CyberpunkTheme = {
  [key: string]: CSSProperties | { [key: string]: CSSProperties };
};

// Styled components for the copy button
const CopyButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  color: #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    width: 1.2em;
    height: 1.2em;
  }
`;

const CodeBlockWrapper = styled.div`
  position: relative;

  &:hover ${CopyButton} {
    opacity: 1;
  }
`;

/**
 * CyberpunkCodeBlock Component
 * Renders code blocks with a custom cyberpunk-themed syntax highlighting.
 * @param {CyberpunkCodeBlockProps} props - The component props
 * @returns {JSX.Element} Rendered code block
 */
const cyberpunkTheme: CyberpunkTheme = {
  ...vs,
  'code[class*="language-"]': {
    color: "#f0f0f0",
    background: "#1a1a2e",
    fontFamily: '"Space Mono", monospace',
    fontSize: "0.7em",
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
  },
  'pre[class*="language-"]': {
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
    borderRadius: "0.3em",
    background: "#1a1a2e",
  },
  comment: { color: "#4a9fb1" },
  prolog: { color: "#4a9fb1" },
  doctype: { color: "#4a9fb1" },
  cdata: { color: "#4a9fb1" },
  punctuation: { color: "#f0f0f0" },
  property: { color: "#f92aad" },
  tag: { color: "#f92aad" },
  boolean: { color: "#f92aad" },
  number: { color: "#f92aad" },
  constant: { color: "#f92aad" },
  symbol: { color: "#f92aad" },
  deleted: { color: "#f92aad" },
  selector: { color: "#36f9f6" },
  "attr-name": { color: "#36f9f6" },
  string: { color: "#36f9f6" },
  char: { color: "#36f9f6" },
  builtin: { color: "#36f9f6" },
  inserted: { color: "#36f9f6" },
  operator: { color: "#ff7edb" },
  entity: { color: "#ff7edb", cursor: "help" },
  url: { color: "#ff7edb" },
  ".language-css .token.string": { color: "#ff7edb" },
  ".style .token.string": { color: "#ff7edb" },
  variable: { color: "#ff7edb" },
  atrule: { color: "#fede5d" },
  "attr-value": { color: "#fede5d" },
  function: { color: "#fede5d" },
  "class-name": { color: "#fede5d" },
  keyword: { color: "#f97e72" },
  regex: { color: "#f97e72" },
  important: { color: "#f97e72", fontWeight: "bold" },
};

const CyberpunkCodeBlock: React.FC<CyberpunkCodeBlockProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <CodeBlockWrapper className="font-mono text-sm leading-tight">
      <SyntaxHighlighter
        language={language}
        style={cyberpunkTheme}
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderRadius: "0.5rem",
          boxShadow: "0 0 10px rgba(0, 255, 255, 0.3), 0 0 20px rgba(255, 0, 255, 0.3)",
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
      <CopyButton onClick={copyToClipboard}>{isCopied ? <FiCheck /> : <FiCopy />}</CopyButton>
    </CodeBlockWrapper>
  );
};

export default CyberpunkCodeBlock;
