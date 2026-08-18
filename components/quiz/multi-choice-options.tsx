'use client'

import { cn } from '@/lib/utils'
import type { ChoiceOption } from '@/components/quiz/choice-options'

interface MultiChoiceOptionsProps {
  options: ChoiceOption[]
  selectedValues: string[]
  onToggle: (value: string) => void
  name: string
}

// Lista vertical de selección MÚLTIPLE, con la misma identidad premium que
// ChoiceOptions pero con indicador de check (no radio) y soporte de arreglo.
export function MultiChoiceOptions({
  options,
  selectedValues,
  onToggle,
  name,
}: MultiChoiceOptionsProps) {
  return (
    <div role="group" aria-label={name} className="flex flex-col gap-3">
      {options.map((option, index) => {
        const selected = selectedValues.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={selected}
            onClick={() => onToggle(option.value)}
            style={{ animationDelay: `${0.18 + index * 0.06}s` }}
            className={cn(
              'group animate-betai-fade-up relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-left outline-none transition-all duration-200 ease-out sm:px-5 sm:py-[1.15rem]',
              'focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'active:scale-[0.985] active:duration-100',
              selected
                ? 'border-primary/60 bg-gradient-to-b from-[color-mix(in_oklch,var(--color-primary)_16%,var(--color-surface))] to-[var(--color-surface)] shadow-[0_1px_0_0_oklch(1_0_0/0.06)_inset,0_0_0_1px_oklch(0.58_0.118_166/0.35),0_18px_44px_-26px_oklch(0.58_0.118_166/0.95)]'
                : 'border-hairline bg-[var(--color-surface)]/60 hover:border-primary/30 hover:bg-[var(--color-surface-2)]/60',
            )}
          >
            {/* Detalle amarillo: fina barra lateral sólo cuando está seleccionado */}
            <span
              aria-hidden
              className={cn(
                'absolute inset-y-0 left-0 w-1 rounded-r-full bg-[var(--color-gold)] transition-all duration-200',
                selected ? 'opacity-100' : 'opacity-0',
              )}
            />

            {/* Indicador cuadrado (check) de selección múltiple */}
            <span
              aria-hidden
              className={cn(
                'grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors duration-200',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/40 bg-transparent',
              )}
            >
              {selected && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="animate-betai-check-pop"
                  aria-hidden
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>

            <span
              className={cn(
                'text-pretty text-[0.95rem] font-semibold leading-snug tracking-[-0.005em] transition-colors duration-200 sm:text-base',
                selected ? 'text-foreground' : 'text-foreground/85',
              )}
            >
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
