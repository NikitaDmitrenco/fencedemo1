import { site } from '@/content/site.config';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal, Section } from '@/components/ui';
import { CALC_ANCHOR } from '@/lib/nav';

/**
 * Блок 5. Снять страх «по телефону сказали одно, на месте стало вдвое дороже».
 *
 * Показываем не цену, а её состав: пока клиент не понимает, из чего собирается
 * сумма, любая цифра выглядит как повод для торга или обмана.
 *
 * Обещание «фиксируем смету договором» выводится только при trust.contract —
 * не обещаем за компанию то, чего она не делает.
 */
export function Estimate() {
  return (
    <Section
      id="prices"
      tone="ink"
      eyebrow="Цена"
      title="Из чего складывается смета"
      lead="Ниже — все статьи расходов, которые влияют на итоговую сумму. Если какой-то из них нет в вашем расчёте, значит она вам не нужна."
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <ol className="divide-y divide-white/12 border-y border-white/12 lg:col-span-8">
          {site.estimate.map((row, i) => (
            <Reveal key={row.item} as="li" delay={i * 35}>
              <div className="flex gap-4 py-4">
                <span className="technical-label w-8 shrink-0 pt-1 text-[var(--accent)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-bold text-white">{row.item}</span>
                  <span className="mt-1 block text-[0.9375rem] text-white/60">{row.note}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="lg:col-span-4">
          <div className="border-l-2 border-[var(--accent)] bg-[#151b1e] p-6 lg:sticky lg:top-24">
            <p className="text-lg font-bold text-white">Точная цена — после замера</p>

            <p className="mt-3 text-[0.9375rem] text-white/70">
              Онлайн мы считаем предварительный диапазон по длине, высоте и типу ворот. На итог
              влияют грунт, перепады высот и подъезд к участку — это видно только на месте.
            </p>

            {site.trust.contract && (
              <p className="mt-4 border-t border-white/12 pt-4 text-[0.9375rem] text-white/70">
                После замера стоимость фиксируется в смете и договоре и не меняется в ходе работ.
              </p>
            )}

            <ButtonLink href={CALC_ANCHOR} size="lg" full className="mt-6">
              Получить расчёт
            </ButtonLink>

            <p className="mt-3 text-center text-xs text-white/45">
              Занимает около минуты, без звонка
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
