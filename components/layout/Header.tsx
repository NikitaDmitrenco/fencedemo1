'use client';

import { useCallback, useEffect, useState } from 'react';
import { site, formatPhone } from '@/content/site.config';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS, CALC_ANCHOR } from '@/lib/nav';
import { clsx } from '@/lib/clsx';

/**
 * Шапка: прозрачная поверх фотографии первого экрана, плотная после скролла.
 *
 * Состояние определяется IntersectionObserver по невидимому маркеру в начале
 * страницы, а не обработчиком scroll: тот срабатывает на каждом кадре и на
 * слабых телефонах заметно ест плавность.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const sentinel = document.getElementById('header-sentinel');
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting), {
      threshold: 0,
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={clsx(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-[var(--ease-out-soft)]',
          scrolled
            ? 'border-b border-[var(--color-steel-line)] bg-[var(--color-ink)]'
            : 'border-b border-transparent',
        )}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          <a
            href="#top"
            className={clsx('text-base font-bold tracking-tight transition-colors', 'text-white')}
          >
            {site.company.name}
          </a>

          <nav aria-label="Разделы страницы" className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={clsx(
                  'text-[0.9375rem] font-medium transition-colors',
                  scrolled ? 'text-white/60 hover:text-white' : 'text-white/80 hover:text-white',
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.company.phone}`}
              className={clsx(
                'hidden text-[0.9375rem] font-bold whitespace-nowrap transition-colors sm:block',
                'text-white',
              )}
            >
              {formatPhone(site.company.phone)}
            </a>

            {/* Скрытие — обёрткой, а не классом на самой кнопке: `hidden` и
              `inline-flex` лежат в одном слое, и исход решает порядок правил
              в собранном CSS, а не порядок классов в разметке. */}
            <div className="hidden sm:block">
              <ButtonLink href={CALC_ANCHOR} variant="primary">
                Рассчитать
              </ButtonLink>
            </div>

            {/* Ниже lg ссылки разделов в шапку не помещаются — там меню. */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={menuOpen}
              className={clsx(
                '-mr-2 flex size-11 items-center justify-center rounded-[var(--radius-control)] transition-colors lg:hidden',
                'text-white',
              )}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      {/* Меню намеренно вне <header>: у шапки position + z-index, то есть
          собственный контекст наложения, и любой z-index внутри неё
          сравнивается только с соседями по шапке. Плашка cookie лежит
          на уровне body и перекрывала бы открытое меню. */}
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
