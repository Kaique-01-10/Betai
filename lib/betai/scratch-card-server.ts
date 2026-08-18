import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import {
  SCRATCH_CARD_DISCOUNT,
  type ScratchCardState,
} from '@/lib/betai/scratch-card'

// Secreto para firmar el estado de la raspadinha. En producción debe venir de
// una variable de entorno; aquí hay un fallback para el entorno de desarrollo.
const SECRET =
  process.env.SCRATCH_CARD_SECRET ??
  process.env.BETTER_AUTH_SECRET ??
  'betai-scratch-dev-secret-2027'

// Firma un payload y devuelve "base64url.firma".
export function signState(payload: ScratchCardState): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', SECRET).update(data).digest('base64url')
  return `${data}.${sig}`
}

// Verifica y decodifica el token. Devuelve null si es inválido o fue alterado.
export function verifyState(token: string | undefined): ScratchCardState | null {
  if (!token) return null
  const [data, sig] = token.split('.')
  if (!data || !sig) return null

  const expected = createHmac('sha256', SECRET).update(data).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const parsed = JSON.parse(
      Buffer.from(data, 'base64url').toString('utf8'),
    ) as ScratchCardState
    if (typeof parsed.revealed !== 'boolean') return null
    return parsed
  } catch {
    return null
  }
}

// El descuento lo decide exclusivamente el servidor.
export function decideDiscount(): number {
  return SCRATCH_CARD_DISCOUNT
}

export function newDeviceId(): string {
  return randomUUID()
}
