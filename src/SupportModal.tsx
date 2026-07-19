import { useState } from 'react';
import { REGIONS, COMUNAS_BY_REGION } from './chileData';
import { X } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    comuna: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, region: e.target.value, comuna: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        reporterName: formData.name,
        correoContacto: formData.email,
        telefonoContacto: formData.phone,
        regionContacto: formData.region,
        comunaContacto: formData.comuna,
        reason: 'Solicitud de contacto web',
        lastMessage: formData.message,
        category: 'CONSULTA',
        priority: 'MEDIA',
        reporterType: 'COMPRADOR',
        platform: 'SITIO_WEB',
        origen: 'SITIO_WEB',
        contexto: 'Formulario de contacto del sitio web'
      };

      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api/v1';
      const response = await fetch(`${apiUrl}/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al enviar la solicitud');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar');
    } finally {
      setSubmitting(false);
    }
  };

  const comunas = formData.region ? COMUNAS_BY_REGION[formData.region] || [] : [];

  return (
    <div className="support-modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="support-modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: '#fff', borderRadius: '12px', padding: '24px',
        width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
        position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <X size={24} color="#666" />
        </button>
        <h2 style={{ marginBottom: '16px', fontSize: '1.5rem', fontWeight: 600, color: '#0b1f3b' }}>Contactar a Soporte</h2>
        
        {success ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <h3 style={{ color: '#00875A', marginBottom: '16px', fontSize: '1.25rem' }}>¡Solicitud enviada!</h3>
            <p style={{ color: '#555', marginBottom: '24px' }}>Hemos recibido tu consulta y te responderemos al correo proporcionado a la brevedad.</p>
            <button className="button" style={{ display: 'inline-flex' }} onClick={onClose}>Cerrar ventana</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && <div style={{ color: '#DE350B', padding: '12px', backgroundColor: '#FFEBE6', borderRadius: '6px', fontSize: '0.875rem' }}>{error}</div>}
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '0.875rem' }}>Nombre completo *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '0.875rem' }}>Correo electrónico *</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '0.875rem' }}>Teléfono *</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fff' }}>
                <div style={{ padding: '10px 12px', backgroundColor: '#f5f5f5', borderRight: '1px solid #ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span role="img" aria-label="Chile" style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇨🇱</span>
                  <span style={{ color: '#333', fontWeight: 500 }}>+56</span>
                </div>
                <input 
                  required 
                  type="tel" 
                  placeholder="9 1234 5678"
                  maxLength={9}
                  minLength={9}
                  value={formData.phone} 
                  onChange={e => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 0 && val[0] !== '9') {
                      val = '9' + val;
                    }
                    setFormData({...formData, phone: val.slice(0, 9)});
                  }} 
                  style={{ flex: 1, padding: '10px 12px', border: 'none', outline: 'none', fontSize: '1rem', width: '100%' }} 
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '0.875rem' }}>Región *</label>
                <select required value={formData.region} onChange={handleRegionChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: '#fff' }}>
                  <option value="">Selecciona una región</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '0.875rem' }}>Comuna *</label>
                <select required value={formData.comuna} onChange={e => setFormData({...formData, comuna: e.target.value})} disabled={!formData.region} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: formData.region ? '#fff' : '#f5f5f5' }}>
                  <option value="">Selecciona una comuna</option>
                  {comunas.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '0.875rem' }}>Mensaje *</label>
              <textarea required maxLength={500} rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical', fontSize: '1rem', fontFamily: 'inherit' }} />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: formData.message.length >= 500 ? '#DE350B' : '#666', marginTop: '4px' }}>
                {formData.message.length}/500 caracteres
              </div>
            </div>
            
            <button type="submit" disabled={submitting} className="button" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}>
              {submitting ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
