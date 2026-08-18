'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface PlanLoadingProps {
  // Se llama cuando la PRIMERA barra termina (abre el pullup automáticamente).
  onFirstComplete: () => void
  // La segunda barra queda "esperando" hasta que se marque completada
  // (cuando el usuario vuelve del recorrido de funcionalidades).
  secondActive?: boolean
  onSecondComplete?: () => void
}

// Barra de progreso premium con relleno verde→neón y brillo que la recorre.
function ProgressBar({
  label,
  progress,
  waiting,
}: {
  label: string
  progress: number
  waiting?: boolean
}) {
  return (
    <div className="w-full">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <span
          className={cn(
            'text-sm font-semibold tracking-tight sm:text-base',
            waiting ? 'text-muted-foreground/70' : 'text-foreground',
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'font-mono text-xs tabular-nums',
            waiting ? 'text-muted-foreground/50' : 'text-primary',
          )}
        >
          {waiting ? 'En espera' : `${Math.round(progress)}%`}
        </span>
      </div>

      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        {/* Relleno */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-200 ease-out"
          style={{
            width: `${waiting ? 0 : progress}%`,
            background:
              'linear-gradient(90deg, var(--color-brand-deep) 0%, var(--color-primary) 45%, var(--color-brand-bright) 100%)',
            boxShadow: waiting
              ? undefined
              : '0 0 18px -2px oklch(0.66 0.14 164 / 0.7)',
          }}
        />
        {/* Brillo que recorre mientras carga */}
        {!waiting && progress < 100 && (
          <div
            aria-hidden
            className="betai-shimmer-bar absolute inset-y-0 left-0 w-1/3"
            style={{
              background:
                'linear-gradient(90deg, transparent, oklch(1 0 0 / 0.4), transparent)',
            }}
          />
        )}
        {/* Barra "en espera": punto pulsante */}
        {waiting && (
          <div className="absolute inset-0 flex items-center px-2">
            <span className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground/50" />
          </div>
        )}
      </div>
    </div>
  )
}

export function PlanLoading({
  onFirstComplete,
  secondActive = false,
  onSecondComplete,
}: PlanLoadingProps) {
  const [first, setFirst] = useState(0)
  const [second, setSecond] = useState(0)
  const firstDone = useRef(false)
  const secondDone = useRef(false)

  // Anima la primera barra hasta 100 y avisa una sola vez.
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const duration = 2600
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeInOut para que no sea lineal ni aburrido
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      setFirst(eased * 100)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!firstDone.current) {
        firstDone.current = true
        setTimeout(onFirstComplete, 420)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onFirstComplete])

  // Cuando se activa, anima la segunda barra hasta el final.
  useEffect(() => {
    if (!secondActive) return
    let raf: number
    const start = performance.now()
    const duration = 2200
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      setSecond(eased * 100)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!secondDone.current) {
        secondDone.current = true
        setTimeout(() => onSecondComplete?.(), 500)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [secondActive, onSecondComplete])

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Núcleo animado */}
        <div className="mb-10 flex justify-center">
          <div className="relative grid h-24 w-24 place-items-center">
            <span
              aria-hidden
              className="animate-betai-glow-breathe absolute inset-0 rounded-full bg-primary/25 blur-2xl"
            />
            {/* Anillo giratorio */}
            <span
              aria-hidden
              className="betai-spin absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: 'var(--color-brand-bright)',
                borderRightColor: 'oklch(0.66 0.14 164 / 0.35)',
              }}
            />
            {/* Núcleo */}
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-b from-[var(--color-brand-bright)] to-primary shadow-[0_10px_30px_-8px_oklch(0.66_0.14_164/0.8)]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z"
                  fill="var(--color-gold)"
                />
              </svg>
            </span>
          </div>
        </div>

        <h1 className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          Preparando tu plan personalizado
        </h1>
        <p
          className="animate-betai-fade-up mx-auto mt-3 max-w-xs text-pretty text-center text-sm leading-relaxed text-muted-foreground"
          style={{ animationDelay: '0.1s' }}
        >
          Estamos ajustando cada detalle según tus respuestas.
        </p>

        <div
          className="animate-betai-fade-up mt-10 flex flex-col gap-6"
          style={{ animationDelay: '0.2s' }}
        >
          <ProgressBar label="Cruzando tu perfil con BetAI" progress={first} />
          <ProgressBar
            label="Calibrando tu estrategia personalizada"
            progress={second}
            waiting={!secondActive}
          />
        </div>
      </div>
    </div>
  )
}
