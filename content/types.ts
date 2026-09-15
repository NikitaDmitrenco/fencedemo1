/**
 * Типы контентной модели демо-сайта.
 *
 * Здесь же на уровне типов зафиксированы три требования ТЗ, которые нельзя
 * оставлять на дисциплину разработчика:
 *
 *  1. Недоказанная цифра обязана быть `[X]` — см. `Fact`.
 *  2. Отзыв не существует без ссылки на оригинал — см. `Review.url`.
 *  3. Обещания («фиксируем смету договором») включаются флагом, а не текстом,
 *     чтобы не обещать за клиента то, чего он не делает — см. `Trust`.
 */

/**
 * Проверяемый факт о компании: либо реальное значение, либо честный плейсхолдер.
 *
 * В демо-версии все такие поля равны '[X]'. Подставить сюда «15 лет на рынке»,
 * не имея подтверждения, — осознанное действие, а не случайность.
 */
export type Fact = number | '[X]';

/** Цена в рублях. `null` — «цена не публикуется», карточка отрисуется без строки «от». */
export type PriceRub = number | null;

export type ProductSlug =
  'profnastil' | 'evroshtaketnik' | 'setka-3d' | 'zhalyuzi' | 'otkatnye-vorota';

export interface Company {
  /** Коммерческое название, выводится в шапке и футере. */
  name: string;
  /** Юридическое лицо для реквизитов: «ИП Иванов И. И.» / «ООО "Название"». */
  legalName: string;
  inn: string;
  /** В формате +7XXXXXXXXXX — из него собираются tel:, wa.me и отображаемый вид. */
  phone: string;
  whatsapp?: string;
  telegram?: string;
  address: string;
  /** География работ: «город и область в радиусе 100 км». Демо не привязано к региону. */
  geo: string;
  workHours: string;
}

export interface Brand {
  /** Единственный акцентный цвет сайта. Меняется под фирменный стиль клиента одной строкой. */
  accent: string;
  logo: string | null;
  /** Папка с фотографиями клиента в /public/media. */
  photoDir: string;
}

export interface Proof {
  icon: 'shield' | 'factory' | 'wrench' | 'document';
  title: string;
  note: string;
}

export interface Hero {
  title: string;
  subtitle: string;
  /** 3–4 конкретных доказательства под кнопками: гарантия, производство, монтаж, договор. */
  proofs: Proof[];
  image: string;
  imageAlt: string;
}

export interface Product {
  slug: ProductSlug;
  title: string;
  /** Одна строка пользы. Не техсправочник — карточка продаёт выбор. */
  benefit: string;
  priceFrom: PriceRub;
  priceUnit: 'м.п.' | 'шт.';
  image: string;
}

export interface ProjectCase {
  title: string;
  type: string;
  /** Метры погонные. */
  length: number;
  /** Метры. */
  height: number;
  gates: string;
  /** Срок выполнения: «6 дней». */
  term: string;
  /** Стоимость проекта в рублях. Именно она превращает галерею в доказательство. */
  price: number;
  district: string;
  /** 3–5 фотографий объекта. */
  photos: string[];
}

export interface EstimateItem {
  item: string;
  note: string;
}

export interface DurabilityFactor {
  title: string;
  /** Как делают, когда экономят. */
  cheap: string;
  /** Что это значит через несколько лет. */
  consequence: string;
  /** Как это делается правильно. */
  right: string;
}

export interface ProcessStep {
  title: string;
  text: string;
  /** Сколько занимает этап — снимает неопределённость процесса. */
  duration: string;
}

export interface Owner {
  name: string;
  role: string;
  photo: string | null;
  /** 2–3 предложения от первого лица. Живое фото и позиция отличают сайт от шаблона. */
  quote: string;
}

export interface Trust {
  years: Fact;
  objects: Fact;
  crews: Fact;
  warrantyYears: Fact;
  /** Есть ли собственное производство. Блок не рендерится, если false. */
  production: boolean;
  /** Фиксируется ли смета договором. Если false — не обещаем этого на сайте. */
  contract: boolean;
  owner: Owner | null;
}

export interface Review {
  author: string;
  source: 'yandex' | '2gis';
  text: string;
  /**
   * Ссылка на оригинал отзыва. Обязательна: отзыв без проверяемого источника
   * на этом сайте не публикуется.
   */
  url: string;
  /** ISO-дата: '2026-04-18'. */
  date: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Legal {
  privacyUrl: string;
  consentUrl: string;
  requisites: string;
}

export interface SiteConfig {
  /** true — демо-режим: показываются пометки о заменяемых данных. */
  isDemo: boolean;
  company: Company;
  brand: Brand;
  hero: Hero;
  products: Product[];
  cases: ProjectCase[];
  estimate: EstimateItem[];
  durability: DurabilityFactor[];
  process: ProcessStep[];
  trust: Trust;
  reviews: Review[];
  faq: FaqItem[];
  legal: Legal;
}
