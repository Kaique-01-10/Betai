'use client'

import { useEffect, useRef, useState } from 'react'
import { PrimaryButton } from '@/components/primary-button'
import { SourcesTicker } from '@/components/quiz/sources-ticker'

/* ─────────────────────────────────────────────────────────────
   NÚMEROS Y TEXTOS EDITABLES
   Cambia estos valores para ajustar la comunicación sin tocar el layout.
   ───────────────────────────────────────────────────────────── */
const STAT_PERCENT = 87 // valor final del contador (0 → 87)
const STAT_PHRASE =
  'de los apostadores de Latinoamérica analizan menos de 3 sitios por partido.'

const CRUZA_LABEL = 'BETAI CRUZA'
const SITES_LABEL = '100+ sitios'
const EN_SOLO_LABEL = 'EN SOLO'
const SECONDS_LABEL = '12 segundos'
/* ───────────────────────────────────────────────────────────── */

export function MechanismImpact({ onContinue }: { onContinue: () => void }) {
  const [percent, setPercent] = useState(0)
  // Cuando el conteo termina, se revela el resto de la pantalla en secuencia.
  const [revealed, setRevealed] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setPercent(STAT_PERCENT)
      setRevealed(true)
      return
    }

    const duration = 1600 // ms: el número sube de forma clara y contundente
    const startDelay = 250 // ms: pequeña pausa antes de arrancar
    let start: number | null = null
    let timeout: ReturnType<typeof setTimeout>

    const tick = (now: number) => {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / duration)
      // easeOutExpo: sube rápido y desacelera con suavidad al final
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setPercent(Math.round(eased * STAT_PERCENT))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setPercent(STAT_PERCENT)
        setRevealed(true)
      }
    }

    timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center gap-8 py-2">
        {/* 1 · Estadística de impacto: el número sube de 0 a 87 % */}
        <div className="flex flex-col items-center text-center">
          <div
            className="text-[5.5rem] font-extrabold leading-[0.9] tracking-[-0.04em] tabular-nums transition-transform duration-200 sm:text-[7rem]"
            style={{
              backgroundImage:
                'linear-gradient(180deg, oklch(0.97 0 0) 0%, oklch(0.88 0.02 160) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              transform: revealed ? 'scale(1)' : 'scale(1.02)',
            }}
            aria-label={`${STAT_PERCENT}%`}
          >
            {percent}%
          </div>
          <p
            className="mx-auto mt-3 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground transition-all duration-500 sm:max-w-sm sm:text-base"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(10px)',
            }}
          >
            {STAT_PHRASE}
          </p>
        </div>

        {/* El resto de la pantalla aparece recién cuando el conteo termina */}
        {revealed && (
          <>
        {/* 2 · Transición descendente */}
        <div
          className="animate-betai-fade-up flex flex-col items-center gap-1"
          style={{ animationDelay: '0.05s' }}
          aria-hidden
        >
          <span className="h-8 w-px bg-gradient-to-b from-transparent via-primary/40 to-primary/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_2px_oklch(0.735_0.168_152/0.6)]" />
        </div>

        {/* 3 · Mecanismo BetAI con jerarquía marcada */}
        <div className="flex flex-col items-center text-center">
          <span
            className="animate-betai-impact-in text-sm font-bold uppercase tracking-[0.42em] text-foreground/90 sm:text-base"
            style={{ animationDelay: '0.2s', paddingLeft: '0.42em' }}
          >
            {CRUZA_LABEL}
          </span>

          <span
            className="animate-betai-impact-in mt-2 text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-6xl"
            style={{
              animationDelay: '0.35s',
              backgroundImage:
                'linear-gradient(100deg, var(--color-brand-bright) 0%, oklch(0.82 0.19 150) 45%, var(--color-gold) 130%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {SITES_LABEL}
          </span>

          <span
            className="animate-betai-fade-up mt-5 text-xs font-bold uppercase tracking-[0.42em] text-muted-foreground sm:text-sm"
            style={{ animationDelay: '0.55s', paddingLeft: '0.42em' }}
          >
            {EN_SOLO_LABEL}
          </span>

          <span
            className="animate-betai-impact-in mt-1 flex items-center gap-2 text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl"
            style={{ animationDelay: '0.7s', color: 'var(--color-gold)' }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="drop-shadow-[0_0_10px_oklch(0.86_0.17_95/0.5)]"
            >
              <path
                d="M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z"
                fill="currentColor"
              />
            </svg>
            {SECONDS_LABEL}
          </span>
        </div>

        {/* 4 · Ticker continuo de fuentes analizadas */}
        <div
          className="animate-betai-fade-up mt-2"
          style={{ animationDelay: '0.9s' }}
        >
          <SourcesTicker />
          <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            Fuentes analizadas en tiempo real
          </p>
        </div>
          </>
        )}
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={onContinue} disabled={!revealed}>
          Continuar
        </PrimaryButton>
      </div>
    </div>
  )
}
