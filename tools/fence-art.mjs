/**
 * Генератор изображений-заглушек.
 *
 * Не имитация фотографии: попытка нарисовать «почти фото» читается как
 * дешёвый рисунок и роняет доверие ко всей странице. Вместо этого —
 * оформленные графитовые панели с фактурой конкретного материала: честный
 * placeholder, который выглядит намеренно и подчёркивает, чего не хватает.
 *
 * Заменяются реальными снимками подстановкой файлов с теми же именами.
 */

const BG_TOP = '#232B31';
const BG_BOTTOM = '#10151A';
const METAL_L = '#9AA4AB';
const METAL_M = '#6E787F';
const METAL_D = '#424B52';
const POST = '#2C343A';
const ACCENT = '#E0A33C';

function defs(seed) {
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${BG_TOP}"/>
      <stop offset="1" stop-color="${BG_BOTTOM}"/>
    </linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="0.15" y2="1">
      <stop offset="0" stop-color="${METAL_L}"/>
      <stop offset="0.5" stop-color="${METAL_M}"/>
      <stop offset="1" stop-color="${METAL_D}"/>
    </linearGradient>
    <radialGradient id="keylight" cx="0.74" cy="0.16" r="0.72">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.2"/>
      <stop offset="0.55" stop-color="${ACCENT}" stop-opacity="0.05"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="falloff" x1="0" y1="0" x2="1" y2="0.55">
      <stop offset="0" stop-color="#0B0F12" stop-opacity="0.62"/>
      <stop offset="0.5" stop-color="#0B0F12" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#0B0F12" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0B0F12" stop-opacity="0"/>
      <stop offset="1" stop-color="#0B0F12" stop-opacity="0.85"/>
    </linearGradient>
    <clipPath id="frame-${seed}"><rect x="0" y="0" width="100%" height="100%"/></clipPath>
  </defs>`;
}

/* ─── Фактуры материалов ──────────────────────────────────────────────── */

/** Профнастил: вертикальная волна, читается чередованием света и тени. */
function profnastil(x, y, w, h, s) {
  const wave = 44 * s;
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#metal)"/>`;
  for (let i = 0; i * wave < w; i++) {
    const px = x + i * wave;
    out += `<rect x="${px}" y="${y}" width="${wave * 0.4}" height="${h}" fill="#FFFFFF" opacity="0.1"/>`;
    out += `<rect x="${px + wave * 0.58}" y="${y}" width="${wave * 0.34}" height="${h}" fill="#000000" opacity="0.18"/>`;
  }
  return out;
}

/** Евроштакетник: планки с равным просветом. */
function evroshtaketnik(x, y, w, h, s) {
  const pitch = 62 * s;
  const slat = 40 * s;
  let out = '';
  for (let px = x; px < x + w; px += pitch) {
    const bw = Math.min(slat, x + w - px);
    out += `<rect x="${px}" y="${y}" width="${bw}" height="${h}" rx="${3 * s}" fill="url(#metal)"/>`;
    out += `<rect x="${px}" y="${y}" width="${bw * 0.26}" height="${h}" rx="${3 * s}" fill="#FFFFFF" opacity="0.13"/>`;
    out += `<rect x="${px + bw * 0.76}" y="${y}" width="${bw * 0.24}" height="${h}" fill="#000000" opacity="0.2"/>`;
  }
  return out;
}

/** 3D-сетка: прутки и рёбра жёсткости. */
function mesh(x, y, w, h, s) {
  let out = '';
  for (let px = x + 6 * s; px < x + w; px += 34 * s) {
    out += `<rect x="${px}" y="${y}" width="${4.5 * s}" height="${h}" fill="${METAL_M}" opacity="0.9"/>`;
    out += `<rect x="${px}" y="${y}" width="${1.6 * s}" height="${h}" fill="${METAL_L}" opacity="0.7"/>`;
  }
  for (let py = y + 10 * s; py < y + h; py += 38 * s) {
    out += `<rect x="${x}" y="${py}" width="${w}" height="${4 * s}" fill="${METAL_D}" opacity="0.95"/>`;
  }
  for (const f of [0.28, 0.6]) {
    out += `<rect x="${x}" y="${y + h * f}" width="${w}" height="${9 * s}" fill="${METAL_M}" opacity="0.9"/>`;
    out += `<rect x="${x}" y="${y + h * f}" width="${w}" height="${2.5 * s}" fill="${METAL_L}" opacity="0.5"/>`;
  }
  return out;
}

