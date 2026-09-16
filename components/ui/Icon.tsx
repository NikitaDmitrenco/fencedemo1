import type { Proof } from '@/content/types';

/**
 * Иконки системы. Единая трактовка: штрих 1.5, сетка 24, без заливок,
 * без подложек и кружков. Иконка — уточнение к тексту, а не самостоятельная
 * картинка, поэтому она всегда наследует цвет от родителя.
 */
const PATHS: Record<Proof['icon'], string> = {
  shield: 'M12 3l7 3v5.5c0 4.2-2.9 7.6-7 8.5-4.1-.9-7-4.3-7-8.5V6l7-3z',
  factory: 'M3 20V10l5 3.5V10l5 3.5V10l5 3.5V20H3zM17 10V4h3v6',
  wrench:
    'M14.8 6.2a3.6 3.6 0 004.7 4.6l-8.2 8.2a2.2 2.2 0 01-3.1-3.1l8.2-8.2a3.6 3.6 0 00-1.6-1.5z',
  document: 'M6 3h7l5 5v13H6V3zM13 3v5h5M9 13h6M9 17h6',
};

function Glyph({ size = 24, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function ProofIcon({ name }: { name: Proof['icon'] }) {
  return (
    <Glyph>
      <path d={PATHS[name]} />
    </Glyph>
  );
}

export function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <Glyph size={size}>
      <path d="M5 12h13M12 5l7 7-7 7" />
    </Glyph>
  );
}

export function CheckIcon({ size = 20 }: { size?: number }) {
  return (
    <Glyph size={size}>
      <path d="M4 12.5l5 5L20 6.5" />
    </Glyph>
  );
}

export function PhoneIcon({ size = 18 }: { size?: number }) {
  return (
    <Glyph size={size}>
      <path d="M5 3.5h3.4l1.5 3.7-2 1.5a12.6 12.6 0 005.4 5.4l1.5-2 3.7 1.5V17a2 2 0 01-2.2 2A15.8 15.8 0 013 5.7a2 2 0 012-2.2z" />
    </Glyph>
  );
}
