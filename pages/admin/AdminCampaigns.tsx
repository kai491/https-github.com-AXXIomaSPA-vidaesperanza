import React, { useState } from 'react';
import { ArrowLeft, Plus, Calendar, Target, Hash, CheckCircle, Clock, XCircle, Trash2, Edit2, Save, X } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Campaign, CampaignStatus } from '../../types';

interface AdminCampaignsProps {
  onBack: () => void;
}

export const AdminCampaigns: React.FC<AdminCampaignsProps> = ({ onBack }) => {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useCRM();
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const initialFormState: Omit<Campaign, 'id'> = {
    name: '',
    objective: '',
    startDate: '',
    endDate: '',
    channel: '',
    targetAudience: '',
    status: CampaignStatus.DRAFT,
    budget: '',
    notes: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleEditClick = (campaign: Campaign) => {
    setFormData(campaign);
    setIsEditing(campaign.id);
    setIsCreating(false);
  };

  const handleCreateClick = () => {
    setFormData(initialFormState);
    setIsCreating(true);
    setIsEditing(null);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateCampaign(isEditing, formData);
    } else {
      addCampaign(formData);
    }
    handleCancel();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case CampaignStatus.PLANNED: return 'bg-blue-100 text-blue-800 border-blue-200';
      case CampaignStatus.COMPLETED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case CampaignStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4 w-full">
            <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">CRM de Campañas</h1>
              <p className="text-gray-500 text-sm">Planifica y monitorea tus esfuerzos comunicacionales.</p>
            </div>
          </div>
          <button 
            onClick={handleCreateClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm whitespace-nowrap"
          >
            <Plus size={18} /> Nueva Campaña
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* List Section */}
          <div className={`lg:col-span-2 space-y-4 ${isCreating || isEditing ? 'hidden lg:block' : 'block'}`}>
            {campaigns.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
                    <Target className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No hay campañas registradas.</p>
                </div>
            ) : (
                campaigns.map(campaign => (
                <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                    <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-gray-900">{campaign.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(campaign.status)}`}>
                                    {campaign.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm">{campaign.objective}</p>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => handleEditClick(campaign)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteCampaign(campaign.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-emerald-500" />
                            <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Target size={14} className="text-emerald-500" />
                            <span className="truncate" title={campaign.targetAudience}>{campaign.targetAudience}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Hash size={14} className="text-emerald-500" />
                            <span className="truncate" title={campaign.channel}>{campaign.channel}</span>
                        </div>
                         <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-emerald-600">{campaign.budget || '$0'}</span>
                        </div>
                    </div>
                    </div>
                </div>
                ))
            )}
          </div>

          {/* Form Section (Sticky Sidebar) */}
          {(isCreating || isEditing) && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-6 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    {isEditing ? 'Editar Campaña' : 'Nueva Campaña'}
                  </h2>
                  <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Nombre</label>
                    <input 
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Objetivo</label>
                    <textarea 
                      name="objective" rows={2} required value={formData.objective} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Inicio</label>
                        <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Fin</label>
                        <input type="date" name="endDate" required value={formData.endDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Estado</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-white">
                            {Object.values(CampaignStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Presupuesto</label>
                        <input type="text" name="budget" placeholder="$" value={formData.budget} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm" />
                    </div>
                  </div>

                   <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Público Objetivo</label>
                    <input 
                      type="text" name="targetAudience" placeholder="Ej: Adulto mayor, Estudiantes" value={formData.targetAudience} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Canales</label>
                    <input 
                      type="text" name="channel" placeholder="Ej: Instagram, Email" value={formData.channel} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">Notas Internas</label>
                    <textarea 
                      name="notes" rows={3} value={formData.notes} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 font-medium text-sm flex justify-center items-center gap-2">
                        <Save size={16} /> Guardar
                    </button>
                    <button type="button" onClick={handleCancel} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm">
                        Cancelar
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};