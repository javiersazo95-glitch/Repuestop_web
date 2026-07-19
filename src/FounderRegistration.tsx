import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Crown, Check, Eye, EyeOff, UploadCloud, FileText,
  UserRound, Store, ClipboardCheck, ShieldCheck, MailCheck, Sparkles, PartyPopper, X,
} from 'lucide-react';
import {
  registerSeller, verifyRegistrationCode, resendRegistrationCode,
  fetchPaises, fetchRegiones, fetchComunas,
  uploadVerificacion, renderGoogleButton, googleEnabled,
  isPendingVerification,
  type UbicacionOption, type GoogleProfile, type SellerRegistrationPayload,
} from './founderApi';
import { VENDEDOR_TERMS, PRIVACIDAD_POLICY } from './legalTexts';

type LegalDoc = 'terms' | 'privacy';

const GIRO_OPTIONS = [
  'Venta al por menor de repuestos y accesorios',
  'Venta al por mayor de repuestos y accesorios',
  'Mantenimiento y reparación de vehículos motorizados',
  'Venta de vehículos motorizados',
];

const PHASES = [
  { icon: <UserRound />, title: 'Registro', text: 'Crea tu cuenta de tienda fundadora.' },
  { icon: <Store />, title: 'Documentos', text: 'Sube los documentos de tu tienda.' },
  { icon: <ClipboardCheck />, title: 'Validación', text: 'Nuestro equipo revisa tu tienda.' },
  { icon: <PartyPopper />, title: 'Aprobación', text: 'Ingresas al panel de vendedores.' },
];

type Session = { sellerId: string; token: string; storeName: string; founder: boolean };

type FormState = {
  responsibleName: string; cargo: string; email: string; phone: string; password: string;
  storeName: string; taxId: string; giro: string; giroOtro: string;
  regionId: string; comunaId: string; address: string; codigoPostal: string;
  acceptsTerms: boolean;
};

const EMPTY_FORM: FormState = {
  responsibleName: '', cargo: '', email: '', phone: '', password: '',
  storeName: '', taxId: '', giro: '', giroOtro: '',
  regionId: '', comunaId: '', address: '', codigoPostal: '',
  acceptsTerms: false,
};

