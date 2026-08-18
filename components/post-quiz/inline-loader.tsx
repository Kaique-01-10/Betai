'use client'

import { useEffect, useState } from 'react'

interface InlineLoaderProps {
  text: string
  // Duración de la carga en ms antes de llamar onDone.
  duration?: number
  onDone: () => void
}

// Pequeña carga premium con barra determinada y texto.
// Se usa entre pullups: "Conectando +12 fuentes deportivas...",
// "Calculando tu precisión personalizada...", etc.
export function InlineLoader({ text, duration = 1600, onDone }: InlineLoaderProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf: number
    let done = false
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(eased * 100)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!done) {
        done = true
        setTimeout(onDone, 260)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, onDone])

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-8 py-16">
      {/* Anillo giratorio */}
      <div className="relative grid h-16 w-16 place-items-center">
        <span
          aria-hidden
          className="animate-betai-glow-breathe absolute inset-0 rounded-full bg-primary/25 blur-xl"
        />
        <span
          aria-hidden
          className="betai-spin absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: 'var(--color-brand-bright)',
            borderRightColor: 'oklch(0.66 0.14 164 / 0.3)',
          }}
        />
        <span className="relative h-2 w-2 rounded-full bg-[var(--color-gold)]" />
      </div>

      <p className="text-pretty text-center text-sm font-semibold text-foreground sm:text-base">
        {text}
      </p>

      <div className="relative h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-150 ease-out"
          style={{
            width: `${progress}%`,
            background:
              'linear-gradient(90deg, var(--color-primary), var(--color-brand-bright))',
            boxShadow: '0 0 14px -2px oklch(0.66 0.14 164 / 0.7)',
          }}
        />
      </div>
    </div>
  )
}
