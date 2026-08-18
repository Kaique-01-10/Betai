import type { SVGProps } from 'react'

/**
 * Íconos vectoriales minimalistas para las competiciones de la etapa 6
 * que NO cuentan con un logo oficial disponible. Trazo con currentColor
 * para heredar el color del estado (igual que la etapa 5).
 * No imitan ni recrean logos oficiales: son íconos deportivos genéricos.
 */

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

// LaLiga → escudo / crest genérico
export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 5 5.5V11c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V5.5L12 3Z" />
      <path d="M9.5 11.5 12 9l2.5 2.5" />
    </svg>
  )
}

// Copa Libertadores → copa / trofeo continental
export function CupIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5.5H5.5V7a2.5 2.5 0 0 0 2.5 2.5" />
      <path d="M16 5.5h2.5V7A2.5 2.5 0 0 1 16 9.5" />
      <path d="M12 11v4" />
      <path d="M9 20h6" />
      <path d="M10 20a2 2 0 0 1 4 0" />
    </svg>
  )
}

// Europa League → balón sobre arco continental
export function ContinentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="10" r="5.5" />
      <path d="M6.8 12h10.4" />
      <path d="M12 4.5c1.9 1.4 1.9 9.6 0 11" />
      <path d="M12 4.5c-1.9 1.4-1.9 9.6 0 11" />
      <path d="M4 20c2.5-1.6 5.2-2.4 8-2.4s5.5.8 8 2.4" />
    </svg>
  )
}

// Liga MX → banderín / pennant
export function PennantIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4v16" />
      <path d="M6 4.5h12l-3.2 4L18 12.5H6" fill="currentColor" fillOpacity="0.14" />
    </svg>
  )
}

// Campeonatos nacionales de Latinoamérica → escudos apilados (región)
export function RegionIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3 4 4.8V8c0 2.8 2 5.1 5 6 3-.9 5-3.2 5-6V4.8L9 3Z" />
      <path d="M16.5 8.5 20 9.8V12c0 1.9-1.4 3.5-3.5 4.2" />
    </svg>
  )
}

// Otras ligas → símbolo de infinito (opciones ilimitadas)
export function InfinityIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 9a3 3 0 1 0 0 6c1.7 0 2.7-1.3 3.8-2.7L12 10.4c1.1-1.4 2.1-2.7 3.8-2.7a3 3 0 1 1 0 6c-1.7 0-2.7-1.3-3.8-2.7" />
    </svg>
  )
}
