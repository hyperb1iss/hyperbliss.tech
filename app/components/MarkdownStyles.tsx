// app/components/MarkdownStyles.tsx
import styled from 'styled-components'

// Headings
export const StyledH1 = styled.h1`
  font-size: clamp(2.5rem, 2.5vw, 4rem);
  background: linear-gradient(
    135deg,
    #ff75d8 0%,
    #d946ef 25%,
    #ec4899 50%,
    #e0aaff 75%,
    #ff75d8 100%
  );
  background-size: 200% 200%;
  animation: shimmerGradient 8s ease infinite;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 25px rgba(217, 70, 239, 0.4))
          drop-shadow(0 0 15px rgba(255, 117, 216, 0.3));
  text-align: left;
  font-weight: 700;
  line-height: 1.2;
  
  @keyframes shimmerGradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`

export const StyledH2 = styled.h2`
  font-size: clamp(2rem, 2vw, 3.5rem);
  background: linear-gradient(
    90deg,
    #ec4899 0%,
    #a855f7 35%,
    #d946ef 70%,
    #ff75d8 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.3));
  text-align: left;
  font-weight: 600;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #ff75d8, transparent);
  }
`

export const StyledH3 = styled.h3`
  font-size: clamp(1.75rem, 1.5vw, 3rem);
  color: #ff75d8;
  margin-top: 1.6rem;
  margin-bottom: 0.8rem;
  text-shadow: 0 0 15px rgba(255, 117, 216, 0.4),
               0 0 8px rgba(217, 70, 239, 0.3);
  text-align: left;
  font-weight: 600;
  position: relative;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.4rem;
    width: 5.5rem;
    height: 0.3rem;
    border-radius: 999px;
    background: linear-gradient(90deg, #ff75d8, rgba(255, 117, 216, 0));
    box-shadow: 0 0 12px rgba(255, 117, 216, 0.35);
  }
`

// Paragraph
export const StyledParagraph = styled.p`
  font-size: clamp(1.6rem, 1.2vw, 2rem);
  line-height: 1.7;
  color: rgba(224, 224, 224, 0.9);
  margin-bottom: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  
  strong {
    color: #e0aaff;
    font-weight: 600;
    text-shadow: 0 0 8px rgba(224, 170, 255, 0.3);
  }
  
  em {
    color: #ff75d8;
    font-style: italic;
    text-shadow: 0 0 5px rgba(255, 117, 216, 0.2);
  }
`

// Links
export const StyledLink = styled.a`
  color: #d946ef;
  text-decoration: none;
  position: relative;
  transition: all 0.3s var(--ease-silk);
  font-weight: 500;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      #ff75d8,
      #ec4899,
      #d946ef
    );
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s var(--ease-silk);
  }

  &:hover {
    color: #ff75d8;
    text-shadow: 0 0 15px rgba(255, 117, 216, 0.6),
                 0 0 8px rgba(236, 72, 153, 0.4);
    
    &::after {
      transform: scaleX(1);
      transform-origin: left;
      box-shadow: 0 0 10px rgba(255, 117, 216, 0.5);
    }
  }
`

