import sharp from 'sharp';
import { hero, product, gateProduct, object, ogImage } from './fence-art.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = new URL('../public/media/demo/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const jobs = [
  ['hero.jpg', hero({ w: 2400, h: 1350, type: 'profnastil', seed: 11 })],
  ['og.jpg', ogImage()],

  ['product-profnastil.jpg', product({ w: 1200, h: 900, type: 'profnastil', seed: 21 })],
  ['product-evroshtaketnik.jpg', product({ w: 1200, h: 900, type: 'evroshtaketnik', seed: 22 })],
  ['product-setka.jpg', product({ w: 1200, h: 900, type: 'mesh', seed: 23 })],
  ['product-zhalyuzi.jpg', product({ w: 1200, h: 900, type: 'zhalyuzi', seed: 24 })],
  ['product-vorota.jpg', gateProduct({ w: 1200, h: 900, type: 'profnastil', seed: 25 })],

  ['case-1-1.jpg', object({ w: 1500, h: 1000, type: 'profnastil', seed: 31, spans: 4, withGate: true })],
  ['case-1-2.jpg', gateProduct({ w: 1500, h: 1000, type: 'profnastil', seed: 32 })],
  ['case-1-3.jpg', product({ w: 1500, h: 1000, type: 'profnastil', seed: 33 })],

  ['case-2-1.jpg', object({ w: 1500, h: 1000, type: 'evroshtaketnik', seed: 41, spans: 4 })],
  ['case-2-2.jpg', product({ w: 1500, h: 1000, type: 'evroshtaketnik', seed: 42 })],
  ['case-2-3.jpg', object({ w: 1500, h: 1000, type: 'evroshtaketnik', seed: 43, spans: 6 })],

  ['case-3-1.jpg', object({ w: 1500, h: 1000, type: 'mesh', seed: 51, spans: 5 })],
  ['case-3-2.jpg', product({ w: 1500, h: 1000, type: 'mesh', seed: 52 })],
  ['case-3-3.jpg', object({ w: 1500, h: 1000, type: 'mesh', seed: 53, spans: 3 })],

  ['case-4-1.jpg', object({ w: 1500, h: 1000, type: 'zhalyuzi', seed: 61, spans: 3, withGate: true })],
  ['case-4-2.jpg', product({ w: 1500, h: 1000, type: 'zhalyuzi', seed: 62 })],
  ['case-4-3.jpg', object({ w: 1500, h: 1000, type: 'zhalyuzi', seed: 63, spans: 4 })],
];

let total = 0;
for (const [name, svg] of jobs) {
  const info = await sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toFile(join(OUT, name));
  total += info.size;
}
console.log(`${jobs.length} файлов, ${(total / 1024).toFixed(0)} КБ всего`);
