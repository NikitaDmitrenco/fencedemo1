/**
 * Генератор изображений-заглушек для демо-сайта.
 *
 * Это осознанно НЕ имитация фотографии: попытка нарисовать «почти фото»
 * читается как дешёвый рисунок и роняет доверие ко всей странице. Здесь —
 * стилизованная архитектурная иллюстрация: точная геометрия, минимум деталей,
 * честный placeholder, который выглядит намеренно и заменяется реальными
 * снимками простой подстановкой файлов с теми же именами.
 *
 * Что изменилось по сравнению с первой версией и почему:
 *
 * · Дневной свет вместо студийного. Сайт живёт на светлом холсте
 *   (--color-canvas), и прежние почти чёрные панели читались на нём как дыры.
 *   Тональность держим в середине: светлое небо сверху, спокойный средний тон
 *   металла, графитовые столбы как самая тёмная точка. Ни чёрного, ни белого.
 *
 * · Сцена, а не текстура. Небо, дальний план, линия горизонта, плоскость
 *   газона и контактная тень под конструкцией. Без них кадр читается как
 *   образец материала, а портфолио из образцов не собирается.
 *
 * · Перспектива с честной точкой схода. Верх и низ забора сходятся на линии
 *   горизонта — это и делает кадр «снятым», а не начерченным. Заодно это даёт
 *   разные планы: общий, ворота, крупный узел.
 *
 * · Просветы настоящие. Евроштакетник, 3D-сетка и жалюзи не закрашивают фон,
 *   а показывают его сквозь себя. Это главное, чем четыре материала
 *   отличаются друг от друга с первого взгляда.
 *
 * Палитра — из app/globals.css. Бронзовый акцент (--color-accent) в кадрах
 * объектов не используется вовсе: металл забора не бронзовый. Он остаётся
 * только в OG-превью, где работает как элемент интерфейса, а не как материал.
 */

/* ─── Палитра ─────────────────────────────────────────────────────────── */

const SKY_TOP = '#bcc6cd';
const SKY_LOW = '#e7e5e0';
const HAZE = '#a7b0af'; // дальний план: воздушная перспектива съедает контраст
const LAWN_FAR = '#a6ab97';
const LAWN_NEAR = '#79806a';
const PAVE = '#b6b3ab';
const STEEL_HI = '#c8ced2';
const STEEL = '#8e979d';
const STEEL_LO = '#606970';
const STEEL_DEEP = '#474f55';
const POST = '#3c4448';
const INK = '#15191b';
const ACCENT = '#8f5433';

/* ─── Мелкая механика ─────────────────────────────────────────────────── */

const lerp = (a, b, t) => a + (b - a) * t;
const nn = (v) => Math.round(v * 10) / 10;
const op = (o) => (o === undefined || o === 1 ? '' : ` opacity="${Math.round(o * 1000) / 1000}"`);

function poly(pts, fill, o) {
  return `<polygon points="${pts.map(([x, y]) => `${nn(x)},${nn(y)}`).join(' ')}" fill="${fill}"${op(o)}/>`;
}

function rect(x, y, w, h, fill, o, rx) {
  if (w <= 0 || h <= 0) return '';
  return `<rect x="${nn(x)}" y="${nn(y)}" width="${nn(w)}" height="${nn(h)}" fill="${fill}"${
    rx ? ` rx="${nn(rx)}"` : ''
  }${op(o)}/>`;
}

function circ(cx, cy, r, fill, o) {
  return `<circle cx="${nn(cx)}" cy="${nn(cy)}" r="${nn(r)}" fill="${fill}"${op(o)}/>`;
}

/** Детерминированный шум: кадры должны отличаться, но пересобираться одинаково. */
function rng(seed) {
  let s = (seed >>> 0) || 7;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/* ─── Геометрия кадра ─────────────────────────────────────────────────── */

/**
 * Проекция линии забора. vx/vy — точка схода на линии горизонта: у настоящей
 * съёмки верх и низ ограждения сходятся в одну точку, и без этого кадр
 * выглядит чертежом. vx = null — строго фронтальный план (кадр ворот).
 */
function shot({ x0, yTop, yBase, vx, vy }) {
  const k = vx === null ? () => 0 : (x) => (x - x0) / (vx - x0);
  return {
    top: (x) => lerp(yTop, vy, k(x)),
    base: (x) => lerp(yBase, vy, k(x)),
    scale: (x) => Math.max(0.16, 1 - k(x)),
  };
}

/** Столбы в перспективе стоят неравномерно: шаг сокращается к дальнему краю. */
function nodes(x0, x1, n, ratio) {
  const wts = [];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const k = Math.pow(ratio, i);
    wts.push(k);
    sum += k;
  }
  const xs = [x0];
  let acc = 0;
  for (let i = 0; i < n; i++) {
    acc += wts[i] / sum;
    xs.push(lerp(x0, x1, acc));
  }
  return xs;
}

