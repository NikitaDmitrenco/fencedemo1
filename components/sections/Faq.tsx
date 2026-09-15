import { site } from '@/content/site.config';
import { Accordion, AccordionItem, Reveal, Section } from '@/components/ui';

/**
 * Блок 10. Снять оставшиеся коммерческие возражения.
 *
 * Аккордеон на нативных <details>: работает с клавиатуры, находится поиском
 * по странице и не стоит ни байта JavaScript.
 *
 * Разметка FAQPage отдаётся поисковикам — вопросы из этого блока попадают
 * в выдачу и приводят людей, у которых уже есть конкретный вопрос.
 */
export function Faq() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: site.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <Section
      id="faq"
      tone="raised"
      eyebrow="Вопросы"
      title="Коротко о главном"
      lead="Если вашего вопроса здесь нет — позвоните, ответим без лишних формальностей."
    >
      <div className="ml-auto max-w-4xl">
        <Reveal>
          <div>
            <Accordion>
              {site.faq.map((item) => (
                <AccordionItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>

      <script
        type="application/ld+json"
        // Данные собраны из конфига на сервере, стороннего ввода здесь нет.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </Section>
  );
}
