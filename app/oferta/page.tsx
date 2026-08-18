import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { OfferView } from '@/components/oferta/offer-view'
import {
  finalPriceUSD,
  OFFER_BASE_PRICE_USD,
  OFFER_DURATION_MS,
  SCRATCH_COOKIE,
} from '@/lib/betai/scratch-card'
import { verifyState } from '@/lib/betai/scratch-card-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tu oferta con descuento | BetAI',
  description:
    'Acceso vitalicio a BetAI con tu descuento desbloqueado. Pago único, sin suscripción.',
}

// El descuento y el fin de la oferta se VALIDAN en el servidor a partir de la
// cookie firmada. Nunca se confía en la query string ni en el cliente.
export default async function OfertaPage() {
  const store = await cookies()
  const state = verifyState(store.get(SCRATCH_COOKIE)?.value)

  // Sin una raspadinha revelada válida no hay oferta promocional que mostrar.
  if (!state?.revealed || state.discount === null) {
    redirect('/plan')
  }

  const discount = state.discount
  // El deadline viene congelado desde el reveal. Fallback sólo para cookies
  // antiguas sin deadline (no debería ocurrir en flujos nuevos).
  const deadline = state.deadline ?? Date.now() + OFFER_DURATION_MS

  return (
    <OfferView
      discount={discount}
      deadline={deadline}
      basePrice={OFFER_BASE_PRICE_USD}
      finalPrice={finalPriceUSD(discount)}
    />
  )
}
