'use client'

import { useEffect, useRef, useState } from 'react'
import { PrimaryButton } from '@/components/primary-button'
import { LatamMap } from '@/components/quiz/latam-map'
import { TestimonialsCarousel } from '@/components/quiz/testimonials-carousel'

/* ────────────────────────────────────────────────────────────
   NÚMEROS EDITABLES
   Cambia estos valores para actualizar la pantalla fácilmente.
   ──────────────────────────────────────────────────────────── */
const MAP_LABEL = '+36.574' // número estático sobre el mapa
const COUNTER_TARGET = 36000 // valor final del contador animado (bajo el mapa)
const COUNTER_LABEL = '+36.000' // etiqueta mostrada al terminar el conteo
/* ──────────────────────────────────────────────────────────── */

const numberFormatter = new Intl.NumberFormat('es-ES')

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

interface LatamSocialProofProps {
  onContinue: () => void
}

export function LatamSocialProof({ onContinue }: LatamSocialProofProps) {
  const reduced = usePrefersReducedMotion()
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduced) {
      setCount(COUNTER_TARGET)
      setDone(true)
      return
    }

    const duration = 2200 // ms: conteo fluido y elegante
    const startDelay = 900 // ms: arranca tras aparecer el mapa
    let start: number | null = null
    let timeout: ReturnType<typeof setTimeout>

    const tick = (now: number) => {
      if (start === null) start = now
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      // easeOutExpo: sube rápido y desacelera suavemente al final
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setCount(Math.round(eased * COUNTER_TARGET))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCount(COUNTER_TARGET)
        setDone(true)
      }
    }

    timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reduced])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col">
        {/* Título y subtítulo */}
        <div className="flex flex-col gap-2 text-center">
          <h1
            className="animate-betai-fade-up text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
            style={{ animationDelay: '0.05s' }}
          >
            Apostadores de toda Latinoamérica
          </h1>
          <p
            className="animate-betai-fade-up mx-auto max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
            style={{ animationDelay: '0.14s' }}
          >
            Cada vez más apostadores están aprovechando la tecnología de BetAI.
          </p>
        </div>

        {/* Mapa con el indicador principal superpuesto */}
        <div className="relative mt-4 flex-1">
          <LatamMap />

          {/* Indicador principal: +47 mil */}
          <div
            className="animate-betai-fade-up pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 text-center"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="rounded-xl border border-hairline bg-[oklch(0.14_0.013_162/0.72)] px-3.5 py-1.5 backdrop-blur-md">
              <div
                className="text-lg font-extrabold tabular-nums tracking-tight sm:text-xl"
                style={{
                  color: 'oklch(0.86 0.24 148)',
                  textShadow: '0 0 14px oklch(0.86 0.24 148 / 0.65)',
                }}
              >
                {MAP_LABEL}
              </div>
            </div>
          </div>
        </div>

        {/* Prueba social */}
        <div
          className="animate-betai-fade-up mx-auto mt-2 flex max-w-md flex-col items-center gap-1 text-center"
          style={{ animationDelay: '0.7s' }}
        >
          <span className="bg-gradient-to-r from-[var(--color-brand-bright)] via-primary to-[var(--color-gold)] bg-clip-text text-3xl font-extrabold tabular-nums tracking-tight text-transparent sm:text-4xl">
            {done ? COUNTER_LABEL : `+${numberFormatter.format(count)}`}
          </span>
          <span className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            apostadores de toda Latinoamérica ya usan BetAI
          </span>
        </div>

        {/* Carrusel de testimonios (avance automático + swipe) */}
        <div
          className="animate-betai-fade-up mt-5"
          style={{ animationDelay: '1.1s' }}
        >
          <TestimonialsCarousel />
        </div>
      </div>

      {/* CTA con el mismo componente de las etapas anteriores */}
      <div
        className="animate-betai-fade-up mt-6"
        style={{ animationDelay: '1.7s' }}
      >
        <PrimaryButton onClick={onContinue}>Continuar</PrimaryButton>
      </div>
    </div>
  )
}
