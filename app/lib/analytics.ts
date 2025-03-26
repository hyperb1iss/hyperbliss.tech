import { event } from "nextjs-google-analytics";

/**
 * Analytics utility for tracking various user interactions
 * and events throughout the application.
 */

interface EventOptions {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track navigation events
 * @param source The source/origin page
 * @param destination The destination page
 */
export const trackNavigation = (source: string, destination: string) => {
  event("navigation", {
    source_page: source,
    destination_page: destination,
  });
};

/**
 * Track external link clicks
 * @param url The external URL clicked
 * @param linkText The text of the link
 */
export const trackExternalLink = (url: string, linkText: string) => {
  event("external_link", {
    external_url: url,
    link_text: linkText,
  });
};

/**
 * Track project interactions
 * @param action The action performed (view, click, etc.)
 * @param projectId The ID of the project
 * @param options Additional event data
 */
export const trackProjectEvent = (action: string, projectId: string, options?: EventOptions) => {
  event(`project_${action}`, {
    project_id: projectId,
    ...options,
  });
};

/**
 * Track blog post interactions
 * @param action The action performed (view, read, share, etc.)
 * @param postId The ID of the blog post
 * @param options Additional event data
 */
export const trackBlogEvent = (action: string, postId: string, options?: EventOptions) => {
  event(`blog_${action}`, {
    post_id: postId,
    ...options,
  });
};

/**
 * Track user engagement events
 * @param action The engagement action
 * @param options Additional event data
 */
export const trackEngagement = (action: string, options?: EventOptions) => {
  event(`engagement_${action}`, {
    ...options,
  });
};

/**
 * Track CyberScape interactions
 * @param action The interaction type
 * @param options Additional event data
 */
export const trackCyberScapeEvent = (action: string, options?: EventOptions) => {
  event(`cyberscape_${action}`, {
    ...options,
  });
};

// Re-export the raw event function for custom event tracking
export { event };
