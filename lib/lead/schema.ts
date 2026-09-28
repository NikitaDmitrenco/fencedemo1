import { z } from 'zod';
import { normalizePhone } from '@/lib/phone';
import { DEFAULT_COUNTRY_ISO } from '@/lib/phone-countries';

/**
 * Схема заявки. Одна на клиент и сервер: браузеру верить нельзя, а
 * расхождение между двумя схемами рано или поздно пропускает мусор.
 *
 * Сообщения заданы явно и по-русски: текст ошибки показывается посетителю,
 * и «Too big: expected number to be <=2000» в форме забора выглядит поломкой.
 */

/** Поля, общие для всех форм сайта. */
const contactFields = {
  name: z.string().trim().max(80, 'Слишком длинное имя').optional(),

  phone: z
    .string('Укажите телефон')
    .transform((value) => {
      // Пытаемся нормализовать номер. Если не удалось — вернём null,
      // а следующая проверка покажет ошибку.
      return normalizePhone(value) ?? value;
    })
    .refine(
      (value) => {
        // Принимаем номер если он содержит хотя бы 7 цифр (минимум для любой страны)
        const digits = value.replace(/\D/g, '');
        return digits.length >= 7;
      },
      'Введите телефон полностью',
    ),

  country: z.string().default(DEFAULT_COUNTRY_ISO),

  messenger: z.enum(['call', 'whatsapp', 'telegram'], 'Выберите способ связи'),

  consent: z.literal(true, 'Нужно согласие на обработку данных'),

  /**
   * Ловушка для ботов: поле скрыто от людей и заполняется только автоматами.
   *
   * Схема его НЕ отклоняет — иначе бот получит внятную ошибку и поймёт, какое
   * поле нужно оставить пустым. Заполненную ловушку молча отбрасывает маршрут.
   */
  company: z.string().max(500).optional(),

  /** Сколько миллисекунд человек провёл в форме — ниже порога это автомат. */
  elapsedMs: z.number().int().nonnegative().optional(),
};

/** Длина ограждения. Ноль допустим только там, где забор не ставят. */
const lengthField = z
  .number('Укажите длину ограждения')
  .int('Длина указывается целым числом метров')
  .min(0, 'Длина не может быть отрицательной')
  .max(2000, 'Для объектов длиннее 2000 м позвоните нам — посчитаем отдельно');

/** Заявка из квиза: все параметры объекта известны. */
const quizLead = z.object({
  kind: z.literal('quiz'),
  type: z.enum(
    ['profnastil', 'evroshtaketnik', 'setka-3d', 'zhalyuzi', 'komplekt', 'tolko-vorota'],
    'Выберите тип ограждения',
  ),
  length: lengthField,
  height: z.union(
    [z.literal(1.5), z.literal(1.8), z.literal(2), z.literal(2.5)],
    'Выберите высоту ограждения',
  ),
  gates: z.enum(['otkatnye', 'raspashnye', 'kalitka', 'net'], 'Выберите тип ворот'),
  automation: z.boolean('Укажите, нужна ли автоматика'),
  ...contactFields,
});

/**
 * Короткая заявка из финального блока: человек уже всё прочитал и хочет
 * просто оставить контакт. Заставлять его проходить квиз на этом месте
 * значило бы терять тех, кто уже готов.
 */
const shortLead = z.object({
  kind: z.literal('short'),
  task: z
    .string('Опишите, что нужно сделать')
    .trim()
    .min(3, 'Опишите задачу хотя бы парой слов')
    .max(500, 'Слишком длинное описание — расскажете подробнее по телефону'),
  length: lengthField.optional(),
  ...contactFields,
});

export const leadSchema = z
  .discriminatedUnion('kind', [quizLead, shortLead])
  // Длина обязательна для всех решений квиза, кроме «только ворота»: там
  // забор не ставят, и требовать метраж было бы бессмысленно.
  .refine((lead) => lead.kind !== 'quiz' || lead.type === 'tolko-vorota' || lead.length >= 1, {
    message: 'Укажите длину ограждения',
    path: ['length'],
  });

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