/**
 * Полотно пролёта как четырёхугольник: u — доля ширины, v — доля высоты.
 * Все фактуры рисуются в этих координатах, поэтому одинаково работают и на
 * фронтальном кадре, и в перспективе, и на ступенчатом рельефе.
 */
function cellOf(q) {
  return (u0, u1, v0, v1, fill, o) => {
    const p = (u, v) => [
      q.x + q.w * u,
      lerp(lerp(q.tl, q.tr, u), lerp(q.bl, q.br, u), v),
    ];
    return poly([p(u0, v0), p(u1, v0), p(u1, v1), p(u0, v1)], fill, o);
  };
}

const spanH = (q) => (q.bl - q.tl + (q.br - q.tr)) / 2;

/* ─── Фактуры материалов ──────────────────────────────────────────────── */

/**
 * Профнастил: глухое полотно, широкая вертикальная волна. Узнаётся тем, что
 * сквозь него ничего не видно и ритм задаёт пара «гребень на свету — впадина
 * в тени».
 */
function profnastil(q, px) {
  const c = cellOf(q);
  const n = Math.max(3, Math.round(q.w / (54 * px)));
  let out = c(0, 1, 0, 1, 'url(#steel)');
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const d = 1 / n;
    out += c(u + d * 0.05, u + d * 0.36, 0, 1, '#ffffff', 0.17);
    out += c(u + d * 0.54, u + d * 0.86, 0, 1, INK, 0.19);
    out += c(u + d * 0.86, u + d * 0.94, 0, 1, '#ffffff', 0.08);
  }
  // П-планка по верху: тонкая светлая кромка отделяет полотно от неба
  out += c(0, 1, -0.014, 0.014, STEEL_HI, 0.9);
  out += c(0, 1, 0.014, 0.03, INK, 0.18);
  return out;
}

/**
 * Евроштакетник: узкие планки с просветом почти в половину шага. Просвет
 * настоящий — сквозь него видно небо и газон, а в глубине темнеют лаги.
 * Именно это отличает его от профнастила на маленькой карточке.
 */
function evroshtaketnik(q, px) {
  const c = cellOf(q);
  const n = Math.max(5, Math.round(q.w / (44 * px)));
  let out = '';
  out += c(0, 1, 0.19, 0.25, STEEL_DEEP, 0.92);
  out += c(0, 1, 0.71, 0.77, STEEL_DEEP, 0.92);
  for (let i = 0; i < n; i++) {
    const d = 1 / n;
    const u0 = (i + 0.08) * d;
    const u1 = u0 + d * 0.56;
    const p = (u, v) => [
      q.x + q.w * u,
      lerp(lerp(q.tl, q.tr, u), lerp(q.bl, q.br, u), v),
    ];
    const ch = 0.024; // скос верхней кромки: планка не обрублена по прямой
    const cx = (u1 - u0) * 0.3;
    out += poly(
      [p(u0, ch), p(u0 + cx, 0), p(u1 - cx, 0), p(u1, ch), p(u1, 1), p(u0, 1)],
      'url(#steel)',
    );
    out += c(u0, u0 + (u1 - u0) * 0.22, ch, 1, '#ffffff', 0.15);
    out += c(u1 - (u1 - u0) * 0.24, u1, ch, 1, INK, 0.2);
  }
  return out;
}

/**
 * 3D-сетка: тонкий пруток и крупная ячейка — полотно почти прозрачное.
 * Два гиба-ребра жёсткости поперёк панели — то, по чему её и узнают.
 */
function mesh(q, px) {
  const c = cellOf(q);
  const H = spanH(q);
  const wire = 3.6 * px;
  const step = 52 * px;
  const nv = Math.max(4, Math.round(q.w / step));
  const nh = Math.max(4, Math.round(H / step));
  const wu = wire / q.w;
  const wv = wire / H;
  let out = c(0, 1, 0, 1, INK, 0.05); // двор за сеткой чуть глубже в тени
  for (let j = 1; j < nh; j++) {
    const v = j / nh;
    out += c(0, 1, v - wv / 2, v + wv / 2, STEEL_LO, 0.9);
  }
  for (let i = 1; i < nv; i++) {
    const u = i / nv;
    out += c(u - wu / 2, u + wu / 2, 0, 1, STEEL_LO, 0.95);
    out += c(u - wu / 2, u - wu / 6, 0, 1, STEEL_HI, 0.75);
  }
  for (const v of [0.3, 0.63]) {
    out += c(0, 1, v - wv * 2, v - wv * 0.4, STEEL_HI, 0.95);
    out += c(0, 1, v - wv * 0.4, v + wv * 2, STEEL_DEEP, 0.95);
  }
  out += c(0, 1, 0, wv * 1.3, STEEL_LO, 0.9);
  out += c(0, 1, 1 - wv * 1.3, 1, STEEL_LO, 0.9);
  return out;
}

