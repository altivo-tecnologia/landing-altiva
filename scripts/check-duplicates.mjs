import { sourceFiles } from './lib/source-files.mjs';
import { findDuplicates } from './lib/duplicate-rules.mjs';

const violations = findDuplicates(await sourceFiles());
if (violations.length) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else console.log('Duplication gate passed (8 significant lines, at least 240 characters).');
