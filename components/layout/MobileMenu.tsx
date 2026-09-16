'use client';

import { useEffect, useRef } from 'react';
import { site, formatPhone } from '@/content/site.config';
import { buttonClass, Container } from '@/components/ui';
import { NAV_LINKS, CALC_ANCHOR } from '@/lib/nav';
import { clsx } from '@/lib/clsx';

/**
 * Меню для экранов, где ссылки разделов не помещаются в шапку.
 *
 * Кроме навигации отдаёт телефон и мессенджеры: по ТЗ они должны быть
 * доступны без поиска в футере, а на узком экране в шапку не влезают.
 * До появления этого меню на первом экране телефона не было вовсе.
 *
 * Панель — светлая поверхность страницы, а не отдельная тёмная тема:
 * меню открывается поверх любой секции и не должно выглядеть как кусок
 * чужого сайта. Боковые поля берутся у Container — пункты меню стоят на той
 * же вертикальной оси, что и логотип в шапке.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // Фон не должен уезжать под открытым меню.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    // Фокус переносится в меню, иначе с клавиатуры человек остаётся
    // на странице под ним и «проваливается» сквозь открытую панель.
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const messengers = [
    site.company.whatsapp && {
      label: 'WhatsApp',
      href: `https://wa.me/${site.company.whatsapp.replace(/\D/g, '')}`,
    },
    site.company.telegram && {
      label: 'Telegram',
      href: `https://t.me/${site.company.telegram}`,
    },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <div
      // Выше плашки cookie и шапки: у них z-50, и без запаса баннер
      // перекрывал бы нижние пункты открытого меню.
      className={clsx(
        'fixed inset-0 z-60 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
      inert={!open || undefined}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Закрыть меню"
        onClick={onClose}
        className={clsx(
          'absolute inset-0 bg-[var(--color-ink-deep)]',
          'transition-opacity duration-300 ease-[var(--ease-out-soft)]',
          open ? 'opacity-70' : 'opacity-0',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
        data-surface="canvas"
        className={clsx(
          'absolute inset-x-0 top-0 border-b border-[var(--hairline)]',
          'transition-transform duration-300 ease-[var(--ease-out-soft)]',
          open ? 'translate-y-0' : '-translate-y-full',
        )}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {/* Высота строки совпадает с шапкой: при открытии меню логотип
            остаётся на месте, а не переезжает на несколько пикселей. */}
        <Container className="flex h-16 items-center justify-between gap-6">
          <span className="t-h4">{site.company.name}</span>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            className="-mr-2 flex size-11 items-center justify-center rounded-[var(--radius-control)] text-[var(--fg)]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </Container>

        <div className="border-t border-[var(--hairline)]">
          <Container className="pt-2 pb-8">
            <nav aria-label="Разделы страницы">
              <ul className="divide-y divide-[var(--hairline)] border-b border-[var(--hairline)]">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={onClose}
                      className="t-h3 flex min-h-14 items-center text-[var(--fg)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={CALC_ANCHOR}
              onClick={onClose}
              className={clsx(buttonClass('primary', 'lg', true), 'mt-6')}
            >
              Рассчитать стоимость
            </a>

            <a href={`tel:${site.company.phone}`} className="t-h3 mt-6 block text-[var(--fg)]">
              {formatPhone(site.company.phone)}
            </a>

            <p className="t-xs mt-1 text-[var(--fg-3)]">{site.company.workHours}</p>

            {messengers.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {messengers.map((m) => (
                  <a
                    key={m.label}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass('secondary', 'md')}
                  >
                    {m.label}
                  </a>
                ))}
              </div>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}
