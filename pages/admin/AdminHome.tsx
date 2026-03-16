
import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2, MoveUp, MoveDown, Video, Image as ImageIcon, Link, Edit2, Upload, X } from 'lucide-react';
import { useContent, HomeContent } from '../../context/ContentContext';
import { HeroSlide, HeroButton } from '../../types';

interface AdminHomeProps {
  onBack: () => void;
}

export const AdminHome: React.FC<AdminHomeProps> = ({ onBack }) => {
  const { homeContent, updateHomeContent, heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide } = useContent();
  const [introFormData, setIntroFormData] = useState<HomeContent>(homeContent);
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);

  // Initial state for a new slide
  const defaultSlideData: Omit<HeroSlide, 'id'> = {
    mediaType: 'image',
    mediaUrl: '',
    title: '',
    subtitle: '',
    buttons: [
        { label: 'Botón Principal', link: '', style: 'primary' },
        { label: '', link: '', style: 'outline' }
    ],
    isActive: true,
    order: 0
  };

  const [slideFormData, setSlideFormData] = useState(defaultSlideData);

  // --- File Processing Logic (Same as Blog) ---
  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Límite de 10MB para slides (mayor que blog porque puede ser video corto)
        if (file.size > 10 * 1024 * 1024) {
            alert("El archivo es demasiado pesado (máx 10MB). Para videos largos, usa una URL externa.");
            return reject("File too large");
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        try {
            const data = await processFile(e.target.files[0]);
            setSlideFormData(prev => ({ ...prev, mediaUrl: data }));
        } catch (err) {
            console.error("Error uploading file", err);
        }
    }
  };

  // --- Intro Section Logic ---
  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setIntroFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIntroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeContent(introFormData);
    alert('Cambios guardados en sección introducción');
  };

  // --- Slide Logic ---
  const handleEditSlide = (slide: HeroSlide) => {
    // Aseguramos que siempre haya estructura para 2 botones
    const safeButtons = [...(slide.buttons || [])];
    if (!safeButtons[0]) safeButtons[0] = { label: '', link: '', style: 'primary' };
    if (!safeButtons[1]) safeButtons[1] = { label: '', link: '', style: 'outline' };

    setSlideFormData({ ...slide, buttons: safeButtons });
    setEditingSlideId(slide.id);
    setShowSlideForm(true);
  };

  const handleDeleteSlide = (id: number) => {
    if(window.confirm('¿Borrar este slide?')) {
        deleteHeroSlide(id);
    }
  };

  const handleCreateSlide = () => {
    setSlideFormData({ 
        ...defaultSlideData, 
        order: heroSlides.length + 1 
    });
    setEditingSlideId(null);
    setShowSlideForm(true);
  };

  const handleSlideFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlideId) {
      updateHeroSlide(editingSlideId, slideFormData);
    } else {
      addHeroSlide(slideFormData);
    }
    setShowSlideForm(false);
  };

  const handleButtonChange = (index: number, field: keyof HeroButton, value: string) => {
    const newButtons = [...slideFormData.buttons];
    if (!newButtons[index]) {
        newButtons[index] = { label: '', link: '', style: index === 0 ? 'primary' : 'outline' };
    }
    newButtons[index] = { ...newButtons[index], [field]: value };
    setSlideFormData({ ...slideFormData, buttons: newButtons });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4 mb-6">
            <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Editar Página de Inicio</h1>
              <p className="text-gray-500 text-sm">Gestiona el Carrusel Principal y la Introducción.</p>
            </div>
        </div>

        {/* --- Hero Slider Management --- */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-emerald-700 px-6 py-4 flex justify-between items-center text-white">
                <h2 className="font-bold text-lg">Carrusel Principal (Hero Slider)</h2>
                <button 
                    onClick={handleCreateSlide}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                >
                    <Plus size={16} /> Agregar Slide
                </button>
            </div>

            <div className="p-6">
                {!showSlideForm ? (
                    <div className="grid gap-4">
                        {heroSlides.length === 0 && <p className="text-gray-500 text-center py-4">No hay slides activos. Agrega uno.</p>}
                        {heroSlides.map((slide, index) => (
                            <div key={slide.id} className="flex flex-col md:flex-row items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition bg-gray-50">
                                <div className="w-full md:w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0 relative">
                                    {slide.mediaType === 'video' ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                                            <Video size={24} />
                                        </div>
                                    ) : (
                                        <img src={slide.mediaUrl} alt="slide preview" className="w-full h-full object-cover" />
                                    )}
                                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">{slide.mediaType}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">{slide.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">{slide.subtitle}</p>
                                    <div className="flex gap-2 mt-2">
                                        {slide.buttons && slide.buttons.filter(b => b.label).map((b, i) => (
                                            <span key={i} className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600 border border-gray-300">
                                                {b.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditSlide(slide)} className="p-2 text-gray-500 hover:text-emerald-600 bg-white border border-gray-200 rounded hover:bg-emerald-50">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 text-gray-500 hover:text-red-600 bg-white border border-gray-200 rounded hover:bg-red-50">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleSlideFormSubmit} className="space-y-6 bg-gray-50 p-6 rounded-lg border border-emerald-100">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <h3 className="font-bold text-gray-800">{editingSlideId ? 'Editar Slide' : 'Nuevo Slide'}</h3>
                            <button type="button" onClick={() => setShowSlideForm(false)} className="text-gray-400 hover:text-gray-600">Cancelar</button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Media Config */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tipo de Recurso</label>
                                    <div className="flex gap-4">
                                        <label className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border transition-all ${slideFormData.mediaType === 'image' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-300'}`}>
                                            <input 
                                                type="radio" name="mediaType" value="image" className="hidden"
                                                checked={slideFormData.mediaType === 'image'}
                                                onChange={() => setSlideFormData({...slideFormData, mediaType: 'image'})}
                                            />
                                            <ImageIcon size={18}/> Imagen
                                        </label>
                                        <label className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border transition-all ${slideFormData.mediaType === 'video' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-300'}`}>
                                            <input 
                                                type="radio" name="mediaType" value="video" className="hidden"
                                                checked={slideFormData.mediaType === 'video'}
                                                onChange={() => setSlideFormData({...slideFormData, mediaType: 'video'})}
                                            />
                                            <Video size={18}/> Video (MP4)
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Archivo o Enlace</label>
                                    
                                    {/* Preview Area */}
                                    <div className="h-40 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center border border-gray-300 relative group mb-3">
                                        {slideFormData.mediaUrl ? (
                                            slideFormData.mediaType === 'video' ? (
                                                <video src={slideFormData.mediaUrl} className="w-full h-full object-cover" muted autoPlay loop />
                                            ) : (
                                                <img src={slideFormData.mediaUrl} className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <div className="text-gray-400 flex flex-col items-center">
                                                {slideFormData.mediaType === 'video' ? <Video size={32} /> : <ImageIcon size={32} />}
                                                <span className="text-xs mt-2">Sin contenido</span>
                                            </div>
                                        )}
                                        {slideFormData.mediaUrl && (
                                            <button 
                                                type="button" 
                                                onClick={() => setSlideFormData({...slideFormData, mediaUrl: ''})}
                                                className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-500 transition shadow-sm"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Upload Controls */}
                                    <div className="flex gap-2">
                                        <label className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer hover:border-emerald-500 hover:text-emerald-600 transition shadow-sm">
                                            <Upload size={16}/>
                                            <span className="text-xs font-bold uppercase">Subir desde PC</span>
                                            <input type="file" className="hidden" accept={slideFormData.mediaType === 'video' ? "video/mp4" : "image/*"} onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                    
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-400 font-mono text-xs">URL</span>
                                        <input 
                                            type="text" 
                                            placeholder="o pega un enlace https://..." 
                                            value={slideFormData.mediaUrl}
                                            onChange={e => setSlideFormData({...slideFormData, mediaUrl: e.target.value})}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-xs text-gray-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Text Config */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título Principal</label>
                                    <input 
                                        type="text" required value={slideFormData.title}
                                        onChange={e => setSlideFormData({...slideFormData, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtítulo</label>
                                    <textarea 
                                        rows={2} required value={slideFormData.subtitle}
                                        onChange={e => setSlideFormData({...slideFormData, subtitle: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Buttons Config */}
                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-bold text-gray-700 text-sm mb-3">Configuración de Botones</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Button 1 */}
                                <div className="bg-white p-3 rounded border border-gray-200">
                                    <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">Botón 1 (Principal)</span>
                                    <div className="space-y-2">
                                        <input 
                                            type="text" placeholder="Texto (ej: Donar)" value={slideFormData.buttons[0]?.label || ''}
                                            onChange={e => handleButtonChange(0, 'label', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                        <div className="flex items-center gap-1">
                                            <Link size={14} className="text-gray-400"/>
                                            <input 
                                                type="text" placeholder="Link (ej: donate)" value={slideFormData.buttons[0]?.link || ''}
                                                onChange={e => handleButtonChange(0, 'link', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Button 2 */}
                                <div className="bg-white p-3 rounded border border-gray-200">
                                    <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Botón 2 (Secundario - Opcional)</span>
                                    <div className="space-y-2">
                                        <input 
                                            type="text" placeholder="Texto (ej: Ver más)" value={slideFormData.buttons[1]?.label || ''}
                                            onChange={e => handleButtonChange(1, 'label', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                        <div className="flex items-center gap-1">
                                            <Link size={14} className="text-gray-400"/>
                                            <input 
                                                type="text" placeholder="Link (ej: about)" value={slideFormData.buttons[1]?.link || ''}
                                                onChange={e => handleButtonChange(1, 'link', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setShowSlideForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold shadow">
                                {editingSlideId ? 'Actualizar Slide' : 'Crear Slide'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>

        {/* --- Intro Section --- */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">Sección Introductoria (Texto inferior)</h2>
            </div>
            <form onSubmit={handleIntroSubmit} className="p-6 space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título de Sección</label>
                <input 
                    type="text" 
                    name="introTitle" 
                    value={introFormData.introTitle} 
                    onChange={handleIntroChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto de Introducción</label>
                <textarea 
                    name="introText" 
                    value={introFormData.introText} 
                    onChange={handleIntroChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-bold shadow-sm">
                        Guardar Intro
                    </button>
                </div>
            </form>
        </section>

      </div>
    </div>
  );
};
