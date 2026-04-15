/**
 * Repo Prompt Generator
 *
 * Usage:
 *
 * Basic:
 *   node scripts/make-prompt.mjs
 *
 * Output file:
 *   node scripts/make-prompt.mjs --out prompt.txt
 *   node scripts/make-prompt.mjs --out tmp/repo-prompt.txt
 *
 * Without source files:
 *   node scripts/make-prompt.mjs --no-src
 *
 * Full mode:
 *   node scripts/make-prompt.mjs --full
 *
 * Include tests:
 *   node scripts/make-prompt.mjs --with-tests
 *
 * Include repository tree:
 *   node scripts/make-prompt.mjs --tree
 *
 * Include git diff:
 *   node scripts/make-prompt.mjs --diff
 *
 * Custom paths only:
 *   node scripts/make-prompt.mjs --paths index.html public src/presentation
 *
 * Show included files only:
 *   node scripts/make-prompt.mjs --list-only
 *
 * Combined examples:
 *   node scripts/make-prompt.mjs --paths index.html public --tree --diff
 *   node scripts/make-prompt.mjs --full --with-tests --out prompt-full.txt
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const INTRO_FILE = path.join(ROOT, 'scripts', 'ai-intro.md');

const argv = process.argv.slice(2);
const args = new Set(argv);

const noSrc = args.has('--no-src');
const isFull = args.has('--full');
const withTests = args.has('--with-tests');
const withTree = args.has('--tree');
const withDiff = args.has('--diff');
const listOnly = args.has('--list-only');

function getArgValue(flag) {
  const i = argv.indexOf(flag);
  if (i === -1) return null;

  const value = argv[i + 1];

  if (!value || value.startsWith('--')) return null;

  return value;
}

function getArgValues(flag) {
  const i = argv.indexOf(flag);
  if (i === -1) return [];

  const values = [];

  for (let index = i + 1; index < argv.length; index++) {
    const value = argv[index];

    if (value.startsWith('--')) break;

    values.push(value);
  }

  return values;
}

const outArg = getArgValue('--out');
const outFile = path.resolve(ROOT, outArg ?? 'prompt.txt');

const customPaths = getArgValues('--paths');

// --- include sets ---

const INCLUDE_MIN = [
  'README.md',
  'CHANGELOG.md',
  'package.json',
  'index.html',
  'docs',
];

const INCLUDE_SRC = [
  'src/domain',
  'src/application',
  'src/app',
  'src/infrastructure',
  'src/presentation',
  'src/main.tsx',
];

const INCLUDE_FULL_EXTRA = [
  '.github/workflows',
  '.gitignore',
  '.nvmrc',
  '.prettierignore',
  '.prettierrc',
  'vite.config.ts',
  'eslint.config.js',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'src/test/setup.ts',
  'scripts',
];

const INCLUDE =
  customPaths.length > 0
    ? customPaths
    : [
        ...INCLUDE_MIN,
        ...(noSrc ? [] : INCLUDE_SRC),
        ...(isFull ? INCLUDE_FULL_EXTRA : []),
      ];

// --- exclude rules ---

const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'coverage',
  '.vite',
]);

const EXCLUDE_FILES = new Set([
  'package-lock.json',
  '.DS_Store',
  'prompt.txt',
]);

const BINARY_EXT = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.ico',
  '.mp4',
  '.mov',
  '.zip',
]);

function rel(p) {
  return path.relative(ROOT, p).replaceAll('\\', '/');
}

function isExplicitlyIncluded(filePath) {
  const relativePath = rel(filePath);

  return customPaths.some((item) => {
    const normalized = item.replaceAll('\\', '/');

    return relativePath === normalized || relativePath.startsWith(`${normalized}/`);
  });
}

function isExcluded(filePath) {
  const base = path.basename(filePath);

  if (EXCLUDE_FILES.has(base)) return true;

  if (!withTests && base.includes('.test.')) return true;

  const ext = path.extname(base).toLowerCase();

  if (BINARY_EXT.has(ext) && !isExplicitlyIncluded(filePath)) return true;

  return false;
}

function walk(dir) {
  const res = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;

      res.push(...walk(full));
      continue;
    }

    if (isExcluded(full)) continue;

    res.push(full);
  }

  return res;
}

function collect(item) {
  const full = path.resolve(ROOT, item);

  if (!fs.existsSync(full)) return [];

  const stat = fs.statSync(full);

  if (stat.isDirectory()) return walk(full);
  if (stat.isFile()) return isExcluded(full) ? [] : [full];

  return [];
}

function safeRead(file) {
  const stat = fs.statSync(file);
  const maxBytes = 200_000;

  if (stat.size > maxBytes) {
    return `<<skipped: file too large (${stat.size} bytes)>>`;
  }

  const ext = path.extname(file).toLowerCase();

  if (BINARY_EXT.has(ext)) {
    return `<<binary file skipped: ${rel(file)} (${stat.size} bytes)>>`;
  }

  return fs.readFileSync(file, 'utf8');
}

function readIntro() {
  if (!fs.existsSync(INTRO_FILE)) return '';

  return fs.readFileSync(INTRO_FILE, 'utf8').trimEnd();
}

function detectIteration(files) {
  const iterFiles = files.filter((file) =>
    rel(file).startsWith('docs/iterations/iter-'),
  );

  if (iterFiles.length === 0) return null;

  return iterFiles.sort().at(-1);
}

function getRepoTree() {
  try {
    return execSync(
      [
        'find .',
        "-path './node_modules' -prune -o",
        "-path './.git' -prune -o",
        "-path './dist' -prune -o",
        "-path './coverage' -prune -o",
        "-path './.vite' -prune -o",
        '-type f',
        "| sed 's#^\\./##'",
        '| sort',
      ].join(' '),
      { encoding: 'utf8' },
    ).trimEnd();
  } catch {
    return '<<failed to generate repository tree>>';
  }
}

function getGitDiff() {
  try {
    return execSync('git diff main...HEAD', {
      encoding: 'utf8',
      maxBuffer: 2_000_000,
    }).trimEnd();
  } catch {
    return '<<failed to generate git diff>>';
  }
}

function main() {
  const files = INCLUDE.flatMap(collect);

  const uniq = Array.from(new Set(files)).sort((a, b) =>
    rel(a).localeCompare(rel(b)),
  );

  if (listOnly) {
    console.log(uniq.map(rel).join('\n'));
    return;
  }

  let out = '';

  const intro = readIntro();

  if (intro) {
    out += intro + '\n\n---\n\n';
  }

  out += '# Repo Prompt Bundle\n';
  out += `Generated: ${new Date().toISOString()}\n`;
  out += `Repo: ${path.basename(ROOT)}\n`;
  out += `Mode: ${isFull ? 'full' : 'minimal'}${noSrc ? ' (no-src)' : ''}`;

  if (customPaths.length > 0) {
    out += ' (custom-paths)';
  }

  out += '\n';

  const currentIter = detectIteration(uniq);

  if (currentIter) {
    out += `Current iteration: ${rel(currentIter)}\n`;
  }

  if (withTree) {
    out += '\n\n## Repository tree\n';
    out += '```text\n';
    out += getRepoTree();
    out += '\n```\n';
  }

  if (withDiff) {
    out += '\n\n## Git diff\n';
    out += '```diff\n';
    out += getGitDiff();
    out += '\n```\n';
  }

  out += '\n\n## Included files\n';
  out += uniq.map((file) => `- ${rel(file)}`).join('\n');
  out += '\n';

  out += '\n\n## Files\n';

  for (const file of uniq) {
    out += `\n\n=== ${rel(file)} ===\n`;
    out += safeRead(file);
    out += '\n';
  }

  fs.writeFileSync(outFile, out, 'utf8');

  console.log(`OK: ${rel(outFile)}`);
}

main();
