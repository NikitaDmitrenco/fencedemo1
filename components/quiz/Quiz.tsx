'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { site } from '@/content/site.config';
import { estimatePrice, formatRub, type FenceType } from '@/content/pricing';
import { FENCE_TYPES, GATES, HEIGHTS, LENGTH_PRESETS, MESSENGERS } from '@/content/quiz';
import { Button } from '@/components/ui/Button';
import { Consent, Field, Input } from '@/components/ui/Field';
import { OptionCard } from './OptionCard';
import { maskPhone } from '@/lib/phone';
import { clsx } from '@/lib/clsx';
import {
  STEPS,
  canAdvance,
  initialState,
  quizReducer,
  visibleStepCount,
  visibleStepIndex,
} from './state';

const STEP_TITLES: Record<(typeof STEPS)[number], string> = {
  type: 'Что ставим?',
  length: 'Какая длина ограждения?',
  height: 'Какая высота?',
  gates: 'Нужны ли ворота?',
  contact: 'Куда отправить расчёт?',
};

type Status = 'idle' | 'sending' | 'done' | 'error';

export function Quiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [customLength, setCustomLength] = useState('');
  // Момент открытия формы фиксируется в эффекте, а не при рендере: обращение
  // к часам во время рендера делает его неидемпотентным. Ноль до монтирования
  // безопасен — он даёт заведомо большую длительность, то есть проверка на
  // «заполнено слишком быстро» в худшем случае просто не сработает.
  const startedAt = useRef(0);
  const headingRef = useRef<HTMLParagraphElement>(null);
  const isFirstRender = useRef(true);

  // Индекс всегда в границах — его двигает только редьюсер, — но выражение
  // из массива по индексу типизировано как возможно-undefined.
  const step = STEPS[state.step] ?? 'type';

  // Тип решения приходит из карточки каталога. Читаем из адреса напрямую,
  // а не через useSearchParams: предзаполнение — приятная мелочь, и ради неё
  // не стоит уводить страницу из статической генерации.
  useEffect(() => {
    startedAt.current = Date.now();

    const type = new URLSearchParams(window.location.search).get('type');
    if (type && FENCE_TYPES.some((option) => option.value === type)) {
      dispatch({ kind: 'set', patch: { type: type as FenceType } });
    }
  }, []);

  // Смена шага переносит фокус чтения на новый вопрос — иначе человек,
  // который пользуется экранным диктором, остаётся на прежнем месте.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [state.step]);

  const range = useMemo(() => {
    if (state.type === null || state.height === null || state.gates === null) return null;
    return estimatePrice({
      type: state.type,
      length: state.length ?? 0,
      height: state.height,
      gates: state.gates,
      automation: state.automation,
    });
  }, [state.type, state.length, state.height, state.gates, state.automation]);

  async function submit() {
    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'quiz',
          type: state.type,
          length: state.length ?? 0,
          height: state.height,
          gates: state.gates,
          automation: state.automation,
          name: state.name || undefined,
          phone: state.phone,
          messenger: state.messenger,
          consent: state.consent,
          company: '',
          elapsedMs: Date.now() - startedAt.current,
        }),
      });

      const data: { ok?: boolean; error?: string } = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        setError(data.error ?? 'Не удалось отправить заявку');
        setStatus('error');
        return;
      }

      setStatus('done');
    } catch {
      setError('Нет связи с сервером. Проверьте интернет или позвоните нам.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="border border-[var(--color-steel-line)] bg-[var(--color-paper-raised)] p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-none bg-[var(--accent)]">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#14181B"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="mt-5 text-xl font-bold">Заявка отправлена</p>

        <p className="measure mx-auto mt-2 text-[var(--color-ink-soft)]">
          Перезвоним в рабочее время, уточним детали и согласуем замер. Если нужно срочно —
          позвоните сами:{' '}
          <a
            href={`tel:${site.company.phone}`}
            className="font-semibold whitespace-nowrap underline underline-offset-4"
          >
            {site.company.phone.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5')}
          </a>
        </p>
      </div>
    );
  }

  const total = visibleStepCount(state);
  const current = visibleStepIndex(state);

  return (
    <div className="border border-[var(--color-steel-line)] bg-[var(--color-paper-raised)] p-5 sm:p-8">
      {/* Прогресс: человек должен видеть, что вопросов мало и они кончаются. */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={clsx(
                'h-px flex-1 transition-colors duration-300',
                i <= current ? 'bg-[var(--accent)]' : 'bg-[var(--color-steel-line)]',
              )}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-[var(--color-ink-muted)] tabular-nums">
          {current + 1} / {total}
        </span>
      </div>

      <p
        ref={headingRef}
        tabIndex={-1}
        aria-live="polite"
        className="mt-6 text-xl font-bold outline-none sm:text-2xl"
      >
        {STEP_TITLES[step]}
      </p>

      <div className="mt-5">
        {step === 'type' && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {FENCE_TYPES.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                note={option.note}
                image={option.image}
                selected={state.type === option.value}
                onSelect={() => dispatch({ kind: 'pick', patch: { type: option.value } })}
              />
            ))}
          </div>
        )}

        {step === 'length' && (
          <div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {LENGTH_PRESETS.map((value) => (
                <OptionCard
                  key={value}
                  label={`${value} м`}
                  selected={state.length === value}
                  onSelect={() => {
                    setCustomLength('');
                    dispatch({ kind: 'pick', patch: { length: value } });
                  }}
                />
              ))}
            </div>

            <div className="mt-4">
              <Field id="quiz-length" label="Или своя длина, метров">
                <Input
                  id="quiz-length"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={2000}
                  placeholder="например, 64"
                  value={customLength}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setCustomLength(raw);
                    const parsed = Number.parseInt(raw, 10);
                    dispatch({
                      kind: 'set',
                      patch: { length: Number.isFinite(parsed) && parsed > 0 ? parsed : null },
                    });
                  }}
                />
              </Field>
            </div>
          </div>
        )}

        {step === 'height' && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {HEIGHTS.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                note={option.note}
                selected={state.height === option.value}
                onSelect={() => dispatch({ kind: 'pick', patch: { height: option.value } })}
              />
            ))}
          </div>
        )}

        {step === 'gates' && (
          <div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {GATES.map((option) => (
                <OptionCard
                  key={option.value}
                  label={option.label}
                  note={option.note}
                  selected={state.gates === option.value}
                  onSelect={() =>
                    dispatch({
                      kind: 'set',
                      patch: {
                        gates: option.value,
                        automation: option.value === 'net' ? false : state.automation,
                      },
                    })
                  }
                />
              ))}
            </div>

            {state.gates !== null && state.gates !== 'net' && (
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-[var(--radius-control)] border border-[var(--color-steel-line)] p-4">
                <input
                  type="checkbox"
                  checked={state.automation}
                  onChange={(e) =>
                    dispatch({ kind: 'set', patch: { automation: e.target.checked } })
                  }
                  className="size-5 accent-[var(--accent)]"
                />
                <span>
                  <span className="block font-semibold">Нужна автоматика</span>
                  <span className="text-sm text-[var(--color-ink-muted)]">
                    привод, пульты, открывание без выхода из машины
                  </span>
                </span>
              </label>
            )}
          </div>
        )}

        {step === 'contact' && (
          <div>
            {/* Результат показывается ДО запроса телефона. Цена в обмен на
                номер выглядит как торг и отсекает часть посетителей; телефон
                просим за точный расчёт и выезд замерщика. */}
            {range && (
              <div className="rounded-[var(--radius-control)] border border-[var(--accent)]/35 bg-[var(--accent)]/8 p-5">
                <p className="text-sm font-semibold text-[var(--color-ink-soft)]">
                  Предварительно ваш проект обойдётся в
                </p>
                <p className="mt-1.5 text-2xl font-bold sm:text-3xl">
                  {formatRub(range.low)} — {formatRub(range.high)}
                </p>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                  Это оценка без замера. Точную стоимость назовём после выезда на участок — она
                  зависит от грунта, перепадов высот и подъезда.
                </p>
              </div>
            )}

            <div className="mt-5 space-y-4">
              <Field id="quiz-name" label="Как к вам обращаться">
                <Input
                  id="quiz-name"
                  autoComplete="name"
                  placeholder="Имя"
                  value={state.name}
                  onChange={(e) => dispatch({ kind: 'set', patch: { name: e.target.value } })}
                />
              </Field>

              <Field id="quiz-phone" label="Телефон" required>
                <Input
                  id="quiz-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={state.phone}
                  onChange={(e) =>
                    dispatch({ kind: 'set', patch: { phone: maskPhone(e.target.value) } })
                  }
                />
              </Field>

              <div>
                <p className="mb-1.5 text-sm font-semibold">Как удобнее связаться</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {MESSENGERS.map((option) => (
                    <OptionCard
                      key={option.value}
                      label={option.label}
                      selected={state.messenger === option.value}
                      onSelect={() => dispatch({ kind: 'set', patch: { messenger: option.value } })}
                    />
                  ))}
                </div>
              </div>

              <Consent
                id="quiz-consent"
                checked={state.consent}
                onChange={(checked) => dispatch({ kind: 'set', patch: { consent: checked } })}
              >
                Согласен на обработку персональных данных и принимаю{' '}
                <a
                  href={site.legal.privacyUrl}
                  className="font-semibold underline underline-offset-2"
                >
                  политику конфиденциальности
                </a>
              </Consent>

              {/* Ловушка для ботов: скрыта от людей и от экранных дикторов. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] size-0 opacity-0"
              />
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm font-medium text-[var(--color-warn)]">
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        {state.step > 0 && (
          <Button
            variant="outline"
            onClick={() => dispatch({ kind: 'back' })}
            disabled={status === 'sending'}
          >
            Назад
          </Button>
        )}

        {step === 'contact' ? (
          <Button
            size="lg"
            className="flex-1"
            disabled={!canAdvance(state) || status === 'sending'}
            onClick={submit}
          >
            {status === 'sending' ? 'Отправляем…' : 'Получить точный расчёт'}
          </Button>
        ) : (
          <Button
            size="lg"
            className="flex-1"
            disabled={!canAdvance(state)}
            onClick={() => dispatch({ kind: 'next' })}
          >
            Далее
          </Button>
        )}
      </div>
    </div>
  );
}
