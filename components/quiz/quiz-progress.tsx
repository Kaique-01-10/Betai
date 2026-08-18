interface QuizProgressProps {
  currentStep: number
  totalSteps: number
}

export function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  const pct = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100))

  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          Etapa <span className="text-foreground">{currentStep}</span> de{' '}
          {totalSteps}
        </span>
        <span className="text-xs font-bold tabular-nums text-primary">
          {Math.round(pct)}%
        </span>
      </div>

      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)] shadow-[0_1px_0_0_oklch(1_0_0/0.04)_inset]"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-label={`Etapa ${currentStep} de ${totalSteps}`}
      >
        <div
          className="animate-betai-progress-grow relative h-full rounded-full bg-gradient-to-r from-[var(--color-brand-deep)] via-primary to-[var(--color-brand-bright)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${pct}%`,
            boxShadow: '0 0 12px -1px oklch(0.735 0.168 152 / 0.7)',
          }}
        >
          {/* Detalle dorado en el borde de avance */}
          <span
            aria-hidden
            className="absolute inset-y-0 right-0 w-[3px] rounded-full bg-[var(--color-gold)] shadow-[0_0_8px_0_oklch(0.842_0.152_91/0.9)]"
          />
        </div>
      </div>
    </div>
  )
}
