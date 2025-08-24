// app/components/PageWrapper.tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

const pageVariants = {
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  initial: { opacity: 0, scale: 0.95 },
}

const pageTransition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96],
}

interface PageWrapperProps {
  children: ReactNode
}

/**
 * PageWrapper component
 * Wraps page content with animation transitions.
 * @param {PageWrapperProps} props - The component props
 * @returns {JSX.Element} Animated page wrapper
 */
export default function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname()
  const [displayedChildren, setDisplayedChildren] = useState(children)

  useEffect(() => {
    setDisplayedChildren(children)
  }, [children])

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate="animate"
        exit="exit"
        initial="initial"
        key={pathname}
        transition={pageTransition}
        variants={pageVariants}
      >
        {displayedChildren}
      </motion.div>
    </AnimatePresence>
  )
}