/**
 * Забор-жалюзи: горизонтальные ламели с косым просветом. Направление ритма
 * противоположно первым двум материалам — этого достаточно, чтобы кадр
 * опознавался мгновенно даже в маленькой карточке.
 */
function zhalyuzi(q, px) {
  const c = cellOf(q);
  const H = spanH(q);
  const n = Math.max(7, Math.round(H / (31 * px)));
  let out = c(0, 1, 0, 1, INK, 0.08);
  for (let i = 0; i < n; i++) {
    const v = i / n;
    const d = 1 / n;
    out += c(0, 1, v, v + d * 0.8, 'url(#steel)');
    out += c(0, 1, v, v + d * 0.2, '#ffffff', 0.18);
    out += c(0, 1, v + d * 0.63, v + d * 0.8, INK, 0.27);
  }
  // боковые стойки, в которые заведены торцы ламелей
  out += c(0, 0.04, -0.012, 1, 'url(#post)');
  out += c(0.96, 1, -0.012, 1, 'url(#post)');
  return out;
}

const MATERIALS = { profnastil, evroshtaketnik, mesh, zhalyuzi };
const materialOf = (type) => MATERIALS[type] ?? profnastil;

/* ─── Конструкция ─────────────────────────────────────────────────────── */

/** Контактная тень: без неё конструкция висит в воздухе, а не стоит на земле. */
function contact(q, px) {
  const d = 13 * px;
  return (
    poly(
      [
        [q.x, q.bl],
        [q.x + q.w, q.br],
        [q.x + q.w, q.br + d * 3],
        [q.x, q.bl + d * 3],
      ],
      INK,
      0.09,
    ) +
    poly(
      [
        [q.x, q.bl],
        [q.x + q.w, q.br],
        [q.x + q.w, q.br + d],
        [q.x, q.bl + d],
      ],
      INK,
      0.24,
    )
  );
}

/** Столб с крышкой: крышка — видимый признак аккуратного монтажа. */
function postAt(x, yTop, yBase, w, px) {
  const capH = 5 * px;
  const capW = w * 1.3;
  const lift = 8 * px;
  return (
    rect(x - w / 2, yTop - lift, w, yBase - yTop + lift, 'url(#post)') +
    rect(x - capW / 2, yTop - lift - capH, capW, capH, '#525b60') +
    rect(x - capW / 2, yTop - lift - capH, capW, capH * 0.34, STEEL_HI, 0.55)
  );
}

/**
 * Линия пролётов. step сдвигает каждый следующий пролёт по вертикали —
 * так собирается забор на склоне: ступенями, как его и монтируют.
 */
function run(type, { sh, x0, x1, spans, ratio = 1, step = 0 }, s) {
  const xs = nodes(x0, x1, spans, ratio);
  const draw = materialOf(type);
  let shade = '';
  let panels = '';
  let posts = '';

  for (let i = 0; i < spans; i++) {
    // линия может уходить и вправо, и влево — полотно всегда строим слева направо
    const a = Math.min(xs[i], xs[i + 1]);
    const b = Math.max(xs[i], xs[i + 1]);
    const pa = 26 * s * sh.scale(a);
    const pb = 26 * s * sh.scale(b);
    const off = step * i;
    const q = {
      x: a + pa / 2,
      w: b - pb / 2 - (a + pa / 2),
      tl: sh.top(a) + off,
      tr: sh.top(b) + off,
      bl: sh.base(a) + off,
      br: sh.base(b) + off,
    };
    if (q.w <= 0) continue;
    const px = s * sh.scale((a + b) / 2);
    shade += contact(q, px);
    panels += draw(q, px);
  }

  for (let i = 0; i <= spans; i++) {
    const x = xs[i];
    const hi = step * Math.max(0, i - 1); // столб держит верх более высокого пролёта
    const lo = step * Math.min(i, spans - 1);
    const px = s * sh.scale(x);
    posts += postAt(x, sh.top(x) + hi, sh.base(x) + lo, 26 * s * sh.scale(x), px);
  }

  return shade + panels + posts;
}

/** Бетонная площадка перед въездом: даёт воротам опору и второй план. */
function apron(x, w, yBase, h) {
  return poly(
    [
      [x, yBase],
      [x + w, yBase],
      [x + w + w * 0.18, h],
      [x - w * 0.18, h],
    ],
    PAVE,
    0.9,
  );
}

