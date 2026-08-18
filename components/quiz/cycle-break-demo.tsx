'use client'

import { useEffect, useState } from 'react'
import { PrimaryButton } from '@/components/primary-button'

/* ─────────────────────────────────────────────────────────────
   TEXTOS EDITABLES DE LA SECUENCIA (ETAPA 11)
   ───────────────────────────────────────────────────────────── */
const STEPS = [
  {
    id: 'red-1',
    text: 'Entras en una apuesta y recibes el primer RED',
    // Amarillo: primer aviso.
    accent: 'oklch(0.86 0.19 95)',
  },
  {
    id: 'red-2',
    text: 'Doblas la apuesta para recuperar y recibes un RED aún mayor',
    // Naranja: la situación escala.
    accent: 'oklch(0.72 0.19 55)',
  },
  {
    id: 'red-3',
    text: 'Pierdes la cabeza y apuestas todo',
    // Rojo: pérdida de control.
    accent: 'oklch(0.62 0.22 27)',
  },
]

const BETAI_GREEN = 'oklch(0.82 0.24 148)'
/* ───────────────────────────────────────────────────────────── */

// Ícono de alerta (triángulo) que acompaña cada RED.
function AlertIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.2 22 20H2L12 3.2Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 10v4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1.1" fill={color} />
    </svg>
  )
}

// Ícono del bloque BetAI: escudo con check (intervención / protección).
function ShieldCheckIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5 20 5.4v5.2c0 5-3.4 8.6-8 10.9-4.6-2.3-8-5.9-8-10.9V5.4L12 2.5Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8.4 12.2 11 14.8l4.8-5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CycleBreakDemo({ onContinue }: { onContinue: () => void }) {
  // Cantidad de bloques ya revelados (cards 0..2 y luego el bloque BetAI = 3).
  const [revealed, setRevealed] = useState(0)
  const finished = revealed >= STEPS.length + 1

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setRevealed(STEPS.length + 1)
      return
    }

    // Revela un bloque cada ~700ms para contar la historia visualmente.
    const timers: ReturnType<typeof setTimeout>[] = []
    const total = STEPS.length + 1
    for (let i = 1; i <= total; i++) {
      timers.push(setTimeout(() => setRevealed(i), 450 + i * 700))
    }
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center py-2">
        <h1
          className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
          style={{ animationDelay: '0.05s' }}
        >
          ¿Qué te pasa?
        </h1>

        {/* Secuencia vertical conectada por una línea con degradado */}
        <div className="relative mx-auto mt-8 w-full max-w-md">
          {/* Línea conectora extremadamente discreta (alerta → intervención) */}
          <div
            className="pointer-events-none absolute bottom-6 left-[27px] top-6 w-[2px] rounded-full transition-opacity duration-700 sm:left-[31px]"
            style={{
              opacity: revealed > 0 ? 1 : 0,
              backgroundImage:
                'linear-gradient(to bottom, oklch(0.86 0.19 95 / 0.55), oklch(0.72 0.19 55 / 0.6), oklch(0.62 0.22 27 / 0.65), oklch(0.82 0.24 148 / 0.7))',
            }}
            aria-hidden
          />

          <ol className="relative flex flex-col gap-3">
            {STEPS.map((step, i) => {
              const isVisible = revealed > i
              return (
                <li
                  key={step.id}
                  className="flex items-center gap-3 transition-all duration-500"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? 'translateY(0)'
                      : 'translateY(14px)',
                  }}
                >
                  {/* Nodo con ícono de alerta */}
                  <span
                    className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border sm:h-[62px] sm:w-[62px]"
                    style={{
                      borderColor: `color-mix(in oklch, ${step.accent} 60%, transparent)`,
                      backgroundColor: 'var(--color-surface)',
                      boxShadow: isVisible
                        ? `0 0 22px -6px ${step.accent}, inset 0 0 0 1px color-mix(in oklch, ${step.accent} 35%, transparent)`
                        : 'none',
                    }}
                  >
                    <AlertIcon color={step.accent} />
                  </span>

                  {/* Tarjeta con el texto del evento */}
                  <div
                    className="flex-1 rounded-2xl border px-4 py-3.5"
                    style={{
                      borderColor: `color-mix(in oklch, ${step.accent} 45%, transparent)`,
                      backgroundColor:
                        'color-mix(in oklch, var(--color-surface) 82%, black)',
                      boxShadow: isVisible
                        ? `0 0 30px -14px ${step.accent}`
                        : 'none',
                    }}
                  >
                    <span
                      className="text-[0.62rem] font-bold uppercase tracking-[0.22em]"
                      style={{ color: step.accent }}
                    >
                      {`RED ${i + 1}`}
                    </span>
                    <p className="mt-1 text-pretty text-sm font-medium leading-snug text-foreground/90">
                      {step.text}
                    </p>
                  </div>
                </li>
              )
            })}

            {/* BLOQUE FINAL — BetAI (verde neón, intervención) */}
            <li
              className="mt-1 transition-all duration-700"
              style={{
                opacity: finished ? 1 : 0,
                transform: finished ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <div
                className={finished ? 'animate-betai-glow-expand' : undefined}
                style={{
                  borderRadius: '1.25rem',
                }}
              >
                <div
                  className="flex items-start gap-3 rounded-[1.25rem] border px-4 py-5"
                  style={{
                    borderColor: `color-mix(in oklch, ${BETAI_GREEN} 65%, transparent)`,
                    backgroundImage:
                      'linear-gradient(160deg, oklch(0.24 0.06 155 / 0.7), oklch(0.16 0.03 160 / 0.55))',
                    boxShadow: finished
                      ? `0 0 46px -10px ${BETAI_GREEN}, inset 0 0 0 1px color-mix(in oklch, ${BETAI_GREEN} 30%, transparent)`
                      : 'none',
                  }}
                >
                  <span
                    className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl sm:h-[62px] sm:w-[62px]"
                    style={{
                      backgroundColor:
                        'color-mix(in oklch, var(--color-surface) 70%, black)',
                      boxShadow: `0 0 24px -6px ${BETAI_GREEN}`,
                    }}
                  >
                    <ShieldCheckIcon color={BETAI_GREEN} />
                  </span>

                  <p className="text-pretty text-base font-semibold leading-snug text-foreground sm:text-lg">
                    <span
                      className="font-extrabold"
                      style={{
                        color: BETAI_GREEN,
                        textShadow: `0 0 18px color-mix(in oklch, ${BETAI_GREEN} 60%, transparent)`,
                      }}
                    >
                      BetAI
                    </span>{' '}
                    <span
                      className="font-extrabold"
                      style={{ color: BETAI_GREEN }}
                    >
                      rompe el ciclo
                    </span>{' '}
                    antes de que el primer RED se convierta en descontrol.
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={onContinue} disabled={!finished}>
          Continuar
        </PrimaryButton>
      </div>
    </div>
  )
}
