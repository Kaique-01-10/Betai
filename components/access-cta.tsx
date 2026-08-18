'use client'

import { cn } from '@/lib/utils'

interface AccessCtaProps {
  href?: string
  className?: string
}

// CTA principal de conversión. Mismo acabamiento premium que el botón del quiz.
export function AccessCta({ href, className }: AccessCtaProps) {
  const classes = cn(
    'group relative flex w-full items-center justify-center overflow-hidden rounded-2xl px-8 py-[1.25rem] text-lg font-bold tracking-[-0.01em] outline-none transition-all duration-200 ease-out sm:text-xl',
    'bg-gradient-to-b from-[var(--color-brand-bright)] to-primary text-primary-foreground',
    'shadow-[0_1px_0_0_oklch(1_0_0/0.22)_inset,0_12px_34px_-10px_oklch(0.735_0.168_152/0.7),0_2px_8px_-2px_oklch(0_0_0/0.4)]',
    'hover:-translate-y-0.5 hover:shadow-[0_1px_0_0_oklch(1_0_0/0.28)_inset,0_18px_46px_-12px_oklch(0.735_0.168_152/0.85),0_3px_10px_-2px_oklch(0_0_0/0.45)]',
    'active:translate-y-0 active:duration-100',
    'focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    className,
  )

  const content = (
    <>
      {/* Fino borde superior dorado */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/70 to-transparent"
      />
      {/* Brillo al pasar/enfocar */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <span className="absolute top-0 left-0 h-full w-1/4 -translate-x-[200%] bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:[animation:betai-sheen_0.9s_ease-out] group-focus-visible:[animation:betai-sheen_0.9s_ease-out]" />
      </span>
      <span className="relative z-10">Liberar acceso a BetAI</span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes}>
      {content}
    </button>
  )
}
