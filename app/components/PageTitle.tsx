// app/components/PageTitle.tsx
import styled from "styled-components";
import { motion } from "framer-motion";

const TitleWrapper = styled(motion.h1)`
  font-size: 4rem;
  color: var(--color-primary);
  text-align: center;
  margin: 2rem 0;
  text-shadow: 0 0 5px var(--color-primary);

  @media (max-width: 768px) {
    font-size: 3.6rem;
  }
`;

interface PageTitleProps {
  children: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ children }) => {
  return (
    <TitleWrapper
      initial={{ opacity: 0, y: -140 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </TitleWrapper>
  );
};

export default PageTitle;
