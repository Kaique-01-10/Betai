'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PrimaryButton } from '@/components/primary-button'
import { ScratchCard } from '@/components/post-quiz/scratch-card'
import { fetchScratchCard, revealScratchCard } from '@/lib/betai/scratch-card'

interface OfferScratchScreenProps {
  onSeeOffer: (discount: number) => void
}

type Status = 'loading' | 'ready'

export function OfferScratchScreen({ onSeeOffer }: OfferScratchScreenProps) {
  const [status, setStatus] = useState<Status>('loading')
  const [revealed, setRevealed] = useState(false)
  const [discount, setDiscount] = useState<number | null>(null)
  const revealing = useRef(false)

  // Lee el estado persistido en el servidor al montar (GET /scratch-card).
  useEffect(() => {
    let active = true
    fetchScratchCard()
      .then((state) => {
        if (!active) return
        setRevealed(state.revealed)
        setDiscount(state.discount)
        setStatus('ready')
      })
      .catch(() => active && setStatus('ready'))
    return () => {
      active = false
    }
  }, [])

  // Al alcanzar el umbral de raspado: confirma con el servidor (POST).
  // El descuento mostrado proviene siempre de la respuesta del servidor.
  const handleReveal = useCallback(() => {
    if (revealing.current) return
    revealing.current = true
    setRevealed(true)
    revealScratchCard()
      .then((state) => {
        setDiscount(state.discount)
      })
      .catch(() => {
        // Si falla, se reintenta la lectura para no perder el estado.
        void fetchScratchCard().then((s) => setDiscount(s.discount))
      })
  }, [])

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10">
      {/* Banda de campaña (tratamiento tipográfico genérico, sin logo oficial) */}
      <div className="animate-betai-fade-up flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/35 bg-[var(--color-gold)]/10 px-3.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Copa Femenina 2027
          </span>
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {/* Headline */}
        <h1
          className="animate-betai-fade-up mt-6 text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
          style={{ animationDelay: '0.08s' }}
        >
          Rasca y gana hasta{' '}
          <span className="text-[var(--color-gold)]">88% de descuento</span> en
          BetAI
        </h1>
        <p
          className="animate-betai-fade-up mx-auto mt-3 max-w-sm text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
          style={{ animationDelay: '0.16s' }}
        >
          Una promoción especial con descuento aplicado automáticamente a tu
          oferta.
        </p>

        {/* Card de la raspadinha */}
        <div
          className="animate-betai-pop-in relative mx-auto mt-8 w-full max-w-sm"
          style={{ animationDelay: '0.24s' }}
        >
          {/* Glow ambiental detrás del card */}
          <div
            aria-hidden
            className="animate-betai-glow-breathe pointer-events-none absolute -inset-3 rounded-[30px] bg-primary/15 blur-2xl"
          />

          <div className="relative overflow-hidden rounded-[26px] border border-hairline bg-[var(--color-surface-2)] p-2.5 shadow-[0_1px_0_0_oklch(1_0_0/0.06)_inset,0_30px_70px_-28px_oklch(0_0_0/0.85)]">
            <div className="relative h-56 w-full">
              {status === 'loading' ? (
                <div className="grid h-full w-full place-items-center rounded-[22px] bg-white/[0.04]">
                  <span
                    className="betai-spin h-8 w-8 rounded-full border-2 border-transparent"
                    style={{
                      borderTopColor: 'var(--color-brand-bright)',
                      borderRightColor: 'oklch(0.66 0.14 164 / 0.3)',
                    }}
                    aria-label="Cargando promoción"
                  />
                </div>
              ) : (
                <ScratchCard revealed={revealed} onReveal={handleReveal}>
                  <PrizeContent revealed={revealed} discount={discount} />
                </ScratchCard>
              )}
            </div>
          </div>

          {/* Pista de raspado (sólo antes de revelar) */}
          {status === 'ready' && !revealed && (
            <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Desliza el dedo sobre la tarjeta
            </p>
          )}
        </div>

        {/* Resultado + CTA (sólo tras revelar) */}
        {revealed && (
          <div className="animate-betai-pop-in mt-8 flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                Aplicado automáticamente a tu oferta
              </p>
            </div>
            <div className="w-full max-w-sm">
              <PrimaryButton onClick={() => onSeeOffer(discount ?? 0)}>
                Ver oferta con descuento
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Contenido del premio bajo la cobertura raspable.
function PrizeContent({
  revealed,
  discount,
}: {
  revealed: boolean
  discount: number | null
}) {
  return (
    <div className="grid h-full w-full place-items-center rounded-[22px] bg-gradient-to-b from-[var(--color-brand-deep)]/40 to-[var(--color-surface)]">
      {/* Fondo radial verde */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[22px]"
        style={{
          background:
            'radial-gradient(90% 90% at 50% 40%, oklch(0.66 0.14 164 / 0.22) 0%, transparent 60%)',
        }}
      />
      <div className="relative flex flex-col items-center">
        {revealed && discount !== null ? (
          <>
            <span
              className="text-6xl font-black leading-none tracking-tight sm:text-7xl"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, var(--color-gold), oklch(0.78 0.15 90))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 8px 24px oklch(0.891 0.174 100 / 0.35))',
              }}
            >
              {discount}% OFF
            </span>
            <span className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
              BetAI · Descuento desbloqueado
            </span>
          </>
        ) : (
          // Mientras el servidor confirma el descuento tras raspar.
          <span
            className="betai-spin h-8 w-8 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: 'var(--color-gold)',
              borderRightColor: 'oklch(0.891 0.174 100 / 0.3)',
            }}
            aria-label="Revelando descuento"
          />
        )}
      </div>
    </div>
  )
}
