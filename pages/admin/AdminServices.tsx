import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Heart, Users, Smile, Hand, Star, Sun, Save, X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { ServiceItem } from '../../types';

interface AdminServicesProps {
  onBack: () => void;
}

const ICON_MAP = {
  Heart: <Heart size={24} />,
  Users: <Users size={24} />,
  Smile: <Smile size={24} />,
  Hand: <Hand size={24} />,
  Star: <Star size={24} />,
  Sun: <Sun size={24} />
};

export const AdminServices: React.FC<AdminServicesProps> = ({ onBack }) => {
  const { services, addService, updateService, deleteService } = useContent();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    description: '',
    icon: 'Heart'
  });

  const handleEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setFormData({ title: service.title, description: service.description, icon: service.icon });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', icon: 'Heart' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateService(editingId, formData);
    } else {
      addService(formData);
    }
    handleCancel();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Nuestro Aporte & Servicios</h1>
              <p className="text-gray-500 text-sm">Gestiona las tarjetas de "Áreas de Acción" que aparecen en el inicio.</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* List of Services */}
          <div className="lg:col-span-2 grid gap-4">
            {services.map(service => (
              <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg flex-shrink-0">
                  {ICON_MAP[service.icon] || <Heart />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                   <button onClick={() => handleEdit(service)} className="p-2 text-gray-400 hover:text-emerald-600 bg-gray-50 rounded-lg">
                      <Edit2 size={16} />
                   </button>
                   <button onClick={() => deleteService(service.id)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg">
                      <Trash2 size={16} />
                   </button>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed">
                No hay servicios registrados. Agrega uno.
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                 {editingId ? <Edit2 size={18} className="text-emerald-600"/> : <Plus size={18} className="text-emerald-600"/>}
                 {editingId ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                  <input 
                    required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ícono</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(ICON_MAP).map(key => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({...formData, icon: key as any})}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${
                          formData.icon === key ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {ICON_MAP[key as keyof typeof ICON_MAP]}
                        <span className="text-[10px] mt-1">{key}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
                  <textarea 
                    required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 font-bold text-sm">
                    Guardar
                  </button>
                  {editingId && (
                    <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium text-sm">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};