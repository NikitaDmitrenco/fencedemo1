'use client';

import { useCallback, useEffect, useState } from 'react';
import { site, formatPhone } from '@/content/site.config';
import { ButtonLink, Container } from '@/components/ui';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS, CALC_ANCHOR } from '@/lib/nav';
import { clsx } from '@/lib/clsx';

/**
 * Шапка: прозрачная поверх фотографии первого экрана, светлая после скролла.
 *
 * Состояние определяется IntersectionObserver по невидимому маркеру в начале
 * страницы, а не обработчиком scroll: тот срабатывает на каждом кадре и на
 * слабых телефонах заметно ест плавность.
 *
 * Меняется только палитра, не геометрия: высота, отступы и толщина нижней
 * линии одинаковы в обоих состояниях, поэтому при переходе ничего не
 * подпрыгивает. Саму палитру объявляет data-surface — вложенные ссылки,
 * кнопка меню и иконки читают --fg / --hairline и перекрашиваются сами.
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
        // Поверх первого экрана шапка живёт на тёмном кадре, после скролла —
        // на светлом холсте страницы.
        data-surface={scrolled ? 'canvas' : 'ink-deep'}
        className={clsx(
          'fixed inset-x-0 top-0 z-50 border-b',
          'transition-colors duration-300 ease-[var(--ease-out-soft)]',
        )}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          // Фон и линия задаются инлайном намеренно: правило [data-surface]
          // в globals.css лежит вне слоёв Tailwind и потому перебивает любую
          // утилиту bg-*/border-* на том же узле. Прозрачность первого
          // состояния иначе просто не применилась бы.
          backgroundColor: scrolled ? 'var(--color-canvas)' : 'transparent',
          borderBottomColor: scrolled ? 'var(--hairline)' : 'transparent',
        }}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          <a href="#top" className="t-h4 transition-colors">
            {site.company.name}
          </a>

          <nav aria-label="Разделы страницы" className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="t-sm font-medium text-[var(--fg-2)] transition-colors hover:text-[var(--fg)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.company.phone}`}
              className="t-sm hidden font-semibold whitespace-nowrap text-[var(--fg)] transition-colors sm:block"
            >
              {formatPhone(site.company.phone)}
            </a>

            {/* Скрытие — обёрткой, а не классом на самой кнопке: `hidden` и
              `inline-flex` лежат в одном слое, и исход решает порядок правил
              в собранном CSS, а не порядок классов в разметке. */}
            <div className="hidden sm:block">
              <ButtonLink href={CALC_ANCHOR} variant="primary" size="md">
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
                '-mr-2 flex size-11 items-center justify-center lg:hidden',
                'rounded-[var(--radius-control)] text-[var(--fg)] transition-colors',
              )}
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
