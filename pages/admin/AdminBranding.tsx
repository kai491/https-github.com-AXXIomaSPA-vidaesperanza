
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, RefreshCw, Palette, Type, Image, Upload, LayoutTemplate, Share2, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { BrandingConfig, FooterConfig, SocialConfig } from '../../types';

interface AdminBrandingProps {
  onBack: () => void;
}

export const AdminBranding: React.FC<AdminBrandingProps> = ({ onBack }) => {
  const { branding, updateBranding, footerContent, updateFooterContent, socialContent, updateSocialContent } = useContent();
  const [formData, setFormData] = useState<BrandingConfig>(branding);
  const [footerData, setFooterData] = useState<FooterConfig>(footerContent);
  const [socialData, setSocialData] = useState<SocialConfig>(socialContent);
  const [saved, setSaved] = useState(false);

  // Sync state if context changes externally
  useEffect(() => {
    setFormData(branding);
    setFooterData(footerContent);
    setSocialData(socialContent);
  }, [branding, footerContent, socialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBranding(formData);
    await updateFooterContent(footerData);
    await updateSocialContent(socialData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (file.size > 2 * 1024 * 1024) {
            alert("Imagen demasiado grande (máx 2MB).");
            return reject("File too large");
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
          const base64 = await processFile(file);
          setFormData(prev => ({ ...prev, logoUrl: base64 }));
      } catch (err) {
          console.error(err);
      }
    }
  };

  const handleGoreLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
          const base64 = await processFile(file);
          setFooterData(prev => ({ ...prev, goreLogo: base64 }));
      } catch (err) {
          console.error(err);
      }
    }
  };

  const handleCoreLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
          const base64 = await processFile(file);
          setFooterData(prev => ({ ...prev, coreLogo: base64 }));
      } catch (err) {
          console.error(err);
      }
    }
  };

  const fonts = ['Inter', 'Roboto', 'Lato', 'Poppins', 'Arial'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Identidad Visual (Branding)</h1>
              <p className="text-gray-500 text-sm">Personaliza logos, colores, redes sociales y pie de página.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
            
            {/* Main Config */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Logo Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Image className="text-brand-600" size={20} /> Logo Principal
                    </h2>
                    <div className="flex items-start gap-6">
                         <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0 relative group">
                            {formData.logoUrl ? (
                                <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-xs text-gray-400">Sin imagen</span>
                            )}
                         </div>
                         <div className="flex-1 space-y-3">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subir Imagen</label>
                                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 bg-white text-sm font-medium text-gray-700 w-fit">
                                    <Upload size={16} />
                                    Seleccionar Archivo (PC)
                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                </label>
                             </div>
                             
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">O usar URL</label>
                                <input 
                                    type="text" 
                                    value={formData.logoUrl}
                                    onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                />
                             </div>
                         </div>
                    </div>
                </div>

                {/* Social Media & Topbar Section (NEW) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Share2 className="text-brand-600" size={20} /> Redes Sociales & Top Header
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2">
                            <input 
                                type="checkbox" 
                                id="showSocial"
                                checked={socialData.isVisible}
                                onChange={e => setSocialData({...socialData, isVisible: e.target.checked})}
                                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor="showSocial" className="text-sm font-bold text-gray-700 select-none cursor-pointer">
                                Mostrar Barra Superior (Top Header)
                            </label>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Texto de la Barra</label>
                            <input 
                                type="text" 
                                value={socialData.topbarText}
                                onChange={e => setSocialData({...socialData, topbarText: e.target.value})}
                                placeholder="Ej: Síguenos en nuestras redes oficiales"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                            />
                        </div>

                        <div className="grid gap-3">
                            <div className="relative">
                                <Facebook size={16} className="absolute left-3 top-2.5 text-blue-600" />
                                <input 
                                    type="text" 
                                    value={socialData.facebookUrl}
                                    onChange={e => setSocialData({...socialData, facebookUrl: e.target.value})}
                                    placeholder="Facebook URL (https://facebook.com/...)"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Instagram size={16} className="absolute left-3 top-2.5 text-pink-600" />
                                <input 
                                    type="text" 
                                    value={socialData.instagramUrl}
                                    onChange={e => setSocialData({...socialData, instagramUrl: e.target.value})}
                                    placeholder="Instagram URL (https://instagram.com/...)"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Linkedin size={16} className="absolute left-3 top-2.5 text-blue-700" />
                                <input 
                                    type="text" 
                                    value={socialData.linkedinUrl}
                                    onChange={e => setSocialData({...socialData, linkedinUrl: e.target.value})}
                                    placeholder="LinkedIn URL (https://linkedin.com/...)"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <LayoutTemplate className="text-brand-600" size={20} /> Pie de Página (Financiamiento)
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Leyenda de Financiamiento</label>
                            <input 
                                type="text" 
                                value={footerData.legendText}
                                onChange={e => setFooterData({...footerData, legendText: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* GORE LOGO */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Logo Gobierno Regional</label>
                                <div className="h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center relative group overflow-hidden mb-2">
                                    {footerData.goreLogo ? (
                                        <img src={footerData.goreLogo} className="h-full w-auto object-contain p-2" />
                                    ) : <span className="text-xs text-gray-400">Vacio</span>}
                                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white text-xs font-bold">
                                        <Upload size={20} className="mb-1"/> Cambiar
                                        <input type="file" className="hidden" accept="image/*" onChange={handleGoreLogoUpload} />
                                    </label>
                                </div>
                            </div>

                            {/* CORE LOGO */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Logo Consejo Regional (CORE)</label>
                                <div className="h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center relative group overflow-hidden mb-2">
                                    {footerData.coreLogo ? (
                                        <img src={footerData.coreLogo} className="h-full w-auto object-contain p-2" />
                                    ) : <span className="text-xs text-gray-400">Vacio</span>}
                                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white text-xs font-bold">
                                        <Upload size={20} className="mb-1"/> Cambiar
                                        <input type="file" className="hidden" accept="image/*" onChange={handleCoreLogoUpload} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colors Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Palette className="text-brand-600" size={20} /> Paleta de Colores
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Primary Color */}
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Color Primario (Marca)</label>
                             <div className="flex items-center gap-3">
                                 <input 
                                    type="color" 
                                    value={formData.primaryColor}
                                    onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                                    className="w-12 h-12 rounded cursor-pointer border-0 p-0 shadow-sm"
                                 />
                                 <input 
                                    type="text" 
                                    value={formData.primaryColor}
                                    onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm font-mono uppercase"
                                 />
                             </div>
                        </div>
                         {/* Secondary Color */}
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Color Secundario (Acento)</label>
                             <div className="flex items-center gap-3">
                                 <input 
                                    type="color" 
                                    value={formData.secondaryColor || '#3b82f6'}
                                    onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                                    className="w-12 h-12 rounded cursor-pointer border-0 p-0 shadow-sm"
                                 />
                                 <input 
                                    type="text" 
                                    value={formData.secondaryColor || '#3b82f6'}
                                    onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none text-sm font-mono uppercase"
                                 />
                             </div>
                        </div>
                    </div>
                </div>

                 {/* Typography Section */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Type className="text-brand-600" size={20} /> Tipografía
                    </h2>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fuente Principal</label>
                        <select 
                            value={formData.fontFamily}
                            onChange={e => setFormData({...formData, fontFamily: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                        >
                            {fonts.map(font => (
                                <option key={font} value={font} style={{fontFamily: font}}>{font}</option>
                            ))}
                        </select>
                    </div>
                </div>

            </div>

            {/* Sticky Actions */}
            <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-lg border border-brand-100 p-6 sticky top-6">
                    <h3 className="font-bold text-gray-800 mb-2">Aplicar Cambios</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Guardar actualizará el logo principal, el pie de página, las redes sociales y los colores en todo el sitio.
                    </p>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 font-bold shadow-md flex items-center justify-center gap-2 transition"
                    >
                        {saved ? '¡Guardado!' : <><Save size={18} /> Guardar Todo</>}
                    </button>

                    <button 
                        type="button"
                        onClick={() => { setFormData(branding); setFooterData(footerContent); setSocialData(socialContent); }}
                        className="w-full mt-3 bg-white text-gray-600 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={14} /> Restaurar
                    </button>
                </div>
            </div>

        </form>

      </div>
    </div>
  );
};
