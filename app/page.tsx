import { site } from '@/content/site.config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyCTA } from '@/components/layout/StickyCTA';
import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  ButtonLink,
  Card,
  Consent,
  Container,
  Field,
  Input,
  Reveal,
  Section,
  Textarea,
} from '@/components/ui';
import { CALC_ANCHOR } from '@/lib/nav';

/**
 * Этап Э1: витрина дизайн-системы.
 *
 * Страница временная — показывает собранный UI-kit, шапку, футер и нижнюю
 * панель в работе. На Э2 её содержимое заменяется реальными секциями лендинга
 * из docs/PLAN.md §5; компоненты и раскладка остаются те же.
 */

const PALETTE = [
  { name: 'Графит', value: '#14181B', token: '--color-ink' },
  { name: 'Текст', value: '#3A4247', token: '--color-ink-soft' },
  { name: 'Молочный', value: '#F7F5F2', token: '--color-paper' },
  { name: 'Металл', value: '#8B9399', token: '--color-steel' },
  { name: 'Акцент', value: site.brand.accent, token: '--accent' },
];

export default function Home() {
  return (
    <>
      <Header />

      <main id="top">
        {/* Маркер для шапки: пока он в зоне видимости, шапка прозрачная. */}
        <div id="header-sentinel" aria-hidden="true" className="absolute top-20 h-px w-px" />

        {/* Заглушка первого экрана: проверяет поведение шапки поверх тёмного фона. */}
        <section className="relative flex min-h-[78svh] items-end bg-[var(--color-ink)] pt-28 pb-14 text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                'radial-gradient(120% 80% at 75% 15%, rgba(224,163,60,0.22), transparent 62%), linear-gradient(180deg, #1D2327 0%, #14181B 100%)',
            }}
          />

          <Container className="relative">
            <Badge tone="accent" className="!bg-white/12 !text-white !border-white/25">
              Этап Э1 · дизайн-система
            </Badge>

            <h1 className="h-display mt-5 max-w-3xl text-balance">{site.hero.title}</h1>

            <p className="measure mt-5 text-lg text-white/75">{site.hero.subtitle}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={CALC_ANCHOR} size="lg">
                Рассчитать стоимость
              </ButtonLink>
              <ButtonLink href="#cases" variant="ghost" size="lg">
                Посмотреть работы
              </ButtonLink>
            </div>

            <ul className="mt-12 grid gap-x-8 gap-y-5 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {site.hero.proofs.map((proof) => (
                <li key={proof.title}>
                  <p className="font-bold">{proof.title}</p>
                  <p className="mt-0.5 text-sm text-white/60">{proof.note}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Ниже этого маркера показывается нижняя панель с CTA. */}
        <div id="sticky-sentinel" aria-hidden="true" className="h-px w-px" />

        <Section
          eyebrow="Палитра"
          title="Графит, молочный, металл и ровно один акцент"
          lead="Акцент занят главной кнопкой. Второй акцентный цвет отбирал бы у неё внимание, поэтому в системе его нет — под фирменный стиль клиента меняется значение одной переменной."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {PALETTE.map((color, i) => (
              <Reveal key={color.token} delay={i * 50}>
                <Card className="overflow-hidden">
                  <div className="h-20 w-full" style={{ backgroundColor: color.value }} />
                  <div className="p-4">
                    <p className="font-semibold">{color.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-[var(--color-ink-muted)]">
                      {color.value}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section
          id="catalog"
          tone="raised"
          eyebrow="Компоненты"
          title="Кнопки, карточки и метки"
          lead="Иерархия кнопок удерживает правило «один доминирующий CTA»: заливка акцентом — только у расчёта стоимости, всё остальное вторично."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <Card className="p-6">
                <p className="text-sm font-bold">Кнопки</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button>Рассчитать стоимость</Button>
                  <Button variant="outline">Посмотреть работы</Button>
                  <Button disabled>Отправка…</Button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button size="lg">Крупная</Button>
                  <Button variant="outline" size="lg">
                    Крупная вторичная
                  </Button>
                </div>
              </Card>
            </Reveal>

            <Reveal delay={80}>
              <Card className="p-6">
                <p className="text-sm font-bold">Метки</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge>Гарантия [X] лет</Badge>
                  <Badge tone="accent">от 2 100 ₽/м.п.</Badge>
                  <Badge tone="ink">Яндекс Карты</Badge>
                </div>

                <p className="mt-7 text-sm font-bold">Карточка объекта</p>
                <Card interactive className="mt-4 p-5">
                  <p className="font-bold">Участок в коттеджном посёлке</p>
                  <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                    Профнастил · 64 м · высота 2 м · откатные ворота
                  </p>
                  <p className="mt-3 font-bold text-[var(--color-ink)]">289 000 ₽ · 7 дней</p>
                </Card>
              </Card>
            </Reveal>
          </div>
        </Section>

        <Section
          id="prices"
          tone="ink"
          eyebrow="Тёмная секция"
          title="Способ разбить длинную страницу"
          lead="Контраст вместо рамок и теней: длинный лендинг нуждается в ритме, но визуальный шум ТЗ прямо запрещает."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {site.estimate.slice(0, 3).map((row, i) => (
              <Reveal key={row.item} delay={i * 70}>
                <div className="rounded-[var(--radius-card)] border border-white/12 bg-white/5 p-5">
                  <p className="font-bold text-white">{row.item}</p>
                  <p className="mt-1.5 text-sm text-white/60">{row.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section
          id="cases"
          eyebrow="Формы"
          title="Поля, согласие и аккордеон"
          lead="Аккордеон собран на нативных details — работает с клавиатуры, находится поиском по странице и не стоит ни байта JavaScript."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <Card className="p-6">
                <div className="space-y-5">
                  <Field id="demo-name" label="Как к вам обращаться" required>
                    <Input id="demo-name" name="name" placeholder="Имя" autoComplete="name" />
                  </Field>

                  <Field
                    id="demo-phone"
                    label="Телефон"
                    hint="Перезвоним в рабочее время и уточним детали"
                  >
                    <Input
                      id="demo-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="+7 (___) ___-__-__"
                      aria-describedby="demo-phone-hint"
                    />
                  </Field>

                  <Field
                    id="demo-task"
                    label="Что нужно сделать"
                    error="Опишите объект в двух словах"
                  >
                    <Textarea
                      id="demo-task"
                      name="task"
                      invalid
                      placeholder="Забор 40 метров и откатные ворота"
                      aria-describedby="demo-task-error"
                    />
                  </Field>

                  <Consent id="demo-consent">
                    Согласен на обработку персональных данных и принимаю{' '}
                    <a
                      href={site.legal.privacyUrl}
                      className="font-semibold underline underline-offset-2"
                    >
                      политику конфиденциальности
                    </a>
                  </Consent>

                  <Button full size="lg">
                    Получить расчёт
                  </Button>
                </div>
              </Card>
            </Reveal>

            <Reveal delay={80}>
              <Card id="faq" className="p-6">
                <Accordion>
                  {site.faq.slice(0, 4).map((item) => (
                    <AccordionItem key={item.q} question={item.q} answer={item.a} />
                  ))}
                </Accordion>
              </Card>
            </Reveal>
          </div>
        </Section>
      </main>

      <Footer />
      <StickyCTA />
    </>
  );
}
