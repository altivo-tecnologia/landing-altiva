import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

export async function sourceFiles(directory = 'src') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await sourceFiles(path)));
    else if (['.astro', '.css', '.ts', '.js', '.mjs'].includes(extname(path))) {
      files.push({ path, content: await readFile(path, 'utf8') });
    }
  }
  return files;
}
