import type { SVGProps } from 'react'

/**
 * Íconos vectoriales propios para cada mercado de la etapa 5.
 * Trazo consistente (currentColor) para heredar el color del estado.
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

// Ganador del partido: trofeo
export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v1a3 3 0 0 0 3 3" />
      <path d="M17 6h3v1a3 3 0 0 1-3 3" />
      <path d="M12 13v3" />
      <path d="M9 20h6" />
      <path d="M10 20a2 2 0 0 1 4 0" />
    </svg>
  )
}

// Más/Menos goles: balón con flechas arriba/abajo
export function OverUnderIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="12" r="5.5" />
      <path d="M9 8.7 11 11l-2 .8L7 11l2-2.3Z" fill="currentColor" stroke="none" />
      <path d="M18 6v5" />
      <path d="m16 8 2-2 2 2" />
      <path d="M18 18v-5" />
      <path d="m16 16 2 2 2-2" />
    </svg>
  )
}

// Ambos equipos marcan: dos redes/porterías
export function BothScoreIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h6v10H3z" />
      <path d="M3 10.5h6M3 14h6M6 7v10" />
      <path d="M21 7h-6v10h6z" />
      <path d="M21 10.5h-6M21 14h-6M18 7v10" />
    </svg>
  )
}

// Córners: banderín de esquina
export function CornerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4v16" />
      <path d="M7 4h9l-2.5 3L16 10H7" fill="currentColor" fillOpacity="0.15" />
      <path d="M4 20h8" />
    </svg>
  )
}

// Tarjetas: dos rectángulos superpuestos
export function CardsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="4" width="8" height="12" rx="1.4" transform="rotate(-8 9 10)" />
      <rect
        x="11"
        y="7"
        width="8"
        height="12"
        rx="1.4"
        transform="rotate(8 15 13)"
        fill="currentColor"
        fillOpacity="0.14"
      />
    </svg>
  )
}

// Hándicap: balanza
export function HandicapIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v16" />
      <path d="M6 20h12" />
      <path d="M5 7h14" />
      <path d="M5 7 3 12h4L5 7Z" />
      <path d="M19 7l-2 5h4l-2-5Z" />
    </svg>
  )
}

// Resultado exacto: marcador digital
export function ScoreboardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M12 9v6" />
      <path d="M7 10v4" />
      <path d="M17 10v4" />
    </svg>
  )
}

// 1.º o 2.º tiempo: cronómetro
export function StopwatchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 3h4" />
      <path d="M12 5v2" />
      <circle cx="12" cy="14" r="7" />
      <path d="M12 14V10.5" />
      <path d="M18.5 8.5 20 7" />
    </svg>
  )
}

// Jugador específico: silueta con balón
export function PlayerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="6" r="2.4" />
      <path d="M6.5 20v-4a3.5 3.5 0 0 1 7 0v4" />
      <circle cx="18" cy="16.5" r="2.4" />
    </svg>
  )
}
