const env = (import.meta as any).env ?? {};

export const siteConfig = {
  androidStatus: 'coming-soon' as const,
  supportEmail: 'contacto@repuestop.cl',
  whatsappUrl: 'https://wa.me/56900000000',
  instagramUrl: 'https://instagram.com/repuestop.cl',
  flowUrls: {
    webpay: 'https://web.flow.cl/es-cl/preguntas-frecuentes/webpay/',
    tariffs: 'https://web.flow.cl/es-cl/tarifas/',
    paymentMethods: 'https://developers.flow.cl/en/docs/payment-methods',
    refunds: 'https://web.flow.cl/es-cl/link-de-pago',
  },
};

/** Base del backend RepuesTop (mono-repo). Configurable con VITE_API_URL. */
export const API_URL: string = env.VITE_API_URL || 'http://localhost:8080/api/v1';

/** Client ID de Google OAuth para web. Sin esto, el botón de Google queda deshabilitado. */
export const GOOGLE_CLIENT_ID: string = env.VITE_GOOGLE_CLIENT_ID || '';

export function trackEvent(event: string, detail?: string) {
  window.dispatchEvent(new CustomEvent('repuestop:analytics', { detail: { event, detail } }));
}
