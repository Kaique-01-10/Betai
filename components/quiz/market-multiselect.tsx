'use client'

import type { ComponentType, SVGProps } from 'react'
import { cn } from '@/lib/utils'

export type MarketOption = {
  value: string
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

type MarketMultiSelectProps = {
  options: MarketOption[]
  selected: string[]
  onToggle: (value: string) => void
}

export function MarketMultiSelect({
  options,
  selected,
  onToggle,
}: MarketMultiSelectProps) {
  return (
    <div
      role="group"
      aria-label="Mercados en los que sueles apostar (selección múltiple)"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {options.map((opt, i) => {
        const isSelected = selected.includes(opt.value)
        const { Icon } = opt
        return (
          <button
            key={opt.value}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            onClick={() => onToggle(opt.value)}
            style={{ animationDelay: `${0.05 + i * 0.04}s` }}
            className={cn(
              'animate-betai-fade-up group relative flex h-full min-h-[104px] flex-col items-start justify-between gap-3 rounded-2xl border p-3.5 text-left outline-none transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary/60',
              isSelected
                ? 'border-primary/70 bg-primary/[0.1] shadow-[0_0_0_1px_oklch(0.58_0.118_166/0.35),0_14px_34px_-20px_oklch(0.58_0.118_166/0.9)]'
                : 'border-hairline bg-[var(--color-surface)]/55 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-[var(--color-surface)]',
            )}
          >
            {/* Ícono */}
            <span
              className={cn(
                'grid h-10 w-10 place-items-center rounded-xl transition-colors duration-200',
                isSelected
                  ? 'bg-primary/15 text-primary'
                  : 'bg-[var(--color-surface-2)] text-muted-foreground group-hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-colors duration-200',
                  isSelected && 'text-secondary',
                )}
              />
            </span>

            {/* Nombre del mercado */}
            <span
              className={cn(
                'text-pretty text-[0.82rem] font-semibold leading-snug transition-colors duration-200',
                isSelected ? 'text-foreground' : 'text-foreground/90',
              )}
            >
              {opt.label}
            </span>

            {/* Indicador de selección */}
            <span
              className={cn(
                'absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-md border transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-hairline bg-transparent',
              )}
            >
              {isSelected && (
                <svg
                  className="animate-betai-check-pop h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
