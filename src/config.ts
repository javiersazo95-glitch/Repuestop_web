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

export function trackEvent(event: string, detail?: string) {
  window.dispatchEvent(new CustomEvent('repuestop:analytics', { detail: { event, detail } }));
}
