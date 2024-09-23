// app/hooks/useAnimatedNavigation.ts
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export const useAnimatedNavigation = () => {
  const router = useRouter();

  const animateAndNavigate = useCallback(
    (href: string) => {
      // The animation is now handled by Framer Motion in the MainContent component
      router.push(href);
    },
    [router]
  );

  return animateAndNavigate;
};
