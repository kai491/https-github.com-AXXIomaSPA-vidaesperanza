import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Eye, Link as LinkIcon, FileText } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { CustomPage } from '../../types';

interface AdminCustomPagesProps {
  onBack: () => void;
  onNavigateToPage: (slug: string) => void;
}

export const AdminCustomPages: React.FC<AdminCustomPagesProps> = ({ onBack, onNavigateToPage }) => {
  const { customPages, addCustomPage, updateCustomPage, deleteCustomPage } = useContent();
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<CustomPage, 'id' | 'lastModified'>>({
    title: '',
    slug: '',
    content: '',
    isVisible: true
  });

  // Helper to auto-generate slug from title
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Only auto-update slug if creating new page
    if (!isEditing) {
        setFormData({ ...formData, title, slug: generateSlug(title) });
    } else {
        setFormData({ ...formData, title });
    }
  };

  const handleEdit = (page: CustomPage) => {
    setIsEditing(page.id);
    setFormData({ title: page.title, slug: page.slug, content: page.content, isVisible: page.isVisible });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ title: '', slug: '', content: '', isVisible: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateCustomPage(isEditing, formData);
    } else {
      addCustomPage(formData);
    }
    handleCancel();
  };

  const handleDelete = (id: number) => {
      if(window.confirm('¿Eliminar esta página permanentemente?')) {
          deleteCustomPage(id);
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition text-gray-600">
                <ArrowLeft size={20} />
                </button>
                <div>
                <h1 className="text-2xl font-bold text-gray-800">Páginas Dinámicas</h1>
                <p className="text-gray-500 text-sm">Crea páginas informativas (ej: Protocolos, Transparencia) sin programar.</p>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Page List */}
            <div className="lg:col-span-1 space-y-4">
                <button 
                    onClick={handleCancel}
                    className="w-full py-3 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-600 font-bold hover:bg-emerald-50 transition flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> Crear Nueva Página
                </button>

                <div className="space-y-3">
                    {customPages.map(page => (
                        <div 
                            key={page.id} 
                            className={`bg-white p-4 rounded-xl shadow-sm border cursor-pointer transition ${isEditing === page.id ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'}`}
                            onClick={() => handleEdit(page)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800">{page.title}</h3>
                                    <div className="flex items-center text-xs text-gray-400 mt-1">
                                        <LinkIcon size={10} className="mr-1"/> /{page.slug}
                                    </div>
                                </div>
                                {page.isVisible ? (
                                    <span className="w-2 h-2 bg-green-500 rounded-full" title="Visible"></span>
                                ) : (
                                    <span className="w-2 h-2 bg-gray-300 rounded-full" title="Oculta"></span>
                                )}
                            </div>
                            <div className="flex justify-end mt-3 gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onNavigateToPage(page.slug); }}
                                    className="p-1.5 text-gray-400 hover:text-emerald-600 rounded bg-gray-50"
                                    title="Ver página"
                                >
                                    <Eye size={14} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(page.id); }}
                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded bg-gray-50"
                                    title="Eliminar"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {customPages.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No hay páginas creadas.</p>}
                </div>
            </div>

            {/* Editor Area */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            {isEditing ? <Edit2 size={18}/> : <Plus size={18}/>}
                            {isEditing ? 'Editando Página' : 'Nueva Página'}
                        </h2>
                        {isEditing && (
                            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título de la Página</label>
                                <input 
                                    required type="text" value={formData.title} onChange={handleTitleChange}
                                    placeholder="Ej: Política de Privacidad"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (URL)</label>
                                <div className="flex items-center">
                                    <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 rounded-l-lg text-gray-500 text-sm">/</span>
                                    <input 
                                        required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contenido (HTML)</label>
                            <textarea 
                                required rows={12} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                                placeholder="<p>Escribe aquí el contenido de la página...</p>"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Tip: Usa etiquetas HTML como <code>&lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;</code> para dar formato.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <input 
                                type="checkbox" id="isVisible" 
                                checked={formData.isVisible} 
                                onChange={e => setFormData({...formData, isVisible: e.target.checked})}
                                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor="isVisible" className="text-sm text-gray-700">Página visible públicamente</label>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                                Cancelar
                            </button>
                            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold shadow-md flex items-center gap-2">
                                <Save size={18} /> Guardar Página
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