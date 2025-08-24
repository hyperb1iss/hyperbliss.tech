// app/components/SilkCircuitSyntaxTheme.tsx
'use client'

import { createGlobalStyle } from 'styled-components'

/**
 * SilkCircuit Glow Syntax Theme
 * Based on the SilkCircuit Glow VSCode theme
 * Applies vibrant neon colors with glowing effects
 */
export const SilkCircuitSyntaxTheme = createGlobalStyle`
  /* Base code block styles */
  pre code {
    /* General text */
    color: #ffffff;
    
    /* Comments */
    .hljs-comment,
    .hljs-quote,
    .hljs-meta {
      color: #cc66ff;
      font-style: italic;
      text-shadow: 0 0 5px rgba(204, 102, 255, 0.3);
    }
    
    /* Keywords, Storage, Control */
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-type,
    .hljs-section {
      color: #ff00ff;
      font-weight: bold;
      text-shadow: 0 0 10px rgba(255, 0, 255, 0.5),
                   0 0 20px rgba(255, 0, 255, 0.3);
    }
    
    /* Functions, Methods */
    .hljs-title,
    .hljs-function .hljs-title,
    .hljs-title.function_,
    .hljs-title.class_,
    .hljs-title.class_.inherited__ {
      color: #00ffff;
      font-weight: 600;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5),
                   0 0 20px rgba(0, 255, 255, 0.3);
    }
    
    /* Strings */
    .hljs-string,
    .hljs-regexp,
    .hljs-addition,
    .hljs-attribute,
    .hljs-meta-string {
      color: #ff99ff;
      text-shadow: 0 0 8px rgba(255, 153, 255, 0.4);
    }
    
    /* Numbers, Constants, Built-ins */
    .hljs-number,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-constant,
    .hljs-params {
      color: #ff66ff;
      text-shadow: 0 0 8px rgba(255, 102, 255, 0.4);
    }
    
    /* Classes, Types */
    .hljs-class,
    .hljs-symbol,
    .hljs-bullet,
    .hljs-subst,
    .hljs-meta,
    .hljs-meta .hljs-keyword,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-link {
      color: #ffff00;
      text-shadow: 0 0 10px rgba(255, 255, 0, 0.4);
    }
    
    /* Variables */
    .hljs-variable,
    .hljs-template-variable,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #ffffff;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
    }
    
    /* Tags (HTML, XML) */
    .hljs-tag,
    .hljs-name,
    .hljs-selector {
      color: #ff00ff;
      text-shadow: 0 0 8px rgba(255, 0, 255, 0.4);
    }
    
    /* Attributes */
    .hljs-attr,
    .hljs-attribute {
      color: #ffff00;
      font-style: italic;
      text-shadow: 0 0 6px rgba(255, 255, 0, 0.3);
    }
    
    /* Operators, Punctuation */
    .hljs-operator,
    .hljs-punctuation {
      color: #00ffff;
      text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
    }
    
    /* Deletion */
    .hljs-deletion {
      color: #ff0066;
      text-shadow: 0 0 8px rgba(255, 0, 102, 0.5);
    }
    
    /* Insertion */
    .hljs-addition {
      color: #00ff00;
      text-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
    }
    
    /* Strong emphasis */
    .hljs-strong {
      font-weight: bold;
      color: #ff00ff;
    }
    
    /* Emphasis */
    .hljs-emphasis {
      font-style: italic;
      color: #ff00ff;
    }
    
    /* Links */
    .hljs-link {
      text-decoration: underline;
    }
  }
  
  /* Blog-specific purple/magenta theme overrides */
  .blog-syntax {
    pre code {
      /* Comments */
      .hljs-comment,
      .hljs-quote,
      .hljs-meta {
        color: #a855f7;
        text-shadow: 0 0 5px rgba(168, 85, 247, 0.3);
      }
      
      /* Keywords */
      .hljs-keyword,
      .hljs-selector-tag,
      .hljs-type {
        color: #d946ef;
        text-shadow: 0 0 10px rgba(217, 70, 239, 0.5);
      }
      
      /* Functions */
      .hljs-title,
      .hljs-function .hljs-title {
        color: #ec4899;
        text-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
      }
      
      /* Strings */
      .hljs-string,
      .hljs-regexp {
        color: #ff75d8;
        text-shadow: 0 0 8px rgba(255, 117, 216, 0.4);
      }
      
      /* Numbers, Constants */
      .hljs-number,
      .hljs-built_in,
      .hljs-constant {
        color: #e0aaff;
        text-shadow: 0 0 8px rgba(224, 170, 255, 0.4);
      }
      
      /* Operators */
      .hljs-operator,
      .hljs-punctuation {
        color: #ff75d8;
        opacity: 0.8;
        text-shadow: 0 0 5px rgba(255, 117, 216, 0.3);
      }
    }
  }
  
  /* Project-specific cyan/teal theme overrides */
  .project-syntax {
    pre code {
      /* Comments */
      .hljs-comment,
      .hljs-quote,
      .hljs-meta {
        color: #00acc1;
        text-shadow: 0 0 5px rgba(0, 172, 193, 0.3);
      }
      
      /* Keywords */
      .hljs-keyword,
      .hljs-selector-tag,
      .hljs-type {
        color: #00fff0;
        text-shadow: 0 0 10px rgba(0, 255, 240, 0.5);
      }
      
      /* Functions */
      .hljs-title,
      .hljs-function .hljs-title {
        color: #00e5ff;
        text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
      }
      
      /* Strings */
      .hljs-string,
      .hljs-regexp {
        color: #26c6da;
        text-shadow: 0 0 8px rgba(38, 198, 218, 0.4);
      }
      
      /* Numbers, Constants */
      .hljs-number,
      .hljs-built_in,
      .hljs-constant {
        color: #00fff0;
        text-shadow: 0 0 8px rgba(0, 255, 240, 0.4);
      }
      
      /* Operators */
      .hljs-operator,
      .hljs-punctuation {
        color: #00e5ff;
        opacity: 0.8;
        text-shadow: 0 0 5px rgba(0, 229, 255, 0.3);
      }
    }
  }
  
  /* Inline code styling for general use */
  code:not(pre code) {
    background: linear-gradient(
      135deg,
      rgba(255, 0, 255, 0.1),
      rgba(0, 255, 255, 0.05)
    );
    border: 1px solid rgba(255, 0, 255, 0.3);
    color: #ff00ff;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-family: var(--font-mono);
    text-shadow: 0 0 5px rgba(255, 0, 255, 0.3);
    transition: all 0.2s ease;
    
    &:hover {
      background: linear-gradient(
        135deg,
        rgba(255, 0, 255, 0.15),
        rgba(0, 255, 255, 0.08)
      );
      border-color: #00ffff;
      color: #00ffff;
      text-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
    }
  }
`

export default SilkCircuitSyntaxTheme
