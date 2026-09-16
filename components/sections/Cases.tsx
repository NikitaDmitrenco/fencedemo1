import Image from 'next/image';
import { site } from '@/content/site.config';
import { Reveal, Section } from '@/components/ui';
import { formatRub } from '@/content/pricing';
import type { ProjectCase } from '@/content/types';

/**
 * Блок 4. Заменить обезличенную галерею доказательством масштаба и цены.
 *
 * Работает именно строка параметров: длина, высота, ворота, срок и стоимость
 * позволяют посетителю мысленно приложить объект к своему участку. Без них
 * это просто фотографии заборов, которых в интернете и так достаточно.
 *
 * Композиция — портфолио-запись, а не карточка в сетке: слева крупный
 * ведущий кадр, справа спецификация объекта. Фотография здесь и есть товар,
 * поэтому она занимает больше половины ширины, а цифры читаются рядом с ней
 * как паспорт изделия, а не как подпись под картинкой.
 */

/**
 * Строка спецификации: подпись слева, значение справа, всегда в одних и тех
 * же долях сетки. Одинаковая раскладка у всех объектов — то, из-за чего
 * четыре разных проекта читаются как один каталог, а не четыре вёрстки.
 */
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 items-baseline gap-x-4 border-t border-[var(--hairline)] py-3">
      <dt className="t-label text-[var(--fg-3)]">{label}</dt>
      <dd className="t-sm col-span-2 font-semibold">{value}</dd>
    </div>
  );
}

function Gallery({ item }: { item: ProjectCase }) {
  const [lead, ...rest] = item.photos;
  if (!lead) return null;

  return (
    /**
     * Одна разметка на два поведения. На телефоне это лента с привязкой
     * прокрутки, но кадр в ней ровно один на экран: обрезанный «на 85%»
     * сосед читается как сломанный слайдер, а не как приглашение листать.
     * На десктопе лента распускается в композицию «ведущий кадр + подчинённые»,
     * и прокрутка не нужна — все снимки видны сразу.
     */
    <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto lg:block lg:overflow-visible">
      <div className="relative aspect-3/2 w-full shrink-0 snap-start overflow-hidden rounded-[var(--radius-surface)] bg-[var(--color-ink-raised)]">
        <Image
          src={lead}
          alt={`${item.title}: фото 1 из ${item.photos.length}`}
          fill
          sizes="(max-width: 1023px) 100vw, 56vw"
          className="object-cover"
        />
      </div>

      {rest.length > 0 && (
        // display:contents — чтобы на мобильном миниатюры оставались кадрами
        // той же ленты, а на десктопе собирались в отдельный ряд под ведущим.
        <div className="contents lg:mt-2 lg:flex lg:gap-2">
          {rest.map((photo, i) => (
            <div
              key={photo}
              className="relative aspect-3/2 w-full shrink-0 snap-start overflow-hidden rounded-[var(--radius-surface)] bg-[var(--color-ink-raised)] lg:flex-1"
            >
              <Image
                src={photo}
                alt={`${item.title}: фото ${i + 2} из ${item.photos.length}`}
                fill
                sizes="(max-width: 1023px) 100vw, 28vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Cases() {
  return (
    <Section
      id="cases"
      tone="canvas"
      title="Объекты с параметрами и ценой"
      lead="У каждого объекта указаны длина, высота, тип ворот, срок и итоговая стоимость — чтобы можно было прикинуть свой участок, а не гадать по фотографиям."
    >
      {/* Волосяные разделители во всю ширину контейнера вместо карточек:
          объекты выстраиваются в один разворот каталога и не спорят
          рамками с фотографиями. */}
      <ul className="border-t border-[var(--hairline)]">
        {site.cases.map((item, i) => (
          <Reveal
            key={item.title}
            as="li"
            delay={i * 60}
            className="border-b border-[var(--hairline)]"
          >
            <article className="grid gap-6 py-8 lg:grid-cols-12 lg:gap-8 lg:py-12">
              <div className="lg:col-span-7">
                <Gallery item={item} />
              </div>

              <div className="flex flex-col lg:col-span-5">
                <p className="t-label text-[var(--fg-3)]">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="t-h3 mt-3">{item.title}</h3>
                <p className="t-sm mt-2 text-[var(--fg-2)]">{item.type}</p>

                <dl className="mt-6">
                  <Spec label="Длина" value={`${item.length} м`} />
                  <Spec label="Высота" value={`${item.height} м`} />
                  <Spec label="Срок" value={item.term} />
                  <Spec label="Ворота" value={item.gates} />
                  <Spec label="Район" value={item.district} />
                </dl>

                {/* mt-auto прижимает цену к низу колонки: на десктопе она
                    встаёт на одну линию с нижним краем фотографий. */}
                <div className="mt-8 border-t border-[var(--hairline-strong)] pt-5 lg:mt-auto">
                  <p className="t-label text-[var(--fg-3)]">Стоимость проекта</p>
                  <p className="t-metric mt-3 whitespace-nowrap">{formatRub(item.price)}</p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