// Lists
export const StyledUl = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  li {
    padding: 0;

    &::before {
      content: '';
      width: 1rem;
      height: 1rem;
      border-radius: 0.35rem;
      margin-top: 0.6rem;
      background: radial-gradient(circle at 30% 30%, #fff 0%, #ff75d8 45%, rgba(162, 89, 255, 0.3) 100%);
      box-shadow:
        0 0 12px rgba(255, 117, 216, 0.65),
        0 0 24px rgba(162, 89, 255, 0.45);
      flex-shrink: 0;
    }
  }

  li ul {
    margin-top: 0.9rem;
    margin-left: 1.4rem;
    padding-left: 1.2rem;
    border-left: 1px solid rgba(224, 170, 255, 0.25);
    gap: 0.9rem;
  }

  li ul li::before {
    transform: scale(0.75);
    box-shadow:
      0 0 8px rgba(255, 117, 216, 0.5),
      0 0 16px rgba(162, 89, 255, 0.35);
    opacity: 0.9;
  }
`

export const StyledOl = styled.ol`
  list-style: none;
  padding-left: 0;
  margin: 2rem 0;
  counter-reset: silk-counter;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;

  li {
    padding: 0;
    counter-increment: silk-counter;

    &::before {
      content: counter(silk-counter);
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #ff75d8 0%, #d946ef 60%, #a855f7 100%);
      color: var(--silk-void-black);
      font-weight: 600;
      font-family: var(--font-mono);
      font-size: 0.95em;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 0 20px rgba(255, 117, 216, 0.6),
        inset 0 0 12px rgba(236, 72, 153, 0.35);
      margin-top: 0.1rem;
      flex-shrink: 0;
    }
  }

  li ol {
    margin-top: 0.9rem;
    margin-left: 1.5rem;
    padding-left: 1.2rem;
    border-left: 1px solid rgba(224, 170, 255, 0.2);
    gap: 1rem;
  }
`

export const StyledLi = styled.li`
  list-style: none;
  margin: 0;
  font-size: clamp(1.6rem, 1.2vw, 2rem);
  line-height: 1.75;
  color: rgba(224, 224, 224, 0.92);
  letter-spacing: 0.01em;
  display: flex;
  gap: 1.1rem;
  align-items: flex-start;

  p {
    margin: 0;
  }
`

// Blockquote
export const StyledBlockquote = styled.blockquote`
  font-size: clamp(1.6rem, 1.2vw, 2rem);
  border-left: 3px solid transparent;
  padding: 1.5rem 1.5rem 1.5rem 2.5rem;
  color: #e0aaff;
  background: linear-gradient(
    135deg,
    rgba(255, 117, 216, 0.12) 0%,
    rgba(217, 70, 239, 0.08) 25%,
    rgba(30, 25, 45, 0.6) 50%,
    rgba(236, 72, 153, 0.06) 75%,
    rgba(224, 170, 255, 0.08) 100%
  );
  backdrop-filter: blur(15px) saturate(1.2);
  margin: 2rem 0;
  font-style: italic;
  border-radius: var(--radius-lg);
  position: relative;
  box-shadow: 
    0 0 30px rgba(217, 70, 239, 0.2),
    0 0 60px rgba(255, 117, 216, 0.1),
    inset 0 0 30px rgba(236, 72, 153, 0.05);
  text-shadow: 0 0 10px rgba(224, 170, 255, 0.3);
  
  &::before {
    content: '❝';
    position: absolute;
    left: 0.8rem;
    top: 0.5rem;
    font-size: 2.5rem;
    color: #ff75d8;
    text-shadow: 0 0 20px rgba(255, 117, 216, 0.6);
    opacity: 0.6;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
      180deg,
      #ff75d8,
      #d946ef,
      #ec4899,
      #ff75d8
    );
    border-radius: 2px;
    animation: pulseGlow 3s ease infinite;
  }
  
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 10px rgba(255, 117, 216, 0.5); }
    50% { box-shadow: 0 0 20px rgba(217, 70, 239, 0.8); }
  }
`

// Horizontal Rule
export const StyledHr = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--silk-quantum-purple) 20%,
    var(--silk-circuit-cyan) 50%,
    var(--silk-quantum-purple) 80%,
    transparent
  );
  margin: 3rem 0;
  position: relative;
  
  &::after {
    content: '◆';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: var(--silk-void-black);
    color: var(--silk-lavender);
    padding: 0 1rem;
    font-size: 1.2rem;
  }
`

// Inline Code
export const StyledInlineCode = styled.code`
  font-size: clamp(1.4rem, 1vw, 1.8rem);
  background: linear-gradient(
    135deg,
    rgba(217, 70, 239, 0.2),
    rgba(255, 117, 216, 0.1),
    rgba(30, 25, 45, 0.8)
  );
  color: #ff75d8;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  border: 1px solid rgba(255, 117, 216, 0.3);
  text-shadow: 0 0 8px rgba(255, 117, 216, 0.4);
  transition: all 0.2s var(--ease-silk);
  
  &:hover {
    border-color: #d946ef;
    background: linear-gradient(
      135deg,
      rgba(236, 72, 153, 0.25),
      rgba(217, 70, 239, 0.15),
      rgba(30, 25, 45, 0.8)
    );
    color: #e0aaff;
    transform: translateY(-1px);
    box-shadow: 0 2px 10px rgba(217, 70, 239, 0.3);
  }
`

// Image
export const StyledImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
`
