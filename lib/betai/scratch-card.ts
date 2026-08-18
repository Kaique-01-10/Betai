// Estado de la raspadinha (rascar y ganar) compartido entre cliente y servidor.
// El descuento SIEMPRE lo decide el backend: el frontend nunca es la autoridad.

export interface ScratchCardState {
  revealed: boolean
  // El descuento aplicado. Sólo tiene valor cuando revealed = true.
  discount: number | null
  // Fin de la oferta (epoch ms). Se fija UNA sola vez al revelar y se firma,
  // por lo que el contador NO se reinicia al recargar la página.
  deadline?: number
}

// Descuento fijo de la campaña. Editable en un único lugar.
// (En producción esto viviría en el backend / base de datos.)
export const SCRATCH_CARD_DISCOUNT = 79

// Precio base de la oferta (USD). El precio final se calcula con el descuento.
export const OFFER_BASE_PRICE_USD = 67.9

// Duración de la ventana de oferta desde que se revela (≈ 4 días).
export const OFFER_DURATION_MS = 4 * 24 * 60 * 60 * 1000

// Calcula el precio final redondeado a partir del descuento aplicado.
export function finalPriceUSD(discount: number): number {
  return Math.round(OFFER_BASE_PRICE_USD * (1 - discount / 100))
}

// Nombre de la cookie httpOnly firmada donde el servidor guarda el estado.
export const SCRATCH_COOKIE = 'betai_scratch'
// Identificador persistente de dispositivo/sesión (para vincular el premio).
export const DEVICE_COOKIE = 'betai_uid'

// Endpoints preparados para conectarse a un backend real más adelante.
const GET_ENDPOINT = '/api/scratch-card'
const REVEAL_ENDPOINT = '/api/scratch-card/reveal'

// GET /scratch-card — lee el estado actual (persistido en el servidor).
export async function fetchScratchCard(): Promise<ScratchCardState> {
  const res = await fetch(GET_ENDPOINT, { cache: 'no-store' })
  if (!res.ok) throw new Error('No se pudo leer el estado de la promoción.')
  return (await res.json()) as ScratchCardState
}

// POST /scratch-card/reveal — marca el premio como revelado.
// Idempotente: si ya estaba revelado, devuelve el mismo descuento.
export async function revealScratchCard(): Promise<ScratchCardState> {
  const res = await fetch(REVEAL_ENDPOINT, { method: 'POST' })
  if (!res.ok) throw new Error('No se pudo revelar la promoción.')
  return (await res.json()) as ScratchCardState
}
