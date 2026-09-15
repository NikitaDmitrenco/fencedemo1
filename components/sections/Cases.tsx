import Image from 'next/image';
import { site } from '@/content/site.config';
import { Card, Reveal, Section } from '@/components/ui';
import { formatRub } from '@/content/pricing';
import type { ProjectCase } from '@/content/types';

/**
 * Блок 4. Заменить обезличенную галерею доказательством масштаба и цены.
 *
 * Работает именно строка параметров: длина, высота, ворота, срок и стоимость
 * позволяют посетителю мысленно приложить объект к своему участку. Без них
 * это просто фотографии заборов, которых в интернете и так достаточно.
 */

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[var(--color-ink-muted)]">{label}</dt>
      <dd className="mt-0.5 font-semibold">{value}</dd>
    </div>
  );
}

function Gallery({ item }: { item: ProjectCase }) {
  return (
    // Горизонтальная лента с привязкой прокрутки: листается пальцем на
    // телефоне и колесом на десктопе, без слайдера на JavaScript.
    <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth">
      {item.photos.map((photo, i) => (
        <div
          key={photo}
          className="relative aspect-3/2 w-[85%] shrink-0 snap-start overflow-hidden rounded-[10px] bg-[var(--color-ink)] sm:w-[70%]"
        >
          <Image
            src={photo}
            alt={`${item.title}: фото ${i + 1} из ${item.photos.length}`}
            fill
            sizes="(max-width: 1024px) 85vw, 40vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function Cases() {
  return (
    <Section
      id="cases"
      tone="raised"
      eyebrow="Работы"
      title="Объекты с параметрами и ценой"
      lead="У каждого объекта указаны длина, высота, тип ворот, срок и итоговая стоимость — чтобы можно было прикинуть свой участок, а не гадать по фотографиям."
    >
      <ul className="grid gap-6 lg:grid-cols-2">
        {site.cases.map((item, i) => (
          <Reveal key={item.title} as="li" delay={i * 60} className="h-full">
            <Card className="flex h-full flex-col p-4 sm:p-5">
              <Gallery item={item} />

              <div className="mt-5 flex flex-1 flex-col">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-[0.9375rem] text-[var(--color-ink-soft)]">{item.type}</p>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-[0.9375rem] sm:grid-cols-3">
                  <Spec label="Длина" value={`${item.length} м`} />
                  <Spec label="Высота" value={`${item.height} м`} />
                  <Spec label="Срок" value={item.term} />
                  <Spec label="Ворота" value={item.gates} />
                  <Spec label="Район" value={item.district} />
                </dl>

                <p className="mt-auto pt-5 text-xl font-bold">
                  {formatRub(item.price)}
                  <span className="ml-2 text-sm font-medium text-[var(--color-ink-muted)]">
                    стоимость проекта
                  </span>
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
