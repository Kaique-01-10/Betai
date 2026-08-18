'use client'

import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

// Botón primario de conversión con la identidad de BetAI:
// verde intenso, detalle dorado, elevación y brillo sutil sólo al interactuar.
export function PrimaryButton({
  children,
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'group relative flex w-full items-center justify-center overflow-hidden rounded-2xl px-8 py-[1.15rem] text-lg font-bold tracking-[-0.01em] outline-none transition-all duration-200 ease-out sm:text-xl',
        // Estado activo
        'bg-gradient-to-b from-[var(--color-brand-bright)] to-primary text-primary-foreground',
        'shadow-[0_1px_0_0_oklch(1_0_0/0.22)_inset,0_10px_30px_-10px_oklch(0.735_0.168_152/0.65),0_2px_8px_-2px_oklch(0_0_0/0.4)]',
        'hover:-translate-y-0.5 hover:shadow-[0_1px_0_0_oklch(1_0_0/0.28)_inset,0_16px_40px_-12px_oklch(0.735_0.168_152/0.8),0_3px_10px_-2px_oklch(0_0_0/0.45)]',
        'active:translate-y-0 active:duration-100',
        'focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        // Estado deshabilitado
        'disabled:pointer-events-none disabled:translate-y-0 disabled:bg-none disabled:bg-muted disabled:text-muted-foreground/60 disabled:shadow-none',
        className,
      )}
      {...props}
    >
      {/* Fino borde superior dorado (sólo activo) */}
      {!disabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/70 to-transparent"
        />
      )}
      {/* Brillo que recorre el botón al pasar/enfocar */}
      {!disabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <span className="absolute top-0 left-0 h-full w-1/4 -translate-x-[200%] bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:[animation:betai-sheen_0.9s_ease-out] group-focus-visible:[animation:betai-sheen_0.9s_ease-out]" />
        </span>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
