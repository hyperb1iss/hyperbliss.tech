// app/components/PageLayout.tsx
import styled from "styled-components";
import { motion } from "framer-motion";

const MainContentWrapper = styled(motion.main)`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px 40px;

  @media (max-width: 768px) {
    padding: 80px 20px 20px;
  }
`;

interface PageLayoutProps {
  children: React.ReactNode;
}

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
