import { API_URL, GOOGLE_CLIENT_ID } from './config';

/* ------------------------------------------------------------------ *
 * Tipos
 * ------------------------------------------------------------------ */

export type UbicacionOption = { id: string; nombre: string };

export type DireccionPayload = {
  comunaId: number;
  calleYNumero: string;
  codigoPostal?: string;
};

export type SellerRegistrationPayload = {
  responsibleName: string;
  cargo: string;
  email: string;
  phone: string;
  password?: string;
  authProvider: 'EMAIL_PASSWORD' | 'GOOGLE';
  idToken?: string;
  userProfileUrl?: string;
  storeName: string;
  taxId: string;
  giro: string;
  direccion: DireccionPayload;
  hours?: string;
  shippingMethods?: string;
  acceptsTerms: boolean;
};

export type EmailVerificationPending = {
  pendingEmailVerification: true;
  email: string;
  message: string;
};

export type RegistrationResponse = {
  token: string;
  tokenType: string;
  sellerId: string;
  responsibleName: string;
  storeName: string;
  founder: boolean;
  status: string;
  [key: string]: unknown;
};

export type RegistrationResult = EmailVerificationPending | RegistrationResponse;

export function isPendingVerification(r: RegistrationResult): r is EmailVerificationPending {
  return (r as EmailVerificationPending).pendingEmailVerification === true;
}

export type VerificacionResponse = {
  verificationId: string;
  proveedorId: string;
  representativeDocument: string | null;
  inicioActividadesDoc: string | null;
  patenteDoc: string | null;
  boletaFacturaDoc: string | null;
  reviewStatus: string | null;
  reviewNotes: string | null;
  submittedAt: string | null;
};

/* ------------------------------------------------------------------ *
 * HTTP helper
 * ------------------------------------------------------------------ */

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message =
      (data && (data.message || data.error || data.detail)) ||
      (typeof data === 'string' && data) ||
      'No pudimos completar la solicitud. Intenta nuevamente.';
    throw new Error(message);
  }
  return data as T;
}

/* ------------------------------------------------------------------ *
 * Registro
 * ------------------------------------------------------------------ */

export function registerSeller(payload: SellerRegistrationPayload): Promise<RegistrationResult> {
  return request<RegistrationResult>('/auth/register/seller', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function verifyRegistrationCode(email: string, code: string): Promise<RegistrationResponse> {
  return request<RegistrationResponse>('/auth/register/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
}

export function resendRegistrationCode(email: string): Promise<{ message: string }> {
  return request('/auth/register/resend-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

/* ------------------------------------------------------------------ *
 * Geografía (público) — necesitamos comunaId real desde el backend
 * ------------------------------------------------------------------ */

export function fetchPaises(): Promise<UbicacionOption[]> {
  return request<UbicacionOption[]>('/geografia/paises');
}

export function fetchRegiones(paisId: string): Promise<UbicacionOption[]> {
  return request<UbicacionOption[]>(`/geografia/paises/${encodeURIComponent(paisId)}/regiones`);
}

export function fetchComunas(regionId: string): Promise<UbicacionOption[]> {
  return request<UbicacionOption[]>(`/geografia/regiones/${encodeURIComponent(regionId)}/comunas`);
}

/* ------------------------------------------------------------------ *
 * Verificación de tienda (documentos) — requiere Bearer
 * ------------------------------------------------------------------ */

export type VerificacionFiles = {
  representativeDocument?: File | null;
  inicioActividadesDoc?: File | null;
  patenteDoc?: File | null;
  boletaFacturaDoc?: File | null;
  websiteOrSocialUrl?: string;
  mensaje?: string;
};

export function uploadVerificacion(
  sellerId: string,
  token: string,
  files: VerificacionFiles,
): Promise<VerificacionResponse> {
  const form = new FormData();
  if (files.representativeDocument) form.append('representativeDocument', files.representativeDocument);
  if (files.inicioActividadesDoc) form.append('inicioActividadesDoc', files.inicioActividadesDoc);
  if (files.patenteDoc) form.append('patenteDoc', files.patenteDoc);
  if (files.boletaFacturaDoc) form.append('boletaFacturaDoc', files.boletaFacturaDoc);
  if (files.websiteOrSocialUrl) form.append('websiteOrSocialUrl', files.websiteOrSocialUrl);
  if (files.mensaje) form.append('mensaje', files.mensaje);

  return request<VerificacionResponse>(`/proveedores/${encodeURIComponent(sellerId)}/verificacion`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
}

/* ------------------------------------------------------------------ *
 * Google Identity Services
 * ------------------------------------------------------------------ */

export const googleEnabled = Boolean(GOOGLE_CLIENT_ID);

export type GoogleProfile = { idToken: string; email: string; name: string; picture?: string };

let gisPromise: Promise<void> | null = null;

function loadGoogleIdentity(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Sin ventana'));
  if ((window as any).google?.accounts?.id) return Promise.resolve();
  if (gisPromise) return gisPromise;
  gisPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar Google Sign-In'));
    document.head.appendChild(script);
  });
  return gisPromise;
}

function decodeJwt(token: string): any {
  const payload = token.split('.')[1];
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decodeURIComponent(escape(json)));
}

/**
 * Renderiza el botón oficial de Google dentro de `container`.
 * `onProfile` recibe el id_token + datos decodificados para prefill.
 */
export async function renderGoogleButton(
  container: HTMLElement,
  onProfile: (profile: GoogleProfile) => void,
  onError?: (message: string) => void,
): Promise<void> {
  if (!googleEnabled) return;
  try {
    await loadGoogleIdentity();
    const google = (window as any).google;
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (resp: { credential: string }) => {
        try {
          const claims = decodeJwt(resp.credential);
          onProfile({
            idToken: resp.credential,
            email: claims.email,
            name: claims.name || `${claims.given_name ?? ''} ${claims.family_name ?? ''}`.trim(),
            picture: claims.picture,
          });
        } catch {
          onError?.('No pudimos leer tu cuenta de Google.');
        }
      },
    });
    container.innerHTML = '';
    google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      logo_alignment: 'center',
      width: container.clientWidth || 360,
      locale: 'es',
    });
  } catch (e: any) {
    onError?.(e?.message || 'No se pudo iniciar Google Sign-In');
  }
}
