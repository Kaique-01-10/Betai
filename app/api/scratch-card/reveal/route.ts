import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  DEVICE_COOKIE,
  OFFER_DURATION_MS,
  SCRATCH_COOKIE,
  type ScratchCardState,
} from '@/lib/betai/scratch-card'
import {
  decideDiscount,
  newDeviceId,
  signState,
  verifyState,
} from '@/lib/betai/scratch-card-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/scratch-card/reveal
// Marca el premio como revelado. Es IDEMPOTENTE: si el usuario ya reveló,
// se devuelve exactamente el mismo descuento y no se genera uno nuevo.
export async function POST() {
  const store = await cookies()

  if (!store.get(DEVICE_COOKIE)?.value) {
    store.set(DEVICE_COOKIE, newDeviceId(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  // Si ya existe un estado revelado válido, se respeta (sin re-generar).
  const existing = verifyState(store.get(SCRATCH_COOKIE)?.value)
  if (existing?.revealed) {
    return NextResponse.json(existing satisfies ScratchCardState)
  }

  // Primera revelación: el servidor decide el descuento, fija el fin de la
  // oferta y lo firma. El deadline queda congelado en la cookie firmada.
  const state: ScratchCardState = {
    revealed: true,
    discount: decideDiscount(),
    deadline: Date.now() + OFFER_DURATION_MS,
  }
  store.set(SCRATCH_COOKIE, signState(state), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  return NextResponse.json(state)
}
