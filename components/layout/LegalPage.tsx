import Link from 'next/link';
import { site } from '@/content/site.config';

/**
 * Обёртка для правовых страниц. Тексты — шаблон: в боевой версии заменяются
 * документами юрлица клиента. В демо это явно помечено, чтобы шаблон
 * не приняли за действующий документ компании.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <Link
        href="/"
        className="text-sm font-semibold text-[var(--color-ink-muted)] underline underline-offset-4"
      >
        ← На главную
      </Link>

      <h1 className="h-section mt-6">{title}</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">Редакция от {updated}</p>

      {site.isDemo ? (
        <p className="mt-6 rounded-[var(--radius-control)] border border-[var(--color-steel-line)] bg-[var(--color-paper-raised)] p-4 text-sm text-[var(--color-ink-soft)]">
          <strong className="font-semibold">Демонстрационный шаблон.</strong> Текст приведён как
          образец структуры документа и в рабочей версии заменяется документом юридического лица
          компании.
        </p>
      ) : null}

      <div className="measure mt-8 space-y-5 text-[var(--color-ink-soft)] [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[var(--color-ink)] [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
