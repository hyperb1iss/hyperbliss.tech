// app/components/PageWrapper.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  useEffect(() => {
    if (!isExiting) {
      setDisplayedChildren(children); // Only update after the animation completes
    }
  }, [children, isExiting]);

  const handleExitComplete = () => {
    setIsExiting(false);
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const transition = {
    duration: 0.5,
    ease: [0.43, 0.13, 0.23, 0.96],
  };

  return (
    <AnimatePresence
      mode="wait"
      initial={false} // Ensure we don't animate on the first render
      onExitComplete={handleExitComplete}
    >
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={transition}
        onAnimationStart={() => setIsExiting(true)}
      >
        {displayedChildren}
      </motion.div>
    </AnimatePresence>
  );
}
