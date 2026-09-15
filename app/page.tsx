import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyCTA } from '@/components/layout/StickyCTA';
import { Hero, Calculator, Catalog, Cases, Estimate } from '@/components/sections';
import { Section } from '@/components/ui';

/**
 * Лендинг. Порядок секций = маршрут посетителя из ТЗ:
 * первый экран → расчёт → решения → работы → цена → доверие → закрытие.
 *
 * Блоки собраны так, что перестановка под конкретного клиента — это
 * перестановка строк здесь, а не правка компонентов.
 *
 * Готово: 1, 2, 3, 4, 5. Блоки 6–11 подключаются на Э4.
 */
export default function Home() {
  return (
    <>
      <Header />

      <main id="top">
        {/* Пока маркер в зоне видимости, шапка остаётся прозрачной. */}
        <div id="header-sentinel" aria-hidden="true" className="absolute top-24 h-px w-px" />

        <Hero />

        {/* Ниже этого маркера показывается нижняя панель с CTA. */}
        <div id="sticky-sentinel" aria-hidden="true" className="h-px w-px" />

        <Calculator />

        <Catalog />
        <Cases />
        <Estimate />

        <Placeholder
          id="faq"
          stage="Э4"
          title="Срок службы, этапы, доверие, отзывы и FAQ"
          text="Что влияет на срок службы забора, как проходит работа, проверяемые факты о компании, отзывы с Яндекс Карт и 2ГИС, ответы на возражения и финальная форма с контактами."
        />
      </main>

      <Footer />
      <StickyCTA />
    </>
  );
}

/** Метка незавершённого блока. Убирается вместе с подключением секции. */
function Placeholder({
  id,
  stage,
  title,
  text,
}: {
  id: string;
  stage: string;
  title: string;
  text: string;
}) {
  return (
    <Section id={id} eyebrow={`${stage} · в работе`} title={title} lead={text}>
      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-steel)] px-6 py-10 text-center text-sm text-[var(--color-ink-muted)]">
        Блок собирается на этапе {stage}
      </div>
    </Section>
  );
}
