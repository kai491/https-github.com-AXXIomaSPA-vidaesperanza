import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useContent, AboutContent } from '../../context/ContentContext';

interface AdminAboutProps {
  onBack: () => void;
}

export const AdminAbout: React.FC<AdminAboutProps> = ({ onBack }) => {
  const { aboutContent, updateAboutContent } = useContent();
  const [formData, setFormData] = useState<AboutContent>(aboutContent);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(aboutContent);
  }, [aboutContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutContent(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-emerald-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center text-white gap-4">
            <button onClick={onBack} className="hover:bg-emerald-600 p-2 rounded-full transition">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Editar Página "Quiénes Somos"</h1>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-2">Nuestra Historia</label>
                <p className="text-sm text-gray-500 mb-2">Detalla los orígenes y evolución de la organización.</p>
                <textarea 
                  name="history" 
                  value={formData.history} 
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Misión</label>
                    <textarea 
                    name="mission" 
                    value={formData.mission} 
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Visión</label>
                    <textarea 
                    name="vision" 
                    value={formData.vision} 
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4">
            {saved && <span className="text-emerald-600 mr-4 font-medium animate-pulse">¡Cambios guardados!</span>}
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition shadow-sm"
            >
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};