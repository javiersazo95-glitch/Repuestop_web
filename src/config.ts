export const siteConfig = {
  androidStatus: 'coming-soon' as const,
  supportEmail: 'contacto@repuestop.cl',
  whatsappUrl: 'https://wa.me/56900000000',
  instagramUrl: 'https://instagram.com/repuestop.cl',
};

export function trackEvent(event: string, detail?: string) {
  window.dispatchEvent(new CustomEvent('repuestop:analytics', { detail: { event, detail } }));
}
