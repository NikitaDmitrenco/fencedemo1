import Link from 'next/link';
import { site } from '@/content/site.config';
import { Container } from '@/components/ui';

/**
 * Обёртка для правовых страниц. Тексты — шаблон: в боевой версии заменяются
 * документами юрлица клиента. В демо это явно помечено, чтобы шаблон
 * не приняли за действующий документ компании.
 *
 * Ширина берётся у Container и текстовой колонки measure, а не задаётся
 * заново: служебная страница обязана стоять на той же вертикальной оси,
 * что и главная, иначе переход по ссылке из футера выглядит как переход
 * на другой сайт.
 *
 * Заголовки внутри документа приходят из страниц обычными <h2>, поэтому
 * оформляются здесь цепочкой [&_h2]: добраться до них классом на месте
 * нельзя — разметку документа задаёт вызывающая страница.
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
    <main data-surface="canvas" className="min-h-dvh py-16 lg:py-24">
      <Container>
        <div className="measure">
          <Link href="/" className="t-label text-[var(--accent-fg)] underline underline-offset-4">
            ← На главную
          </Link>

          <h1 className="t-h2 mt-6">{title}</h1>
          <p className="t-label mt-5 text-[var(--fg-3)]">Редакция от {updated}</p>

          {site.isDemo ? (
            <p className="t-sm mt-8 rounded-[var(--radius-surface)] bg-[var(--color-accent-soft)] p-4 text-[var(--fg-2)]">
              <strong className="font-semibold text-[var(--fg)]">Демонстрационный шаблон.</strong>{' '}
              Текст приведён как образец структуры документа и в рабочей версии заменяется
              документом юридического лица компании.
            </p>
          ) : null}

          <div className="t-body mt-10 space-y-5 text-[var(--fg-2)] [&_h2]:mt-10 [&_h2]:border-t [&_h2]:border-[var(--hairline)] [&_h2]:pt-5 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-[var(--fg)] [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
            {children}
          </div>
        </div>
      </Container>
    </main>
  );
}
