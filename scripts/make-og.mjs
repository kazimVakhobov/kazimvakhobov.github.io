/**
 * Рендерит OG-превью для страницы с методологией: public/og/*.png, 1200×630.
 *
 * Запускается руками (`node scripts/make-og.mjs`), а не на сборке: результат
 * лежит в репозитории, меняется редко и не стоит того, чтобы тащить sharp
 * в прямые зависимости — здесь он берётся транзитивно, из набора Astro.
 */
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Те же токены, что в src/styles/global.css — светлая тема.
const C = {
  bg: '#f8f6f2',
  surface: '#f1eee8',
  line: '#e0dbd1',
  fg: '#1d1a17',
  muted: '#5a534b',
  faint: '#716961',
  accent: '#c2553a',
};

const SERIF = 'Palatino Linotype, Palatino, Georgia, serif';
const SANS = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const MONO = 'Menlo, DejaVu Sans Mono, monospace';

const repos = [
  { name: 'acme-api', x: 740, y: 300 },
  { name: 'acme-web', x: 948, y: 300 },
  { name: 'acme-mobile', x: 740, y: 394 },
  { name: 'acme-admin', x: 948, y: 394 },
];

const repoBox = ({ name, x, y }) => `
  <rect x="${x}" y="${y}" width="180" height="78" rx="7" fill="${C.surface}" stroke="${C.line}"/>
  <text x="${x + 15}" y="${y + 30}" font-family="${MONO}" font-size="15" fill="${C.fg}">${name}/</text>
  <text x="${x + 15}" y="${y + 57}" font-family="${MONO}" font-size="14" fill="${C.accent}">shared-docs/</text>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect x="0" y="0" width="1200" height="7" fill="${C.accent}"/>

  <text x="72" y="118" font-family="${SANS}" font-size="19" font-weight="600" letter-spacing="2.6" fill="${C.accent}">METHODOLOGY</text>

  <text x="72" y="232" font-family="${SERIF}" font-size="68" fill="${C.fg}">Agents need context,</text>
  <text x="72" y="306" font-family="${SERIF}" font-size="68" fill="${C.fg}">not access.</text>

  <rect x="72" y="352" width="104" height="2" fill="${C.accent}"/>

  <text x="72" y="412" font-family="${SANS}" font-size="24" fill="${C.muted}">One documentation repository, mounted into every</text>
  <text x="72" y="448" font-family="${SANS}" font-size="24" fill="${C.muted}">code repository as a git submodule. Read-only.</text>

  <text x="72" y="556" font-family="${SANS}" font-size="22" font-weight="600" fill="${C.fg}">Kazim Vakhobov<tspan dx="16" font-weight="400" fill="${C.faint}">· Senior Frontend Engineer</tspan></text>
  <text x="72" y="590" font-family="${MONO}" font-size="18" fill="${C.accent}">kazimvakhobov.com</text>

  <rect x="740" y="150" width="388" height="96" rx="7" fill="${C.surface}" stroke="${C.accent}"/>
  <text x="755" y="192" font-family="${MONO}" font-size="21" fill="${C.accent}">shared-docs</text>
  <text x="755" y="222" font-family="${SANS}" font-size="16" fill="${C.faint}">specs · ADRs · tasks · progress · changelog</text>

  <path d="M934 246 V286" stroke="${C.line}" stroke-width="2"/>
  <path d="M928 280 L934 288 L940 280" fill="none" stroke="${C.line}" stroke-width="2" stroke-linecap="round"/>

  ${repos.map(repoBox).join('')}
</svg>`;

const out = join(root, 'public/og/agents-need-context-not-access.png');
await mkdir(dirname(out), { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);

console.log(`wrote ${out}`);
