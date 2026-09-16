import Link from 'next/link';
import type { Route } from 'next';
import { site, formatPhone } from '@/content/site.config';
import { Container } from '@/components/ui';
import { NAV_LINKS } from '@/lib/nav';

/**
 * Футер. По ТЗ здесь закрываются последние вопросы: куда звонить, куда
 * выезжают, с кем заключается договор и где юридические документы.
 *
 * Тёмная поверхность — не случайный блок, а нижняя опора страницы: светлый
 * холст заканчивается ровно так же, как начинался первым экраном. Колонки
 * лежат на той же 12-колоночной сетке, что и секции.
 */
export function Footer() {
  const { company, legal } = site;

  const messengers = [
    company.whatsapp && {
      label: 'WhatsApp',
      href: `https://wa.me/${company.whatsapp.replace(/\D/g, '')}`,
    },
    company.telegram && { label: 'Telegram', href: `https://t.me/${company.telegram}` },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    // Нижний отступ на мобильном учитывает панель «Позвонить | Рассчитать»:
    // она зафиксирована поверх страницы и без запаса накрывала бы последние
    // строки с реквизитами.
    <footer
      data-surface="ink-deep"
      className="border-t border-[var(--hairline)] pt-16 pb-28 lg:pt-20 lg:pb-12"
    >
      <Container>
        <div className="grid items-start gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="t-h4">{company.name}</p>
            <p className="t-sm mt-3 text-[var(--fg-2)]">{company.geo}</p>
            <p className="t-sm mt-1 text-[var(--fg-2)]">{company.workHours}</p>
          </div>

          <div className="lg:col-span-3">
            <p className="t-label text-[var(--fg-3)]">Связаться</p>

            <a
              href={`tel:${company.phone}`}
              className="t-h3 mt-3 block whitespace-nowrap transition-colors hover:text-[var(--accent-fg)]"
            >
              {formatPhone(company.phone)}
            </a>

            {messengers.length > 0 && (
              <ul className="t-sm mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[var(--fg-2)]">
                {messengers.map((m) => (
                  <li key={m.label}>
                    <a
                      href={m.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 transition-colors hover:text-[var(--fg)]"
                    >
                      {m.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <p className="t-sm mt-3 text-[var(--fg-2)]">{company.address}</p>
          </div>

          <div className="lg:col-span-3">
            <p className="t-label text-[var(--fg-3)]">Разделы</p>
            <ul className="t-sm mt-3 space-y-2 text-[var(--fg-2)]">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-[var(--fg)]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="t-label text-[var(--fg-3)]">Документы</p>
            <ul className="t-sm mt-3 space-y-2 text-[var(--fg-2)]">
              <li>
                <Link
                  href={legal.privacyUrl as Route}
                  className="transition-colors hover:text-[var(--fg)]"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link
                  href={legal.consentUrl as Route}
                  className="transition-colors hover:text-[var(--fg)]"
                >
                  Согласие на обработку данных
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="t-xs mt-12 border-t border-[var(--hairline)] pt-6 text-[var(--fg-3)]">
          <p>{legal.requisites}</p>

          {site.isDemo && (
            <p className="mt-3">
              Демонстрационный сайт. Название, контакты, цены, сроки, отзывы и фотографии —
              заменяемые примеры. Факты, требующие подтверждения, отмечены как [X].
            </p>
          )}
        </div>
      </Container>
    </footer>
  );
}
