import type { SVGProps } from 'react'

/**
 * Íconos vectoriales minimalistas para la ETAPA 9 (mapa radial de métodos).
 * Trazo consistente (currentColor) para heredar el color según el estado
 * normal/seleccionado del círculo que los contiene.
 */

type IconProps = SVGProps<SVGSVGElement>

function base(props: IconProps) {
  return {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  }
}

// Tips de Telegram: avión de papel / envío.
export function PaperPlaneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21.5 3.5 2.5 10.2l6.4 2.4 2.4 6.4 10.2-15.5Z" />
      <path d="m8.9 12.6 5.1-4.9" />
    </svg>
  )
}

// Analizo las estadísticas en el momento: gráfico de barras con tendencia.
export function StatsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <rect x="7" y="12" width="2.6" height="5" rx="0.6" />
      <rect x="12" y="9" width="2.6" height="8" rx="0.6" />
      <rect x="17" y="6" width="2.6" height="11" rx="0.6" />
    </svg>
  )
}

// Sigo el consejo de un amigo: dos personas.
export function FriendsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3 3 0 0 1 0 5.6" />
      <path d="M17 13.4a5.5 5.5 0 0 1 3.5 5.1" />
    </svg>
  )
}

// Sigo mi intuición: brújula.
export function CompassIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.2 8.8-1.6 4.4-4.4 1.6 1.6-4.4 4.4-1.6Z" />
    </svg>
  )
}

// No tengo un método: interrogación.
export function QuestionIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.4-2.7 4" />
      <path d="M12 17.4h.01" />
    </svg>
  )
}
