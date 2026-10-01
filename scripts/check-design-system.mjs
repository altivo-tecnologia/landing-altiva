import { readFile } from 'node:fs/promises';
import { sourceFiles } from './lib/source-files.mjs';
import { designViolations } from './lib/design-rules.mjs';

const tokenPath = 'src/styles/tokens.css';
const definitions = await readFile(tokenPath, 'utf8');
const tokens = new Set([...definitions.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
const violations = [];
for (const { path, content } of await sourceFiles()) {
  if (path === tokenPath) continue;
  for (const { line, message } of designViolations(content, tokens)) {
    violations.push(`${path}:${line}: ${message}`);
  }
}
if (violations.length) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else console.log('Design system gate passed: semantic colors and defined tokens.');
