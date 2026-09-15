import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyCTA } from '@/components/layout/StickyCTA';
import {
  Hero,
  Calculator,
  Catalog,
  Cases,
  Estimate,
  Durability,
  Process,
  Trust,
  Reviews,
  Faq,
  Contacts,
} from '@/components/sections';
import { localBusinessSchema } from '@/lib/schema-org';

/**
 * Лендинг. Порядок секций = маршрут посетителя из ТЗ:
 * первый экран → расчёт → решения → работы → цена → качество → этапы →
 * доверие → отзывы → вопросы → финальный расчёт.
 *
 * Блоки собраны так, что перестановка под конкретного клиента — это
 * перестановка строк здесь, а не правка компонентов.
 */
export default function Home() {
  const business = localBusinessSchema();

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
        <Durability />
        <Process />
        <Trust />
        <Reviews />
        <Faq />
        <Contacts />
      </main>

      <Footer />
      <StickyCTA />

      {business && (
        <script
          type="application/ld+json"
          // Данные собраны из конфига на сервере, стороннего ввода здесь нет.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}
        />
      )}
    </>
  );
}
