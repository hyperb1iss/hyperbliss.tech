// app/components/PageLayout.tsx
import { motion } from "framer-motion";
import styled from "styled-components";

const MainContentWrapper = styled(motion.main)`
  flex: 1;
  width: 75%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 4rem;

  @media (max-width: 1200px) {
    width: 85%;
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: 8rem 2rem 2rem;
  }
`;

interface PageLayoutProps {
  children: React.ReactNode;
}

/**
 * PageLayout component
 * Provides a consistent layout wrapper for page content with animations.
 * Adjusted styling for better widescreen support and responsiveness.
 * @param {PageLayoutProps} props - The component props
 * @returns {JSX.Element} Rendered page layout
 */
const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <MainContentWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {children}
    </MainContentWrapper>
  );
};

export default PageLayout;
