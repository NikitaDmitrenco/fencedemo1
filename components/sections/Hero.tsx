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
    <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-[var(--color-ink)] pt-28 pb-14 text-white lg:min-h-[92svh] lg:pb-20">
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Затемнение снизу: текст должен читаться на любом кадре, который
          подставит клиент, а не только на демонстрационном. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,24,27,0.72) 0%, rgba(20,24,27,0.35) 32%, rgba(20,24,27,0.88) 100%)',
        }}
      />

      <Container className="relative">
        <h1 className="h-display max-w-3xl text-balance">{hero.title}</h1>

        <p className="measure mt-5 text-lg text-white/80 lg:text-xl">{hero.subtitle}</p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={CALC_ANCHOR} size="lg">
            Рассчитать стоимость
          </ButtonLink>
          <ButtonLink href="#cases" variant="ghost" size="lg">
            Посмотреть работы
          </ButtonLink>
        </div>

        <ul className="mt-12 grid gap-x-8 gap-y-6 border-t border-white/20 pt-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {hero.proofs.map((proof) => (
            <li key={proof.title} className="flex gap-3">
              <span className="mt-0.5 shrink-0 text-[var(--accent)]">
                <ProofIcon name={proof.icon} />
              </span>
              <span>
                <span className="block font-bold">{proof.title}</span>
                <span className="mt-0.5 block text-sm text-white/60">{proof.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
