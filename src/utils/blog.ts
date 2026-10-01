// src/utils/blog.ts
import { getCollection, type CollectionEntry } from 'astro:content';

export const BLOG_PAGE_SIZE = 4;

/**
 * Calculate reading time for blog posts
 * @param content - Raw content string (post.body)
 * @returns Estimated reading time in minutes
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Format a date for display
 * @param date - Date object
 * @param format - Optional format: 'short' | 'long' | 'relative'
 * @returns Formatted date string
 */
export function formatDate(date: Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  if (format === 'long') {
    options.month = 'long';
    options.day = 'numeric';
    options.year = 'numeric';
  }

  if (format === 'relative') {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `há ${diffDays} dias`;
    if (diffDays < 30) return `há ${Math.ceil(diffDays / 7)} semanas`;
    if (diffDays < 365) return `há ${Math.ceil(diffDays / 30)} meses`;
    return `há ${Math.ceil(diffDays / 365)} anos`;
  }

  return date.toLocaleDateString('pt-BR', options);
}

/**
 * Get the most recent posts, excluding the current post
 * @param currentPost - Current blog post
 * @param allPosts - All blog posts
 * @param limit - Maximum number of related posts
 * @returns Array of related posts
 */
export function getRecentPosts(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit: number = 3,
): CollectionEntry<'blog'>[] {
  return sortPostsByDate(allPosts.filter((post) => post.id !== currentPost.id)).slice(0, limit);
}

export function sortPostsByDate(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getSortedBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  return sortPostsByDate(await getCollection('blog'));
}
