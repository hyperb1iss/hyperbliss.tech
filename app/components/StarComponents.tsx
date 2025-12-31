'use client'

import Image from 'next/image'
import React from 'react'
import { StarButtonWrapper, StarDividerContainer } from '../styles/silkcircuit/components'

interface StarButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}

/**
 * StarButton - A CTA button with an animated shooting star accent
 */
export const StarButton: React.FC<StarButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className,
}) => {
  return (
    <StarButtonWrapper
      $size={size}
      $variant={variant}
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Image alt="" aria-hidden="true" className="star-icon" height={24} src="/images/star-icon.png" width={24} />
      {children}
    </StarButtonWrapper>
  )
}

interface StarDividerProps {
  compact?: boolean
  className?: string
}

/**
 * StarDivider - A decorative section divider with a glowing star
 */
export const StarDivider: React.FC<StarDividerProps> = ({ compact = false, className }) => {
  return (
    <StarDividerContainer $compact={compact} className={className}>
      <div className="divider-line" />
      <Image alt="" aria-hidden="true" className="star-icon" height={48} src="/images/star-icon.png" width={48} />
      <div className="divider-line" />
    </StarDividerContainer>
  )
}
