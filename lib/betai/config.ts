// Videos de las funcionalidades (Vimeo). Editables en un único lugar.
// Se guarda SÓLO el ID numérico del video de Vimeo. Deja el string vacío
// para mostrar el placeholder premium.
// La proporción es vertical (formato original del video: 100 / 175.56).
export const TIP_PRONTA_VIMEO_ID = '1219065672'
export const CONTROL_BANCA_VIMEO_ID = '1219065671'

// Proporción original de los videos verticales (ancho / alto), tomada del
// embed de Vimeo (padding-top 175.56%).
export const VIMEO_ASPECT_RATIO = '100 / 175.56'

// Destino del checkout de la última página.
export const CHECKOUT_URL = 'https://pay.cakto.com.br/378qkcj_689395'

// Métodos de pago. Sólo se MUESTRAN los que están realmente integrados
// (enabled: true). Cambia el flag cuando se active cada método en el checkout.
export interface PaymentMethod {
  id: string
  label: string
  enabled: boolean
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'visa', label: 'Visa', enabled: true },
  { id: 'mastercard', label: 'Mastercard', enabled: true },
  { id: 'apple-pay', label: 'Apple Pay', enabled: true },
  { id: 'google-pay', label: 'Google Pay', enabled: true },
]
