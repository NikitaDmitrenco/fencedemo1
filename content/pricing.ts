/**
 * Матрица цен и предварительный расчёт для квиза.
 *
 * Все числа — заменяемые placeholders: у каждого клиента свой прайс, и этот
 * файл правится отдельно от кода. Расчёт — чистая функция, работает на клиенте,
 * без обращения к серверу.
 *
 * Результат всегда диапазон, а не точная сумма: это требование ТЗ (снять страх
 * «по телефону сказали одно, на месте стало вдвое дороже») и одновременно
 * защита компании от обязательства по цене, названной без замера.
 */
//
import type { ProductSlug } from './types';

export type FenceType = ProductSlug | 'komplekt' | 'tolko-vorota';
export type GateType = 'otkatnye' | 'raspashnye' | 'kalitka' | 'net';
export type Height = 1.5 | 1.8 | 2.0 | 2.5;

/** Цена за метр погонный забора при высоте 2.0 м, включая материал и монтаж. */
export const PRICE_PER_METER: Record<Exclude<FenceType, 'tolko-vorota'>, number> = {
  profnastil: 2100,
  evroshtaketnik: 2600,
  'setka-3d': 1450,
  zhalyuzi: 4900,
  'otkatnye-vorota': 2100,
  komplekt: 2800,
};

/** Коэффициент высоты относительно базовых 2.0 м. */
export const HEIGHT_FACTOR: Record<Height, number> = {
  1.5: 0.82,
  1.8: 0.93,
  2.0: 1,
  2.5: 1.22,
};

export const GATE_PRICE: Record<GateType, number> = {
  otkatnye: 89000,
  raspashnye: 52000,
  kalitka: 21000,
  net: 0,
};

export const AUTOMATION_PRICE = 42000;

/** Ширина «вилки» вокруг расчётной суммы: −10 % / +15 %. */
const RANGE_LOW = 0.9;
const RANGE_HIGH = 1.15;

export interface QuizAnswers {
  type: FenceType;
  /** Длина ограждения в метрах погонных. */
  length: number;
  height: Height;
  gates: GateType;
  automation: boolean;
}

export interface PriceRange {
  low: number;
  high: number;
}

/** Округление до тысячи: предварительная оценка не должна выглядеть точной до рубля. */
const roundToThousand = (value: number): number => Math.round(value / 1000) * 1000;

/**
 * Предварительная вилка стоимости проекта.
 *
 * базовая = цена_за_метр[тип] × коэффициент_высоты × длина
 * ворота   = цена_ворот[тип] + (автоматика ? цена_автоматики : 0)
 * диапазон = [итого × 0.9, итого × 1.15]
 */
export function estimatePrice(answers: QuizAnswers): PriceRange {
  const { type, length, height, gates, automation } = answers;

  const fence =
    type === 'tolko-vorota'
      ? 0
      : PRICE_PER_METER[type] * HEIGHT_FACTOR[height] * Math.max(length, 0);

  const gatesTotal = GATE_PRICE[gates] + (automation && gates !== 'net' ? AUTOMATION_PRICE : 0);
  const total = fence + gatesTotal;

  return {
    low: roundToThousand(total * RANGE_LOW),
    high: roundToThousand(total * RANGE_HIGH),
  };
}

/** Формат «от 1 200 000 ₽» с неразрывными пробелами. */
export function formatRub(value: number): string {
  return `${value.toLocaleString('ru-RU').replace(/\s/g, ' ')} ₽`;
}