/**
 * Откатные ворота: полотно в раме, нижняя балка с направляющей, роликовые
 * опоры и столб-улавливатель. Без этих узлов кадр читается как ещё один
 * пролёт забора, а не как ворота.
 */
function slidingGate(type, { x, y, w, h }, s) {
  const draw = materialOf(type);
  const fr = 11 * s;
  const beam = 26 * s;
  const by = y + h;
  const q = {
    x: x + fr,
    w: w - fr * 2,
    tl: y + fr,
    tr: y + fr,
    bl: by - fr,
    br: by - fr,
  };
  let out = '';
  out += rect(x, y, w, h, STEEL_DEEP);
  out += draw(q, s);
  out += rect(x, y, w, fr * 0.45, STEEL_HI, 0.5);
  out += rect(x, y, fr * 0.4, h, STEEL_HI, 0.35);

  // нижняя балка с пазом направляющей
  out += rect(x - w * 0.05, by, w * 1.05, beam, 'url(#post)');
  out += rect(x - w * 0.05, by, w * 1.05, beam * 0.2, STEEL_HI, 0.35);
  out += rect(x - w * 0.05, by + beam * 0.58, w * 1.05, beam * 0.2, INK, 0.38);

  // роликовые опоры под балкой
  for (const t of [0.2, 0.68]) {
    const rx = x + w * t;
    out += rect(rx - 26 * s, by + beam, 52 * s, 13 * s, STEEL_DEEP);
    out += circ(rx, by + beam + 6 * s, 10 * s, INK, 0.55);
    out += circ(rx, by + beam + 6 * s, 3.5 * s, STEEL_HI, 0.6);
  }
  out += rect(x - w * 0.05, by + beam + 13 * s, w * 1.05, 5 * s, INK, 0.2);

  // столб-улавливатель с верхним и нижним уловителями
  const cw = 32 * s;
  const cx = x + w + 14 * s;
  out += rect(cx, y - 26 * s, cw, by + beam - (y - 26 * s), 'url(#post)');
  out += rect(cx - cw * 0.16, y - 32 * s, cw * 1.32, 6 * s, '#525b60');
  out += rect(cx - 20 * s, y + 18 * s, 22 * s, 30 * s, STEEL_LO);
  out += rect(cx - 20 * s, y + 18 * s, 22 * s, 7 * s, STEEL_HI, 0.45);
  out += rect(cx - 22 * s, by - 34 * s, 24 * s, 34 * s, STEEL_LO);
  return out;
}

/**
 * Распашные ворота и калитка: створки на петлях, притвор по центру,
 * нижний шпингалет. Кадр должен объяснять способ открывания.
 */
function swingGate(type, { x, y, w, h, leaves = 2 }, s) {
  const draw = materialOf(type);
  const fr = 11 * s;
  const gap = 5 * s;
  const lw = (w - gap * (leaves - 1)) / leaves;
  let out = '';

  for (let i = 0; i < leaves; i++) {
    const lx = x + i * (lw + gap);
    out += rect(lx, y, lw, h, STEEL_DEEP);
    out += draw(
      { x: lx + fr, w: lw - fr * 2, tl: y + fr, tr: y + fr, bl: y + h - fr, br: y + h - fr },
      s,
    );
    out += rect(lx, y, lw, fr * 0.45, STEEL_HI, 0.5);
    out += rect(lx, y, fr * 0.4, h, STEEL_HI, 0.35);
  }

  // петли навешены на крайние столбы — по три на створку
  for (let i = 0; i < leaves; i++) {
    const near = i === 0;
    const hx = near ? x : x + w;
    for (const t of [0.16, 0.5, 0.84]) {
      const hy = y + h * t;
      out += rect(hx - (near ? 20 * s : 6 * s), hy - 13 * s, 26 * s, 26 * s, STEEL_LO);
      out += rect(hx - (near ? 20 * s : 6 * s), hy - 13 * s, 26 * s, 6 * s, STEEL_HI, 0.4);
      out += circ(hx + (near ? -9 * s : 9 * s), hy, 6.5 * s, INK, 0.5);
    }
  }

  // притвор и шпингалет: центр створок, самый читаемый признак распашных
  if (leaves === 2) {
    const mid = x + lw + gap / 2;
    out += rect(mid - 4 * s, y + h * 0.42, 8 * s, h * 0.16, STEEL_HI, 0.6);
    out += rect(mid - 3 * s, y + h, 6 * s, 34 * s, STEEL_LO);
  }
  return out;
}

/* ─── Сцена ───────────────────────────────────────────────────────────── */

