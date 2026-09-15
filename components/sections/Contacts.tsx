import { site, formatPhone } from '@/content/site.config';
import { Reveal, Section } from '@/components/ui';
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
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div>
            <a
              href={`tel:${company.phone}`}
              className="inline-block text-3xl font-bold text-white transition-colors hover:text-[var(--accent)] lg:text-4xl"
            >
              {formatPhone(company.phone)}
            </a>

            {messengers.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {messengers.map((m) => (
                  <a
                    key={m.label}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[var(--radius-control)] border border-white/20 px-4 py-2.5 font-semibold text-white transition-colors hover:border-white/45"
                  >
                    {m.label}
                  </a>
                ))}
              </div>
            )}

            <dl className="mt-10 space-y-5 border-t border-white/12 pt-8">
              <div>
                <dt className="text-sm text-white/50">География работ</dt>
                <dd className="mt-1 font-semibold text-white">{company.geo}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Адрес</dt>
                <dd className="mt-1 font-semibold text-white">{company.address}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Время работы</dt>
                <dd className="mt-1 font-semibold text-white">{company.workHours}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Реквизиты</dt>
                <dd className="mt-1 text-white/75">{legal.requisites}</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ShortForm />
        </Reveal>
      </div>
    </Section>
  );
}
