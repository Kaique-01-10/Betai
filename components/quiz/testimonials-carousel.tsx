'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/* ────────────────────────────────────────────────────────────
   TESTIMONIOS EDITABLES
   Cada testimonio: nombre, tiempo de uso y comentario corto.
   Trátalos como placeholders: publícalos como testimonios reales
   solo si corresponden a testimonios reales de la oferta.
   No añadir métricas ni promesas nuevas aquí.
   ──────────────────────────────────────────────────────────── */
interface Testimonial {
  name: string
  timeUsing: string
  comment: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Carlos M.',
    timeUsing: '3 meses usando BetAI',
    comment: 'Volví a cerrar el mes en positivo.',
  },
  {
    name: 'Daniel R.',
    timeUsing: '2 meses usando BetAI',
    comment: 'Más de 86 USD en mi primera semana.',
  },
  {
    name: 'Mateo G.',
    timeUsing: '5 meses usando BetAI',
    comment: 'Mi banca se duplicó.',
  },
  {
    name: 'Andrés P.',
    timeUsing: '4 meses usando BetAI',
    comment: 'Ahora tengo más tiempo para mi familia.',
  },
  {
    name: 'Lucas T.',
    timeUsing: '6 meses usando BetAI',
    comment: 'Hoy apuesto con un método.',
  },
]

const AUTOPLAY_MS = 3600 // tiempo en cada comentario
const TRANSITION_MS = 450 // duración del fundido

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

export function TestimonialsCarousel() {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const swapRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pointerStartX = useRef<number | null>(null)

  // Cambia al testimonio indicado con un fundido de salida/entrada.
  const goTo = useCallback(
    (next: number) => {
      const target = (next + TESTIMONIALS.length) % TESTIMONIALS.length
      if (target === index) return
      if (reduced) {
        setIndex(target)
        return
      }
      setVisible(false)
      if (swapRef.current) clearTimeout(swapRef.current)
      swapRef.current = setTimeout(() => {
        setIndex(target)
        setVisible(true)
      }, TRANSITION_MS)
    },
    [index, reduced],
  )

  // Autoplay en bucle infinito, pausado durante la interacción táctil.
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setVisible(false)
      if (swapRef.current) clearTimeout(swapRef.current)
      swapRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % TESTIMONIALS.length)
        setVisible(true)
      }, TRANSITION_MS)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [reduced])

  useEffect(() => {
    return () => {
      if (swapRef.current) clearTimeout(swapRef.current)
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return
    const delta = e.clientX - pointerStartX.current
    pointerStartX.current = null
    if (Math.abs(delta) < 40) return
    goTo(delta < 0 ? index + 1 : index - 1)
  }

  const current = TESTIMONIALS[index]

  return (
    <div
      className="mx-auto w-full max-w-md touch-pan-y select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartX.current = null
      }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-[oklch(0.2_0.02_166/0.55)] px-5 py-4 backdrop-blur-sm">
        {/* Detalle verde muy discreto a la izquierda */}
        <span
          aria-hidden
          className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-gradient-to-b from-primary to-[var(--color-gold)]/60"
        />

        <div
          aria-live="polite"
          className="min-h-[68px]"
          style={{
            transition: reduced
              ? undefined
              : `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-bold tracking-tight text-foreground">
              {current.name}
            </span>
            {/* Tiempo de uso: destaque amarillo muy sutil */}
            <span className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-gold)]/85">
              {current.timeUsing}
            </span>
          </div>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
            {current.comment}
          </p>
        </div>

        {/* Indicadores de progreso, minimalistas */}
        <div className="mt-3 flex items-center gap-1.5">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              aria-label={`Ver testimonio de ${t.name}`}
              onClick={() => goTo(i)}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === index ? '1.25rem' : '0.375rem',
                backgroundColor:
                  i === index
                    ? 'var(--color-primary)'
                    : 'oklch(0.97 0.02 155 / 0.18)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