function defs() {
  return `<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${SKY_TOP}"/>
    <stop offset="0.74" stop-color="${SKY_LOW}"/>
    <stop offset="1" stop-color="#f2f0ec"/>
  </linearGradient>
  <linearGradient id="lawn" x1="0" y1="0" x2="0.05" y2="1">
    <stop offset="0" stop-color="${LAWN_FAR}"/>
    <stop offset="1" stop-color="${LAWN_NEAR}"/>
  </linearGradient>
  <linearGradient id="steel" x1="0" y1="0" x2="0.07" y2="1">
    <stop offset="0" stop-color="${STEEL_HI}"/>
    <stop offset="0.44" stop-color="${STEEL}"/>
    <stop offset="1" stop-color="${STEEL_LO}"/>
  </linearGradient>
  <linearGradient id="post" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#5b6468"/>
    <stop offset="0.38" stop-color="${POST}"/>
    <stop offset="1" stop-color="#2e3538"/>
  </linearGradient>
  <radialGradient id="edge" cx="0.5" cy="0.44" r="0.78">
    <stop offset="0.5" stop-color="${INK}" stop-opacity="0"/>
    <stop offset="1" stop-color="${INK}" stop-opacity="0.15"/>
  </radialGradient>
</defs>`;
}

/**
 * Дальний план: полоса зелени и один силуэт дома. Подробностей здесь быть не
 * должно — они нужны только чтобы задать масштаб и глубину.
 */
function skyline(w, hz, s, rnd) {
  let band = '';
  let x = -40 * s;
  while (x < w + 40 * s) {
    const bw = (70 + rnd() * 130) * s;
    const bh = (24 + rnd() * 64) * s;
    band += rect(x, hz - bh, bw, bh, HAZE);
    x += bw * 0.82;
  }
  const hx = w * (0.08 + rnd() * 0.58);
  const hw = 170 * s;
  const hh = 92 * s;
  const house =
    rect(hx, hz - hh, hw, hh, HAZE) +
    poly(
      [
        [hx - 14 * s, hz - hh],
        [hx + hw / 2, hz - hh - 56 * s],
        [hx + hw + 14 * s, hz - hh],
      ],
      HAZE,
    );
  return `<g opacity="0.5">${band}</g><g opacity="0.62">${house}</g>`;
}

