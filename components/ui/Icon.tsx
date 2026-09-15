import type { Proof } from '@/content/types';

/**
 * Иконки доказательств первого экрана. Инлайн-SVG вместо шрифта или спрайта:
 * четыре штриховых значка не стоят отдельного запроса.
 */
const PATHS: Record<Proof['icon'], string> = {
  shield: 'M12 3l7 3v5.5c0 4.2-2.9 7.6-7 8.5-4.1-.9-7-4.3-7-8.5V6l7-3z',
  factory: 'M3 20V10l5 3.5V10l5 3.5V10l5 3.5V20H3zM17 10V4h3v6',
  wrench:
    'M14.8 6.2a3.6 3.6 0 004.7 4.6l-8.2 8.2a2.2 2.2 0 01-3.1-3.1l8.2-8.2a3.6 3.6 0 00-1.6-1.5z',
  document: 'M6 3h7l5 5v13H6V3zM13 3v5h5M9 13h6M9 17h6',
};

export function ProofIcon({ name }: { name: Proof['icon'] }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13M12 5l7 7-7 7" />
    </svg>
  );
}
