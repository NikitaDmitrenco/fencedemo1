import { site } from '@/content/site.config';
import { ButtonLink } from '@/components/ui/Button';
import { Card, Reveal, Section } from '@/components/ui';
import { CALC_ANCHOR } from '@/lib/nav';

/**
 * Блок 5. Снять страх «по телефону сказали одно, на месте стало вдвое дороже».
 *
 * Показываем не цену, а её состав: пока клиент не понимает, из чего собирается
 * сумма, любая цифра выглядит как повод для торга или обмана. Поэтому список
 * статей свёрстан как документ — номера по одной вертикальной оси, волосяные
 * разделители, одинаковый шаг строк: смета должна выглядеть проверяемой.
 *
 * Обещание «фиксируем смету договором» выводится только при trust.contract —
 * не обещаем за компанию то, чего она не делает.
 */
export function Estimate() {
  return (
    <Section
      id="prices"
      tone="ink"
      title="Из чего складывается смета"
      lead="Ниже — все статьи расходов, которые влияют на итоговую сумму. Если какой-то из них нет в вашем расчёте, значит она вам не нужна."
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <ol className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)] lg:col-span-7">
          {site.estimate.map((row, i) => (
            <Reveal key={row.item} as="li" delay={i * 35}>
              <div className="flex gap-5 py-5 lg:py-6">
                {/* Фиксированная ширина колонки номера, а не отступ по месту:
                    номера должны стоять на одной оси при любой длине строки. */}
                <span className="t-label w-8 shrink-0 pt-1 text-[var(--accent-fg)]">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="measure">
                  <span className="block font-semibold">{row.item}</span>
                  <span className="t-sm mt-1 block text-[var(--fg-2)]">{row.note}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="lg:col-span-5">
          {/* Липкость держится на самой карточке: её грид-ячейка тянется на
              всю высоту списка, поэтому карточка не может уехать за пределы
              секции и останавливается вместе с последней статьёй сметы. */}
          <Card className="p-6 lg:sticky lg:top-24 lg:p-8">
            <h3 className="t-h4">Точная цена — после замера</h3>

            <p className="t-sm mt-4 text-[var(--fg-2)]">
              Онлайн мы считаем предварительный диапазон по длине, высоте и типу ворот. На итог
              влияют грунт, перепады высот и подъезд к участку — это видно только на месте.
            </p>

            {site.trust.contract && (
              <p className="t-sm mt-5 border-t border-[var(--hairline)] pt-5 text-[var(--fg-2)]">
                После замера стоимость фиксируется в смете и договоре и не меняется в ходе работ.
              </p>
            )}

            <ButtonLink href={CALC_ANCHOR} size="lg" full className="mt-6">
              Получить расчёт
            </ButtonLink>

            <p className="t-xs mt-3 text-center text-[var(--fg-3)]">
              Занимает около минуты, без звонка
            </p>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