/** Общая оболочка кадра: небо, дальний план, горизонт, газон, лёгкий спад к краям. */
function frame(w, h, { seed = 1, hz }, body) {
  const s = h / 900;
  const rnd = rng(seed);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${defs()}
${rect(0, 0, w, hz, 'url(#sky)')}
${skyline(w, hz, s, rnd)}
${rect(0, hz - 30 * s, w, 30 * s, '#ffffff', 0.22)}
${rect(0, hz, w, h - hz, 'url(#lawn)')}
${rect(0, hz, w, 1.6 * s, INK, 0.16)}
${body}
${rect(0, 0, w, h, 'url(#edge)')}
</svg>`;
}

/* ─── Кадры ───────────────────────────────────────────────────────────── */

/**
 * Первый экран. Поверх левой части ложится крупный заголовок и тёмная маска,
 * поэтому слева забор уходит вдаль и кадр там спокойный, а вся выразительная
 * геометрия — ворота и ближние пролёты — собрана справа, где кадр открыт.
 */
export function hero({ w, h, type = 'profnastil', seed = 11 }) {
  const s = h / 900;
  const hz = h * 0.47;
  const xNear = w * 0.58;
  const sh = shot({ x0: xNear, yTop: h * 0.29, yBase: h * 0.84, vx: -w * 1.15, vy: hz });
  const gx = w * 0.6;
  const gw = w * 0.3;
  const gc = gx + gw / 2;
  const gs = s * sh.scale(gc);
  const gy = sh.top(gc) - 14 * gs;
  const gh = sh.base(gc) - gy;

  const body =
    run(type, { sh, x0: xNear, x1: -w * 0.05, spans: 5, ratio: 0.84 }, s) +
    apron(gx - w * 0.04, gw + w * 0.16, sh.base(gc), h) +
    slidingGate(type, { x: gx, y: gy, w: gw, h: gh }, gs) +
    run(type, { sh, x0: gx + gw + 70 * gs, x1: w * 1.06, spans: 1 }, s);

  return frame(w, h, { seed, hz }, body);
}

/**
 * Карточка каталога: два пролёта чуть под углом. Крупнее нельзя — полотно
 * превратится в текстуру и тип ограждения перестанет читаться.
 */
export function product({ w, h, type, seed }) {
  const s = h / 900;
  const hz = h * 0.42;
  const sh = shot({ x0: -w * 0.06, yTop: h * 0.19, yBase: h * 0.9, vx: w * 4.2, vy: hz });
  return frame(w, h, { seed, hz }, run(type, { sh, x0: -w * 0.06, x1: w * 1.06, spans: 2, ratio: 0.88 }, s));
}

/**
 * Кадр ворот: строго фронтально, целиком, с пролётами забора по бокам —
 * так его и снимают, чтобы был виден весь узел въезда.
 */
export function gate({ w, h, type, seed, kind = 'sliding', leaves = 2 }) {
  const s = h / 900;
  const hz = h * 0.44;
  const yTop = h * 0.26;
  const yBase = h * 0.86;
  const sh = shot({ x0: 0, yTop, yBase, vx: null, vy: hz });
  const gw = w * (kind === 'sliding' ? 0.5 : leaves === 1 ? 0.2 : 0.44);
  const gx = w * 0.5 - gw / 2 - (kind === 'sliding' ? w * 0.03 : 0);
  const gy = yTop - 16 * s;
  const gh = yBase - gy;

  const body =
    run(type, { sh, x0: -w * 0.1, x1: gx - 26 * s, spans: 1 }, s) +
    run(type, { sh, x0: gx + gw + 46 * s, x1: w * 1.1, spans: 1 }, s) +
    apron(gx - w * 0.03, gw + w * 0.06, yBase, h) +
    (kind === 'sliding'
      ? slidingGate(type, { x: gx, y: gy, w: gw, h: gh }, s)
      : swingGate(type, { x: gx, y: gy, w: gw, h: gh, leaves }, s));

  return frame(w, h, { seed, hz }, body);
}

/**
 * Общий план объекта. angle меняет сторону, с которой смотрит камера,
 * step собирает забор ступенями на склоне — кадры одного набора не должны
 * быть двенадцатью одинаковыми фронтальными планами.
 */
export function object({ w, h, type, seed, spans = 4, angle = 'right', step = 0, withGate = false }) {
  const s = h / 900;
  const hz = h * 0.45;
  const right = angle === 'right';
  const xNear = right ? -w * 0.08 : w * 1.08;
  const xFar = right ? w * 1.08 : -w * 0.08;
  const vx = right ? w * 2.2 : -w * 1.2;
  const sh = shot({ x0: xNear, yTop: h * 0.24, yBase: h * 0.87, vx, vy: hz });

  let body = run(type, { sh, x0: xNear, x1: xFar, spans, ratio: 0.82, step: step * h }, s);

  if (withGate) {
    const gc = xNear + (xFar - xNear) * 0.14;
    const gs = s * sh.scale(gc);
    const gw = w * 0.3 * sh.scale(gc);
    const gx = gc - gw / 2;
    const gy = sh.top(gc) - 12 * gs;
    const gh = sh.base(gc) - gy;
    body +=
      apron(gx - w * 0.03, gw + w * 0.06, sh.base(gc), h) +
      slidingGate(type, { x: gx, y: gy, w: gw, h: gh }, gs);
  }

  return frame(w, h, { seed, hz }, body);
}

/* ─── Крупные планы узлов ─────────────────────────────────────────────── */

/** Сварной шов: ряд валиков по стыку. Прямое доказательство ручной работы. */
function weld(x0, y0, x1, y1, px) {
  const n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / (7 * px)));
  let out = '';
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out += circ(lerp(x0, x1, t), lerp(y0, y1, t), 5 * px, STEEL_HI, 0.55);
    out += circ(lerp(x0, x1, t), lerp(y0, y1, t) + 1.6 * px, 3.4 * px, INK, 0.2);
  }
  return out;
}

function bolt(cx, cy, r) {
  return (
    circ(cx, cy, r, STEEL_DEEP) +
    circ(cx - r * 0.2, cy - r * 0.2, r * 0.62, STEEL_HI, 0.55) +
    circ(cx, cy, r * 0.3, INK, 0.45)
  );
}

/** Расфокусированный задний план: широкие полосы низкого контраста. */
function softBack(w, h, hz, s, rnd) {
  let out = '';
  let x = -w * 0.1;
  while (x < w * 1.1) {
    const bw = w * (0.06 + rnd() * 0.1);
    out += rect(x, hz - h * 0.3, bw, h * 0.3, STEEL_LO, 0.1 + rnd() * 0.08);
    x += bw * 1.5;
  }
  return out;
}

/**
 * Крупный план монтажного узла. Такие кадры — прямое доказательство качества
 * работы, и в портфолио их не хватает сильнее всего: общий план показывает
 * результат, а узел показывает, как он сделан.
 *
 * Фон здесь намеренно мягкий и бесструктурный, а сам узел — единственная
 * резкая геометрия в кадре. Это и создаёт ощущение съёмки с малой глубиной
 * резкости, без попытки нарисовать фотографию.
 */
export function detail({ w, h, kind, type = 'profnastil', seed = 1 }) {
  const s = h / 900;
  const rnd = rng(seed + 99);
  const draw = materialOf(type);

  if (kind === 'roller') {
    // Ролики и направляющая откатных ворот — узел, который определяет,
    // будут ли ворота ходить через пять лет.
    const hz = h * 0.26;
    const beamY = h * 0.34;
    const beamH = h * 0.13;
    const body =
      softBack(w, h, hz, s, rnd) +
      apron(-w * 0.2, w * 1.4, h * 0.6, h) +
      draw({ x: -w * 0.05, w: w * 1.1, tl: -h * 0.3, tr: -h * 0.3, bl: beamY, br: beamY }, s * 2.1) +
      rect(-w * 0.05, beamY, w * 1.1, beamH, 'url(#post)') +
      rect(-w * 0.05, beamY, w * 1.1, beamH * 0.16, STEEL_HI, 0.4) +
      rect(-w * 0.05, beamY + beamH * 0.62, w * 1.1, beamH * 0.22, INK, 0.4) +
      rect(w * 0.16, h * 0.6, w * 0.54, h * 0.1, INK, 0.16) +
      rect(w * 0.18, h * 0.58, w * 0.5, h * 0.09, PAVE) +
      rect(w * 0.18, h * 0.58, w * 0.5, h * 0.012, STEEL_HI, 0.4) +
      rect(w * 0.24, beamY + beamH, w * 0.38, h * 0.07, STEEL_DEEP) +
      rect(w * 0.24, beamY + beamH, w * 0.38, h * 0.012, STEEL_HI, 0.5);
    let node = '';
    for (const t of [0.31, 0.55]) {
      node += circ(w * t, beamY + beamH + h * 0.07, h * 0.055, POST);
      node += circ(w * t, beamY + beamH + h * 0.07, h * 0.055, STEEL_HI, 0.18);
      node += circ(w * t, beamY + beamH + h * 0.07, h * 0.02, STEEL_HI, 0.5);
    }
    node += bolt(w * 0.22, h * 0.62, h * 0.016) + bolt(w * 0.64, h * 0.62, h * 0.016);
    node += weld(w * 0.24, beamY + beamH, w * 0.62, beamY + beamH, s * 1.4);
    return frame(w, h, { seed, hz }, body + node);
  }

  if (kind === 'hinge') {
    // Петля распашных ворот: столб, кромка створки, шов по месту приварки.
    const hz = h * 0.4;
    const px = s * 2.2;
    const post = { x: w * 0.12, w: w * 0.2 };
    const leaf = w * 0.5;
    let body =
      softBack(w, h, hz, s, rnd) +
      draw({ x: leaf, w: w * 0.62, tl: -h * 0.1, tr: -h * 0.1, bl: h * 1.1, br: h * 1.1 }, px) +
      rect(leaf, -h * 0.1, w * 0.07, h * 1.2, STEEL_DEEP) +
      rect(leaf, -h * 0.1, w * 0.014, h * 1.2, STEEL_HI, 0.4) +
      rect(post.x, -h * 0.1, post.w, h * 1.2, 'url(#post)') +
      rect(post.x - w * 0.02, -h * 0.1, post.w + w * 0.04, h * 0.05, '#525b60');
    for (const t of [0.3, 0.76]) {
      const hy = h * t;
      body += rect(post.x + post.w * 0.72, hy - h * 0.06, w * 0.13, h * 0.12, STEEL_LO);
      body += rect(post.x + post.w * 0.72, hy - h * 0.06, w * 0.13, h * 0.02, STEEL_HI, 0.45);
      body += rect(leaf - w * 0.1, hy - h * 0.1, w * 0.12, h * 0.1, STEEL_LO);
      body += rect(leaf - w * 0.1, hy - h * 0.1, w * 0.12, h * 0.016, STEEL_HI, 0.45);
      body += rect(w * 0.355, hy - h * 0.11, w * 0.028, h * 0.19, POST);
      body += circ(w * 0.369, hy - h * 0.11, w * 0.014, STEEL_HI, 0.5);
      body += weld(post.x + post.w * 0.72, hy - h * 0.06, post.x + post.w * 0.72, hy + h * 0.06, px);
    }
    return frame(w, h, { seed, hz }, body);
  }

  if (kind === 'clip') {
    // Скоба крепления 3D-сетки к столбу: пруток, прижимная пластина, крышка.
    const hz = h * 0.58;
    const px = s * 1.9;
    const cx = w * 0.46;
    const pw = w * 0.13;
    const q = { x: -w * 0.05, w: w * 1.1, tl: h * 0.08, tr: h * 0.08, bl: h * 1.05, br: h * 1.05 };
    let body = softBack(w, h, hz, s, rnd) + mesh(q, px);
    body += rect(cx - pw / 2, h * 0.04, pw, h, 'url(#post)');
    body += rect(cx - pw * 0.66, h * 0.015, pw * 1.32, h * 0.028, '#525b60');
    body += rect(cx - pw * 0.66, h * 0.015, pw * 1.32, h * 0.01, STEEL_HI, 0.55);
    for (const t of [0.3, 0.72]) {
      const y = h * t;
      body += rect(cx - pw * 0.78, y, pw * 1.56, h * 0.062, STEEL_LO);
      body += rect(cx - pw * 0.78, y, pw * 1.56, h * 0.012, STEEL_HI, 0.5);
      body += bolt(cx - pw * 0.56, y + h * 0.031, h * 0.015);
      body += bolt(cx + pw * 0.56, y + h * 0.031, h * 0.015);
    }
    return frame(w, h, { seed, hz }, body);
  }

  // 'lamella-end' — торцы ламелей жалюзи, заведённые в стойку.
  const hz = h * 0.52;
  const px = s * 2.4;
  const stile = w * 0.14;
  const q = { x: stile, w: w * 1.02 - stile, tl: -h * 0.06, tr: -h * 0.06, bl: h * 1.06, br: h * 1.06 };
  let body = softBack(w, h, hz, s, rnd) + zhalyuzi(q, px);
  body += rect(stile - w * 0.12, -h * 0.06, w * 0.14, h * 1.12, 'url(#post)');
  body += rect(stile - w * 0.12, -h * 0.06, w * 0.022, h * 1.12, STEEL_HI, 0.35);
  body += rect(stile - w * 0.022, -h * 0.06, w * 0.022, h * 1.12, INK, 0.3);
  const H = spanH(q);
  const n = Math.max(7, Math.round(H / (31 * px)));
  for (let i = 0; i < n; i++) {
    const y = q.tl + (H * (i + 0.4)) / n;
    body += bolt(stile - w * 0.06, y, h * 0.013);
  }
  return frame(w, h, { seed, hz }, body);
}

/* ─── OG-превью ───────────────────────────────────────────────────────── */

/**
 * Превью для мессенджеров и соцсетей (Open Graph).
 *
 * Для этого демо картинка важнее обычного: ссылку отправляют владельцам
 * компаний в WhatsApp и Telegram, и превью — первое, что они видят,
 * ещё до открытия сайта.
 *
 * Здесь кадр остаётся тёмным намеренно: лента мессенджера светлая, и светлое
 * превью в ней теряется. Но типографика и геометрия те же, что на сайте:
 * Manrope, радиус 3px, бронзовый акцент вместо прежнего золотого, никаких
 * скруглённых «кнопок» со случайным радиусом.
 *
 * Текст здесь общий для всех клиентов (оффер, а не название компании),
 * поэтому перегенерировать картинку под каждого не нужно.
 */
export function ogImage({ w = 1200, h = 630, type = 'profnastil' } = {}) {
  const s = h / 900;
  const hz = h * 0.44;
  const sh = shot({ x0: w * 1.06, yTop: h * 0.1, yBase: h * 1.04, vx: w * 0.2, vy: hz });
  const fence = run(type, { sh, x0: w * 1.06, x1: w * 0.42, spans: 3, ratio: 0.8 }, s);
  const m = w * 0.067;
  const font = 'Manrope, DejaVu Sans, sans-serif';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${defs()}
${rect(0, 0, w, h, '#0f1315')}
<g opacity="0.5">${fence}</g>
${rect(0, 0, w, h, '#0f1315', 0.34)}
${rect(0, 0, w * 0.64, h, '#0f1315', 0.86)}

${rect(m, h * 0.232, 56, 4, ACCENT)}

<text x="${m}" y="${h * 0.413}" font-family="${font}" font-size="64" font-weight="700" fill="#ffffff" letter-spacing="-1.6">Заборы и ворота</text>
<text x="${m}" y="${h * 0.53}" font-family="${font}" font-size="64" font-weight="700" fill="#ffffff" letter-spacing="-1.6">под ключ</text>
<text x="${m}" y="${h * 0.629}" font-family="${font}" font-size="25" font-weight="500" fill="#ffffff" opacity="0.62">Изготовление · доставка · монтаж</text>

${rect(m, h * 0.705, 330, 58, ACCENT, 1, 3)}
<text x="${m + 165}" y="${h * 0.763}" text-anchor="middle" font-family="${font}" font-size="22" font-weight="700" fill="#ffffff">Рассчитать стоимость</text>
</svg>`;
}
