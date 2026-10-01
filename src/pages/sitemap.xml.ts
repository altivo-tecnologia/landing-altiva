import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const staticPaths = ['/', '/blog', '/links', '/privacy'];

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Astro site URL is required to generate the sitemap.');

  const posts = await getCollection('blog');
  const urls: { loc: string; lastmod?: string }[] = [
    ...staticPaths.map((path) => ({ loc: new URL(path, site).href })),
    ...posts.map((post) => ({
      loc: new URL(`/blog/${post.id}`, site).href,
      lastmod: post.data.updatedDate?.toISOString(),
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      ({ loc, lastmod }) =>
        `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
    )
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
