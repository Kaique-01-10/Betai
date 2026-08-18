'use client'

import type { ComponentType, SVGProps } from 'react'
import { cn } from '@/lib/utils'

export type MethodOption = {
  value: string
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  /** Posición del centro del nodo en porcentaje del lienzo (0–100). */
  x: number
  y: number
}

type Props = {
  options: MethodOption[]
  selected: string[]
  onToggle: (value: string) => void
}

// Centro del lienzo ("VOS").
const CX = 50
const CY = 50

export function MethodRadialMap({ options, selected, onToggle }: Props) {
  const anySelected = selected.length > 0

  return (
    <div
      className="relative mx-auto w-full max-w-md touch-manipulation select-none"
      style={{ aspectRatio: '1 / 1' }}
    >
      {/* Capa de líneas de conexión (nodo → centro) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {options.map((opt) => {
          const isSel = selected.includes(opt.value)
          const dx = CX - opt.x
          const dy = CY - opt.y
          const length = Math.sqrt(dx * dx + dy * dy)
          return (
            <line
              key={opt.value}
              x1={opt.x}
              y1={opt.y}
              x2={CX}
              y2={CY}
              stroke={
                isSel ? 'var(--color-brand-bright)' : 'oklch(0.98 0 0 / 0.12)'
              }
              strokeWidth={isSel ? 0.7 : 0.4}
              strokeLinecap="round"
              className={cn(isSel && 'betai-line-draw')}
              style={
                isSel
                  ? ({
                      // Longitud en unidades del viewBox para el dash animado.
                      ['--line-length' as string]: length,
                      filter:
                        'drop-shadow(0 0 1.2px oklch(0.735 0.168 152 / 0.9))',
                    } as React.CSSProperties)
                  : undefined
              }
            />
          )
        })}
      </svg>

      {/* Centro: "VOS" (elemento visual, no es un botón) */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        <div
          className={cn(
            'grid h-[19%] w-[19%] min-h-16 min-w-16 place-items-center rounded-full border text-center transition-all duration-300',
            'border-hairline bg-[oklch(0.2_0.02_162/0.9)] backdrop-blur-sm',
          )}
          style={{
            boxShadow: anySelected
              ? '0 0 0 1px oklch(0.735 0.168 152 / 0.45), 0 0 34px -6px oklch(0.735 0.168 152 / 0.55)'
              : '0 10px 30px -14px oklch(0 0 0 / 0.8)',
          }}
        >
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground sm:text-sm">
            Vos
          </span>
        </div>
      </div>

      {/* Nodos radiales (botones totalmente tocables) */}
      {options.map((opt) => {
        const isSel = selected.includes(opt.value)
        const { Icon } = opt
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            aria-pressed={isSel}
            aria-label={opt.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 focus:outline-none"
            style={{ left: `${opt.x}%`, top: `${opt.y}%`, width: '31%' }}
          >
            <span
              className={cn(
                'grid aspect-square w-[58%] min-h-14 min-w-14 place-items-center rounded-full border transition-all duration-200 ease-out',
                'focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                isSel
                  ? 'animate-betai-node-pop scale-105 border-[var(--color-brand-bright)] bg-[var(--color-brand-bright)] text-[oklch(0.16_0.02_162)]'
                  : 'border-hairline bg-[oklch(0.19_0.018_162/0.85)] text-foreground/85 backdrop-blur-sm',
              )}
              style={
                isSel
                  ? {
                      boxShadow:
                        '0 0 0 5px oklch(0.735 0.168 152 / 0.16), 0 0 26px -2px oklch(0.735 0.168 152 / 0.7)',
                    }
                  : { boxShadow: '0 8px 22px -16px oklch(0 0 0 / 0.9)' }
              }
            >
              <Icon className="h-[46%] w-[46%]" />
            </span>
            <span
              className={cn(
                'text-pretty text-center text-[0.7rem] font-semibold leading-tight transition-colors duration-200 sm:text-xs',
                isSel ? 'text-secondary' : 'text-muted-foreground',
              )}
            >
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
