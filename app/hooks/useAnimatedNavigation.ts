// app/hooks/useAnimatedNavigation.ts

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export const useAnimatedNavigation = () => {
  const router = useRouter()

  const animateAndNavigate = useCallback(
    (href: string) => {
      // Scroll to top before navigation to prevent title hiding behind header
      window.scrollTo({ behavior: 'instant', top: 0 })
      // The animation is now handled by Framer Motion in the MainContent component
      router.push(href)
    },
    [router],
  )

  return animateAndNavigate
}
