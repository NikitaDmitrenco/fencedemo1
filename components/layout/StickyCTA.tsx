'use client';

import { useEffect, useState } from 'react';
import { site } from '@/content/site.config';
import { buttonClass, PhoneIcon } from '@/components/ui';
import { CALC_ANCHOR } from '@/lib/nav';
import { clsx } from '@/lib/clsx';

/**
 * Нижняя панель «Позвонить | Рассчитать» — требование ТЗ для мобильной версии.
 *
 * Появляется после первого экрана: поверх hero она конкурировала бы с его
 * собственными кнопками. Учитывает safe-area, иначе на iPhone кнопки уезжают
 * под системную полосу.
 *
 * Кнопки собираются тем же buttonClass, что и везде: панель — не отдельный
 * виджет, а продолжение страницы, и «Рассчитать» здесь обязано выглядеть
 * ровно так же, как в шапке и в секциях.
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
      data-surface="canvas"
      className={clsx(
        'fixed inset-x-0 bottom-0 z-40 border-t border-[var(--hairline)] lg:hidden',
        'transition-transform duration-300 ease-[var(--ease-out-soft)]',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
      // Скрытая панель не должна ловить фокус с клавиатуры.
      aria-hidden={!visible}
      inert={!visible || undefined}
    >
      <div className="flex gap-3 px-4 pt-3">
        <a
          href={`tel:${site.company.phone}`}
          className={clsx(buttonClass('secondary', 'md'), 'flex-1')}
        >
          <PhoneIcon />
          Позвонить
        </a>

        <a href={CALC_ANCHOR} className={clsx(buttonClass('primary', 'md'), 'flex-1')}>
          Рассчитать
        </a>
      </div>
    </div>
  );
}