/** Забор-жалюзи: горизонтальные ламели с просветом между ними. */
function zhalyuzi(x, y, w, h, s) {
  const pitch = 34 * s;
  let out = '';
  for (let py = y; py < y + h; py += pitch) {
    const bh = Math.min(pitch * 0.66, y + h - py);
    out += `<rect x="${x}" y="${py}" width="${w}" height="${bh}" rx="${bh * 0.28}" fill="url(#metal)"/>`;
    out += `<rect x="${x}" y="${py}" width="${w}" height="${bh * 0.22}" fill="#FFFFFF" opacity="0.16"/>`;
    out += `<rect x="${x}" y="${py + bh * 0.72}" width="${w}" height="${bh * 0.28}" fill="#000000" opacity="0.22"/>`;
  }
  return out;
}

const MATERIALS = { profnastil, evroshtaketnik, mesh, zhalyuzi };

/* ─── Компоновка ──────────────────────────────────────────────────────── */

/**
 * Панель материала с опорными столбами. Полотно слегка не доходит до краёв —
 * так видно, что это конструкция из пролётов, а не бесконечная текстура.
 */
function run(type, x, y, w, h, s, spans) {
  const material = MATERIALS[type] ?? profnastil;
  const postW = 22 * s;
  const span = w / spans;
  let out = '';

  for (let i = 0; i < spans; i++) {
    const px = x + i * span;
    out += material(px + postW / 2, y, span - postW, h, s);
  }
  for (let i = 0; i <= spans; i++) {
    const px = x + i * span - postW / 2;
    out += `<rect x="${px}" y="${y - 10 * s}" width="${postW}" height="${h + 10 * s}" fill="${POST}"/>`;
    out += `<rect x="${px}" y="${y - 10 * s}" width="${postW * 0.3}" height="${h + 10 * s}" fill="#FFFFFF" opacity="0.1"/>`;
  }
  return out;
}

/** Откатные ворота: полотно на направляющей с роликами. */
function gate(type, x, y, w, h, s) {
  const material = MATERIALS[type] ?? profnastil;
  return `
  <g>
    ${material(x, y, w, h, s)}
    <rect x="${x - 12 * s}" y="${y - 14 * s}" width="${w + 24 * s}" height="${12 * s}" fill="${POST}"/>
    <rect x="${x - 12 * s}" y="${y + h - 14 * s}" width="${w + 24 * s}" height="${13 * s}" fill="${METAL_D}"/>
    <rect x="${x - 12 * s}" y="${y + h - 14 * s}" width="${w + 24 * s}" height="${3 * s}" fill="${METAL_L}" opacity="0.35"/>
    <circle cx="${x + w * 0.22}" cy="${y + h + 4 * s}" r="${9 * s}" fill="${POST}"/>
    <circle cx="${x + w * 0.74}" cy="${y + h + 4 * s}" r="${9 * s}" fill="${POST}"/>
    <rect x="${x - 14 * s}" y="${y - 20 * s}" width="${6 * s}" height="${h + 26 * s}" fill="${ACCENT}" opacity="0.55"/>
  </g>`;
}

function shell(w, h, seed, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${defs(seed)}
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${body}
  <rect width="${w}" height="${h}" fill="url(#keylight)"/>
  <rect width="${w}" height="${h}" fill="url(#falloff)"/>
  <rect x="0" y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="url(#floor)"/>
</svg>`;
}

/** Широкий кадр для первого экрана. */
export function hero({ w, h, type, seed, withGate = true }) {
  const s = h / 900;
  const y = h * 0.2;
  const fh = h * 0.66;
  let body = run(type, -w * 0.02, y, w * 1.04, fh, s, 5);
  if (withGate) body += gate(type, w * 0.05, y - h * 0.03, w * 0.3, fh + h * 0.03, s);
  return shell(w, h, seed, body);
}

/** Карточка каталога: крупный план полотна. */
export function product({ w, h, type, seed }) {
  const s = h / 900;
  return shell(w, h, seed, run(type, -w * 0.04, h * 0.12, w * 1.08, h * 0.76, s, 2));
}

/** Карточка каталога для ворот. */
export function gateProduct({ w, h, type, seed }) {
  const s = h / 900;
  const y = h * 0.16;
  const fh = h * 0.68;
  return shell(
    w,
    h,
    seed,
    run(type, -w * 0.04, y, w * 1.08, fh, s, 3) + gate(type, w * 0.16, y - h * 0.02, w * 0.62, fh + h * 0.02, s),
  );
}

/** Кадр объекта: общий план пролётов. */
export function object({ w, h, type, seed, spans = 4, withGate = false }) {
  const s = h / 900;
  const y = h * 0.18;
  const fh = h * 0.68;
  let body = run(type, -w * 0.03, y, w * 1.06, fh, s, spans);
  if (withGate) body += gate(type, w * 0.08, y - h * 0.02, w * 0.36, fh + h * 0.02, s);
  return shell(w, h, seed, body);
}
