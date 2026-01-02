/**
 * SilkCircuit Component Library
 * Sophisticated, reusable components with quantum elegance
 */

import { motion } from 'framer-motion'
import React from 'react'
import { css } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Button Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const buttonBaseStyles = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-body);
  font-size: clamp(1.5rem, 1.3rem + 0.4vw, 1.8rem);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal) var(--ease-silk);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const buttonVariantStyles = {
  danger: css`
    background: var(--silk-error);
    color: var(--silk-white);
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: #dc2626;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--text-primary);
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: var(--surface-raised);
      border-color: var(--border-default);
    }
  `,
  primary: css`
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
    color: var(--silk-white);
    border: 1px solid transparent;
    box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.1);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  secondary: css`
    background: var(--surface-raised);
    color: var(--color-secondary);
    border: 1px solid var(--color-secondary);

    &:hover:not(:disabled) {
      background: rgba(0, 255, 240, 0.1);
      box-shadow: var(--glow-cyan);
    }
  `,
}

const buttonSizeStyles = {
  lg: css`
    padding: var(--space-4) var(--space-8);
    font-size: clamp(1.8rem, 1.6rem + 0.5vw, 2.2rem);
    min-height: 56px;
  `,
  md: css`
    min-height: 44px;
  `,
  sm: css`
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    min-height: 36px;
  `,
}

interface SilkButtonProps extends React.ComponentProps<typeof motion.button> {
  $variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  $size?: 'sm' | 'md' | 'lg'
}

export const SilkButton = React.forwardRef<HTMLButtonElement, SilkButtonProps>(
  ({ $variant = 'primary', $size = 'md', className, ...props }, ref) => (
    <motion.button
      className={`${buttonBaseStyles} ${buttonVariantStyles[$variant]} ${buttonSizeStyles[$size]} ${className || ''}`}
      ref={ref}
      {...props}
    />
  ),
)
SilkButton.displayName = 'SilkButton'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Card Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const cardBaseStyles = css`
  position: relative;
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  transition: all var(--duration-normal) var(--ease-silk);
`

const cardVariantStyles = {
  default: css`
    background: var(--surface-raised);
    border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-base);
  `,
  featured: css`
    background: linear-gradient(
      135deg,
      rgba(162, 89, 255, 0.1),
      rgba(0, 255, 240, 0.05)
    );
    border: 1px solid var(--color-primary);
    box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  `,
  glass: css`
    background: var(--surface-glass);
    backdrop-filter: blur(var(--blur-lg));
    border: 1px solid var(--border-subtle);
  `,
  interactive: css`
    background: var(--surface-raised);
    border: 1px solid var(--border-subtle);
    cursor: pointer;

    &:hover {
      border-color: var(--border-emphasis);
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }
  `,
}

const cardGlowStyles = css`
  @keyframes glow {
    0%, 100% { box-shadow: var(--glow-purple); }
    33% { box-shadow: var(--glow-cyan); }
    66% { box-shadow: var(--glow-pink); }
  }
  animation: glow 4s ease-in-out infinite;
`

interface SilkCardProps extends React.ComponentProps<typeof motion.div> {
  $variant?: 'default' | 'glass' | 'featured' | 'interactive'
  $glow?: boolean
}

export const SilkCard = React.forwardRef<HTMLDivElement, SilkCardProps>(
  ({ $variant = 'default', $glow = false, className, ...props }, ref) => (
    <motion.div
      className={`${cardBaseStyles} ${cardVariantStyles[$variant]} ${$glow ? cardGlowStyles : ''} ${className || ''}`}
      ref={ref}
      {...props}
    />
  ),
)
SilkCard.displayName = 'SilkCard'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Typography Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const headingBaseStyles = css`
  font-family: var(--font-heading);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
`

const headingLevelStyles = {
  1: css`font-size: var(--text-fluid-5xl);`,
  2: css`font-size: var(--text-fluid-4xl);`,
  3: css`font-size: var(--text-fluid-3xl);`,
  4: css`font-size: var(--text-fluid-2xl);`,
  5: css`font-size: var(--text-fluid-xl);`,
  6: css`font-size: var(--text-fluid-lg);`,
}

const headingGradientStyles = css`
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-secondary),
    var(--color-accent)
  );
  background-size: 200% 200%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  animation: shimmer 3s linear infinite;
