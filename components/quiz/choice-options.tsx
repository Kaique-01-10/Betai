'use client'

import { cn } from '@/lib/utils'

export interface ChoiceOption {
  value: string
  label: string
}

interface ChoiceOptionsProps {
  options: ChoiceOption[]
  selectedValue: string | null
  onChange: (value: string) => void
  name: string
}

// Tarjetas de selección premium (no radio buttons tradicionales).
// Verde como color principal de selección, amarillo como pequeño detalle.
export function ChoiceOptions({
  options,
  selectedValue,
  onChange,
  name,
}: ChoiceOptionsProps) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="flex flex-col gap-3"
    >
      {options.map((option, index) => {
        const selected = option.value === selectedValue
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
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

            {/* Indicador circular de selección */}
            <span
              aria-hidden
              className={cn(
                'relative grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-200',
                selected ? 'border-primary' : 'border-muted-foreground/40',
              )}
            >
              <span
                className={cn(
                  'h-2.5 w-2.5 rounded-full bg-primary transition-transform duration-200 ease-out',
                  selected ? 'scale-100' : 'scale-0',
                )}
              />
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
