import { site, formatPhone } from '@/content/site.config';
import { buttonClass, Reveal, Section } from '@/components/ui';
import { ShortForm } from './ShortForm';

/**
 * Блок 11. Последний понятный шаг после всей аргументации.
 *
 * Слева контакты, справа короткая форма. Телефон здесь крупный и кликабельный:
 * часть людей всё равно предпочтёт позвонить, и прятать номер ради формы
 * означает терять именно этих — самых горячих.
 */
export function Contacts() {
  const { company, legal } = site;

  const messengers = [
    company.whatsapp && {
      label: 'WhatsApp',
      href: `https://wa.me/${company.whatsapp.replace(/\D/g, '')}`,
    },
    company.telegram && { label: 'Telegram', href: `https://t.me/${company.telegram}` },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <Section
      id="contacts"
      tone="ink"
      eyebrow="Контакты"
      title="Посчитаем ваш объект"
      lead="Оставьте заявку или позвоните — ответим на вопросы и согласуем замер в удобное время."
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
        <Reveal className="lg:col-span-5">
          {/* Номер — самый крупный элемент колонки: он же самый короткий путь
              к сделке, всё остальное здесь только подтверждает реальность
              компании. */}
          <a
            href={`tel:${company.phone}`}
            className="t-h2 inline-block tabular-nums transition-colors hover:text-[var(--accent-fg)]"
          >
            {formatPhone(company.phone)}
          </a>

          {messengers.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {messengers.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass('secondary')}
                >
                  {m.label}
                </a>
              ))}
            </div>
          )}

          <dl className="mt-10 space-y-5 border-t border-[var(--hairline)] pt-8">
            <div>
              <dt className="t-xs text-[var(--fg-3)]">География работ</dt>
              <dd className="t-sm mt-1.5 font-semibold text-[var(--fg)]">{company.geo}</dd>
            </div>
            <div>
              <dt className="t-xs text-[var(--fg-3)]">Адрес</dt>
              <dd className="t-sm mt-1.5 font-semibold text-[var(--fg)]">{company.address}</dd>
            </div>
            <div>
              <dt className="t-xs text-[var(--fg-3)]">Время работы</dt>
              <dd className="t-sm mt-1.5 font-semibold text-[var(--fg)]">{company.workHours}</dd>
            </div>
            <div>
              <dt className="t-xs text-[var(--fg-3)]">Реквизиты</dt>
              <dd className="t-sm mt-1.5 font-semibold text-[var(--fg-2)]">{legal.requisites}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-6 lg:col-start-7">
          <ShortForm />
        </Reveal>
      </div>
    </Section>
  );
}
