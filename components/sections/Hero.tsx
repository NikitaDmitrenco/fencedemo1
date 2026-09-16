import Image from 'next/image';
import { site } from '@/content/site.config';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ProofIcon } from '@/components/ui/Icon';
import { CALC_ANCHOR } from '@/lib/nav';
import { clsx } from '@/lib/clsx';

/**
 * Блок 1. За 5–10 секунд объяснить продукт и дать путь к расчёту.
 *
 * Фотография грузится с priority — это LCP-элемент страницы, и откладывать
 * его загрузку значит портить главную метрику скорости на мобильном.
 *
 * Верхний отступ считается от высоты фиксированной шапки плюс safe-area:
 * шапка лежит поверх экрана, и без этой поправки на телефонах с вырезом
 * первая строка заголовка уходит под неё.
 */
export function Hero() {
  const { hero } = site;

  return (
    <section
      data-surface="ink-deep"
      className={clsx(
        'relative flex min-h-svh flex-col justify-end overflow-hidden bg-[var(--color-ink-deep)]',
        'pt-[calc(6rem+env(safe-area-inset-top,0px))] pb-16',
        'lg:pt-[calc(8rem+env(safe-area-inset-top,0px))] lg:pb-20',
      )}
    >
      {/* Кадр задаётся только через next/image: дублирующий background-image
          на секции грузил бы тот же файл вторым, неоптимизированным запросом.
          Сдвиг фокуса вправо — чтобы на узком экране в кадр попадало полотно
          забора с ребром и столбом, а не пустая створка ворот. */}
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-[46%_center] sm:object-[63%_center]"
      />

      {/* Маска читаемости — .hero-scrim в globals.css. Она же позволяет
          клиенту подставить любой свой кадр, не трогая вёрстку. */}
      <div aria-hidden="true" className="hero-scrim absolute inset-0 z-10" />

      <Container className="relative z-20">
        <div className="grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h1 className="t-display text-balance">{hero.title}</h1>
            <p className="t-lead measure mt-6">{hero.subtitle}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={CALC_ANCHOR} size="lg" className="w-full sm:w-auto">
                Рассчитать стоимость
              </ButtonLink>
              <ButtonLink href="#cases" variant="secondary" size="lg" className="w-full sm:w-auto">
                Посмотреть работы
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Строка доказательств, а не список преимуществ: волосяная линия
            сверху и разделители между колонками делают из неё таблицу
            характеристик компании — так её и читают, по одному факту. */}
        <ul className="mt-16 grid gap-x-8 gap-y-6 border-t border-[var(--hairline)] pt-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-y-0">
          {hero.proofs.map((proof) => (
            <li
              key={proof.title}
              className="flex gap-3 lg:border-l lg:border-[var(--hairline)] lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="shrink-0 text-[var(--accent-fg)]">
                <ProofIcon name={proof.icon} />
              </span>
              <span className="block">
                <span className="t-sm block font-semibold">{proof.title}</span>
                <span className="t-xs mt-1 block text-[var(--fg-2)]">{proof.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
