/**
 * Шаги квиза и подписи к вариантам ответа.
 *
 * Лежит рядом с контентом, а не в компоненте, потому что подписи нужны в двух
 * местах: в интерфейсе квиза и в тексте заявки, которая уходит владельцу.
 * Один источник — иначе в Telegram однажды прилетит «type: setka-3d».
 */

import type { FenceType, GateType, Height } from './pricing';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const assetPath = (path: string): string =>
  isGitHubPages ? `/fencedemo1${path}` : path;

export interface Option<T> {
  value: T;
  label: string;
  note?: string;
  image?: string;
}

export const FENCE_TYPES: Option<FenceType>[] = [
  {
    value: 'profnastil',
    label: 'Профнастил',
    note: 'глухой, закрывает участок',
    image: assetPath('/media/demo/product-profnastil.jpg'),
  },
  {
    value: 'evroshtaketnik',
    label: 'Евроштакетник',
    note: 'с просветом, светлее',
    image: assetPath('/media/demo/product-evroshtaketnik.jpg'),
  },
  {
    value: 'setka-3d',
    label: '3D-сетка',
    note: 'бюджетное решение',
    image: assetPath('/media/demo/product-setka.jpg'),
  },
  {
    value: 'zhalyuzi',
    label: 'Забор-жалюзи',
    note: 'современный вид',
    image: assetPath('/media/demo/product-zhalyuzi.jpg'),
  },
  {
    value: 'komplekt',
    label: 'Ещё не выбрал',
    note: 'подскажем на замере',
  },
  {
    value: 'tolko-vorota',
    label: 'Только ворота',
    note: 'забор уже есть',
    image: assetPath('/media/demo/product-vorota.jpg'),
  },
];

export const LENGTH_PRESETS = [20, 30, 50, 80] as const;

export const HEIGHTS: Option<Height>[] = [
  { value: 1.5, label: '1,5 м', note: 'дача, разделение участков' },
  { value: 1.8, label: '1,8 м', note: 'чаще всего выбирают' },
  { value: 2.0, label: '2,0 м', note: 'полная приватность' },
  { value: 2.5, label: '2,5 м', note: 'максимальная высота' },
];

export const GATES: Option<GateType>[] = [
  { value: 'otkatnye', label: 'Откатные', note: 'не занимают место на въезде' },
  { value: 'raspashnye', label: 'Распашные', note: 'дешевле откатных' },
  { value: 'kalitka', label: 'Только калитка', note: 'въезд не нужен' },
  { value: 'net', label: 'Не нужны', note: 'ворота уже стоят' },
];

export const MESSENGERS = [
  { value: 'call', label: 'Позвонить' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
] as const;

export type Messenger = (typeof MESSENGERS)[number]['value'];

/** Подпись по значению — для текста заявки. */
export function labelOf<T>(options: readonly Option<T>[], value: T): string {
  return options.find((o) => o.value === value)?.label ?? String(value);
}

export function messengerLabel(value: Messenger): string {
  return MESSENGERS.find((m) => m.value === value)?.label ?? value;
}