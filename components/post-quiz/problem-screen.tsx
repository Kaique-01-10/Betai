'use client'

import { PrimaryButton } from '@/components/primary-button'

interface ProblemScreenProps {
  onContinue: () => void
}

export function ProblemScreen({ onContinue }: ProblemScreenProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10">
      <div className="flex-1">
        <h1 className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          Sin BetAI, tu entrada puede terminar siendo una oportunidad para la
          casa de apuestas.
        </h1>
        <p
          className="animate-betai-fade-up mx-auto mt-4 max-w-sm text-pretty text-center text-sm font-semibold text-muted-foreground sm:text-base"
          style={{ animationDelay: '0.1s' }}
        >
          ¿Quién gana cuando apuestas sin un método?
        </p>

        <p
          className="animate-betai-fade-up mt-8 text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/80"
          style={{ animationDelay: '0.18s' }}
        >
          Dos caminos
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {/* Camino 01 — alerta */}
          <div
            className="animate-betai-fade-up relative overflow-hidden rounded-2xl border border-destructive/35 bg-destructive/[0.06] p-5"
            style={{ animationDelay: '0.24s' }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-destructive/20 blur-2xl"
            />
            <div className="relative flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-destructive/40 bg-destructive/15 text-destructive">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 3L2 20h20L12 3z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 10v4M12 17h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h2 className="text-base font-extrabold uppercase tracking-wide text-destructive sm:text-lg">
                Esperanza
              </h2>
            </div>
            <p className="relative mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              Seguir apostando a ciegas, dependiendo de la intuición y
              reaccionando a cada resultado.
            </p>
          </div>

          {/* Camino 02 — BetAI IA */}
          <div
            className="animate-betai-fade-up relative overflow-hidden rounded-2xl border border-primary/40 bg-primary/[0.08] p-5"
            style={{
              animationDelay: '0.32s',
              boxShadow: '0 16px 44px -22px oklch(0.66 0.14 164 / 0.8)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/25 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
            />
            <div className="relative flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[var(--color-brand-bright)] to-primary text-primary-foreground shadow-[0_8px_20px_-8px_oklch(0.66_0.14_164/0.9)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 2l7 3v6c0 4.5-3 8-7 11-4-3-7-6.5-7-11V5l7-3z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="text-base font-extrabold uppercase tracking-wide text-primary sm:text-lg">
                BetAI IA
              </h2>
            </div>
            <p className="relative mt-3 text-pretty text-sm leading-relaxed text-foreground/90">
              Analizar más información, seguir un método y tomar decisiones con
              mayor control.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={onContinue}>
          Quiero mejorar mis decisiones con BetAI
        </PrimaryButton>
      </div>
    </div>
  )
}