`

interface SilkHeadingProps extends React.ComponentProps<typeof motion.h2> {
  $level?: 1 | 2 | 3 | 4 | 5 | 6
  $gradient?: boolean
}

export const SilkHeading = React.forwardRef<HTMLHeadingElement, SilkHeadingProps>(
  ({ $level = 2, $gradient = false, className, ...props }, ref) => (
    <motion.h2
      className={`${headingBaseStyles} ${headingLevelStyles[$level]} ${$gradient ? headingGradientStyles : ''} ${className || ''}`}
      ref={ref}
      {...props}
    />
  ),
)
SilkHeading.displayName = 'SilkHeading'

const textSizeStyles = {
  base: css`font-size: var(--text-base);`,
  lg: css`font-size: var(--text-lg);`,
  sm: css`font-size: var(--text-sm);`,
}

interface SilkTextProps extends React.ComponentProps<'p'> {
  $size?: 'sm' | 'base' | 'lg'
  $muted?: boolean
}

const textBaseStyles = css`
  font-family: var(--font-body);
  line-height: var(--leading-relaxed);
`

export const SilkText = React.forwardRef<HTMLParagraphElement, SilkTextProps>(
  ({ $size = 'base', $muted = false, className, style, ...props }, ref) => (
    <p
      className={`${textBaseStyles} ${textSizeStyles[$size]} ${className || ''}`}
      ref={ref}
      style={{ color: $muted ? 'var(--text-muted)' : 'var(--text-secondary)', ...style }}
      {...props}
    />
  ),
)
SilkText.displayName = 'SilkText'

export const SilkCode = styled.code`
  font-family: var(--font-mono);
  font-size: 0.875em;
  padding: var(--space-1) var(--space-2);
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--color-secondary);
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Input Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SilkInput = styled.input`
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  background: var(--surface-raised);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-silk);

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(162, 89, 255, 0.1), var(--glow-purple);
    background: rgba(30, 41, 59, 0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const SilkTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  background: var(--surface-raised);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  resize: vertical;
  transition: all var(--duration-fast) var(--ease-silk);

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(162, 89, 255, 0.1), var(--glow-purple);
  }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Layout Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const containerBaseStyles = css`
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-6);
`

const containerWidthStyles = {
  '2xl': css`max-width: 1536px;`,
  full: css`max-width: 100%;`,
  lg: css`max-width: 1024px;`,
  md: css`max-width: 768px;`,
  sm: css`max-width: 640px;`,
  xl: css`max-width: 1280px;`,
}

interface SilkContainerProps extends React.ComponentProps<'div'> {
  $maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export const SilkContainer = React.forwardRef<HTMLDivElement, SilkContainerProps>(
  ({ $maxWidth = 'xl', className, ...props }, ref) => (
    <div
      className={`${containerBaseStyles} ${containerWidthStyles[$maxWidth]} ${className || ''}`}
      ref={ref}
      {...props}
    />
  ),
)
SilkContainer.displayName = 'SilkContainer'

const gridBaseStyles = css`
  display: grid;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

interface SilkGridProps extends React.ComponentProps<'div'> {
  $columns?: number
  $gap?: string
}

export const SilkGrid = React.forwardRef<HTMLDivElement, SilkGridProps>(
  ({ $columns = 1, $gap = 'var(--space-6)', className, style, ...props }, ref) => (
    <div
      className={`${gridBaseStyles} ${className || ''}`}
      ref={ref}
      style={{
        gap: $gap,
        gridTemplateColumns: `repeat(${$columns}, 1fr)`,
        ...style,
      }}
      {...props}
    />
  ),
)
SilkGrid.displayName = 'SilkGrid'

const flexBaseStyles = css`
  display: flex;
`

interface SilkFlexProps extends React.ComponentProps<'div'> {
  $direction?: 'row' | 'column'
  $align?: 'start' | 'center' | 'end' | 'stretch'
  $justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  $gap?: string
  $wrap?: boolean
}

const alignMap = {
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
}

const justifyMap = {
  around: 'space-around',
  between: 'space-between',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
}

