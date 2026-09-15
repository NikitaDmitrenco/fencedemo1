import type { FenceType, GateType, Height } from '@/content/pricing';
import type { Messenger } from '@/content/quiz';

export const STEPS = ['type', 'length', 'height', 'gates', 'contact'] as const;
export type StepName = (typeof STEPS)[number];

export interface QuizState {
  step: number;
  type: FenceType | null;
  length: number | null;
  height: Height | null;
  gates: GateType | null;
  automation: boolean;
  name: string;
  phone: string;
  messenger: Messenger;
  consent: boolean;
}

export const initialState: QuizState = {
  step: 0,
  type: null,
  length: null,
  height: null,
  gates: null,
  automation: false,
  name: '',
  phone: '',
  messenger: 'call',
  consent: false,
};

export type QuizAction =
  | { kind: 'set'; patch: Partial<QuizState> }
  /** Выбор варианта: сохраняет ответ и сразу ведёт дальше. */
  | { kind: 'pick'; patch: Partial<QuizState> }
  | { kind: 'next' }
  | { kind: 'back' }
  | { kind: 'goto'; step: number }
  | { kind: 'reset' };

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.kind) {
    case 'set':
      return { ...state, ...action.patch };

    case 'pick': {
      const next = { ...state, ...action.patch };
      // «Только ворота» — длина и высота забора не нужны, спрашивать их
      // значит заставлять человека отвечать на бессмысленные вопросы.
      const target =
        next.type === 'tolko-vorota' && STEPS[state.step] === 'type' ? 3 : state.step + 1;
      return { ...next, step: Math.min(target, STEPS.length - 1) };
    }

    case 'next':
      return { ...state, step: Math.min(state.step + 1, STEPS.length - 1) };

    case 'back': {
      // Симметрично пропуску вперёд, иначе «Назад» приведёт на шаг,
      // которого человек не видел.
      const target = state.type === 'tolko-vorota' && state.step === 3 ? 0 : state.step - 1;
      return { ...state, step: Math.max(target, 0) };
    }

    case 'goto':
      return { ...state, step: Math.min(Math.max(action.step, 0), STEPS.length - 1) };

    case 'reset':
      return initialState;
  }
}

/** Можно ли уйти с текущего шага дальше. */
export function canAdvance(state: QuizState): boolean {
  switch (STEPS[state.step]) {
    case 'type':
      return state.type !== null;
    case 'length':
      return state.length !== null && state.length > 0;
    case 'height':
      return state.height !== null;
    case 'gates':
      return state.gates !== null;
    case 'contact':
      return state.phone.replace(/\D/g, '').length === 11 && state.consent;
    default:
      return false;
  }
}

/** Шаги, которые человек реально проходит при текущем выборе. */
export function visibleStepCount(state: QuizState): number {
  return state.type === 'tolko-vorota' ? STEPS.length - 2 : STEPS.length;
}

/** Порядковый номер текущего шага среди видимых — для прогресса. */
export function visibleStepIndex(state: QuizState): number {
  if (state.type === 'tolko-vorota' && state.step >= 3) return state.step - 2;
  return state.step;
}
