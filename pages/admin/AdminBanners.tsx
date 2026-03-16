
import React, { useState } from 'react';
import { ArrowLeft, Save, Image as ImageIcon, RefreshCw, Layout } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { PageBanner } from '../../types';

interface AdminBannersProps {
  onBack: () => void;
}

export const AdminBanners: React.FC<AdminBannersProps> = ({ onBack }) => {
  const { pageBanners, updatePageBanner } = useContent();
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PageBanner | null>(null);
  const [saved, setSaved] = useState(false);

  const startEdit = (banner: PageBanner) => {
    setEditingPageId(banner.pageId);
    setFormData({ ...banner });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData && editingPageId) {
      await updatePageBanner(editingPageId, formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setEditingPageId(null);
    }
  };

  const getPageLabel = (id: string) => {
      switch(id) {
          case 'about': return 'Quiénes Somos';
          case 'volunteer': return 'Ser Voluntaria';
          case 'donate': return 'Cómo Ayudar';
          case 'blog': return 'Noticias (Blog)';
          default: return id;
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Diseño de Encabezados (Banners)</h1>
              <p className="text-gray-500 text-sm">Personaliza la imagen, título y subtítulo de cada página secundaria.</p>
            </div>
        </div>

        <div className="grid gap-6">
            {pageBanners.map((banner) => (
                <div key={banner.pageId} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    {editingPageId === banner.pageId ? (
                        <form onSubmit={handleSave} className="p-8">
                             <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Layout size={20} className="text-emerald-600"/> Editando: {getPageLabel(banner.pageId)}
                                </h2>
                                <button type="button" onClick={() => setEditingPageId(null)} className="text-gray-400 hover:text-gray-600 font-bold text-sm uppercase">Cancelar</button>
                             </div>

                             <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Título del Banner</label>
                                        <input 
                                            type="text" required value={formData?.title || ''}
                                            onChange={e => setFormData(prev => prev ? {...prev, title: e.target.value} : null)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Subtítulo (Descripción Corta)</label>
                                        <textarea 
                                            rows={3} required value={formData?.subtitle || ''}
                                            onChange={e => setFormData(prev => prev ? {...prev, subtitle: e.target.value} : null)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Imagen de Fondo (URL)</label>
                                        <input 
                                            type="text" required value={formData?.imageUrl || ''}
                                            onChange={e => setFormData(prev => prev ? {...prev, imageUrl: e.target.value} : null)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-mono text-xs"
                                        />
                                    </div>
                                    <div className="h-24 w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
                                        {formData?.imageUrl ? (
                                            <img src={formData.imageUrl} className="w-full h-full object-cover opacity-50" />
                                        ) : (
                                            <ImageIcon size={32} className="text-gray-300"/>
                                        )}
                                    </div>
                                </div>
                             </div>

                             <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                                {saved && <span className="text-emerald-600 font-bold text-sm animate-pulse mr-4 py-2">¡Cambios registrados!</span>}
                                <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition">
                                    Guardar Cambios
                                </button>
                             </div>
                        </form>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="w-full md:w-64 h-40 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                                <img src={banner.imageUrl} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-emerald-900/40"></div>
                                <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-emerald-900">{banner.pageId}</span>
                            </div>
                            <div className="p-6 flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{banner.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2">{banner.subtitle}</p>
                            </div>
                            <div className="p-6 border-t md:border-t-0 md:border-l border-gray-100">
                                <button 
                                    onClick={() => startEdit(banner)}
                                    className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-emerald-100 transition whitespace-nowrap"
                                >
                                    Personalizar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};
