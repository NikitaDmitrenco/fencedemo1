'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { site } from '@/content/site.config';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'cookie-notice-accepted';

/**
 * Уведомление об использовании cookie.
 *
 * Появляется только после монтирования: решение хранится в localStorage,
 * а на сервере его не прочитать — отрисовать баннер сразу значило бы
 * показывать его тем, кто уже согласился.
 *
 * Обращение к хранилищу обёрнуто: в приватном окне и при запрете сайту
 * хранить данные доступ бросает исключение, и падать из-за плашки нельзя.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let accepted = false;
    try {
      accepted = Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      // Хранилище недоступно — показываем плашку один раз за сессию.
    }

    if (accepted) return;

    // Показ откладывается на следующий кадр: во-первых, синхронный вызов
    // setState прямо в эффекте вызывает лишний каскад рендеров, во-вторых,
    // плашка мягче появляется уже после отрисовки страницы.
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!visible) return null;

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Не смогли запомнить — плашка вернётся при следующем визите.
    }
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label="Уведомление об использовании cookie"
      // На мобильном поднят над панелью «Позвонить | Рассчитать»,
      // иначе две полосы наложились бы друг на друга.
      className="fixed inset-x-3 bottom-21 z-50 mx-auto max-w-2xl rounded-[var(--radius-card)] border border-[var(--color-steel-line)] bg-[var(--color-ink-raised)] p-4 sm:inset-x-4 lg:bottom-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-white/65">
          Сайт использует cookie для работы форм и сбора обезличенной статистики. Подробности — в{' '}
          <Link
            href={site.legal.privacyUrl as Route}
            className="font-semibold underline underline-offset-2"
          >
            политике конфиденциальности
          </Link>
          .
        </p>

        <Button onClick={accept} className="shrink-0">
          Понятно
        </Button>
      </div>
    </div>
  );
}
