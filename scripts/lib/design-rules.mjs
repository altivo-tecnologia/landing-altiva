export function designViolations(content, tokens) {
  const violations = [];
  const rules = [
    [
      /#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\s*\(/gi,
      'Use a color token instead of a literal',
    ],
    [
      /\b(?:bg|text|border|divide|outline|ring|decoration|fill|stroke|from|via|to|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b|\b(?:bg|text|border|divide|outline|ring|decoration|fill|stroke|from|via|to)-(?:white|black)\b/g,
      'Use the semantic project palette',
    ],
    [
      /\b(?:color|background(?:-color)?|border(?:-color)?):\s*(?:white|black|navy|red|blue|gray)\b/gi,
      'Use a color token instead of a named color',
    ],
  ];
  for (const [pattern, message] of rules) {
    for (const match of content.matchAll(pattern)) {
      violations.push({ line: content.slice(0, match.index).split('\n').length, message });
    }
  }
  for (const match of content.matchAll(/var\((--(?:color|font|radius|shadow)-[\w-]+)/g)) {
    if (!tokens.has(match[1])) {
      violations.push({
        line: content.slice(0, match.index).split('\n').length,
        message: `Unknown token ${match[1]}`,
      });
    }
  }
  for (const match of content.matchAll(
    /\b(?:bg|text|border|divide|outline|ring|decoration|fill|stroke|from|via|to)-((?:primary|canvas|surface|ink|copy|on-canvas|line|brand|mask|muted)[\w-]*)/g,
  )) {
    if (['stroke-linecap', 'stroke-linejoin'].includes(match[0])) continue;
    if (!tokens.has(`--color-${match[1]}`)) {
      violations.push({
        line: content.slice(0, match.index).split('\n').length,
        message: `Unknown palette utility ${match[0]}`,
      });
    }
  }
  return violations;
}
