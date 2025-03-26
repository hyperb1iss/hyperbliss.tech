"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import * as analyticsUtils from "../lib/analytics";

/**
 * Custom hook for analytics that provides easy access to tracking functions
 * and automatically tracks user journeys without duplicating basic page views
 * already handled by the Analytics component
 */
export default function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathRef = useRef<string | null>(null);
  const pageViewTimeRef = useRef<Date>(new Date());
  const initialRenderRef = useRef<boolean>(true);

  // Track navigation between pages and time spent on previous page
  useEffect(() => {
    // Skip on initial render since Analytics component handles initial page view
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    if (prevPathRef.current && prevPathRef.current !== pathname) {
      // Calculate time spent on previous page
      const timeSpent = new Date().getTime() - pageViewTimeRef.current.getTime();

      // Track navigation between pages with time spent data
      analyticsUtils.trackNavigation(prevPathRef.current, pathname);

      // Track engagement time on previous page
      analyticsUtils.trackEngagement("page_time", {
        page_path: prevPathRef.current,
        time_seconds: Math.floor(timeSpent / 1000),
      });

      // Reset timer for new page
      pageViewTimeRef.current = new Date();
    }

    // Update previous path
    prevPathRef.current = pathname;
  }, [pathname]);

  // Track search parameters if they change without a page navigation
  useEffect(() => {
    if (initialRenderRef.current) {
      return; // Skip on initial render
    }

    if (searchParams && searchParams.toString()) {
      const params = Object.fromEntries(searchParams.entries());
      analyticsUtils.trackEngagement("search", {
        search_params: JSON.stringify(params),
        page_path: pathname,
      });
    }
  }, [searchParams, pathname]);

  // Setup visibility change detection for more accurate session tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // User is navigating away or switching tabs
        const timeSpent = new Date().getTime() - pageViewTimeRef.current.getTime();

        analyticsUtils.trackEngagement("page_exit", {
          page_path: pathname,
          time_seconds: Math.floor(timeSpent / 1000),
          exit_type: "visibility_change",
        });
      } else if (document.visibilityState === "visible") {
        // User returned to the page
        pageViewTimeRef.current = new Date();

        analyticsUtils.trackEngagement("page_return", {
          page_path: pathname,
        });
      }
    };

    // More reliable way to track when users leave the page in SPAs
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  // Return all tracking utilities for use in components
  return {
    ...analyticsUtils,
  };
}
