'use client'

import { PrimaryButton } from '@/components/primary-button'
import {
  RISK_CLASS_LABEL,
  type BettorProfile,
  type RiskClass,
} from '@/lib/betai/profile'
import { cn } from '@/lib/utils'

interface DiagnosisScreenProps {
  profile: BettorProfile
  onContinue: () => void
}

const CLASS_ORDER: RiskClass[] = ['ESTABLE', 'EN_RIESGO', 'CRITICO']

// Colores por clasificación (activo vs. inactivo).
const CLASS_STYLE: Record<
  RiskClass,
  { dot: string; activeBorder: string; activeText: string; glow: string }
> = {
  ESTABLE: {
    dot: 'bg-primary',
    activeBorder: 'border-primary bg-primary/12',
    activeText: 'text-primary',
    glow: 'oklch(0.66 0.14 164 / 0.5)',
  },
  EN_RIESGO: {
    dot: 'bg-[var(--color-gold)]',
    activeBorder: 'border-[var(--color-gold)] bg-[var(--color-gold)]/12',
    activeText: 'text-[var(--color-gold)]',
    glow: 'oklch(0.891 0.174 100 / 0.5)',
  },
  CRITICO: {
    dot: 'bg-destructive',
    activeBorder: 'border-destructive bg-destructive/12',
    activeText: 'text-destructive',
    glow: 'oklch(0.62 0.24 25 / 0.55)',
  },
}

export function DiagnosisScreen({ profile, onContinue }: DiagnosisScreenProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10">
      <div className="flex-1">
        <p className="animate-betai-fade-up text-center text-xs font-bold uppercase tracking-[0.24em] text-primary">
          Análisis de tus respuestas completado
        </p>

        <p
          className="animate-betai-fade-up mt-8 text-center text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground"
          style={{ animationDelay: '0.1s' }}
        >
          Tu perfil es
        </p>

        {/* Título del perfil */}
        <h1
          className="animate-betai-pop-in mt-3 text-balance text-center text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl"
          style={{ animationDelay: '0.2s' }}
        >
          <span
            style={{
              backgroundImage:
                'linear-gradient(180deg, oklch(0.98 0 0), oklch(0.86 0.03 160))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {profile.title}
          </span>
        </h1>

        <p
          className="animate-betai-fade-up mx-auto mt-4 max-w-md text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
          style={{ animationDelay: '0.3s' }}
        >
          {profile.description}
        </p>

        {/* Clasificación visual */}
        <div
          className="animate-betai-fade-up mt-8 grid grid-cols-3 gap-2.5"
          style={{ animationDelay: '0.38s' }}
        >
          {CLASS_ORDER.map((c) => {
            const active = profile.classification === c
            const style = CLASS_STYLE[c]
            return (
              <div
                key={c}
                className={cn(
                  'relative flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 transition-all duration-300',
                  active
                    ? style.activeBorder
                    : 'border-hairline bg-white/[0.02] opacity-50',
                )}
                style={
                  active
                    ? { boxShadow: `0 12px 34px -16px ${style.glow}` }
                    : undefined
                }
              >
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    style.dot,
                    !active && 'opacity-60',
                  )}
                />
                <span
                  className={cn(
                    'text-center text-[0.72rem] font-bold uppercase tracking-wide sm:text-xs',
                    active ? style.activeText : 'text-muted-foreground',
                  )}
                >
                  {RISK_CLASS_LABEL[c]}
                </span>
                {active && (
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Tu estado
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Copy de diagnóstico */}
        <div
          className="animate-betai-fade-up mt-8 rounded-2xl border border-hairline bg-white/[0.03] p-5"
          style={{ animationDelay: '0.46s' }}
        >
          <p className="text-pretty text-sm leading-relaxed text-foreground sm:text-base">
            Años apostando, decisiones basadas en la intuición.
          </p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            BetAI reemplaza el juego a ciegas por análisis basado en{' '}
            <span className="font-bold text-primary">
              más de 100 fuentes cruzadas
            </span>
            , sin que tengas que estudiar cada partido por tu cuenta.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={onContinue}>Continuar diagnóstico</PrimaryButton>
      </div>
    </div>
  )
}
