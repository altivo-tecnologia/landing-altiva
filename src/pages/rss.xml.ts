import type { APIRoute } from 'astro';
import { getSortedBlogPosts } from '../utils/blog';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Astro site URL is required to generate the RSS feed.');

  const posts = await getSortedBlogPosts();
  const items = posts
    .map((post) => {
      const url = new URL(`/blog/${post.id}`, site).href;
      return `    <item>\n      <title>${escapeXml(post.data.title)}</title>\n      <link>${url}</link>\n      <guid>${url}</guid>\n      <description>${escapeXml(post.data.description)}</description>\n      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>\n    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n  <title>${escapeXml(SITE_TITLE)}</title>\n  <link>${site.href}</link>\n  <description>${escapeXml(SITE_DESCRIPTION)}</description>\n  <language>pt-BR</language>\n${items}\n</channel></rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
