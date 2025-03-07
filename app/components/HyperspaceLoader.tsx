"use client";

import { useEffect } from "react";
import { initHyperspace } from "../lib/hyperspace";

/**
 * HyperspaceLoader Component
 * Client component that initializes the hyperspace easter egg
 * The 'use client' directive ensures this only runs on the client
 */
export default function HyperspaceLoader() {
  useEffect(() => {
    // Initialize the hyperspace easter egg
    try {
      initHyperspace();
    } catch (err) {
      console.error("Failed to initialize hyperspace:", err);
    }
  }, []);

  // This component doesn't render anything visible
  return null;
}
