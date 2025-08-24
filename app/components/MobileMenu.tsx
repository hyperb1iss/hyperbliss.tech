// app/components/MobileMenu.tsx
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { triggerCyberScapeAnimation } from '../cyberscape/CyberScape'

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Trigger CyberScape animation when menu is opened
      const menuIcon = document.querySelector('.menu-icon')
      if (menuIcon) {
        const rect = menuIcon.getBoundingClientRect()
        triggerCyberScapeAnimation(rect.left + rect.width / 2, rect.top + rect.height / 2)
      }
    }
  }

  return (
    <>
      <button
        aria-label="Toggle menu"
        className="menu-icon fixed top-4 right-4 z-50 p-2 rounded-full bg-cyberpunk-900 shadow-neon"
        onClick={toggleMenu}
      >
        <motion.div
          animate={isOpen ? 'open' : 'closed'}
          className="w-6 h-0.5 bg-cyberpunk-100 mb-1.5 shadow-glow"
          variants={{
            closed: { rotate: 0, y: 0 },
            open: { rotate: 45, y: 7 },
          }}
        />
        <motion.div
          animate={isOpen ? 'open' : 'closed'}
          className="w-6 h-0.5 bg-cyberpunk-100 mb-1.5 shadow-glow"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
        />
        <motion.div
          animate={isOpen ? 'open' : 'closed'}
          className="w-6 h-0.5 bg-cyberpunk-100 shadow-glow"
          variants={{
            closed: { rotate: 0, y: 0 },
            open: { rotate: -45, y: -7 },
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ x: 0 }}
            className="fixed inset-y-0 right-0 w-64 bg-cyberpunk-900 bg-opacity-90 shadow-lg z-40 backdrop-blur-md"
            exit={{ x: '100%' }}
            initial={{ x: '100%' }}
            transition={{ damping: 30, stiffness: 300, type: 'spring' }}
          >
            <nav className="flex flex-col h-full justify-center items-center space-y-8 pr-8">
              {/* ... (keep existing menu items) */}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileMenu
