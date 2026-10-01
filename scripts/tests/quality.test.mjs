import assert from 'node:assert/strict';
import { test } from 'node:test';
import { designViolations } from '../lib/design-rules.mjs';
import { findDuplicates } from '../lib/duplicate-rules.mjs';

const tokens = new Set(['--color-canvas', '--color-primary', '--font-display']);

test('accepts semantic colors, opacity modifiers and layout arbitrary values', () => {
  assert.deepEqual(
    designViolations(
      'bg-canvas/90 text-primary md:grid-cols-[20rem_1fr] color: var(--color-primary);',
      tokens,
    ),
    [],
  );
});

test('rejects raw CSS and Tailwind palette colors', () => {
  for (const value of [
    'color: #fff;',
    'bg-[#020617]',
    'rgb(0 0 0)',
    'text-slate-100',
    'hover:bg-red-500',
    'border-white/10',
    'color: navy;',
  ]) {
    assert.ok(designViolations(value, tokens).length, value);
  }
});

test('rejects undefined tokens and semantic utility typos', () => {
  assert.ok(designViolations('var(--color-missing)', tokens).length);
  assert.ok(designViolations('border-line-missing', tokens).length);
});

const block = Array.from(
  { length: 8 },
  (_, index) => `const item${index} = calculateTotal(invoice${index}, taxRate);`,
).join('\n');

test('detects duplicates between files and within one file despite whitespace', () => {
  assert.equal(
    findDuplicates([
      { path: 'a.ts', content: block },
      { path: 'b.astro', content: block.replaceAll(' = ', '  =  ') },
    ]).length,
    1,
  );
  assert.equal(findDuplicates([{ path: 'a.ts', content: `${block}\n\n${block}` }]).length, 1);
});

test('allows short idioms, imports and unique blocks', () => {
  assert.deepEqual(findDuplicates([{ path: 'a.ts', content: 'const x = 1;\nconst x = 1;' }]), []);
  assert.deepEqual(findDuplicates([{ path: 'a.ts', content: block }]), []);
  assert.deepEqual(
    findDuplicates([
      { path: 'a.ts', content: Array(20).fill("import { value } from './module';").join('\n') },
    ]),
    [],
  );
});
