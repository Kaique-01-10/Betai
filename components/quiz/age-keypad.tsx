'use client'

import { useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AgeKeypadProps {
  value: string
  onChange: (next: string) => void
  maxLength?: number
  error?: string | null
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

// Icono de backspace dibujado a mano (no imagen, no ilustración genérica).
function BackspaceIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-foreground/80"
    >
      <path
        d="M9.5 5.5H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9.5a2 2 0 0 1-1.5-.68l-4.2-4.7a1.5 1.5 0 0 1 0-2l4.2-4.7a2 2 0 0 1 1.5-.72Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m11.5 9.5 5 5m0-5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function AgeKeypad({
  value,
  onChange,
  maxLength = 2,
  error,
}: AgeKeypadProps) {
  const pressDigit = useCallback(
    (digit: string) => {
      // Sin cero a la izquierda y respetando el límite de dígitos.
      if (value.length === 0 && digit === '0') return
      if (value.length >= maxLength) return
      onChange(value + digit)
    },
    [value, maxLength, onChange],
  )

  const pressBackspace = useCallback(() => {
    if (value.length === 0) return
    onChange(value.slice(0, -1))
  }, [value, onChange])

  // Soporte de teclado físico como complemento (no como experiencia principal).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        pressDigit(e.key)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        pressBackspace()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [pressDigit, pressBackspace])

  const hasValue = value.length > 0

  return (
    <div className="flex flex-col items-center gap-7">
      {/* Campo de edad */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          Edad
        </span>
        <div
          className={cn(
            'flex h-24 min-w-[9rem] items-center justify-center rounded-2xl border bg-[var(--color-surface)]/50 px-8 tabular-nums backdrop-blur-sm transition-colors duration-200',
            error
              ? 'border-destructive/60 animate-betai-shake'
              : hasValue
                ? 'border-primary/45 shadow-[0_0_0_1px_oklch(0.58_0.118_166/0.25),0_18px_44px_-26px_oklch(0.58_0.118_166/0.9)]'
                : 'border-hairline',
          )}
          aria-live="polite"
        >
          {hasValue ? (
            <span className="flex items-end">
              {value.split('').map((digit, i) => (
                <span
                  key={`${i}-${digit}`}
                  className="animate-betai-digit-pop bg-gradient-to-b from-foreground to-foreground/75 bg-clip-text text-6xl font-extrabold leading-none tracking-tight text-transparent"
                >
                  {digit}
                </span>
              ))}
            </span>
          ) : (
            <span className="text-3xl font-bold text-muted-foreground/40">
              Edad
            </span>
          )}
        </div>
        {/* Mensaje de error discreto (sólo tras intentar continuar) */}
        <p
          className={cn(
            'min-h-[1.25rem] text-center text-sm font-medium text-destructive transition-opacity duration-200',
            error ? 'opacity-100' : 'opacity-0',
          )}
          role={error ? 'alert' : undefined}
        >
          {error ?? '\u00A0'}
        </p>
      </div>

      {/* Teclado numérico premium */}
      <div className="grid w-full max-w-[19rem] grid-cols-3 gap-3">
        {KEYS.map((k) => (
          <KeypadButton key={k} onPress={() => pressDigit(k)} label={`Marcar ${k}`}>
            {k}
          </KeypadButton>
        ))}

        {/* Fila final: backspace · 0 · (vacío) */}
        <KeypadButton
          onPress={pressBackspace}
          label="Borrar último dígito"
          variant="muted"
          disabled={!hasValue}
        >
          <BackspaceIcon />
        </KeypadButton>
        <KeypadButton onPress={() => pressDigit('0')} label="Marcar 0">
          0
        </KeypadButton>
        <span aria-hidden />
      </div>
    </div>
  )
}

interface KeypadButtonProps {
  children: React.ReactNode
  onPress: () => void
  label: string
  variant?: 'default' | 'muted'
  disabled?: boolean
}

function KeypadButton({
  children,
  onPress,
  label,
  variant = 'default',
  disabled,
}: KeypadButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'group relative flex h-16 select-none items-center justify-center rounded-2xl border border-hairline text-3xl font-bold tabular-nums outline-none transition-all duration-150 ease-out sm:h-[4.25rem]',
        'bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-surface)]',
        'shadow-[0_1px_0_0_oklch(1_0_0/0.05)_inset,0_6px_16px_-10px_oklch(0_0_0/0.6)]',
        // Feedback instantáneo al tocar/pasar
        'hover:border-primary/40 hover:from-[var(--color-surface-2)] hover:to-[var(--color-surface-2)]',
        'active:scale-[0.94] active:duration-75',
        'focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-35',
        variant === 'default' ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      {/* Iluminación sutil al presionar */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-primary/0 transition-colors duration-150 group-active:bg-primary/10"
      />
      <span className="relative z-10">{children}</span>
    </button>
  )
}