export default function FounderRegistration() {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState(0);
  const [legal, setLegal] = useState<LegalDoc | null>(null);

  // Phase 0 — registro
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [authProvider, setAuthProvider] = useState<'EMAIL_PASSWORD' | 'GOOGLE'>('EMAIL_PASSWORD');
  const [google, setGoogle] = useState<GoogleProfile | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Verificación de correo
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resent, setResent] = useState(false);

  // Sesión creada
  const [session, setSession] = useState<Session | null>(null);

  // Geografía
  const [regiones, setRegiones] = useState<UbicacionOption[]>([]);
  const [comunas, setComunas] = useState<UbicacionOption[]>([]);
  const [geoError, setGeoError] = useState('');

  // Google button
  const googleRef = useRef<HTMLDivElement | null>(null);
  const [googleMsg, setGoogleMsg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cargar país (Chile) + regiones
  useEffect(() => {
    let alive = true;
    fetchPaises()
      .then((paises) => {
        if (!alive) return;
        const chile = paises.find((p) => /chile/i.test(p.nombre)) ?? paises[0];
        if (!chile) return;
        return fetchRegiones(chile.id).then((r) => alive && setRegiones(r));
      })
      .catch(() => alive && setGeoError('No pudimos cargar las regiones. Verifica tu conexión.'));
    return () => { alive = false; };
  }, []);

  // Cargar comunas al cambiar región
  useEffect(() => {
    if (!form.regionId) { setComunas([]); return; }
    let alive = true;
    fetchComunas(form.regionId)
      .then((c) => alive && setComunas(c))
      .catch(() => alive && setGeoError('No pudimos cargar las comunas.'));
    return () => { alive = false; };
  }, [form.regionId]);

  // Botón de Google
  useEffect(() => {
    if (activePhase !== 0 || pendingEmail || !googleEnabled || !googleRef.current) return;
    renderGoogleButton(googleRef.current, (profile) => {
      setGoogle(profile);
      setAuthProvider('GOOGLE');
      setForm((f) => ({
        ...f,
        email: profile.email || f.email,
        responsibleName: f.responsibleName || profile.name || '',
      }));
      setGoogleMsg('');
    }, (msg) => setGoogleMsg(msg));
  }, [activePhase, pendingEmail]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const emailLocked = authProvider === 'GOOGLE';

  /* ------------------------- validación ------------------------- */
  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.responsibleName.trim()) e.responsibleName = 'Ingresa el nombre del responsable';
    if (!form.cargo.trim()) e.cargo = 'Ingresa el cargo';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) e.email = 'Correo no válido';
    if (!/^9\d{8}$/.test(form.phone)) e.phone = 'Teléfono chileno de 9 dígitos (empieza en 9)';
    if (authProvider === 'EMAIL_PASSWORD' && form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (!form.storeName.trim()) e.storeName = 'Ingresa el nombre de tu tienda';
    if (!/^[0-9.]+-[0-9kK]$/.test(form.taxId.trim())) e.taxId = 'RUT con formato 12.345.678-9';
    if (!form.giro) e.giro = 'Selecciona un giro';
    if (form.giro === 'other' && !form.giroOtro.trim()) e.giroOtro = 'Especifica el giro';
    if (!form.regionId) e.regionId = 'Selecciona una región';
    if (!form.comunaId) e.comunaId = 'Selecciona una comuna';
    if (!form.address.trim()) e.address = 'Ingresa la dirección';
    if (!form.acceptsTerms) e.acceptsTerms = 'Debes aceptar los términos';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ------------------------- submit registro ------------------------- */
  async function handleSubmit() {
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload: SellerRegistrationPayload = {
        responsibleName: form.responsibleName.trim(),
        cargo: form.cargo.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone,
        authProvider,
        storeName: form.storeName.trim(),
        taxId: form.taxId.trim(),
        giro: form.giro === 'other' ? form.giroOtro.trim() : form.giro,
        direccion: {
          comunaId: Number(form.comunaId),
          calleYNumero: form.address.trim(),
          codigoPostal: form.codigoPostal.trim() || undefined,
        },
        acceptsTerms: true,
      };
      if (authProvider === 'GOOGLE' && google) {
        payload.idToken = google.idToken;
        payload.userProfileUrl = google.picture;
      } else {
        payload.password = form.password;
      }

      const result = await registerSeller(payload);
      if (isPendingVerification(result)) {
        setPendingEmail(result.email);
      } else {
        setSession({
          sellerId: result.sellerId,
          token: result.token,
          storeName: result.storeName,
          founder: result.founder,
        });
        setActivePhase(1);
      }
    } catch (err: any) {
      setFormError(err?.message || 'No pudimos crear tu cuenta. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify() {
    if (code.trim().length !== 6 || !pendingEmail) return;
    setVerifying(true);
    setFormError('');
    try {
      const result = await verifyRegistrationCode(pendingEmail, code.trim());
      setSession({
        sellerId: result.sellerId,
        token: result.token,
        storeName: result.storeName,
        founder: result.founder,
      });
      setPendingEmail(null);
      setActivePhase(1);
    } catch (err: any) {
      setFormError(err?.message || 'El código no es válido o expiró.');
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (!pendingEmail) return;
    try {
      await resendRegistrationCode(pendingEmail);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch { /* noop */ }
  }

  /* ================================================================= */
  return (
    <div className="founder-reg">
      <header className="founder-reg-topbar">
        <button className="founder-reg-back" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Volver al inicio
        </button>
        <a href="/" className="founder-reg-brand" aria-label="RepuesTop, inicio">
          <img src="/assets/repuestop-icon.jpg" alt="" /><span>Repues<span>Top</span></span>
        </a>
      </header>

      <div className="founder-reg-shell">
        {/* ---------------- columna izquierda: contexto + timeline ---------------- */}
        <aside className="founder-reg-aside">
          <span className="founder-reg-ribbon"><Sparkles size={13} /> Postulación tienda fundadora</span>
          <h1>Únete como <em>tienda fundadora</em> de RepuesTop</h1>
          <p className="founder-reg-lead">
            Completa tu registro y sigue las 4 fases para activar tu tienda con beneficios de fundador:
            5% de comisión fija, distintivo oficial y mayor visibilidad.
          </p>
          <Timeline activePhase={activePhase} />
        </aside>

        {/* ---------------- columna derecha: contenido por fase ---------------- */}
        <section className="founder-reg-main">
          {activePhase === 0 && !pendingEmail && (
            <RegistrationForm
              form={form} errors={errors} update={update}
              authProvider={authProvider} emailLocked={emailLocked}
              google={google}
              onClearGoogle={() => { setGoogle(null); setAuthProvider('EMAIL_PASSWORD'); }}
              googleRef={googleRef} googleMsg={googleMsg}
              showPassword={showPassword} setShowPassword={setShowPassword}
              regiones={regiones} comunas={comunas} geoError={geoError}
              onRegionChange={(regionId) => setForm((f) => ({ ...f, regionId, comunaId: '' }))}
              submitting={submitting} formError={formError}
              onSubmit={handleSubmit}
              onOpenLegal={setLegal}
            />
          )}

          {activePhase === 0 && pendingEmail && (
            <VerifyCode
              email={pendingEmail} code={code} setCode={setCode}
              verifying={verifying} formError={formError} resent={resent}
              onVerify={handleVerify} onResend={handleResend}
              onBack={() => { setPendingEmail(null); setCode(''); setFormError(''); }}
            />
          )}

          {activePhase === 1 && session && (
            <DocumentsUpload
              session={session}
              onDone={() => setActivePhase(2)}
            />
          )}

          {activePhase === 2 && (
            <ReviewInfo storeName={session?.storeName} onFinish={() => setActivePhase(3)} />
          )}

          {activePhase === 3 && (
            <ApprovedInfo onHome={() => navigate('/')} />
          )}
        </section>
      </div>

      <LegalModal
        open={legal !== null}
        title={legal === 'privacy' ? 'Política de privacidad' : 'Términos y condiciones'}
        text={legal === 'privacy' ? PRIVACIDAD_POLICY : VENDEDOR_TERMS}
        onClose={() => setLegal(null)}
      />
    </div>
  );
}

/* ==================================================================== *
 * Timeline
 * ==================================================================== */
function Timeline({ activePhase }: { activePhase: number }) {
  return (
    <ol className="founder-timeline">
      {PHASES.map((phase, i) => {
        const state = i < activePhase ? 'done' : i === activePhase ? 'active' : 'todo';
        return (
          <li key={phase.title} className={`founder-timeline-step is-${state}`}>
            <span className="founder-timeline-marker">
              {state === 'done' ? <Check size={16} /> : phase.icon}
            </span>
            <div className="founder-timeline-body">
              <strong>Fase {i + 1} · {phase.title}</strong>
              <span>{phase.text}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ==================================================================== *
 * Fase 1 — Formulario de registro
 * ==================================================================== */
type RegFormProps = {
  form: FormState; errors: Partial<Record<keyof FormState, string>>;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  authProvider: 'EMAIL_PASSWORD' | 'GOOGLE'; emailLocked: boolean;
  google: GoogleProfile | null; onClearGoogle: () => void;
  googleRef: React.RefObject<HTMLDivElement>; googleMsg: string;
  showPassword: boolean; setShowPassword: (v: boolean) => void;
  regiones: UbicacionOption[]; comunas: UbicacionOption[]; geoError: string;
  onRegionChange: (regionId: string) => void;
  submitting: boolean; formError: string; onSubmit: () => void;
  onOpenLegal: (doc: LegalDoc) => void;
};

function RegistrationForm(p: RegFormProps) {
  const { form, errors, update } = p;
  return (
    <div className="founder-reg-card">
      <div className="founder-reg-head">
        <h2>Crea tu cuenta de tienda fundadora</h2>
        <p>Ingresa los datos del responsable y de tu tienda. Podrás subir los documentos en el siguiente paso.</p>
      </div>

      {/* Google */}
      {googleEnabled ? (
        <div className="founder-reg-google">
          {p.google ? (
            <div className="founder-reg-google-active">
              <MailCheck size={18} />
              <div><strong>{p.google.email}</strong><span>Conectado con Google</span></div>
              <button type="button" onClick={p.onClearGoogle} aria-label="Quitar Google"><X size={16} /></button>
            </div>
          ) : (
            <>
              <div ref={p.googleRef} className="founder-reg-google-btn" />
              {p.googleMsg && <p className="founder-reg-hint-error">{p.googleMsg}</p>}
              <div className="founder-reg-or"><span>o regístrate con tu correo</span></div>
            </>
          )}
        </div>
      ) : (
        <div className="founder-reg-google-disabled">
          <button type="button" className="button button-outline" disabled>Continuar con Google</button>
          <small>Disponible al configurar el acceso con Google.</small>
          <div className="founder-reg-or"><span>regístrate con tu correo</span></div>
        </div>
      )}

      <div className="founder-reg-grid">
        <Field label="Nombre del responsable" required error={errors.responsibleName}>
          <input value={form.responsibleName} placeholder="Nombre completo"
            onChange={(e) => update('responsibleName', e.target.value)} />
        </Field>
        <Field label="Cargo" required error={errors.cargo}>
          <input value={form.cargo} placeholder="Ej: Gerente, Administrador"
            onChange={(e) => update('cargo', e.target.value)} />
        </Field>

        <Field label="Correo electrónico" required error={errors.email}
          hint={p.emailLocked ? 'Verificado con tu cuenta de Google' : undefined}>
          <input type="email" value={form.email} placeholder="ejemplo@correo.com" disabled={p.emailLocked}
            onChange={(e) => update('email', e.target.value)} />
        </Field>
        <Field label="Teléfono" required error={errors.phone}>
          <div className="founder-reg-phone">
            <span>🇨🇱 +56</span>
            <input type="tel" value={form.phone} placeholder="9 1234 5678" maxLength={9}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length && v[0] !== '9') v = '9' + v;
                update('phone', v.slice(0, 9));
              }} />
          </div>
        </Field>

        {p.authProvider === 'EMAIL_PASSWORD' && (
          <Field label="Contraseña" required error={errors.password} className="founder-reg-col-full">
            <div className="founder-reg-password">
              <input type={p.showPassword ? 'text' : 'password'} value={form.password}
                placeholder="Mínimo 8 caracteres"
                onChange={(e) => update('password', e.target.value)} />
              <button type="button" onClick={() => p.setShowPassword(!p.showPassword)} aria-label="Ver contraseña">
                {p.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>
        )}

        <div className="founder-reg-divider founder-reg-col-full"><Store size={15} /> Datos de la tienda</div>

        <Field label="Nombre de la tienda" required error={errors.storeName}>
          <input value={form.storeName} placeholder="Nombre de tu tienda o negocio"
            onChange={(e) => update('storeName', e.target.value)} />
        </Field>
        <Field label="RUT de la empresa" required error={errors.taxId}>
          <input value={form.taxId} placeholder="12.345.678-9"
            onChange={(e) => update('taxId', e.target.value)} />
        </Field>

        <Field label="Giro comercial" required error={errors.giro} className="founder-reg-col-full">
          <select value={form.giro} onChange={(e) => update('giro', e.target.value)}>
            <option value="">Selecciona el giro de tu tienda</option>
            {GIRO_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
            <option value="other">Otro</option>
          </select>
        </Field>
        {form.giro === 'other' && (
          <Field label="Especificar giro" required error={errors.giroOtro} className="founder-reg-col-full">
            <input value={form.giroOtro} placeholder="Escribe tu giro comercial"
              onChange={(e) => update('giroOtro', e.target.value)} />
          </Field>
        )}

        <Field label="Región" required error={errors.regionId}>
          <select value={form.regionId} onChange={(e) => p.onRegionChange(e.target.value)}>
            <option value="">{p.regiones.length ? 'Selecciona una región' : 'Cargando...'}</option>
            {p.regiones.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
          </select>
        </Field>
        <Field label="Comuna" required error={errors.comunaId}>
          <select value={form.comunaId} disabled={!form.regionId}
            onChange={(e) => update('comunaId', e.target.value)}>
            <option value="">{form.regionId ? 'Selecciona una comuna' : 'Elige región primero'}</option>
            {p.comunas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </Field>

        <Field label="Dirección" required error={errors.address}>
          <input value={form.address} placeholder="Av. Principal 123"
            onChange={(e) => update('address', e.target.value)} />
        </Field>
        <Field label="Código postal" hint="Opcional">
          <input value={form.codigoPostal} placeholder="Opcional"
            onChange={(e) => update('codigoPostal', e.target.value)} />
        </Field>
      </div>

      {p.geoError && <p className="founder-reg-hint-error">{p.geoError}</p>}

      <div className="founder-reg-terms">
        <input id="acceptsTerms" type="checkbox" checked={form.acceptsTerms}
          onChange={(e) => update('acceptsTerms', e.target.checked)} />
        <label htmlFor="acceptsTerms">
          Acepto los{' '}
          <button type="button" className="founder-reg-link" onClick={() => p.onOpenLegal('terms')}>términos y condiciones</button>
          {' '}y la{' '}
          <button type="button" className="founder-reg-link" onClick={() => p.onOpenLegal('privacy')}>política de privacidad</button>
          {' '}de RepuesTop.
        </label>
      </div>
      {errors.acceptsTerms && <p className="founder-reg-hint-error">{errors.acceptsTerms}</p>}

      {p.formError && <div className="founder-reg-alert">{p.formError}</div>}

      <button className="button founder-reg-submit" onClick={p.onSubmit} disabled={p.submitting}>
        {p.submitting ? 'Creando cuenta...' : <>Crear cuenta y continuar <ArrowRight size={18} /></>}
      </button>
    </div>
  );
}

/* ==================================================================== *
 * Verificación de correo
 * ==================================================================== */
function VerifyCode(p: {
  email: string; code: string; setCode: (v: string) => void;
  verifying: boolean; formError: string; resent: boolean;
  onVerify: () => void; onResend: () => void; onBack: () => void;
}) {
  return (
    <div className="founder-reg-card founder-reg-centered">
      <div className="founder-reg-icon-badge"><MailCheck size={28} /></div>
      <h2>Verifica tu correo</h2>
      <p>Te enviamos un código de 6 dígitos a <strong>{p.email}</strong>. Ingrésalo para activar tu cuenta.</p>
      <input className="founder-reg-code" inputMode="numeric" maxLength={6} placeholder="000000"
        value={p.code} onChange={(e) => p.setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} />
      {p.formError && <div className="founder-reg-alert">{p.formError}</div>}
      {p.resent && <p className="founder-reg-hint-ok">Código reenviado con éxito.</p>}
      <button className="button founder-reg-submit" onClick={p.onVerify}
        disabled={p.verifying || p.code.length !== 6}>
        {p.verifying ? 'Verificando...' : 'Verificar código'}
      </button>
      <div className="founder-reg-verify-actions">
        <button onClick={p.onResend}>Reenviar código</button>
        <button onClick={p.onBack}>Corregir datos</button>
      </div>
    </div>
  );
}

/* ==================================================================== *
 * Fase 2 — Subida de documentos
 * ==================================================================== */
type DocKey = 'representativeDocument' | 'inicioActividadesDoc' | 'patenteDoc' | 'boletaFacturaDoc';
const DOC_FIELDS: { key: DocKey; label: string; hint: string; required: boolean }[] = [
  { key: 'representativeDocument', label: 'Cédula del representante', hint: 'Foto o PDF de la cédula por ambos lados.', required: true },
  { key: 'inicioActividadesDoc', label: 'Inicio de actividades (SII)', hint: 'Documento de inicio de actividades.', required: true },
  { key: 'patenteDoc', label: 'Patente comercial', hint: 'Patente municipal vigente.', required: true },
  { key: 'boletaFacturaDoc', label: 'Boleta o factura', hint: 'Ejemplo de boleta o factura de tu tienda.', required: false },
];

function DocumentsUpload({ session, onDone }: { session: Session; onDone: () => void }) {
  const [files, setFiles] = useState<Record<DocKey, File | null>>({
    representativeDocument: null, inicioActividadesDoc: null, patenteDoc: null, boletaFacturaDoc: null,
  });
  const [website, setWebsite] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const requiredReady = DOC_FIELDS.filter((d) => d.required).every((d) => files[d.key]);

  async function submit() {
    setError('');
    if (!requiredReady) { setError('Adjunta los documentos obligatorios para continuar.'); return; }
    setUploading(true);
    try {
      await uploadVerificacion(session.sellerId, session.token, {
        ...files,
        websiteOrSocialUrl: website.trim() || undefined,
      });
      onDone();
    } catch (err: any) {
      setError(err?.message || 'No pudimos subir los documentos. Intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="founder-reg-card">
      <div className="founder-reg-head">
        <div className="founder-reg-success-pill"><Check size={14} /> Cuenta creada{session.founder ? ' · Fundador' : ''}</div>
        <h2>Sube los documentos de tu tienda</h2>
        <p>Verificamos cada tienda antes de abrirla para proteger a compradores y proveedores. Al enviarlos recibirás un correo de confirmación.</p>
      </div>

      <div className="founder-reg-docs">
        {DOC_FIELDS.map((doc) => (
          <FileField key={doc.key} label={doc.label} hint={doc.hint} required={doc.required}
            file={files[doc.key]}
            onChange={(f) => setFiles((prev) => ({ ...prev, [doc.key]: f }))} />
        ))}
      </div>

      <Field label="Sitio web o red social" hint="Opcional">
        <input value={website} placeholder="https://instagram.com/tu-tienda"
          onChange={(e) => setWebsite(e.target.value)} />
      </Field>

      {error && <div className="founder-reg-alert">{error}</div>}

      <button className="button founder-reg-submit" onClick={submit} disabled={uploading || !requiredReady}>
        {uploading ? 'Enviando documentos...' : <>Enviar documentos <ArrowRight size={18} /></>}
      </button>
    </div>
  );
}

function FileField({ label, hint, required, file, onChange }: {
  label: string; hint: string; required: boolean; file: File | null; onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className={`founder-file ${file ? 'has-file' : ''}`}>
      <input ref={inputRef} type="file" accept="image/*,application/pdf" hidden
        onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      <button type="button" className="founder-file-drop" onClick={() => inputRef.current?.click()}>
        <span className="founder-file-icon">{file ? <FileText size={20} /> : <UploadCloud size={20} />}</span>
        <span className="founder-file-text">
          <strong>{label}{required && <i className="founder-req">*</i>}</strong>
          <small>{file ? file.name : hint}</small>
        </span>
        {file && <span className="founder-file-check"><Check size={16} /></span>}
      </button>
    </div>
  );
}

/* ==================================================================== *
 * Fase 3 — En revisión
 * ==================================================================== */
function ReviewInfo({ storeName, onFinish }: { storeName?: string; onFinish: () => void }) {
  return (
    <div className="founder-reg-card founder-reg-centered">
      <div className="founder-reg-icon-badge founder-reg-icon-review"><ClipboardCheck size={28} /></div>
      <h2>¡Documentos recibidos!</h2>
      <p>
        {storeName ? <><strong>{storeName}</strong> quedó en revisión. </> : 'Tu tienda quedó en revisión. '}
        Nuestro equipo de Mediación y Confianza validará tu documentación. Te enviaremos un correo con el
        veredicto final apenas termine la revisión.
      </p>
      <ul className="founder-reg-checklist">
        <li><MailCheck size={16} /> Recibiste un correo confirmando la recepción de tus documentos.</li>
        <li><ShieldCheck size={16} /> El equipo revisa que todo esté correcto (normalmente en 24-48h).</li>
        <li><PartyPopper size={16} /> Cuando se apruebe, podrás ingresar al panel de vendedores.</li>
      </ul>
      <button className="button button-outline founder-reg-submit" onClick={onFinish}>
        Ver qué sigue <ArrowRight size={18} />
      </button>
    </div>
  );
}

/* ==================================================================== *
 * Fase 4 — Aprobación (informativa)
 * ==================================================================== */
function ApprovedInfo({ onHome }: { onHome: () => void }) {
  return (
    <div className="founder-reg-card founder-reg-centered">
      <div className="founder-reg-icon-badge founder-reg-icon-approved"><Crown size={28} /></div>
      <h2>Último paso: aprobación e ingreso</h2>
      <p>
        Cuando el equipo apruebe tu tienda, recibirás un correo con el acceso al <strong>panel de vendedores</strong>,
        donde podrás cargar tu inventario y empezar a vender como tienda fundadora con 5% de comisión fija.
      </p>
      <ul className="founder-reg-checklist">
        <li><Check size={16} /> Distintivo oficial de Fundador en tus publicaciones.</li>
        <li><Check size={16} /> Mayor visibilidad en las búsquedas por patente.</li>
        <li><Check size={16} /> Acceso anticipado a la gestión de inventario.</li>
      </ul>
      <button className="button founder-reg-submit" onClick={onHome}>Volver al inicio</button>
    </div>
  );
}

/* ==================================================================== *
 * Modal legal (términos / privacidad)
 * ==================================================================== */
function LegalModal({ open, title, text, onClose }: {
  open: boolean; title: string; text: string; onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="founder-legal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="founder-legal" onClick={(e) => e.stopPropagation()}>
        <header className="founder-legal-head">
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </header>
        <div className="founder-legal-body">
          {text.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== *
 * Campo reutilizable
 * ==================================================================== */
function Field({ label, required, error, hint, className, children }: {
  label: string; required?: boolean; error?: string; hint?: string; className?: string; children: ReactNode;
}) {
  return (
    <label className={`founder-field ${className ?? ''} ${error ? 'has-error' : ''}`}>
      <span className="founder-field-label">{label}{required && <i className="founder-req">*</i>}</span>
      {children}
      {error ? <span className="founder-field-error">{error}</span>
        : hint ? <span className="founder-field-hint">{hint}</span> : null}
    </label>
  );
}
