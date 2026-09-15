'use client';

import { useEffect, useRef } from 'react';
import { clsx } from '@/lib/clsx';

/**
 * Появление блока при скролле.
 *
 * Видимость переключается атрибутом на самом узле, без состояния React:
 * это чисто визуальный эффект, и прогонять из-за него ре-рендер каждого
 * блока страницы незачем. IntersectionObserver вместо обработчика scroll —
 * тот срабатывает на каждом кадре и заметно ест плавность на слабых телефонах.
 *
 * Наблюдатель отключается после первого срабатывания: повторная анимация
 * при обратном скролле раздражает. Сам моушен гасится prefers-reduced-motion
 * в globals.css, а на случай выключенного JS там же лежит noscript-правило.
 */
export function Reveal({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  /** Задержка в мс — для лёгкого каскада внутри одной группы карточек. */
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => {
      node.dataset.visible = 'true';
    };

    // Без поддержки API показываем содержимое сразу, а не прячем навсегда.
    if (typeof IntersectionObserver === 'undefined') {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      // Отрицательный отступ снизу: блок проявляется, когда заметно вошёл
      // в экран, а не в момент касания края.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={clsx('reveal', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
