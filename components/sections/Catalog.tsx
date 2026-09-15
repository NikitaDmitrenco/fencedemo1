import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { site } from '@/content/site.config';
import { Card, Reveal, Section } from '@/components/ui';
import { ArrowRight } from '@/components/ui/Icon';
import { formatRub } from '@/content/pricing';

/**
 * Блок 3. Показать ассортимент и ценовые ориентиры.
 *
 * Карточка продаёт выбор, а не является техсправочником: одна строка пользы,
 * цена «от» и переход к расчёту.
 *
 * Тип решения передаётся параметром запроса, а не в самом якоре: `#calc?type=x`
 * сделал бы фрагментом строку «calc?type=x», и переход к блоку расчёта просто
 * не сработал бы. Квиз читает параметр на Э3 и открывается с уже выбранным
 * материалом, чтобы посетитель не отвечал на один вопрос дважды.
 */
export function Catalog() {
  return (
    <Section
      id="catalog"
      eyebrow="Решения"
      title="Что мы ставим"
      lead="Цены указаны за метр погонный с материалом и монтажом. Точная стоимость зависит от высоты, рельефа участка и типа ворот."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {site.products.map((product, i) => (
          <Reveal key={product.slug} delay={i * 60} className="h-full">
            <Card as="li" interactive className="flex h-full list-none flex-col overflow-hidden">
              <Link href={`/?type=${product.slug}#calc` as Route} className="flex h-full flex-col">
                <div className="relative aspect-4/3 w-full bg-[var(--color-ink)]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold">{product.title}</h3>

                  <p className="mt-2 flex-1 text-[0.9375rem] text-[var(--color-ink-soft)]">
                    {product.benefit}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--color-steel-line)] pt-4">
                    {product.priceFrom !== null ? (
                      <span className="font-bold">
                        от {formatRub(product.priceFrom)}
                        <span className="font-medium text-[var(--color-ink-muted)]">
                          {' / '}
                          {product.priceUnit}
                        </span>
                      </span>
                    ) : (
                      <span className="font-semibold text-[var(--color-ink-muted)]">
                        цена по расчёту
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink)]">
                      Рассчитать
                      <ArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
