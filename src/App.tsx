import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowDown, ArrowRight, BadgeCheck, Boxes, ChevronDown,
  CircleDollarSign, FileSpreadsheet, Headphones, HeartHandshake, LockKeyhole,
  MessageSquareQuote, PackageCheck, Search, ShieldCheck, ShoppingCart,
  Smartphone, Store, Users, Zap, KeyRound, MapPin, UserRound,
  Package, CreditCard, CarFront, Truck, Mail, MessageCircle, ClipboardCheck,
} from 'lucide-react';
import { siteConfig, trackEvent } from './config';

type Feature = { icon: ReactNode; title: string; text: string };
type ExperienceMode = 'buyer' | 'seller';

const buyerFeatures: Feature[] = [
  { icon: <Search />, title: 'Busca con confianza', text: 'Identifica tu vehículo por patente o selecciona marca, modelo, versión y año.' },
  { icon: <BadgeCheck />, title: 'Tiendas verificadas', text: 'Encuentra alternativas publicadas por vendedores formalizados y validados.' },
  { icon: <MessageSquareQuote />, title: 'Compra o cotiza', text: 'Compara opciones o solicita una cotización privada cuando el precio no sea público.' },
  { icon: <PackageCheck />, title: 'Sigue tu pedido', text: 'Consulta el avance de tu compra y solicita ayuda cuando la necesites.' },
];

const sellerFeatures: Feature[] = [
  { icon: <Users />, title: 'Llega a nuevos clientes', text: 'Conecta tu tienda con personas que buscan repuestos para vehículos concretos.' },
  { icon: <FileSpreadsheet />, title: 'Carga tu inventario', text: 'Publica productos manualmente o prepara cargas masivas mediante Excel o CSV.' },
  { icon: <CircleDollarSign />, title: 'Tú controlas tus precios', text: 'Publica precios o responde cotizaciones privadas según tu estrategia comercial.' },
  { icon: <Boxes />, title: 'Gestiona tu operación', text: 'Administra stock, solicitudes, pedidos y comunicación desde un mismo lugar.' },
];


const experiences = {
  buyer: {
    label: 'Quiero comprar', icon: <ShoppingCart />, eyebrow: 'Para personas y talleres',
    title: 'Encuentra el repuesto correcto sin perder tiempo',
    text: 'Tu vehículo es el punto de partida. Busca por patente, compara alternativas de tiendas verificadas y elige con información clara.',
    features: buyerFeatures, image: '/assets/comprador-como-funciona.png',
    stats: [['1 búsqueda', 'Todo parte con tu vehículo'], ['Tiendas verificadas', 'Más confianza al elegir'], ['Compra o cotiza', 'Tú decides cómo avanzar']],
  },
  seller: {
    label: 'Quiero vender', icon: <Store />, eyebrow: 'Para tiendas de repuestos',
    title: 'Convierte tu inventario en nuevas oportunidades',
    text: 'Digitaliza tu oferta, responde solicitudes y conecta con clientes que ya están buscando productos para un vehículo concreto.',
    features: sellerFeatures, image: '/assets/vendedor-como-funciona.png',
    stats: [['Más alcance', 'Llega a nuevos clientes'], ['Control total', 'Precios, stock y condiciones'], ['Todo en orden', 'Cotizaciones y pedidos']],
  },
} as const;

function usePageMeta() {
  useEffect(() => {
    document.title = 'RepuesTop | Compra y vende repuestos';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Compra o vende repuestos automotrices con una experiencia simple, confiable y moderna.');
  }, []);
}

function AndroidIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.4 5.3 5.9 2.8a.7.7 0 0 1 1.2-.7l1.6 2.6a9 9 0 0 1 6.6 0l1.6-2.6a.7.7 0 1 1 1.2.7l-1.5 2.5A7.2 7.2 0 0 1 20 11H4a7.2 7.2 0 0 1 3.4-5.7ZM8 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM4 12h16v7a2 2 0 0 1-2 2h-1v1.3a1 1 0 1 1-2 0V21H9v1.3a1 1 0 1 1-2 0V21H6a2 2 0 0 1-2-2v-7Z" /></svg>;
}

function AppleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.8 12.8c0-2.3 1.9-3.4 2-3.5a4.3 4.3 0 0 0-3.4-1.8c-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.9-3-.9a4.5 4.5 0 0 0-3.8 2.3c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3.1-.7 1.4 0 1.9.7 3.1.7 1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.7-1-2.7-3.6ZM14.5 6c.6-.8 1.1-2 1-3.2-1 .1-2.3.7-3 1.5-.7.7-1.2 1.9-1.1 3 1.2.1 2.4-.5 3.1-1.3Z" /></svg>;
}

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 9.3V8c0-.7.5-1.1 1.2-1.1H16V4.2h-1.8C11.8 4.2 10 5.9 10 8.5v.8H8v2.7h2V20h3.1v-8h2.4l.4-2.7h-2.9Z" /></svg>;
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.2 3.8h9.6A3.4 3.4 0 0 1 20.2 7.2v9.6a3.4 3.4 0 0 1-3.4 3.4H7.2a3.4 3.4 0 0 1-3.4-3.4V7.2a3.4 3.4 0 0 1 3.4-3.4Zm0 1.8a1.6 1.6 0 0 0-1.6 1.6v9.6a1.6 1.6 0 0 0 1.6 1.6h9.6a1.6 1.6 0 0 0 1.6-1.6V7.2a1.6 1.6 0 0 0-1.6-1.6H7.2Zm4.8 2.2a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Zm0 1.8a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Zm4.9-2.1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" /></svg>;
}

function TiktokIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.5 4c.5 1.6 1.5 3 2.9 3.8.8.5 1.7.8 2.6.9v3.1c-1.8 0-3.4-.5-4.7-1.4V15a4.9 4.9 0 1 1-4.9-4.9c.2 0 .4 0 .6.1v3.1a1.8 1.8 0 1 0 1.8 1.8V4h1.7Z" /></svg>;
}

function Brand() {
  return <a href="#inicio" className="hero-brand" aria-label="RepuesTop, inicio"><img src="/assets/repuestop-icon.jpg" alt="" /><span>Repues<span>Top</span></span></a>;
}

function PlatformPill({ platform, soon = false }: { platform: 'android' | 'ios'; soon?: boolean }) {
  const isAndroid = platform === 'android';
  return <div className={`platform-pill ${platform}`}>
    <span className="platform-icon">{isAndroid ? <AndroidIcon /> : <AppleIcon />}</span>
    <span><small>{soon ? 'Próximamente en' : 'Primero en'}</small><strong>{isAndroid ? 'Android' : 'iOS'}</strong></span>
      <i>{isAndroid ? 'Muy pronto' : 'Próx. etapa'}</i>
  </div>;
}

