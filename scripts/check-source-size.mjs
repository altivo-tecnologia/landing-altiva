import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const roots = ['src', 'scripts'];
const rootFiles = ['astro.config.mjs', 'eslint.config.mjs'];
const limits = new Map([
  ['.astro', 300],
  ['.js', 300],
  ['.mjs', 300],
  ['.ts', 300],
  ['.css', 500],
]);
const violations = [];

async function visit(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const fullPath = join(path, entry.name);
    if (entry.isDirectory()) {
      await visit(fullPath);
      continue;
    }

    const extension = extname(entry.name);
    const limit = limits.get(extension);
    if (!limit) continue;

    const content = await readFile(fullPath, 'utf8');
    const lines = content.replace(/\r/g, '').split('\n');
    if (lines.at(-1) === '') lines.pop();
    if (lines.length > limit) {
      violations.push(`${relative(root, fullPath)}: ${lines.length} lines (limit ${limit})`);
    }
  }
}

for (const path of roots) await visit(join(root, path));
for (const path of rootFiles) {
  const content = await readFile(join(root, path), 'utf8');
  const lines = content.replace(/\r/g, '').split('\n');
  if (lines.at(-1) === '') lines.pop();
  if (lines.length > 300) violations.push(`${path}: ${lines.length} lines (limit 300)`);
}

if (violations.length) {
  console.error('Source size limit exceeded:\n' + violations.map((item) => `- ${item}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Source size limits passed (300 lines per module, 500 per stylesheet).');
}
