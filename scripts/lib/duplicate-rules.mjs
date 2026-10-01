export const MIN_LINES = 8;
export const MIN_CHARACTERS = 240;

export function findDuplicates(files) {
  const seen = new Map();
  const violations = [];
  const reported = new Set();
  for (const { path, content } of files) {
    const lines = content
      .split('\n')
      .map((text, index) => ({ text: text.trim().replace(/\s+/g, ' '), line: index + 1 }))
      .filter(
        ({ text }) => text && !text.startsWith('import ') && !/^(?:\/\/|\/\*|\*|<!--)/.test(text),
      );
    for (let index = 0; index <= lines.length - MIN_LINES; index++) {
      const block = lines.slice(index, index + MIN_LINES);
      const key = block.map(({ text }) => text).join('\n');
      if (key.length < MIN_CHARACTERS) continue;
      const location = { path, line: block[0].line };
      const previous = seen.get(key);
      if (!previous) {
        seen.set(key, location);
        continue;
      }
      if (previous.path === path && location.line < previous.line + MIN_LINES) continue;
      const pair = `${previous.path}:${path}`;
      if (reported.has(pair)) continue;
      reported.add(pair);
      violations.push(
        `${previous.path}:${previous.line} and ${path}:${location.line}: duplicated block; extract a utility or component`,
      );
    }
  }
  return violations;
}
