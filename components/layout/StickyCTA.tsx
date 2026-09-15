'use client';

import { useEffect, useState } from 'react';
import { site } from '@/content/site.config';
import { CALC_ANCHOR } from '@/lib/nav';
import { clsx } from '@/lib/clsx';

/**
 * Нижняя панель «Позвонить | Рассчитать» — требование ТЗ для мобильной версии.
 *
 * Появляется после первого экрана: поверх hero она конкурировала бы с его
 * собственными кнопками. Учитывает safe-area, иначе на iPhone кнопки уезжают
 * под системную полосу.
 */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('sticky-sentinel');
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Именно «маркер ушёл вверх», а не «маркер не виден»: при загрузке
        // страницы маркер находится НИЖЕ экрана и тоже не виден, и панель
        // выскакивала бы поверх первого экрана, конкурируя с его кнопками.
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={clsx(
        'fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-steel-line)]',
        'bg-[var(--color-paper)]/95 backdrop-blur-md lg:hidden',
        'transition-transform duration-300 ease-[var(--ease-out-soft)]',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.625rem)' }}
      // Скрытая панель не должна ловить фокус с клавиатуры.
      aria-hidden={!visible}
      inert={!visible || undefined}
    >
      <div className="flex gap-3 px-4 pt-2.5">
        <a
          href={`tel:${site.company.phone}`}
          className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-steel-line)] bg-[var(--color-paper-raised)] font-semibold"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path
              d="M4.2 3h3l1.3 3.2-1.8 1.3a10.5 10.5 0 004.8 4.8l1.3-1.8L16 11.8v3a1.5 1.5 0 01-1.7 1.5A13.2 13.2 0 013 4.7 1.5 1.5 0 014.2 3z"
              strokeLinejoin="round"
            />
          </svg>
          Позвонить
        </a>

        <a
          href={CALC_ANCHOR}
          className="inline-flex min-h-13 flex-1 items-center justify-center rounded-[var(--radius-control)] bg-[var(--accent)] font-bold whitespace-nowrap text-[var(--color-accent-ink)]"
        >
          Рассчитать
        </a>
      </div>
    </div>
  );
}
