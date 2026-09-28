'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site.config';
import { Button, Consent, Field, Input, Textarea, PhoneInput } from '@/components/ui';
import { OptionCard } from '@/components/quiz/OptionCard';
import { MESSENGERS, type Messenger } from '@/content/quiz';
import { isPhoneComplete } from '@/lib/phone';
import { DEFAULT_COUNTRY_ISO } from '@/lib/phone-countries';
import { LEAD_API_URL } from '@/lib/config';
import { clsx } from '@/lib/clsx';

/**
 * Короткая форма финального блока.
 *
 * Отдельная от квиза: человек, дочитавший страницу до конца, уже всё для себя
 * решил, и гнать его обратно через пять шагов — верный способ его потерять.
 * Уходит в тот же /api/lead с другим видом заявки.
 */

/**
 * Поверхность формы и её же поверхность после отправки. Вынесена в константу,
 * чтобы блок не менял размер и фон при переходе в состояние «принято» —
 * иначе финальная секция дёргается ровно в тот момент, когда человек ждёт
 * подтверждения.
 *
 * Цвета не задаются явно: контролы внутри читают переменные тёмной секции
 * сами, поэтому здесь нет ни одного переопределения через !important.
 */
const SHELL = clsx(
  'rounded-[var(--radius-surface)] border border-[var(--hairline)]',
  'bg-[var(--surface-bg)] p-6 lg:p-8',
);

export function ShortForm() {
  const [task, setTask] = useState('');
  const [length, setLength] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(DEFAULT_COUNTRY_ISO);
  const [messenger, setMessenger] = useState<Messenger>('call');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  // Момент открытия формы фиксируется в эффекте, а не при рендере: часы во
  // время рендера делают его неидемпотентным, а до монтирования ноль безопасен.
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const ready = isPhoneComplete(phone, country) && consent;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('sending');
    setError(null);

    const parsedLength = Number.parseInt(length, 10);

    try {
      const response = await fetch(LEAD_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'short',
          task: task.trim(),
          length: Number.isFinite(parsedLength) && parsedLength > 0 ? parsedLength : undefined,
          name: name || undefined,
          phone,
          country,
          messenger,
          consent,
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
      // Сохраняем позицию скролла после отправки
      const targetRef = formRef.current || doneRef.current;
      targetRef?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch {
      setError('Нет связи с сервером. Проверьте интернет или позвоните нам.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div ref={doneRef} className={clsx(SHELL, 'text-center')}>
        <p className="t-h3">Заявка принята</p>
        <p className="t-sm measure mx-auto mt-3 text-[var(--fg-2)]">
          Перезвоним в рабочее время и уточним детали. Если нужно срочно — звоните сами.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className={SHELL}>
      <p className="t-h3">Оставьте заявку</p>
      <p className="t-sm mt-2 text-[var(--fg-2)]">
        Перезвоним, уточним детали и посчитаем точную стоимость.
      </p>

      <div className="mt-6 space-y-5">
        <Field id="short-task" label="Что нужно сделать" required>
          <Textarea
            id="short-task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Забор из профнастила и откатные ворота"
          />
        </Field>

        <Field id="short-length" label="Примерная длина, метров" hint="Если знаете — так точнее">
          <Input
            id="short-length"
            type="number"
            inputMode="numeric"
            min={1}
            max={2000}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="например, 40"
            aria-describedby="short-length-hint"
          />
        </Field>

        <Field id="short-name" label="Как к вам обращаться">
          <Input
            id="short-name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
          />
        </Field>

        <Field id="short-phone" label="Телефон" required>
          <PhoneInput
            id="short-phone"
            value={phone}
            onChange={setPhone}
            country={country}
            onCountryChange={setCountry}
          />
        </Field>

        <div>
          <p className="t-xs mb-2 block font-semibold text-[var(--fg)]">Как удобнее связаться</p>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {MESSENGERS.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                selected={messenger === option.value}
                onSelect={() => setMessenger(option.value)}
              />
            ))}
          </div>
        </div>

        <Consent id="short-consent" checked={consent} onChange={setConsent}>
          Согласен на обработку персональных данных и принимаю{' '}
          <a href={site.legal.privacyUrl} className="font-semibold underline underline-offset-2">
            политику конфиденциальности
          </a>
        </Consent>

        {/* Ловушка для ботов: скрыта от людей и от экранных дикторов — человек
            с диктором не должен услышать поле, которое ему нельзя заполнять. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] size-0 opacity-0"
        />
      </div>

      {/* На тёмной поверхности обычный --color-danger уходит в грязь,
          поэтому у ошибки отдельный светлый вариант того же семантического
          цвета. */}
      {error && (
        <p role="alert" className="t-sm mt-4 font-medium text-[var(--color-danger-light)]">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        full
        className="mt-6"
        disabled={!ready || status === 'sending'}
      >
        {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
      </Button>
    </form>
  );
}
