// app/components/HeaderFade.tsx
'use client'

import React from 'react'
import { css } from '../../styled-system/css'
import { useHeaderContext } from './HeaderContext'

const fadeContainerBaseStyles = css`
  height: 40px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  transition: top 0.3s ease;
`

const HeaderFade: React.FC = () => {
  const { isExpanded } = useHeaderContext()

  return <div className={fadeContainerBaseStyles} style={{ top: isExpanded ? '200px' : '100px' }} />
}

export default HeaderFade
