import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INTRO_FILE = path.join(ROOT, 'scripts', 'ai-intro.md');

const args = new Set(process.argv.slice(2));
const noSrc = args.has('--no-src');
const isFull = args.has('--full');

const argv = process.argv.slice(2);

function getArgValue(flag) {
  const i = argv.indexOf(flag);
  if (i === -1) return null;
  const value = argv[i + 1];
  if (!value || value.startsWith('--')) return null;
  return value;
}

const outArg = getArgValue('--out');
const outFile = path.resolve(ROOT, outArg ?? 'prompt.txt');

// --- include sets ---

const INCLUDE_MIN = ['README.md', 'CHANGELOG.md', 'package.json', 'docs'];

const INCLUDE_SRC = [
  'src/domain',
  'src/application',
  'src/app/compositionRoot.ts',
  'src/infrastructure',
  'src/presentation/App.tsx',
  'src/presentation/pages/GamePage.tsx',
  'src/presentation/components/PuzzleBoard.tsx',
  'src/presentation/styles/global.css',
  'src/main.tsx',
];

const INCLUDE_FULL_EXTRA = [
  '.github/workflows',
  'vite.config.ts',
  'eslint.config.js',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'src/test/setup.ts',
];

const INCLUDE = [
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

const EXCLUDE_FILES = new Set(['package-lock.json', '.DS_Store']);

const EXCLUDE_EXT = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.svg',
  '.ico',
  '.mp4',
  '.mov',
  '.zip',
]);

function rel(p) {
  return path.relative(ROOT, p).replaceAll('\\', '/');
}

function isExcluded(filePath) {
  const base = path.basename(filePath);

  if (EXCLUDE_FILES.has(base)) return true;

  const ext = path.extname(base).toLowerCase();

  if (EXCLUDE_EXT.has(ext)) return true;

  // exclude tests
  if (base.includes('.test.')) return true;

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
  const full = path.join(ROOT, item);

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

  return fs.readFileSync(file, 'utf8');
}

function readIntro() {
  if (!fs.existsSync(INTRO_FILE)) return '';
  return fs.readFileSync(INTRO_FILE, 'utf8').trimEnd();
}

// ✅ NEW: highlight current iteration file
function detectIteration(files) {
  const iterFiles = files.filter((f) =>
    rel(f).includes('docs/iterations/iter-'),
  );

  if (iterFiles.length === 0) return null;

  return iterFiles.sort().at(-1);
}

function main() {
  const files = INCLUDE.flatMap(collect);

  const uniq = Array.from(new Set(files)).sort((a, b) =>
    rel(a).localeCompare(rel(b)),
  );

  let out = '';

  const intro = readIntro();

  if (intro) {
    out += intro + '\n\n---\n\n';
  }

  out += '# Repo Prompt Bundle\n';
  out += `Generated: ${new Date().toISOString()}\n`;
  out += `Repo: ${path.basename(ROOT)}\n`;
  out += `Mode: ${isFull ? 'full' : 'minimal'}${noSrc ? ' (no-src)' : ''}\n`;

  // ✅ NEW: show current iteration
  const currentIter = detectIteration(uniq);

  if (currentIter) {
    out += `Current iteration: ${rel(currentIter)}\n`;
  }

  out += '\n\n## Included files\n';
  out += uniq.map((f) => `- ${rel(f)}`).join('\n');
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
