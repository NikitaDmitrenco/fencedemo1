import { site } from '@/content/site.config';
import { Accordion, AccordionItem, Card, Reveal, Section } from '@/components/ui';

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
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Card className="px-5 py-2 sm:px-7">
            <Accordion>
              {site.faq.map((item) => (
                <AccordionItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </Accordion>
          </Card>
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
