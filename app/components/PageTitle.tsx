// app/components/PageTitle.tsx
import { motion } from "framer-motion";
import styled from "styled-components";

const TitleWrapper = styled(motion.h1)`
  font-size: 4rem;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 5px var(--color-primary);

  @media (max-width: 768px) {
    font-size: 3.6rem;
  }
`;

interface PageTitleProps {
  children: React.ReactNode;
}

/**
 * PageTitle component
 * Renders a page title with animation effects.
 * @param {PageTitleProps} props - The component props
 * @returns {JSX.Element} Animated page title
 */
const PageTitle: React.FC<PageTitleProps> = ({ children }) => {
  return (
    <TitleWrapper
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </TitleWrapper>
  );
};

export default PageTitle;
