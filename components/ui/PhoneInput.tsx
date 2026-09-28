'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from '@/lib/clsx';
import { COUNTRIES, countryByIso, DEFAULT_COUNTRY_ISO, type CountryCode } from '@/lib/phone-countries';
import { maskPhone } from '@/lib/phone';

/**
 * Поле ввода телефона с выбором страны.
 *
 * Состоит из:
 * 1. Выпадающего списка стран (код страны + флаг/название)
 * 2. Поля ввода с маской для выбранной страны
 *
 * Внешний интерфейс совместим с существующими формами:
 * - value — отформатированный номер (например "+7 (900) 123-45-67")
 * - onChange — вызывается при изменении значения
 */
interface PhoneInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  country?: string;
  onCountryChange?: (iso: string) => void;
  placeholder?: string;
  invalid?: boolean;
  autoComplete?: string;
  className?: string;
}

const CONTROL = clsx(
  'w-full rounded-[var(--radius-control)] border border-[var(--hairline-strong)]',
  'bg-[var(--field-bg)] px-4 text-[var(--fg)]',
  'min-h-13 py-3',
  'placeholder:text-[var(--fg-3)]',
  'transition-colors duration-150 focus:border-[var(--fg)] focus:outline-none',
  'text-[16px]',
);

export function PhoneInput({
  id,
  value,
  onChange,
  country = DEFAULT_COUNTRY_ISO,
  onCountryChange,
  placeholder,
  invalid,
  autoComplete = 'tel',
  className,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = countryByIso(country);
  // Плейсхолдер только с маской, без кода страны (код уже в кнопке)
  const displayPlaceholder = placeholder ?? selectedCountry.mask.replace(/X/g, '_');

  // Фильтрация стран по поиску
  const filteredCountries = search
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.iso.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search),
      )
    : COUNTRIES;

  // Закрытие дропдауна при клике вне
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskPhone(e.target.value, country);
    onChange(masked);
  }

  function handleCountrySelect(c: CountryCode) {
    onCountryChange?.(c.iso);
    setIsOpen(false);
    setSearch('');
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    }
  }

  return (
    <div className={clsx('relative', className)}>
      <div className="flex">
        {/* Кнопка выбора страны */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'flex items-center gap-1.5 border border-r-0 px-3',
            'rounded-l-[var(--radius-control)] bg-[var(--field-bg)]',
            'border-[var(--hairline-strong)] text-[var(--fg)]',
            'transition-colors duration-150 hover:bg-[var(--fg-3)]',
            'min-h-13 text-[16px]',
            isOpen && 'border-[var(--fg)]',
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Выбор страны"
        >
          <span className="text-sm font-medium">+{selectedCountry.dialCode}</span>
          <span className="text-[var(--fg-3)] text-xs">{selectedCountry.iso}</span>
          <svg
            className={clsx('size-3 transition-transform', isOpen && 'rotate-180')}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 4l4 4 4-4" />
          </svg>
        </button>

        {/* Поле ввода номера */}
        <input
          ref={inputRef}
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          className={clsx(
            CONTROL,
            'rounded-l-none',
            invalid && 'border-[var(--color-danger)]',
          )}
          value={value}
          onChange={handleInputChange}
          placeholder={displayPlaceholder}
          aria-invalid={invalid || undefined}
        />
      </div>

      {/* Выпадающий список стран */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={clsx(
            'absolute z-50 mt-1 w-full max-h-60 overflow-auto',
            'rounded-[var(--radius-control)] border border-[var(--hairline-strong)]',
            'shadow-lg',
          )}
          style={{ backgroundColor: 'var(--surface-bg)' }}
          role="listbox"
          aria-label="Список стран"
        >
          {/* Поиск */}
          <div
            className="sticky top-0 p-2 border-b border-[var(--hairline-strong)]"
            style={{ backgroundColor: 'var(--surface-bg)' }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск страны..."
              className={clsx(
                'w-full rounded px-3 py-2 text-sm',
                'border border-[var(--hairline-strong)]',
                'placeholder:text-[var(--fg-3)] focus:outline-none focus:border-[var(--fg)]',
              )}
              style={{ backgroundColor: 'var(--field-bg)', color: 'var(--fg)' }}
              autoFocus
            />
          </div>

          {/* Список */}
          {filteredCountries.map((c) => (
            <button
              key={c.iso}
              type="button"
              role="option"
              aria-selected={c.iso === country}
              onClick={() => handleCountrySelect(c)}
              className={clsx(
                'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm',
                'transition-colors duration-100',
                c.iso === country
                  ? 'text-[var(--fg)]'
                  : 'text-[var(--fg-2)] hover:text-[var(--fg)]',
              )}
              style={{
                backgroundColor: c.iso === country
                  ? 'var(--color-accent-soft)'
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (c.iso !== country) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (c.iso !== country) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span className="w-8 text-center text-[var(--fg-3)]">+{c.dialCode}</span>
              <span className="flex-1">{c.name}</span>
              <span className="text-[var(--fg-3)] text-xs">{c.iso}</span>
            </button>
          ))}

          {filteredCountries.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-[var(--fg-3)]">
              Страна не найдена
            </div>
          )}
        </div>
      )}
    </div>
  );
}
