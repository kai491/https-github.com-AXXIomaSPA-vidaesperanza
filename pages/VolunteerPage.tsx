
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, FileText, Heart, Sparkles, Send } from 'lucide-react';
import { useVolunteer } from '../context/VolunteerContext';
import { useContent } from '../context/ContentContext';
import { StandardHero } from '../components/StandardHero';

export const VolunteerPage: React.FC = () => {
  const { addVolunteer } = useVolunteer();
  const { pageBanners } = useContent();
  const banner = pageBanners.find(b => b.pageId === 'volunteer');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  
  // Estado inicial con llaves exactas para evitar errores de referencia
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    availability: '',
    motivation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
        await addVolunteer({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            availability: formData.availability,
            motivation: formData.motivation,
            status: 'Pendiente' as any 
        });
        
        setFormStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error("Error al enviar postulación:", error);
        alert("Hubo un problema al enviar tu ficha. Por favor intenta nuevamente.");
        setFormStatus('idle');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  if (formStatus === 'success') {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-4 py-20">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg text-center border border-emerald-100 animate-fadeIn">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-emerald-600" size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">¡Postulación Enviada!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            Gracias <strong>{formData.fullName}</strong>. Tus datos han sido registrados en nuestro sistema de coordinación. 
            Te contactaremos pronto al número <strong>{formData.phone}</strong> para una entrevista personal en el Hospital de La Serena.
          </p>
          <button 
            onClick={() => window.location.hash = 'home'}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Standardized Hero */}
      <StandardHero 
        title={banner?.title || 'Quiero Ser Voluntaria'} 
        subtitle={banner?.subtitle || 'Únete a nuestro equipo.'} 
        imageUrl={banner?.imageUrl}
      />

      {/* Contenedor Principal */}
      <div className="container mx-auto px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Columna de Información */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center">
                <AlertCircle size={24} className="mr-3 text-emerald-600" />
                Requisitos para Postular
              </h3>
              <ul className="space-y-4">
                {[
                    'Ser mayor de 18 años.',
                    'Disponibilidad mínima de 4 horas semanales.',
                    'Compromiso ético y respeto por la privacidad.',
                    'Deseo genuino de acompañar.',
                    'Aprobar el proceso de inducción institucional.'
                ].map((req, i) => (
                    <li key={i} className="flex items-start text-gray-700">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <span className="text-emerald-600 font-bold text-xs">{i+1}</span>
                        </div>
                        <span className="leading-tight">{req}</span>
                    </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-600 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4">El Camino de la Voluntaria</h3>
                    <div className="space-y-4 text-emerald-50 text-sm">
                        <div className="flex gap-3">
                            <div className="w-1 bg-emerald-400 rounded-full"></div>
                            <p><strong>Paso 1:</strong> Envías esta ficha de pre-inscripción.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-1 bg-emerald-400 rounded-full"></div>
                            <p><strong>Paso 2:</strong> Coordinación te llama para una entrevista.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-1 bg-emerald-400 rounded-full"></div>
                            <p><strong>Paso 3:</strong> Realizas la inducción técnica en el hospital.</p>
                        </div>
                    </div>
                </div>
                <Heart className="absolute -bottom-10 -right-10 text-emerald-500/20 group-hover:scale-110 transition-transform" size={150} />
            </div>
          </div>

          {/* Columna del Formulario */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 border-t-8 border-t-emerald-600 animate-fadeIn">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-emerald-50 rounded-2xl">
                        <FileText className="text-emerald-600" size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900">Ficha de Inscripción</h2>
                        <p className="text-gray-500 text-sm">Completa tus datos para iniciar el proceso.</p>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Nombre y Apellido</label>
                    <input 
                      required 
                      type="text" 
                      id="fullName" 
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-gray-800" 
                      placeholder="Ej: María Ignacia Pérez" 
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Teléfono / WhatsApp</label>
                      <input 
                        required 
                        type="tel" 
                        id="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-gray-800" 
                        placeholder="+56 9 1234 5678" 
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Correo Electrónico</label>
                      <input 
                        required 
                        type="email" 
                        id="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-gray-800" 
                        placeholder="ejemplo@correo.com" 
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="availability" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Disponibilidad de Tiempo</label>
                    <select 
                      id="availability" 
                      required
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-gray-800 appearance-none bg-no-repeat"
                      style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.5em'}}
                    >
                      <option value="">Selecciona tu preferencia</option>
                      <option value="Mañanas">Mañanas (09:00 - 13:00)</option>
                      <option value="Tardes">Tardes (14:00 - 18:00)</option>
                      <option value="Fines de Semana">Fines de Semana</option>
                      <option value="Flexible">Horario Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="motivation" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">¿Qué te motiva a ser voluntaria?</label>
                    <textarea 
                      required 
                      id="motivation" 
                      rows={5} 
                      value={formData.motivation}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-gray-800 resize-none" 
                      placeholder="Cuéntanos un poco sobre tu vocación de servicio..."
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={formStatus === 'submitting'}
                      className="w-full bg-emerald-600 text-white font-extrabold py-5 rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-xl shadow-emerald-100 group"
                    >
                      {formStatus === 'submitting' ? (
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      ) : (
                        <Send className="mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={22} />
                      )}
                      Enviar mi Postulación
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
