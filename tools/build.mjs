import sharp from 'sharp';
import { hero, product, gate, object, detail, ogImage } from './fence-art.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = new URL('../public/media/demo/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

/**
 * Раскадровка набора.
 *
 * У каждого объекта три кадра в одной логике (та же, что в docs/PHOTOS.md,
 * по которой заглушки потом заменяются реальными снимками):
 *   -1 общий план объекта,
 *   -2 узел въезда — ворота или калитка,
 *   -3 крупный план монтажного узла.
 *
 * Общие планы намеренно сняты с разных сторон и с разным числом пролётов:
 * двенадцать одинаковых фронтальных кадров в портфолио не складываются.
 */
const jobs = [
  ['hero.jpg', hero({ w: 2400, h: 1350, type: 'profnastil', seed: 11 })],
  ['og.jpg', ogImage()],

  ['product-profnastil.jpg', product({ w: 1200, h: 900, type: 'profnastil', seed: 21 })],
  ['product-evroshtaketnik.jpg', product({ w: 1200, h: 900, type: 'evroshtaketnik', seed: 22 })],
  ['product-setka.jpg', product({ w: 1200, h: 900, type: 'mesh', seed: 23 })],
  ['product-zhalyuzi.jpg', product({ w: 1200, h: 900, type: 'zhalyuzi', seed: 24 })],
  ['product-vorota.jpg', gate({ w: 1200, h: 900, type: 'profnastil', seed: 25, kind: 'sliding' })],

  // Объект 1 — профнастил с откатными воротами
  ['case-1-1.jpg', object({ w: 1500, h: 1000, type: 'profnastil', seed: 31, spans: 5, angle: 'right', withGate: true })],
  ['case-1-2.jpg', gate({ w: 1500, h: 1000, type: 'profnastil', seed: 32, kind: 'sliding' })],
  ['case-1-3.jpg', detail({ w: 1500, h: 1000, type: 'profnastil', seed: 33, kind: 'post-rail' })],

  // Объект 2 — евроштакетник с распашными воротами
  ['case-2-1.jpg', object({ w: 1500, h: 1000, type: 'evroshtaketnik', seed: 41, spans: 6, angle: 'left' })],
  ['case-2-2.jpg', gate({ w: 1500, h: 1000, type: 'evroshtaketnik', seed: 42, kind: 'swing', leaves: 2 })],
  ['case-2-3.jpg', detail({ w: 1500, h: 1000, type: 'evroshtaketnik', seed: 43, kind: 'hinge' })],

  // Объект 3 — 3D-сетка на склоне: пролёты идут ступенями
  ['case-3-1.jpg', object({ w: 1500, h: 1000, type: 'mesh', seed: 51, spans: 5, angle: 'right', step: 0.035 })],
  ['case-3-2.jpg', gate({ w: 1500, h: 1000, type: 'mesh', seed: 52, kind: 'swing', leaves: 1 })],
  ['case-3-3.jpg', detail({ w: 1500, h: 1000, type: 'mesh', seed: 53, kind: 'clip' })],

  // Объект 4 — забор-жалюзи с откатными воротами
  ['case-4-1.jpg', object({ w: 1500, h: 1000, type: 'zhalyuzi', seed: 61, spans: 4, angle: 'left' })],
  ['case-4-2.jpg', gate({ w: 1500, h: 1000, type: 'zhalyuzi', seed: 62, kind: 'sliding' })],
  ['case-4-3.jpg', detail({ w: 1500, h: 1000, type: 'zhalyuzi', seed: 63, kind: 'lamella-end' })],
];

let total = 0;
for (const [name, svg] of jobs) {
  const info = await sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toFile(join(OUT, name));
  total += info.size;
}
console.log(`${jobs.length} файлов, ${(total / 1024).toFixed(0)} КБ всего`);
