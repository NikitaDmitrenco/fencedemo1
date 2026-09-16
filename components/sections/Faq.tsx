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
      tone="canvas"
      eyebrow="Вопросы"
      title="Коротко о главном"
      lead="Если вашего вопроса здесь нет — позвоните, ответим без лишних формальностей."
    >
      {/* Колонки 4–12 — та же ось, что у заголовка секции: вопросы начинаются
          ровно под ним, а рубрика слева остаётся единственным элементом
          первых трёх колонок на всей странице. */}
      <div className="grid gap-x-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-9 lg:col-start-4">
          <Accordion>
            {site.faq.map((item) => (
              <AccordionItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </Accordion>
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
