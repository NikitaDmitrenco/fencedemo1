/**
 * Подготовка фотографий под сайт.
 *
 * Берёт исходники как есть — с телефона, из почты, любого размера и формата —
 * и приводит к тому, что ждёт код: нужное имя, пропорция, размер, sRGB, JPEG.
 *
 *   node tools/photos.mjs                 # обработать по tools/photos.map.json
 *   node tools/photos.mjs --list          # что лежит в исходниках и каких размеров
 *
 * Раскладку по слотам задаёт tools/photos.map.json — он заполняется после
 * просмотра снимков, потому что решение «этот кадр в первый экран, а этот
 * в каталог» принимается глазами, а не скриптом.
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'photos-raw');
const OUT = join(ROOT, 'public/media/demo');
const MAP = join(ROOT, 'tools/photos.map.json');

/** Целевой размер выводится из имени файла — так его негде перепутать. */
function targetFor(name) {
  if (name === 'hero.jpg') return { width: 2400, height: 1350 };
  if (name.startsWith('product-')) return { width: 1200, height: 900 };
  if (name.startsWith('case-')) return { width: 1500, height: 1000 };
  return null;
}

/**
 * Куда смотреть при обрезке.
 *
 * 'attention' — sharp сам ищет самую заметную область. Работает хорошо на
 * кадрах с явным объектом и плохо на ровных пейзажах, поэтому для первого
 * экрана обычно задаётся вручную: там важно оставить место под заголовок.
 */
function positionFor(focus) {
  switch (focus) {
    case 'attention':
      return sharp.strategy.attention;
    case 'entropy':
      return sharp.strategy.entropy;
    case 'top':
      return sharp.gravity.north;
    case 'bottom':
      return sharp.gravity.south;
    case 'left':
      return sharp.gravity.west;
    case 'right':
      return sharp.gravity.east;
    default:
      return sharp.gravity.center;
  }
}

async function list() {
  if (!existsSync(SRC)) {
    console.log(`Папки ${SRC} нет. Создайте её и положите туда исходники.`);
    return;
  }

  const files = readdirSync(SRC).filter((f) => !f.startsWith('.'));
  if (files.length === 0) {
    console.log('Папка photos-raw пуста.');
    return;
  }

  console.log(`Исходников: ${files.length}\n`);
  for (const file of files) {
    try {
      const meta = await sharp(join(SRC, file)).metadata();
      const orientation = meta.width >= meta.height ? 'гориз.' : 'ВЕРТИК.';
      console.log(
        `${file.padEnd(34)} ${String(meta.width).padStart(5)}×${String(meta.height).padEnd(5)} ${meta.format.padEnd(5)} ${orientation}`,
      );
    } catch (error) {
      console.log(`${file.padEnd(34)} не читается: ${error.message.slice(0, 50)}`);
    }
  }
}

async function build() {
  if (!existsSync(MAP)) {
    console.log(`Нет ${MAP}. Сначала разложите снимки по слотам.`);
    return;
  }

  const map = JSON.parse(readFileSync(MAP, 'utf8'));
  mkdirSync(OUT, { recursive: true });

  let done = 0;
  const warnings = [];

  for (const [name, spec] of Object.entries(map)) {
    const target = targetFor(name);
    if (!target) {
      warnings.push(`${name}: неизвестный слот, пропущен`);
      continue;
    }

    const from = typeof spec === 'string' ? spec : spec.from;
    const src = join(SRC, from);

    if (!existsSync(src)) {
      warnings.push(`${name}: не найден исходник ${from}`);
      continue;
    }

    const meta = await sharp(src).metadata();

    // Апскейл из мелкого исходника выглядит мылом. Не отказываем, но говорим.
    if (meta.width < target.width) {
      warnings.push(
        `${name}: исходник ${meta.width} px уже нужных ${target.width} px — будет мягче, чем хотелось бы`,
      );
    }

    await sharp(src)
      // Телефоны пишут поворот в EXIF, а не в пиксели: без этого часть
      // снимков легла бы на сайт боком.
      .rotate()
      .resize({
        width: target.width,
        height: target.height,
        fit: 'cover',
        position: positionFor(typeof spec === 'string' ? 'attention' : spec.focus),
        withoutEnlargement: false,
      })
      // Браузеры считают цвета в sRGB; снимок в AdobeRGB без конвертации
      // выцветает.
      .toColorspace('srgb')
      .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(join(OUT, name));

    const outMeta = await sharp(join(OUT, name)).metadata();
    console.log(
      `${name.padEnd(28)} ← ${from.padEnd(28)} ${outMeta.width}×${outMeta.height}`,
    );
    done++;
  }

  console.log(`\nГотово: ${done} файлов.`);
  if (warnings.length) {
    console.log('\nОбратить внимание:');
    warnings.forEach((w) => console.log('  • ' + w));
  }
}

if (process.argv.includes('--list')) {
  await list();
} else {
  await build();
}
