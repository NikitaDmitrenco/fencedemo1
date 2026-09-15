import Link from 'next/link';
import { site, formatPhone } from '@/content/site.config';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-16">
      <p className="technical-label text-[var(--accent)]">Ошибка 404</p>

      <h1 className="h-section mt-4">Такой страницы нет</h1>

      <p className="measure mt-4 text-[var(--color-ink-soft)]">
        Возможно, ссылка устарела. Вернитесь на главную — там есть расчёт стоимости, примеры работ и
        цены.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/"
          className="rounded-[var(--radius-control)] bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--color-accent-ink)] transition-transform duration-150 hover:-translate-y-0.5"
        >
          На главную
        </Link>

        <a
          href={`tel:${site.company.phone}`}
          className="font-semibold underline underline-offset-4"
        >
          {formatPhone(site.company.phone)}
        </a>
      </div>
    </main>
  );
}
