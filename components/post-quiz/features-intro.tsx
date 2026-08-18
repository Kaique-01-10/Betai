'use client'

import { PrimaryButton } from '@/components/primary-button'

interface FeaturesIntroProps {
  onShow: () => void
}

// Contenido del primer pullup: presenta las 2 funcionalidades principales.
export function FeaturesIntro({ onShow }: FeaturesIntroProps) {
  return (
    <div className="flex min-h-full flex-col px-6 pb-8 pt-2">
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
          BetAI
        </p>
        <h2 className="mt-3 text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          Las 2 funcionalidades principales de BetAI
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Una crea la tip por ti. La otra te ayuda a gestionar tu banca. Te
          presentamos las dos en 30 segundos.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <FeatureBlock
            index="01"
            title="Tip Pronta"
            desc="La IA analiza la jornada y encuentra las oportunidades disponibles."
          />
          <FeatureBlock
            index="02"
            title="Control de banca profesional"
            desc="Organiza tu banca y define límites para decidir con más control."
          />
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={onShow}>Puedes mostrarme</PrimaryButton>
      </div>
    </div>
  )
}

function FeatureBlock({
  index,
  title,
  desc,
}: {
  index: string
  title: string
  desc: string
}) {
  return (
    <div className="relative flex items-start gap-4 overflow-hidden rounded-2xl border border-hairline bg-white/[0.03] p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl"
      />
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 font-mono text-sm font-bold text-primary">
        {index}
      </span>
      <div className="relative">
        <h3 className="text-base font-bold tracking-tight sm:text-lg">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}
