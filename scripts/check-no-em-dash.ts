import fs from 'fs';
import path from 'path';

// Define forbidden tokens dynamically to prevent false positives within this file
export const FORBIDDEN_TOKENS = [
  { name: 'U+2014 (em dash character)', token: String.fromCharCode(0x2014) },
  { name: '&mdash; (HTML entity)', token: ['&', 'm', 'd', 'a', 's', 'h', ';'].join('') },
  { name: '&#8212; (Numeric entity)', token: ['&', '#', '8', '2', '1', '2', ';'].join('') },
  { name: '\\u2014 (Unicode escape string)', token: ['\\', 'u', '2', '0', '1', '4'].join('') },
];

const SCAN_DIRS = ['src', 'docs', 'public', 'tests', 'functions'];
const EXCLUDE_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot',
]);

const projectRoot = path.resolve(__dirname, '..');

export interface Violation {
  file: string;
  line: number;
  col: number;
  tokenName: string;
  snippet: string;
}

export function scanRepository(): Violation[] {
  const violations: Violation[] = [];

  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', '.next', '.git', 'test-results', '.turbo', 'dist', 'build'].includes(entry.name)) {
          continue;
        }
        scanDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (EXCLUDE_EXTS.has(ext)) continue;

        const relPath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');
        if (relPath === 'scripts/check-no-em-dash.ts' || relPath === 'tests/lint/no-em-dash.test.ts') {
          continue;
        }

        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((lineText, lineIdx) => {
          for (const item of FORBIDDEN_TOKENS) {
            let startIdx = 0;
            while (true) {
              const found = lineText.indexOf(item.token, startIdx);
              if (found === -1) break;

              violations.push({
                file: relPath,
                line: lineIdx + 1,
                col: found + 1,
                tokenName: item.name,
                snippet: lineText.trim(),
              });
              startIdx = found + item.token.length;
            }
          }
        });
      }
    }
  }

  for (const dirName of SCAN_DIRS) {
    scanDir(path.join(projectRoot, dirName));
  }

  // Scan top-level files in project root
  const rootEntries = fs.readdirSync(projectRoot, { withFileTypes: true });
  for (const entry of rootEntries) {
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXCLUDE_EXTS.has(ext)) continue;
      const fullPath = path.join(projectRoot, entry.name);
      const relPath = entry.name;
      if (relPath === 'scripts/check-no-em-dash.ts' || relPath === 'tests/lint/no-em-dash.test.ts') {
        continue;
      }
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((lineText, lineIdx) => {
        for (const item of FORBIDDEN_TOKENS) {
          let startIdx = 0;
          while (true) {
            const found = lineText.indexOf(item.token, startIdx);
            if (found === -1) break;
            violations.push({
              file: relPath,
              line: lineIdx + 1,
              col: found + 1,
              tokenName: item.name,
              snippet: lineText.trim(),
            });
            startIdx = found + item.token.length;
          }
        }
      });
    }
  }

  return violations;
}

// Auto-run if executed directly
const violations = scanRepository();
if (violations.length > 0) {
  console.error(`\x1b[31m[EM DASH LINT ERROR] Found ${violations.length} forbidden em dash occurrences:\x1b[0m\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}:${v.col} -> [${v.tokenName}]: "${v.snippet}"`);
  }
  console.error('\nBuild failed. Em dashes (U+2014, &mdash;, &#8212;, \\u2014) are strictly disallowed.\n');
  process.exit(1);
} else {
  console.log('\x1b[32m[EM DASH LINT PASS] 0 em dash occurrences found across source, content, seed, and docs.\x1b[0m');
}
