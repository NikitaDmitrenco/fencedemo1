/**
 * Ограничение частоты заявок с одного адреса.
 *
 * Счётчик живёт в памяти процесса. На serverless это значит, что при
 * нескольких экземплярах лимит считается для каждого отдельно — то есть это
 * заслон от примитивного перебора, а не полноценная защита. Для демо-сайта с
 * одной формой этого достаточно; при потоке спама лимит выносится в Vercel KV.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_IN_WINDOW = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_IN_WINDOW) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  // Карта не должна расти бесконечно в долгоживущем процессе.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(k);
    }
  }

  return false;
}
