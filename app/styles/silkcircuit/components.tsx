/**
 * SilkCircuit Component Library
 * Sophisticated, reusable components with quantum elegance
 */

import { motion } from 'framer-motion'
import styled, { css, keyframes } from 'styled-components'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Animations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const _pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
`

const glow = keyframes`
  0%, 100% { box-shadow: var(--glow-purple); }
  33% { box-shadow: var(--glow-cyan); }
  66% { box-shadow: var(--glow-pink); }
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Button Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const buttonBase = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-body);
  font-size: var(--text-base);
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

export const SilkButton = styled(motion.button)<{
  $variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  $size?: 'sm' | 'md' | 'lg'
}>`
  ${buttonBase}
  
  /* Variants */
  ${({ $variant = 'primary' }) => {
    switch ($variant) {
      case 'primary':
        return css`
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
        `

      case 'secondary':
        return css`
          background: var(--surface-raised);
          color: var(--color-secondary);
          border: 1px solid var(--color-secondary);
          
          &:hover:not(:disabled) {
            background: rgba(0, 255, 240, 0.1);
            box-shadow: var(--glow-cyan);
          }
        `

      case 'ghost':
        return css`
          background: transparent;
          color: var(--text-primary);
          border: 1px solid transparent;
          
          &:hover:not(:disabled) {
            background: var(--surface-raised);
            border-color: var(--border-default);
          }
        `

      case 'danger':
        return css`
          background: var(--silk-error);
          color: var(--silk-white);
          border: 1px solid transparent;
          
          &:hover:not(:disabled) {
            background: #dc2626;
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
          }
        `
    }
  }}
  
  /* Sizes */
  ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: var(--space-2) var(--space-4);
          font-size: var(--text-sm);
        `
      case 'lg':
        return css`
          padding: var(--space-4) var(--space-8);
          font-size: var(--text-lg);
        `
      default:
        return null
    }
  }}
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Card Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SilkCard = styled(motion.div)<{
  $variant?: 'default' | 'glass' | 'featured' | 'interactive'
  $glow?: boolean
}>`
  position: relative;
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  transition: all var(--duration-normal) var(--ease-silk);
  
  ${({ $variant = 'default' }) => {
    switch ($variant) {
      case 'glass':
        return css`
          background: var(--surface-glass);
          backdrop-filter: blur(var(--blur-lg));
          border: 1px solid var(--border-subtle);
        `

      case 'featured':
        return css`
          background: linear-gradient(
            135deg,
            rgba(162, 89, 255, 0.1),
            rgba(0, 255, 240, 0.05)
          );
          border: 1px solid var(--color-primary);
          box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        `

      case 'interactive':
        return css`
          background: var(--surface-raised);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          
          &:hover {
            border-color: var(--border-emphasis);
            transform: translateY(-2px);
            box-shadow: var(--shadow-xl);
          }
        `

      default:
        return css`
          background: var(--surface-raised);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-base);
        `
    }
  }}
  
  ${({ $glow }) =>
    $glow &&
    css`
    animation: ${glow} 4s ease-in-out infinite;
  `}
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Typography Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SilkHeading = styled(motion.h2)<{
  $level?: 1 | 2 | 3 | 4 | 5 | 6
  $gradient?: boolean
}>`
  font-family: var(--font-heading);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  
  ${({ $level = 2 }) => {
    const sizes = {
      1: 'var(--text-fluid-5xl)',
      2: 'var(--text-fluid-4xl)',
      3: 'var(--text-fluid-3xl)',
      4: 'var(--text-fluid-2xl)',
      5: 'var(--text-fluid-xl)',
      6: 'var(--text-fluid-lg)',
    }
    return css`font-size: ${sizes[$level]};`
  }}
  
  ${({ $gradient }) =>
    $gradient &&
    css`
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
    animation: ${shimmer} 3s linear infinite;
  `}
`

export const SilkText = styled.p<{
  $size?: 'sm' | 'base' | 'lg'
  $muted?: boolean
}>`
  font-family: var(--font-body);
  line-height: var(--leading-relaxed);
  
  ${({ $size = 'base' }) => css`
    font-size: var(--text-${$size});
  `}
  
  ${({ $muted }) => css`
    color: ${$muted ? 'var(--text-muted)' : 'var(--text-secondary)'};
  `}
`

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

export const SilkContainer = styled.div<{
  $maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}>`
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-6);
  
  ${({ $maxWidth = 'xl' }) => {
    const widths = {
      '2xl': '1536px',
      full: '100%',
      lg: '1024px',
      md: '768px',
      sm: '640px',
      xl: '1280px',
    }
    return css`max-width: ${widths[$maxWidth]};`
  }}
`

export const SilkGrid = styled.div<{
  $columns?: number
  $gap?: string
}>`
  display: grid;
  grid-template-columns: repeat(${({ $columns = 1 }) => $columns}, 1fr);
  gap: ${({ $gap = 'var(--space-6)' }) => $gap};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const SilkFlex = styled.div<{
  $direction?: 'row' | 'column'
  $align?: 'start' | 'center' | 'end' | 'stretch'
  $justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  $gap?: string
  $wrap?: boolean
}>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  align-items: ${({ $align = 'stretch' }) =>
    $align === 'start' ? 'flex-start' : $align === 'end' ? 'flex-end' : $align};
  justify-content: ${({ $justify = 'start' }) =>
    $justify === 'start'
      ? 'flex-start'
      : $justify === 'end'
        ? 'flex-end'
        : $justify === 'between'
          ? 'space-between'
          : $justify === 'around'
            ? 'space-around'
            : 'center'};
  gap: ${({ $gap = 'var(--space-4)' }) => $gap};
  flex-wrap: ${({ $wrap = false }) => ($wrap ? 'wrap' : 'nowrap')};
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Badge Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SilkBadge = styled.span<{
  $variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
}>`
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
  transition: all var(--duration-fast) var(--ease-silk);
  
  ${({ $variant = 'default' }) => {
    const variants = {
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
    return variants[$variant]
  }}
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Divider Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SilkDivider = styled.hr<{
  $gradient?: boolean
}>`
  width: 100%;
  height: 1px;
  margin: var(--space-8) 0;
  border: none;
  
  ${({ $gradient }) =>
    $gradient
      ? css`
    background: linear-gradient(
      90deg,
      transparent,
      var(--color-primary) 20%,
      var(--color-secondary) 50%,
      var(--color-accent) 80%,
      transparent
    );
  `
      : css`
    background: var(--border-default);
  `}
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Loading Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const SilkSpinner = styled.div<{
  $size?: 'sm' | 'md' | 'lg'
}>`
  display: inline-block;
  border: 2px solid var(--border-subtle);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  
  ${({ $size = 'md' }) => {
    const sizes = {
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
    return sizes[$size]
  }}
`

export const SilkSkeleton = styled.div<{
  $height?: string
  $width?: string
}>`
  background: linear-gradient(
    90deg,
    var(--surface-raised) 0%,
    var(--border-subtle) 50%,
    var(--surface-raised) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
  height: ${({ $height = 'var(--space-6)' }) => $height};
  width: ${({ $width = '100%' }) => $width};
`
