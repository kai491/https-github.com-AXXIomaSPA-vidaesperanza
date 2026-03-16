
import React, { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Package, Minus, BarChart3, Tag, Edit3, Save, CheckCircle2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { DonationItem, DonationCategory } from '../../types';

interface AdminDonationsProps {
  onBack: () => void;
}

export const AdminDonations: React.FC<AdminDonationsProps> = ({ onBack }) => {
  const { donationNeeds, addDonationNeed, removeDonationNeed, updateDonationProgress } = useContent();
  const [editingAmountId, setEditingAmountId] = useState<number | null>(null);
  const [tempAmount, setTempAmount] = useState<string>('');
  
  // State for new item form
  const [newItem, setNewItem] = useState<{
    name: string;
    desc: string;
    priority: 'Alta' | 'Media' | 'Baja';
    category: DonationCategory;
    targetAmount: string;
    unit: string;
  }>({ 
    name: '', 
    desc: '', 
    priority: 'Media', 
    category: 'Higiene', 
    targetAmount: '', 
    unit: 'unidades' 
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.desc) return;
    
    addDonationNeed({
        name: newItem.name,
        desc: newItem.desc,
        priority: newItem.priority,
        category: newItem.category,
        targetAmount: newItem.targetAmount ? parseInt(newItem.targetAmount) : undefined,
        unit: newItem.unit
    });
    
    // Reset form
    setNewItem({ name: '', desc: '', priority: 'Media', category: 'Higiene', targetAmount: '', unit: 'unidades' });
  };

  const startEditingAmount = (item: DonationItem) => {
      setEditingAmountId(item.id);
      setTempAmount(item.currentAmount.toString());
  };

  const saveManualAmount = (id: number) => {
      const val = parseInt(tempAmount);
      if (!isNaN(val)) {
          // Calculamos la diferencia para usar la función existente o podrías crear una de setDirecto
          const current = donationNeeds.find(d => d.id === id)?.currentAmount || 0;
          updateDonationProgress(id, val - current);
      }
      setEditingAmountId(null);
  };

  const categories: DonationCategory[] = ['Higiene', 'Ropa', 'Alimentos', 'Médico', 'Entretención', 'Otro'];

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition text-gray-600 border border-gray-100">
                <ArrowLeft size={20} />
                </button>
                <div>
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Catálogo & Inventario</h1>
                <p className="text-gray-500 text-sm">Administra las solicitudes, metas y recepción de donaciones.</p>
                </div>
            </div>
            <div className="hidden md:flex bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <BarChart3 size={20} />
                </div>
                <div>
                    <p className="text-xs font-bold text-emerald-800 uppercase">Total Items</p>
                    <p className="text-lg font-bold text-emerald-600 leading-none">{donationNeeds.length}</p>
                </div>
            </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Inventory List */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2">
                            <Package size={20} className="text-emerald-600" /> Solicitudes Activas
                        </h2>
                    </div>

                    {donationNeeds.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Package className="mx-auto text-gray-200 mb-4" size={48} />
                            <p className="font-medium">No hay items en el catálogo.</p>
                            <p className="text-sm">Utiliza el formulario lateral para agregar necesidades.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {donationNeeds.map(item => {
                                const progress = item.targetAmount ? Math.min(100, (item.currentAmount / item.targetAmount) * 100) : 0;
                                const isCompleted = item.targetAmount && item.currentAmount >= item.targetAmount;
                                
                                return (
                                    <div key={item.id} className={`p-6 hover:bg-gray-50 transition-colors ${isCompleted ? 'bg-emerald-50/20' : ''}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
                                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{item.category}</span>
                                                    {item.priority === 'Alta' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-md font-bold uppercase">Urgente</span>}
                                                    {isCompleted && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold uppercase flex items-center gap-1"><CheckCircle2 size={10}/> Completado</span>}
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2">{item.desc}</p>
                                            </div>
                                            <button 
                                                onClick={() => removeDonationNeed(item.id)}
                                                className="text-gray-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all ml-4"
                                                title="Eliminar del catálogo"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        {/* Progress Bar Display */}
                                        {item.targetAmount && (
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs mb-1.5 font-bold">
                                                    <span className={isCompleted ? 'text-emerald-700' : 'text-gray-500'}>
                                                        {item.currentAmount} de {item.targetAmount} {item.unit}
                                                    </span>
                                                    <span className={isCompleted ? 'text-emerald-600' : 'text-gray-400'}>{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden border border-gray-200">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-emerald-400'}`} 
                                                        style={{width: `${progress}%`}}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Controls Bar */}
                                        <div className="flex flex-wrap items-center gap-4 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    disabled={item.currentAmount <= 0}
                                                    onClick={() => updateDonationProgress(item.id, -1)}
                                                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-all"
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                
                                                {editingAmountId === item.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            autoFocus
                                                            type="number"
                                                            value={tempAmount}
                                                            onChange={e => setTempAmount(e.target.value)}
                                                            className="w-20 px-2 py-2 border-2 border-emerald-500 rounded-lg text-center font-bold outline-none"
                                                        />
                                                        <button onClick={() => saveManualAmount(item.id)} className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700">
                                                            <Save size={18} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div 
                                                        onClick={() => startEditingAmount(item)}
                                                        className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-extrabold text-gray-800 cursor-pointer hover:border-emerald-300 transition-all min-w-[80px] text-center"
                                                        title="Haz clic para editar manualmente"
                                                    >
                                                        {item.currentAmount}
                                                    </div>
                                                )}

                                                <button 
                                                    onClick={() => updateDonationProgress(item.id, 1)}
                                                    className="w-10 h-10 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 text-emerald-600 transition-all"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>

                                            <div className="flex gap-2 ml-auto">
                                                <button 
                                                    onClick={() => updateDonationProgress(item.id, 5)}
                                                    className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:border-emerald-300 transition-all"
                                                >
                                                    +5
                                                </button>
                                                <button 
                                                    onClick={() => updateDonationProgress(item.id, 10)}
                                                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-all"
                                                >
                                                    +10
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Add Form */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 sticky top-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Plus className="text-emerald-600" size={24} /> Nueva Solicitud
                    </h2>
                    
                    <form onSubmit={handleAddItem} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Nombre del Insumo</label>
                            <input 
                                required
                                type="text" 
                                placeholder="Ej: Shampoo Hipoalergénico"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-sm transition-all"
                                value={newItem.name}
                                onChange={e => setNewItem({...newItem, name: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Categoría</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-3.5 text-gray-400" size={16} />
                                <select 
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-sm bg-white appearance-none transition-all"
                                    value={newItem.category}
                                    onChange={e => setNewItem({...newItem, category: e.target.value as DonationCategory})}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Meta</label>
                                <input 
                                    type="number" 
                                    placeholder="50"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-sm transition-all"
                                    value={newItem.targetAmount}
                                    onChange={e => setNewItem({...newItem, targetAmount: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Unidad</label>
                                <input 
                                    type="text" 
                                    placeholder="unidades"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-sm transition-all"
                                    value={newItem.unit}
                                    onChange={e => setNewItem({...newItem, unit: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Prioridad</label>
                            <div className="flex gap-2">
                                {['Baja', 'Media', 'Alta'].map(p => (
                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => setNewItem({...newItem, priority: p as any})}
                                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                                            newItem.priority === p 
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Descripción</label>
                            <textarea 
                                required
                                rows={3}
                                placeholder="Detalles de tallas, marcas o restricciones..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-sm transition-all resize-none"
                                value={newItem.desc}
                                onChange={e => setNewItem({...newItem, desc: e.target.value})}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-xl shadow-emerald-200 flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Publicar Solicitud
                        </button>
                    </form>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
