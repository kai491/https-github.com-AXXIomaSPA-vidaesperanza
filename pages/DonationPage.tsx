
import React, { useState } from 'react';
import { Gift, CreditCard, Package, Filter, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { DonationCategory } from '../types';
import { StandardHero } from '../components/StandardHero';

export const DonationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'supplies' | 'money'>('supplies');
  const [selectedCategory, setSelectedCategory] = useState<DonationCategory | 'Todas'>('Todas');
  const { donationNeeds, pageBanners } = useContent();
  const banner = pageBanners.find(b => b.pageId === 'donate');

  const categories: (DonationCategory | 'Todas')[] = ['Todas', 'Higiene', 'Ropa', 'Alimentos', 'Médico', 'Entretención', 'Otro'];

  const filteredNeeds = selectedCategory === 'Todas' 
    ? donationNeeds 
    : donationNeeds.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* Standardized Hero */}
      <StandardHero 
        title={banner?.title || 'Cómo Ayudar'} 
        subtitle={banner?.subtitle || 'Tu aporte marca la diferencia.'} 
        imageUrl={banner?.imageUrl}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
        
        {/* Tabs Control */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl inline-flex shadow-xl border border-white/50 ring-1 ring-gray-200">
            <button
              onClick={() => setActiveTab('supplies')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'supplies' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-500 hover:text-emerald-600'
              }`}
            >
              Campaña de Insumos
            </button>
            <button
              onClick={() => setActiveTab('money')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'money' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-500 hover:text-emerald-600'
              }`}
            >
              Aporte Económico
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          {activeTab === 'supplies' ? (
            <div className="animate-fadeIn">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start">
                    <div className="bg-emerald-100 p-4 rounded-2xl mr-4 flex-shrink-0">
                        <Package className="text-emerald-600" size={32} />
                    </div>
                    <div>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-2">Catálogo de Necesidades Críticas</h3>
                    <p className="text-emerald-800/80 leading-relaxed">
                        Estas son nuestras metas actuales. Cada ítem entregado dignifica la estadía de un paciente en el Hospital de La Serena.
                    </p>
                    </div>
                </div>
                <div className="text-center md:text-right bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm min-w-[200px]">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Centro de Acopio</p>
                    <p className="text-emerald-900 font-bold leading-tight">Anfión Muñoz #751<br/>La Serena</p>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-10 items-center">
                <div className="flex items-center mr-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                    <Filter size={14} className="mr-2" /> Filtrar:
                </div>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                            selectedCategory === cat 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
              </div>

              {filteredNeeds.length === 0 ? (
                <div className="text-center text-gray-400 py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Package className="mx-auto h-16 w-16 text-gray-200 mb-4" />
                    <p className="font-medium">No hay solicitudes activas en esta categoría.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {filteredNeeds.map((item) => {
                        const progress = item.targetAmount ? Math.min(100, (item.currentAmount / item.targetAmount) * 100) : 0;
                        const isCompleted = item.targetAmount && item.currentAmount >= item.targetAmount;

                        return (
                            <div key={item.id} className={`bg-white border-2 rounded-3xl p-6 transition-all hover:shadow-xl relative group ${isCompleted ? 'border-emerald-100 bg-emerald-50/20' : 'border-gray-50'}`}>
                                {isCompleted && (
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-3xl z-10 flex items-center shadow-sm">
                                        <CheckCircle2 size={12} className="mr-1.5" /> META CUMPLIDA
                                    </div>
                                )}
                                
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
                                        {item.priority === 'Alta' && !isCompleted && (
                                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-extrabold uppercase animate-pulse">
                                                Urgente
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{item.name}</h4>
                                </div>
                                
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{item.desc}</p>

                                {item.targetAmount ? (
                                    <div>
                                        <div className="flex justify-between text-xs font-extrabold mb-2">
                                            <span className={isCompleted ? 'text-emerald-700' : 'text-gray-600'}>
                                                Logrado: {item.currentAmount} {item.unit}
                                            </span>
                                            <span className="text-gray-400">Meta: {item.targetAmount}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden ring-1 ring-gray-100">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-emerald-400'}`} 
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 px-4 py-2.5 rounded-2xl text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                                        Campaña Abierta Permanente
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white border-2 border-gray-50 rounded-3xl p-8 shadow-sm hover:border-blue-100 hover:shadow-xl transition-all group">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                    <CreditCard className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Transferencia Bancaria</h3>
                  <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100 leading-relaxed font-medium">
                    <p className="flex justify-between"><span className="text-gray-400 uppercase text-[10px] font-bold">Banco:</span> <span className="text-gray-900">Banco Estado</span></p>
                    <p className="flex justify-between"><span className="text-gray-400 uppercase text-[10px] font-bold">Tipo:</span> <span className="text-gray-900">Chequera Electrónica</span></p>
                    <p className="flex justify-between"><span className="text-gray-400 uppercase text-[10px] font-bold">Número:</span> <span className="text-gray-900">123-456-7890</span></p>
                    <p className="flex justify-between"><span className="text-gray-400 uppercase text-[10px] font-bold">RUT:</span> <span className="text-gray-900">78.900.987-1</span></p>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-50 rounded-3xl p-8 shadow-sm hover:border-emerald-100 hover:shadow-xl transition-all group">
                   <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:-rotate-6 transition-transform">
                    <Gift className="text-emerald-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Socio Colaborador</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                    Hazte socio con un aporte mensual automático. Tu constancia nos permite planificar mejor nuestra ayuda mensual.
                  </p>
                  <button className="w-full bg-emerald-600 text-white font-extrabold py-5 rounded-2xl hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 group-hover:-translate-y-1">
                    Suscribir Aporte Mensual
                  </button>
                  <p className="text-xs text-gray-400 mt-6 text-center flex justify-center items-center gap-2">
                    <Lock size={14} className="text-gray-300" /> Transacción Segura vía Webpay
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
