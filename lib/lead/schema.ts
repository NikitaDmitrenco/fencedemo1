import { z } from 'zod';
import { normalizePhone } from '@/lib/phone';

/**
 * Схема заявки. Одна на клиент и сервер: браузеру верить нельзя, а
 * расхождение между двумя схемами рано или поздно пропускает мусор.
 *
 * Сообщения заданы явно и по-русски: текст ошибки показывается посетителю,
 * и «Too big: expected number to be <=2000» в форме забора выглядит поломкой.
 */
const baseLead = z.object({
  type: z.enum(
    ['profnastil', 'evroshtaketnik', 'setka-3d', 'zhalyuzi', 'komplekt', 'tolko-vorota'],
    'Выберите тип ограждения',
  ),

  // Ноль допустим только для «только ворота» — проверка ниже.
  // 2000 м не предел, но заявка на 50 000 м почти наверняка опечатка или бот.
  length: z
    .number('Укажите длину ограждения')
    .int('Длина указывается целым числом метров')
    .min(0, 'Длина не может быть отрицательной')
    .max(2000, 'Для объектов длиннее 2000 м позвоните нам — посчитаем отдельно'),

  height: z.union(
    [z.literal(1.5), z.literal(1.8), z.literal(2), z.literal(2.5)],
    'Выберите высоту ограждения',
  ),

  gates: z.enum(['otkatnye', 'raspashnye', 'kalitka', 'net'], 'Выберите тип ворот'),

  automation: z.boolean('Укажите, нужна ли автоматика'),

  name: z.string().trim().max(80, 'Слишком длинное имя').optional(),

  phone: z
    .string('Укажите телефон')
    .transform((value) => normalizePhone(value))
    .refine((value): value is string => value !== null, 'Введите телефон полностью'),

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
});

/**
 * Длина обязательна для всех решений, кроме «только ворота»: там забор не
 * ставят, и требовать метраж было бы бессмысленно.
 */
export const leadSchema = baseLead.refine(
  (lead) => lead.type === 'tolko-vorota' || lead.length >= 1,
  { message: 'Укажите длину ограждения', path: ['length'] },
);

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
