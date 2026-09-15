import Image from 'next/image';
import { site } from '@/content/site.config';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ProofIcon } from '@/components/ui/Icon';
import { CALC_ANCHOR } from '@/lib/nav';

/**
 * Блок 1. За 5–10 секунд объяснить продукт и дать путь к расчёту.
 *
 * Фотография грузится с priority — это LCP-элемент страницы, и откладывать
 * его загрузку значит портить главную метрику скорости на мобильном.
 */
export function Hero() {
  const { hero } = site;

  return (
    <section
      className="relative flex min-h-[92svh] items-end overflow-hidden bg-[var(--color-ink)] pt-28 pb-10 text-white lg:min-h-[100svh] lg:pb-12"
      style={{
        backgroundImage: `url(${hero.image})`,
        backgroundPosition: '63% center',
        backgroundSize: 'cover',
      }}
    >
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-[63%_center] saturate-[.72] contrast-[1.06]"
      />

      {/* Затемнение снизу: текст должен читаться на любом кадре, который
          подставит клиент, а не только на демонстрационном. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,11,12,0.86) 0%, rgba(8,11,12,0.48) 47%, rgba(8,11,12,0.08) 100%), linear-gradient(0deg, rgba(8,11,12,0.8) 0%, rgba(8,11,12,0.08) 62%)',
        }}
      />

      <Container className="relative z-20">
        <div className="grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <p className="technical-label mb-6 text-[var(--accent)]">
              Digital craft for the physical world
            </p>
            <h1 className="h-display max-w-5xl text-balance">{hero.title}</h1>
            <p className="measure mt-7 text-base text-white/70 lg:text-xl">{hero.subtitle}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={CALC_ANCHOR} size="lg">
                Рассчитать стоимость
              </ButtonLink>
              <ButtonLink href="#cases" variant="ghost" size="lg">
                Посмотреть работы
              </ButtonLink>
            </div>
          </div>
          <div className="hidden justify-end lg:col-span-3 lg:flex lg:items-end">
            <p className="technical-label max-w-28 border-l border-white/30 pl-4 text-white/50">
              Проектирование, изготовление и монтаж в одной системе
            </p>
          </div>
        </div>
        <ul className="mt-14 grid gap-x-8 gap-y-5 border-t border-white/20 pt-5 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {hero.proofs.map((proof) => (
            <li key={proof.title} className="flex gap-3 lg:border-l lg:border-white/18 lg:pl-5">
              <span className="mt-0.5 shrink-0 text-[var(--accent)]">
                <ProofIcon name={proof.icon} />
              </span>
              <span>
                <span className="block text-sm font-bold">{proof.title}</span>
                <span className="mt-0.5 block text-sm text-white/60">{proof.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