function FeatureGrid({ items }: { items: readonly Feature[] }) {
  return <div className="feature-grid">{items.map((item, index) => <article className={`feature-card accent-${index + 1}`} key={item.title}><div className="icon-box">{item.icon}</div><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>;
}

function ExperienceTabs() {
  const [mode, setMode] = useState<ExperienceMode>('buyer');
  const [expanded, setExpanded] = useState(false);
  const experience = experiences[mode];
  const selectMode = (nextMode: ExperienceMode) => {
    setMode(nextMode);
    setExpanded(false);
    trackEvent('audience_tab', nextMode);
  };

  return <section className={`experience-section experience-${mode}`} id="experiencias">
    <div className="section experience-shell">
      <div className="section-heading centered"><span className="eyebrow"><Users /> Una plataforma, dos experiencias</span><h2>Todo lo que necesitas, según tu objetivo</h2><p>Cambia de vista y descubre cómo RepuesTop trabaja para ti.</p></div>
      <div className="experience-tabs" role="tablist" aria-label="Elige tu experiencia">
        {(Object.keys(experiences) as ExperienceMode[]).map(key => (
          <button 
            key={key} 
            type="button" 
            role="tab" 
            id={`experience-tab-${key}`}
            aria-controls={`experience-panel-${key}`}
            aria-selected={mode === key} 
            className={mode === key ? 'is-active' : ''} 
            onClick={() => selectMode(key)}
          >
            {experiences[key].icon}
            <span>{experiences[key].label}</span>
          </button>
        ))}
      </div>
      <div 
        className="experience-panel" 
        role="tabpanel" 
        id={`experience-panel-${mode}`}
        aria-labelledby={`experience-tab-${mode}`}
        key={mode}
      >
        <div className="experience-content"><span className="eyebrow">{experience.eyebrow}</span><h2>{experience.title}</h2><p>{experience.text}</p><div className="experience-stats">{experience.stats.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div><button className="button experience-cta" type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Ver menos' : 'Ver todo lo que ofrece'} <ChevronDown /></button></div>
        <div className="experience-media"><div className="media-glow" /><div className="image-panel"><img src={experience.image} alt={experience.title} /></div><span className="floating-chip chip-top"><Zap /> Experiencia simple y rápida</span><span className="floating-chip chip-bottom"><BadgeCheck /> Información más clara</span></div>
      </div>
      <div className={`experience-features expandable-content ${expanded ? 'is-expanded' : ''}`} aria-hidden={!expanded}><FeatureGrid items={experience.features} /></div>
    </div>
  </section>;
}

type InfoMode = 'flow' | 'about' | 'help' | 'privacy';

const infoOptions = {
  flow: { label: 'Cómo funciona', icon: <Zap />, tone: 'cyan' },
  about: { label: 'Nosotros', icon: <HeartHandshake />, tone: 'violet' },
  help: { label: 'Ayuda', icon: <Headphones />, tone: 'coral' },
  privacy: { label: 'Privacidad', icon: <LockKeyhole />, tone: 'lime' },
} as const;

type HelpTopicKey = 'buyers' | 'vendors' | 'orders' | 'payments';

const helpTopics: Record<HelpTopicKey, {
  label: string;
  icon: ReactNode;
  intro: string;
  title: string;
  description: string;
  questions: Array<{ icon: ReactNode; question: string; answer: string }>;
}> = {
  buyers: {
    label: 'Compradores',
    icon: <UserRound />,
    intro: 'Busca, compara y compra con claridad.',
    title: 'Resuelve dudas antes de comprar',
    description: 'Te ayudamos a entender compatibilidad, cotizaciones y seguimiento para que tu compra avance con más seguridad.',
    questions: [
      {
        icon: <ShoppingCart />,
        question: '¿Cómo sé si un repuesto sirve para mi vehículo?',
        answer: 'Puedes comenzar con tu patente o ingresar marca, modelo, versión y año. RepuesTop usa esa información como guía para mostrar alternativas relevantes y reducir errores al comprar.',
      },
      {
        icon: <BadgeCheck />,
        question: '¿Puedo comparar varias opciones antes de decidir?',
        answer: 'Sí. La idea es que revises alternativas de distintas tiendas, compares condiciones y elijas la que te acomode mejor antes de confirmar una compra o una cotización.',
      },
      {
        icon: <MessageSquareQuote />,
        question: '¿Qué hago si prefiero cotizar en vez de comprar de inmediato?',
        answer: 'Puedes solicitar una cotización y revisar precio, disponibilidad y condiciones antes de avanzar. Así tomas la decisión con más contexto y sin apuro.',
      },
      {
        icon: <PackageCheck />,
        question: '¿Cómo sigo mi pedido después de comprar?',
        answer: 'Dentro de la experiencia podrás revisar el estado de tu pedido y recibir actualizaciones para mantener todo ordenado hasta la entrega.',
      },
    ],
  },
  vendors: {
    label: 'Vendedores',
    icon: <Store />,
    intro: 'Publica inventario y responde oportunidades.',
    title: 'Dale visibilidad a tu tienda',
    description: 'Si vendes repuestos, aquí encuentras respuestas para publicar productos, administrar tu oferta y atender solicitudes con más orden.',
    questions: [
      {
        icon: <Store />,
        question: '¿Cómo publico mi inventario?',
        answer: 'Puedes subir productos de forma manual o preparar cargas más grandes cuando tengas muchos artículos. La idea es que tu catálogo sea fácil de mantener y actualizar.',
      },
      {
        icon: <MessageSquareQuote />,
        question: '¿Puedo responder cotizaciones privadas?',
        answer: 'Sí. Puedes responder con precio, vigencia, disponibilidad y condiciones para que cada consulta quede bien resuelta sin necesidad de publicar todo al mismo tiempo.',
      },
      {
        icon: <Boxes />,
        question: '¿Cómo mantengo mi stock ordenado?',
        answer: 'RepuesTop está pensado para ayudarte a registrar movimientos básicos de tu operación y mantener una vista clara de lo que publicas y lo que tienes disponible.',
      },
      {
        icon: <Users />,
        question: '¿La plataforma me ayuda a llegar a nuevos clientes?',
        answer: 'Ese es justamente uno de los objetivos: conectar tu inventario con personas que ya están buscando una pieza específica para su vehículo.',
      },
    ],
  },
  orders: {
    label: 'Pedidos',
    icon: <Package />,
    intro: 'Sigue compras, estados y entregas.',
    title: 'Todo el camino del pedido, más claro',
    description: 'Ordenamos el seguimiento para que sepas qué pasó, qué falta y qué puedes revisar en cada etapa.',
    questions: [
      {
        icon: <Package />,
        question: '¿Cómo reviso el estado de un pedido?',
        answer: 'Cada pedido podrá mostrar su avance paso a paso para que veas si fue recibido, revisado, preparado o resuelto según el caso.',
      },
      {
        icon: <Truck />,
        question: '¿Cómo funcionan los envíos?',
        answer: 'Las modalidades de despacho dependen de cada tienda, pero el objetivo es que conozcas costos, tiempos y condiciones antes de confirmar.',
      },
      {
        icon: <ClipboardCheck />,
        question: '¿Puedo dejar registrado un problema con mi pedido?',
        answer: 'Sí. Si algo no coincide con lo esperado, puedes usar los canales de ayuda para reportarlo y revisarlo con más contexto.',
      },
      {
        icon: <MessageCircle />,
        question: '¿Recibiré actualizaciones durante el proceso?',
        answer: 'La experiencia busca mantenerte informado con mensajes y estados claros para que no tengas que adivinar en qué va tu solicitud.',
      },
    ],
  },
  payments: {
    label: 'Pagos',
    icon: <CreditCard />,
    intro: 'Pagos claros, ordenados y trazables.',
    title: 'Entiende cómo se gestiona el pago',
    description: 'Aquí te explicamos cómo se manejan los cobros, qué verás antes de confirmar y qué cuidados aplicamos en la experiencia.',
    questions: [
      {
        icon: <CreditCard />,
        question: '¿Qué medios de pago estarán disponibles?',
        answer: 'Estamos trabajando para ofrecer medios de pago habituales y fáciles de entender. La disponibilidad final se mostrará con claridad dentro del servicio.',
      },
      {
        icon: <BadgeCheck />,
        question: '¿Quién procesa el pago?',
        answer: 'La idea es que el proceso sea transparente y que veas con claridad qué parte corresponde a la tienda y qué parte a la plataforma cuando aplique.',
      },
      {
        icon: <LockKeyhole />,
        question: '¿Qué información de pago se guarda?',
        answer: 'Solo la información necesaria para operar la compra o registrar el proceso. Evitamos pedir más datos de los necesarios para mantener la experiencia simple.',
      },
      {
        icon: <ShieldCheck />,
        question: '¿Cómo sé que el cobro es seguro?',
        answer: 'Usamos medidas razonables de protección y buenas prácticas para cuidar la operación. No lo planteamos como un servicio bancario, sino como una experiencia con seguridad y orden.',
      },
    ],
  },
};

function HelpExperience() {
  const [category, setCategory] = useState<HelpTopicKey>('buyers');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const topic = helpTopics[category];
  useEffect(() => setOpenFaq(0), [category]);
  return <div className="help-experience">
    <div className="help-intro-column">
      <div className="help-title-row"><span className="help-title-icon"><Headphones /></span><div><span className="eyebrow">Ayuda</span><h2>Respuestas rápidas.<br />Personas reales.</h2><p>Orientación para compradores y tiendas en cada etapa de la experiencia.</p></div></div>
      <div className="support-showcase"><div className="support-visual"><span className="support-ring ring-one" /><span className="support-ring ring-two" /><Headphones /><MessageCircle /></div><div className="support-copy"><span>Estamos para ayudarte</span><h3>Nuestro equipo está listo para apoyarte</h3><p>Te ayudamos con compatibilidad, envíos, pagos y pedidos. Hablamos contigo.</p><a className="support-primary" href={`mailto:${siteConfig.supportEmail}`}><MessageCircle /> Contactar soporte <ArrowRight /></a><a className="support-secondary" href={`mailto:${siteConfig.supportEmail}`}><Mail /> Escribir a {siteConfig.supportEmail}</a></div></div>
      <div className="support-benefits"><span><Zap /><div><strong>Respuesta rápida</strong><small>Sin bots ni esperas innecesarias.</small></div></span><span><Users /><div><strong>Soporte humano</strong><small>Personas reales que entienden tu caso.</small></div></span><span><ClipboardCheck /><div><strong>Seguimiento</strong><small>Te acompañamos hasta resolverlo.</small></div></span></div>
    </div>
    <div className="help-faq-column">
      <div className="help-topic-header"><span className="eyebrow">{topic.label}</span><h3>{topic.title}</h3><p>{topic.description}</p></div>
      <div className="help-category-tabs">{(Object.entries(helpTopics) as Array<[HelpTopicKey, typeof topic]>).map(([key, item]) => <button type="button" className={category === key ? 'is-active' : ''} key={item.label} onClick={() => setCategory(key)}>{item.icon}<span>{item.label}</span></button>)}</div>
      <div className="visual-faq-list">
        {topic.questions.map((item, index) => {
          const isOpen = openFaq === index;
          const answerId = `faq-answer-${category}-${index}`;
          return (
            <article className={isOpen ? 'is-open' : ''} key={item.question}>
              <button 
                type="button" 
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <span className="faq-icon">{item.icon}</span>
                <strong>{item.question}</strong>
                <ChevronDown />
              </button>
              <div 
                className="visual-faq-answer" 
                id={answerId}
                role="region"
                aria-hidden={!isOpen}
              >
                <p>{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="help-contact-bar"><span className="contact-question">?</span><div><strong>¿No encuentras lo que buscas?</strong><small>Escríbenos y te ayudamos con gusto.</small></div><a href={`mailto:${siteConfig.supportEmail}`}>Ir a contacto <ArrowRight /></a></div>
    </div>
  </div>;
}

function PrivacyExperience() {
  const [openPrivacy, setOpenPrivacy] = useState<number | null>(0);
  const privacyItems = [
    { icon: <UserRound />, title: 'Datos personales', text: 'Información básica asociada a tu cuenta', detail: 'Incluye datos como nombre, correo y teléfono cuando sean necesarios para identificar tu cuenta, contactarte o prestar soporte. Puedes solicitar su actualización cuando corresponda.' },
    { icon: <CarFront />, title: 'Vehículos guardados', text: 'Datos que facilitan tus futuras búsquedas', detail: 'Puedes guardar información de tus vehículos para agilizar búsquedas y mostrar alternativas más relevantes. Esta información puede modificarse o eliminarse desde tu experiencia.' },
    { icon: <CreditCard />, title: 'Información de pagos', text: 'Referencias necesarias para gestionar compras', detail: 'RepuesTop utiliza únicamente la información necesaria para coordinar y registrar operaciones. Los datos sensibles de pago serán gestionados por proveedores especializados cuando el servicio esté habilitado.' },
    { icon: <MapPin />, title: 'Direcciones', text: 'Datos de envío y facturación que decidas guardar', detail: 'Las direcciones permiten calcular o coordinar entregas y emitir documentos cuando corresponda. Solo se comparten con quienes participan en la operación cuando resulta necesario.' },
    { icon: <MessageCircle />, title: 'Preferencias', text: 'Comunicaciones y configuración de tu experiencia', detail: 'Puedes definir cómo deseas recibir novedades, recordatorios o comunicaciones del servicio. Buscamos ofrecer opciones claras para ajustar estas preferencias.' },
  ];
  return <div className="privacy-experience">
    <div className="privacy-intro-column">
      <div className="privacy-title-row"><span className="privacy-title-icon"><LockKeyhole /></span><div><span className="eyebrow">Privacidad</span><h2>Privacidad y control para cada usuario</h2><p>Cuidamos tu información y te explicamos de forma clara para qué se utiliza.</p></div></div>
      <div className="privacy-commitments"><article><h3>Compromisos</h3><span><BadgeCheck /> Uso transparente de la información</span><span><BadgeCheck /> Acceso cuidado a tu cuenta</span><span><BadgeCheck /> Datos utilizados con un propósito claro</span><span><BadgeCheck /> Soporte para consultas de privacidad</span></article><div className="privacy-signals"><span><ShieldCheck /><strong>Buenas prácticas</strong><small>Medidas acordes al servicio</small></span><span><KeyRound /><strong>Acceso protegido</strong><small>Controles para cuidar tu cuenta</small></span><span><Headphones /><strong>Soporte cercano</strong><small>Canal para resolver tus dudas</small></span></div></div>
      <div className="privacy-priority"><ShieldCheck /> Tu confianza es importante. Mejoramos nuestras medidas de seguridad a medida que evoluciona el servicio.</div>
    </div>
    <div className="privacy-control-panel">
      <div className="privacy-settings"><div className="privacy-panel-title"><span><ShieldCheck /></span><div><h3>Mi privacidad</h3><p>Consulta qué información puede formar parte de tu experiencia.</p></div></div><div className="privacy-item-list">{privacyItems.map((item, index) => <article className={openPrivacy === index ? 'is-expanded' : ''} key={item.title}><button type="button" aria-expanded={openPrivacy === index} onClick={() => setOpenPrivacy(openPrivacy === index ? null : index)}><span>{item.icon}</span><div><strong>{item.title}</strong><small>{item.text}</small></div><ChevronDown /></button><div className="privacy-item-detail"><p>{item.detail}</p></div></article>)}</div></div>
      <aside className="privacy-shield-card"><div className="shield-visual"><span className="shield-orbit orbit-one" /><span className="shield-orbit orbit-two" /><ShieldCheck /></div><div className="shield-message"><LockKeyhole /><div><strong>Tu información merece cuidado</strong><p>Aplicamos medidas razonables para limitar accesos indebidos y tratar tus datos de forma responsable.</p></div></div><span className="privacy-status"><BadgeCheck /> Seguridad en mejora continua</span></aside>
    </div>
  </div>;
}

function InfoHub({ mode, setMode }: { mode: InfoMode; setMode: (mode: InfoMode) => void }) {
  const option = infoOptions[mode];
  return <section className={`info-hub hub-${option.tone}`} id="como-funciona"><div className="section">
    <div className="matrix-heading centered"><span className="eyebrow"><MapPin /> Conoce RepuesTop</span><h2>Todo lo importante, a un toque</h2><p>Selecciona una categoría para explorar toda su información.</p></div>
    <div className="info-icon-tabs" role="tablist" aria-label="Información de RepuesTop">
      {(Object.keys(infoOptions) as InfoMode[]).map(key => (
        <button 
          type="button" 
          role="tab" 
          id={`info-tab-${key}`}
          aria-controls={`info-panel-${key}`}
          aria-selected={mode === key} 
          className={`info-icon-tab tab-${infoOptions[key].tone} ${mode === key ? 'is-active' : ''}`} 
          key={key} 
          onClick={() => setMode(key)}
        >
          <span>{infoOptions[key].icon}</span>
          <strong>{infoOptions[key].label}</strong>
          <i />
        </button>
      ))}
    </div>
    <div 
      className="info-detail-panel" 
      role="tabpanel" 
      id={`info-panel-${mode}`}
      aria-labelledby={`info-tab-${mode}`}
      key={mode}
    >
      {mode === 'flow' && <><div className="detail-heading"><span className="detail-icon"><Zap /></span><div><span className="eyebrow">Cómo funciona</span><h2>Dos recorridos que se encuentran</h2><p>Compradores y tiendas avanzan por un proceso claro, desde la necesidad inicial hasta el seguimiento del pedido.</p></div></div><div className="journey-grid"><div className="journey-visual"><img src="/assets/como-funciona.jpg" alt="Cómo funciona RepuesTop" /></div><div className="journey-steps">{[['01', 'Identifica', 'Busca por patente o publica tu inventario.'], ['02', 'Conecta', 'Encuentra alternativas o recibe clientes interesados.'], ['03', 'Decide', 'Compra, cotiza o responde con tus condiciones.'], ['04', 'Avanza', 'Sigue el pedido y mantén todo comunicado.']].map(([number, title, text]) => <article key={number}><b>{number}</b><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></>}
      {mode === 'about' && <><div className="detail-heading"><span className="detail-icon"><HeartHandshake /></span><div><span className="eyebrow">Nosotros</span><h2>Tecnología con propósito automotriz</h2><p>Una solución creada en Chile para ordenar el mercado de repuestos y construir mejores conexiones.</p></div></div><div className="about-grid"><div><img src="/assets/nosotros.jpg" alt="Personas conectando mediante RepuesTop" /></div><div><h3>Más claridad. Más confianza. Mejores conexiones.</h3><p>Acercamos inventario e información para que cada decisión tenga un mejor punto de partida.</p><div className="value-grid"><span><Search /> Claridad</span><span><ShieldCheck /> Confianza</span><span><Users /> Conexión</span><span><Smartphone /> Simplicidad</span></div><div className="chile-strip"><MapPin /><span><strong>Creado en Chile</strong><small>Para el mercado automotriz local</small></span><i>CL</i></div></div></div></>}
      {mode === 'help' && <HelpExperience />}
      {mode === 'privacy' && <PrivacyExperience />}
    </div>
  </div></section>;
}

function FinalStage({ setInfoMode }: { setInfoMode: (mode: InfoMode) => void }) {
  const buyerHighlights = [
    { icon: <Search />, label: 'Búsqueda por patente', text: 'Encuentra repuestos con más contexto' },
    { icon: <BadgeCheck />, label: 'Repuestos compatibles', text: 'Compara antes de comprar' },
    { icon: <ShieldCheck />, label: 'Compra protegida', text: 'Más claridad en cada paso' },
    { icon: <Truck />, label: 'Seguimiento del pedido', text: 'Revisa el avance de tu compra' },
  ];
  const sellerHighlights = [
    { icon: <Package />, label: 'Carga manual o masiva', text: 'Publica a tu ritmo' },
    { icon: <MessageSquareQuote />, label: 'Cotizaciones', text: 'Responde consultas en tiempo real' },
    { icon: <ClipboardCheck />, label: 'Gestión de pedidos', text: 'Controla estados y entregas' },
    { icon: <Boxes />, label: 'Control de ventas', text: 'Monitorea tu operación' },
  ];

  return <section className="final-stage" id="descargar">
    <div className="section final-stage-shell">
      <div className="final-stage-heading">
        <span className="eyebrow"><Smartphone /> La experiencia continúa en tu teléfono</span>
        <h2>¿Listo para usar RepuesTop?</h2>
        <p>Elige cómo quieres usar la plataforma y empieza con el flujo que más te convenga.</p>
      </div>

      <div className="final-stage-grid">
        <article className="final-route-card route-buyer">
          <span className="route-icon"><Search /></span>
          <div>
            <h3>Soy comprador</h3>
            <p>Busca por patente o manual, compara opciones y compra con seguimiento.</p>
          </div>
          <div className="route-mini-grid">
            {buyerHighlights.map(item => <span key={item.label}><i>{item.icon}</i><strong>{item.label}</strong><small>{item.text}</small></span>)}
          </div>
          <div className="route-actions">
            <a className="button button-white" href="#experiencias">Buscar repuestos <ArrowRight /></a>
            <a className="button button-outline route-dark" href={`mailto:${siteConfig.supportEmail}?subject=Avisarme%20del%20lanzamiento`} onClick={() => trackEvent('launch_interest')}>
              <Smartphone /> Avísame del lanzamiento
            </a>
          </div>
        </article>

        <div className="final-device-stage" aria-hidden="true">
          <div className="final-device device-a"><img src="/assets/comprador-como-funciona.png" alt="" /></div>
          <div className="final-device device-b"><img src="/assets/vendedor-como-funciona.png" alt="" /></div>
          <span className="floating-chip chip-search"><Search /> Busca</span>
          <span className="floating-chip chip-cart"><ShoppingCart /> Compra</span>
          <span className="floating-chip chip-store"><Store /> Vende</span>
        </div>

        <article className="final-route-card route-seller">
          <span className="route-icon"><Store /></span>
          <div>
            <h3>Soy vendedor</h3>
            <p>Publica productos, recibe cotizaciones y gestiona tu operación desde un solo lugar.</p>
          </div>
          <div className="route-mini-grid">
            {sellerHighlights.map(item => <span key={item.label}><i>{item.icon}</i><strong>{item.label}</strong><small>{item.text}</small></span>)}
          </div>
          <div className="route-actions">
            <a className="button button-white" href="#como-funciona">Quiero vender en RepuesTop <ArrowRight /></a>
            <a className="button button-outline route-dark" href={`mailto:${siteConfig.supportEmail}`}>Hablar con el equipo <MessageCircle /></a>
          </div>
        </article>
      </div>

      <div className="final-benefits">
        <span><ShieldCheck /><div><strong>Tiendas verificadas</strong><small>Solo tiendas reales y validadas.</small></div></span>
        <span><PackageCheck /><div><strong>Compatibilidad clara</strong><small>Encuentra lo que realmente sirve.</small></div></span>
        <span><Headphones /><div><strong>Soporte y mediación</strong><small>Te acompañamos antes, durante y después.</small></div></span>
        <span><LockKeyhole /><div><strong>Pagos y pedidos protegidos</strong><small>Más orden en cada compra.</small></div></span>
      </div>

      <footer className="final-footer">
        <div className="final-footer-grid">
          <div className="footer-column footer-brand-block">
            <Brand />
            <p>Marketplace chileno para conectar compradores con tiendas de repuestos automotrices.</p>
            <div className="store-badges">
              <PlatformPill platform="android" />
              <PlatformPill platform="ios" soon />
            </div>
          </div>
          <div className="footer-column">
            <strong>Plataforma</strong>
            <a href="#inicio">Inicio</a>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#experiencias">Compradores</a>
            <a href="#experiencias">Vendedores</a>
            <a href="#como-funciona" onClick={() => setInfoMode('help')}>Ayuda</a>
          </div>
          <div className="footer-column">
            <strong>Confianza</strong>
            <a href="#como-funciona" onClick={() => setInfoMode('help')}>Tiendas verificadas</a>
            <a href="#como-funciona" onClick={() => setInfoMode('help')}>Soporte y mediación</a>
            <a href="#como-funciona" onClick={() => setInfoMode('privacy')}>Privacidad</a>
            <a href="#como-funciona" onClick={() => setInfoMode('privacy')}>Términos y condiciones</a>
          </div>
          <div className="footer-column footer-contact-column">
            <strong>Contacto</strong>
            <a href={`mailto:${siteConfig.supportEmail}`}><Mail /> {siteConfig.supportEmail}</a>
            <a className="footer-cta" href={`mailto:${siteConfig.supportEmail}?subject=Quiero%20vender%20en%20RepuesTop`}>Quiero vender en RepuesTop <ArrowRight /></a>
          </div>
        </div>
        <div className="footer-bottom-row">
          <span>© 2026 RepuesTop. Hecho para el mercado automotriz chileno.</span>
          <div className="footer-socials">
            <a href="https://facebook.com/repuestop.cl" className="social-facebook" target="_blank" rel="noopener noreferrer" aria-label="Facebook de RepuesTop"><FacebookIcon /></a>
            <a href={siteConfig.instagramUrl} className="social-instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram de RepuesTop"><InstagramIcon /></a>
            <a href="https://tiktok.com/@repuestop.cl" className="social-tiktok" target="_blank" rel="noopener noreferrer" aria-label="TikTok de RepuesTop"><TiktokIcon /></a>
          </div>
        </div>
      </footer>
    </div>
  </section>;
}

function HomePage() {
  usePageMeta();
  const [infoMode, setInfoMode] = useState<InfoMode>('flow');

  return <main className="single-page">
    <section className="home-hero section" id="inicio"><div className="hero-orb orb-one" /><div className="hero-orb orb-two" /><div className="hero-copy"><Brand /><span className="eyebrow"><MapPin /> El punto de encuentro para los repuestos</span><h1>El repuesto que buscas. La conexión que <em>necesitas.</em></h1><p>RepuesTop conecta personas y tiendas en una experiencia ágil, confiable y creada para una nueva forma de moverse.</p><div className="button-row"><a href="#experiencias" className="button"><Zap /> Descubrir RepuesTop</a><a href="#como-funciona" className="button button-outline">Ver cómo funciona <ArrowDown /></a></div><div className="hero-platforms"><PlatformPill platform="android" /><PlatformPill platform="ios" soon /></div></div><div className="hero-visual"><div className="hero-badge"><span><strong>Compra y vende</strong> en un solo lugar</span></div><div className="image-panel"><img src="/assets/compradores.jpg" alt="Aplicación RepuesTop buscando repuestos por patente en Chile" /></div></div></section>

    <ExperienceTabs />

    <InfoHub mode={infoMode} setMode={setInfoMode} />

    <FinalStage setInfoMode={setInfoMode} />
  </main>;
}

export default function App() {
  return <HomePage />;
}

