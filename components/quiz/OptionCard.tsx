import Image from 'next/image';
import { CheckIcon } from '@/components/ui';
import { clsx } from '@/lib/clsx';

/**
 * Вариант ответа — карточка, а не радиокнопка: по ТЗ квиз должен обходиться
 * без мелких чекбоксов, а на телефоне промах по кружку диаметром 20 px
 * стоит ответа. Вся карточка — одна цель нажатия.
 *
 * Состояния различаются только цветом границы и подложки. Сдвиг карточки под
 * курсором на плотной сетке вариантов читается как дрожание вёрстки, а на
 * шаге выбора это ещё и мешает прицелиться.
 *
 * Подложка выбранного варианта собирается из --accent-fg с прозрачностью, а
 * не из готового --color-accent-soft: тот рассчитан на светлую поверхность, а
 * эта же карточка работает и в форме тёмной финальной секции, где светлое
 * пятно выглядело бы дырой. Заливка индикатора, наоборот, всегда --accent —
 * ровно как у primary-кнопки, которая тоже одинакова на обеих поверхностях.
 */
export function OptionCard({
  label,
  note,
  image,
  selected,
  onSelect,
}: {
  label: string;
  note?: string;
  image?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={clsx(
        // min-h-14 — тап-таргет заведомо больше 48 px; h-full выравнивает
        // карточки с примечанием и без него в одной строке сетки.
        'group flex h-full min-h-14 w-full items-center gap-3 overflow-hidden text-left',
        'rounded-[var(--radius-control)] border p-3',
        'transition-colors duration-150 ease-[var(--ease-out-soft)]',
        selected
          ? 'border-[var(--accent-fg)] bg-[color-mix(in_srgb,var(--accent-fg)_12%,transparent)]'
          : 'border-[var(--hairline-strong)] bg-transparent hover:border-[var(--fg-2)]',
      )}
    >
      {image && (
        <span className="relative size-14 shrink-0 overflow-hidden rounded-[var(--radius-control)] bg-[var(--color-ink-raised)]">
          <Image src={image} alt="" fill sizes="56px" className="object-cover" />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{label}</span>
        {note && <span className="t-xs mt-1 block text-[var(--fg-2)]">{note}</span>}
      </span>

      <span
        aria-hidden="true"
        className={clsx(
          'flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-control)] border transition-colors',
          selected
            ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
            : 'border-[var(--hairline-strong)]',
        )}
      >
        {selected && <CheckIcon size={12} />}
      </span>
    </button>
  );
}
