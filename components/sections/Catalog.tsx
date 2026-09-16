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
 * Сетка ровная: все пять решений — равноправные варианты одной системы, и
 * выделять одно из них размером значило бы подсказывать выбор без причины.
 * Различает материал фотография, поэтому у всех карточек она одинаково
 * крупная и в одной пропорции.
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
      tone="sunken"
      eyebrow="Решения"
      title="Что мы ставим"
      lead="Цены указаны за метр погонный с материалом и монтажом. Точная стоимость зависит от высоты, рельефа участка и типа ворот."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {site.products.map((product, i) => (
          <Reveal key={product.slug} as="li" delay={i * 60} className="h-full">
            <Card interactive className="group flex h-full flex-col overflow-hidden">
              <Link href={`/?type=${product.slug}#calc` as Route} className="flex h-full flex-col">
                <div className="relative aspect-4/3 w-full bg-[var(--color-ink-raised)]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1280px) 420px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 lg:p-6">
                  <h3 className="t-h3 text-balance">{product.title}</h3>
                  <p className="t-sm mt-3 flex-1 text-[var(--fg-2)]">{product.benefit}</p>

                  {/* Цена — то, ради чего сюда смотрят, поэтому она держит
                      вес заголовка, а «Рассчитать» уходит в технический
                      ярлык: два одинаково громких элемента в одной строке
                      заставляли бы выбирать, куда смотреть. */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--hairline)] pt-4">
                    {product.priceFrom !== null ? (
                      <p className="t-h4">
                        от {formatRub(product.priceFrom)}
                        <span className="t-sm font-medium text-[var(--fg-3)]">
                          {' / '}
                          {product.priceUnit}
                        </span>
                      </p>
                    ) : (
                      <p className="t-h4 text-[var(--fg-2)]">цена по расчёту</p>
                    )}

                    <span className="t-label inline-flex items-center gap-2 text-[var(--fg-3)] transition-colors duration-200 ease-[var(--ease-out-soft)] group-hover:text-[var(--accent-fg)]">
                      Рассчитать
                      <ArrowRight size={16} />
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
