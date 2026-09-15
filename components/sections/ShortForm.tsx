'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site.config';
import { Button } from '@/components/ui/Button';
import { Consent, Field, Input, Textarea } from '@/components/ui/Field';
import { OptionCard } from '@/components/quiz/OptionCard';
import { MESSENGERS, type Messenger } from '@/content/quiz';
import { maskPhone } from '@/lib/phone';

/**
 * Короткая форма финального блока.
 *
 * Отдельная от квиза: человек, дочитавший страницу до конца, уже всё для себя
 * решил, и гнать его обратно через пять шагов — верный способ его потерять.
 * Уходит в тот же /api/lead с другим видом заявки.
 */
export function ShortForm() {
  const [task, setTask] = useState('');
  const [length, setLength] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [messenger, setMessenger] = useState<Messenger>('call');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const ready = task.trim().length >= 3 && phone.replace(/\D/g, '').length === 11 && consent;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('sending');
    setError(null);

    const parsedLength = Number.parseInt(length, 10);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'short',
          task: task.trim(),
          length: Number.isFinite(parsedLength) && parsedLength > 0 ? parsedLength : undefined,
          name: name || undefined,
          phone,
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
    } catch {
      setError('Нет связи с сервером. Проверьте интернет или позвоните нам.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="border border-white/14 bg-[#151b1e] p-8 text-center">
        <p className="text-xl font-bold text-white">Заявка принята</p>
        <p className="measure mx-auto mt-2 text-white/70">
          Перезвоним в рабочее время и уточним детали. Если нужно срочно — звоните сами.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-white/14 bg-[#151b1e] p-6 lg:p-8">
      <p className="text-lg font-bold text-white">Оставьте заявку</p>
      <p className="mt-1.5 text-[0.9375rem] text-white/65">
        Перезвоним, уточним детали и посчитаем точную стоимость.
      </p>

      <div className="mt-6 space-y-4 [&_label]:text-white [&_p]:text-white/55">
        <Field id="short-task" label="Что нужно сделать" required>
          <Textarea
            id="short-task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Забор из профнастила и откатные ворота"
            className="!bg-transparent !text-white !border-white/20 placeholder:!text-white/40"
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
            className="!bg-transparent !text-white !border-white/20 placeholder:!text-white/40"
          />
        </Field>

        <Field id="short-name" label="Как к вам обращаться">
          <Input
            id="short-name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
            className="!bg-transparent !text-white !border-white/20 placeholder:!text-white/40"
          />
        </Field>

        <Field id="short-phone" label="Телефон" required>
          <Input
            id="short-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            placeholder="+7 (___) ___-__-__"
            className="!bg-transparent !text-white !border-white/20 placeholder:!text-white/40"
          />
        </Field>

        <div>
          <p className="mb-1.5 text-sm font-semibold text-white">Как удобнее связаться</p>
          <div className="grid grid-cols-3 gap-2.5 [&_button]:!border-white/20 [&_button]:!bg-transparent [&_button]:!text-white">
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

        <div className="[&_a]:text-white [&_span]:text-white/70">
          <Consent id="short-consent" checked={consent} onChange={setConsent}>
            Согласен на обработку персональных данных и принимаю{' '}
            <a href={site.legal.privacyUrl} className="font-semibold underline underline-offset-2">
              политику конфиденциальности
            </a>
          </Consent>
        </div>

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
        <p role="alert" className="mt-4 text-sm font-medium text-[#FFB4A2]">
          {error}
        </p>
      )}

      <Button
        type="submit"
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
