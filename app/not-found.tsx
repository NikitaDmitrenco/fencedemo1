import { site, formatPhone } from '@/content/site.config';
import { ButtonLink, Container } from '@/components/ui';

export default function NotFound() {
  return (
    <main data-surface="canvas" className="flex min-h-dvh flex-col justify-center py-16 lg:py-24">
      <Container>
        <div className="measure">
          <p className="t-label text-[var(--accent-fg)]">Ошибка 404</p>

          <h1 className="t-h2 mt-4">Такой страницы нет</h1>

          <p className="t-body mt-5 text-[var(--fg-2)]">
            Возможно, ссылка устарела. Вернитесь на главную — там есть расчёт стоимости, примеры
            работ и цены.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <ButtonLink href="/" variant="primary" size="md">
              На главную
            </ButtonLink>

            <a
              href={`tel:${site.company.phone}`}
              className="t-sm font-semibold underline underline-offset-4"
            >
              {formatPhone(site.company.phone)}
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}
