import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  DEVICE_COOKIE,
  SCRATCH_COOKIE,
  type ScratchCardState,
} from '@/lib/betai/scratch-card'
import { newDeviceId, verifyState } from '@/lib/betai/scratch-card-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/scratch-card
// Devuelve el estado persistido en el servidor. El descuento NUNCA lo decide
// el cliente: sólo se lee lo que el servidor firmó previamente.
export async function GET() {
  const store = await cookies()

  // Identificador persistente de dispositivo/sesión (se crea una sola vez).
  // Cuando exista autenticación, este valor se reemplazaría por el userId.
  if (!store.get(DEVICE_COOKIE)?.value) {
    store.set(DEVICE_COOKIE, newDeviceId(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  const state = verifyState(store.get(SCRATCH_COOKIE)?.value)
  const response: ScratchCardState = state?.revealed
    ? { revealed: true, discount: state.discount, deadline: state.deadline }
    : { revealed: false, discount: null }

  return NextResponse.json(response)
}