export const SilkFlex = React.forwardRef<HTMLDivElement, SilkFlexProps>(
  (
    {
      $direction = 'row',
      $align = 'stretch',
      $justify = 'start',
      $gap = 'var(--space-4)',
      $wrap = false,
      className,
      style,
      ...props
    },
    ref,
  ) => (
    <div
      className={`${flexBaseStyles} ${className || ''}`}
      ref={ref}
      style={{
        alignItems: alignMap[$align],
        flexDirection: $direction,
        flexWrap: $wrap ? 'wrap' : 'nowrap',
        gap: $gap,
        justifyContent: justifyMap[$justify],
        ...style,
      }}
      {...props}
    />
  ),
)
SilkFlex.displayName = 'SilkFlex'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Badge Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const badgeBaseStyles = css`
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
  transition: all var(--duration-fast) var(--ease-silk);
`

const badgeVariantStyles = {
  default: css`
    background: var(--surface-raised);
    color: var(--text-secondary);
    border: 1px solid var(--border-default);
  `,
  error: css`
    background: rgba(239, 68, 68, 0.1);
    color: var(--silk-error);
    border: 1px solid rgba(239, 68, 68, 0.3);
  `,
  primary: css`
    background: rgba(162, 89, 255, 0.1);
    color: var(--color-primary);
    border: 1px solid rgba(162, 89, 255, 0.3);
  `,
  success: css`
    background: rgba(16, 185, 129, 0.1);
    color: var(--silk-success);
    border: 1px solid rgba(16, 185, 129, 0.3);
  `,
  warning: css`
    background: rgba(245, 158, 11, 0.1);
    color: var(--silk-warning);
    border: 1px solid rgba(245, 158, 11, 0.3);
  `,
}

interface SilkBadgeProps extends React.ComponentProps<'span'> {
  $variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
}

export const SilkBadge = React.forwardRef<HTMLSpanElement, SilkBadgeProps>(
  ({ $variant = 'default', className, ...props }, ref) => (
    <span className={`${badgeBaseStyles} ${badgeVariantStyles[$variant]} ${className || ''}`} ref={ref} {...props} />
  ),
)
SilkBadge.displayName = 'SilkBadge'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Divider Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const dividerBaseStyles = css`
  width: 100%;
  height: 1px;
  margin: var(--space-8) 0;
  border: none;
`

const dividerDefaultStyles = css`
  background: var(--border-default);
`

const dividerGradientStyles = css`
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-primary) 20%,
    var(--color-secondary) 50%,
    var(--color-accent) 80%,
    transparent
  );
`

interface SilkDividerProps extends React.ComponentProps<'hr'> {
  $gradient?: boolean
}

export const SilkDivider = React.forwardRef<HTMLHRElement, SilkDividerProps>(
  ({ $gradient = false, className, ...props }, ref) => (
    <hr
      className={`${dividerBaseStyles} ${$gradient ? dividerGradientStyles : dividerDefaultStyles} ${className || ''}`}
      ref={ref}
      {...props}
    />
  ),
)
SilkDivider.displayName = 'SilkDivider'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Loading Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const spinnerBaseStyles = css`
  display: inline-block;
  border: 2px solid var(--border-subtle);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  animation: spin 0.6s linear infinite;
`

const spinnerSizeStyles = {
  lg: css`
    width: var(--space-12);
    height: var(--space-12);
  `,
  md: css`
    width: var(--space-8);
    height: var(--space-8);
  `,
  sm: css`
    width: var(--space-4);
    height: var(--space-4);
  `,
}

interface SilkSpinnerProps extends React.ComponentProps<'div'> {
  $size?: 'sm' | 'md' | 'lg'
}

export const SilkSpinner = React.forwardRef<HTMLDivElement, SilkSpinnerProps>(
  ({ $size = 'md', className, ...props }, ref) => (
    <div className={`${spinnerBaseStyles} ${spinnerSizeStyles[$size]} ${className || ''}`} ref={ref} {...props} />
  ),
)
SilkSpinner.displayName = 'SilkSpinner'

const skeletonBaseStyles = css`
  background: linear-gradient(
    90deg,
    var(--surface-raised) 0%,
    var(--border-subtle) 50%,
    var(--surface-raised) 100%
  );
  background-size: 200% 100%;
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
`

interface SilkSkeletonProps extends React.ComponentProps<'div'> {
  $height?: string
  $width?: string
}

