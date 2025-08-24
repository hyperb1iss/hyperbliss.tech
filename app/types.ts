/**
 * Custom type definitions for Next.js 15
 */

export interface PageParams {
  [key: string]: string | string[] | undefined
}

export interface PageProps {
  params: Promise<PageParams>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