export const SilkSkeleton = React.forwardRef<HTMLDivElement, SilkSkeletonProps>(
  ({ $height = 'var(--space-6)', $width = '100%', className, style, ...props }, ref) => (
    <div
      className={`${skeletonBaseStyles} ${className || ''}`}
      ref={ref}
      style={{ height: $height, width: $width, ...style }}
      {...props}
    />
  ),
)
SilkSkeleton.displayName = 'SilkSkeleton'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Star Button Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const starButtonBaseStyles = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-body);
  font-size: clamp(1.5rem, 1.3rem + 0.4vw, 1.8rem);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal) var(--ease-silk);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  overflow: hidden;

  .star-icon {
    height: auto;
    filter: brightness(1.5) drop-shadow(0 0 4px rgba(0, 255, 240, 0.5));
    transition: all var(--duration-normal) var(--ease-silk);
    @keyframes starFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-2px) rotate(3deg); }
    }
    animation: starFloat 2s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg), 0 0 20px rgba(162, 89, 255, 0.3);

    .star-icon {
      filter: brightness(2) drop-shadow(0 0 8px rgba(0, 255, 240, 0.8));
      animation-duration: 1s;
    }
  }

  &:active {
    transform: translateY(0);
  }
`

const starButtonVariantStyles = {
  primary: css`
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
    color: var(--silk-white);
    border: 1px solid transparent;
    box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  `,
  secondary: css`
    background: var(--surface-raised);
    color: var(--color-secondary);
    border: 1px solid var(--color-secondary);
  `,
}

const starButtonSizeStyles = {
  lg: css`
    padding: var(--space-4) var(--space-8);
    font-size: clamp(1.8rem, 1.6rem + 0.5vw, 2.2rem);
    gap: var(--space-3);
    min-height: 56px;

    .star-icon {
      width: 28px;
    }
  `,
  md: css`
    min-height: 44px;

    .star-icon {
      width: 22px;
    }
  `,
  sm: css`
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    gap: var(--space-2);
    min-height: 36px;

    .star-icon {
      width: 16px;
    }
  `,
}

interface StarButtonWrapperProps extends React.ComponentProps<typeof motion.div> {
  $variant?: 'primary' | 'secondary'
  $size?: 'sm' | 'md' | 'lg'
}

export const StarButtonWrapper = React.forwardRef<HTMLDivElement, StarButtonWrapperProps>(
  ({ $variant = 'primary', $size = 'md', className, ...props }, ref) => (
    <motion.div
      className={`${starButtonBaseStyles} ${starButtonVariantStyles[$variant]} ${starButtonSizeStyles[$size]} ${className || ''}`}
      ref={ref}
      {...props}
    />
  ),
)
StarButtonWrapper.displayName = 'StarButtonWrapper'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Star Divider Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const starDividerBaseStyles = css`
  display: flex;
  align-items: center;
  gap: var(--space-6);
  width: 100%;

  .divider-line {
    flex: 1;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--color-primary) 30%,
      var(--color-secondary) 50%,
      var(--color-primary) 70%,
      transparent 100%
    );
    opacity: 0.6;
  }

  .star-icon {
    height: auto;
    transition: all var(--duration-normal) var(--ease-silk);
    @keyframes starGlow {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(0, 255, 240, 0.4)); }
      50% { filter: drop-shadow(0 0 16px rgba(162, 89, 255, 0.6)); }
    }
    animation: starGlow 3s ease-in-out infinite;

    &:hover {
      transform: scale(1.1) rotate(5deg);
    }
  }
`

const starDividerCompactStyles = css`
  margin: var(--space-6) 0;

  .star-icon {
    width: 32px;
  }
`

const starDividerDefaultStyles = css`
  margin: var(--space-12) 0;

  .star-icon {
    width: 48px;
  }
`

interface StarDividerContainerProps extends React.ComponentProps<'div'> {
  $compact?: boolean
}

export const StarDividerContainer = React.forwardRef<HTMLDivElement, StarDividerContainerProps>(
  ({ $compact = false, className, ...props }, ref) => (
    <div
      className={`${starDividerBaseStyles} ${$compact ? starDividerCompactStyles : starDividerDefaultStyles} ${className || ''}`}
      ref={ref}
      {...props}
    />
  ),
)
StarDividerContainer.displayName = 'StarDividerContainer'
