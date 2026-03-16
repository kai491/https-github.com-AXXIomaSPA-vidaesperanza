import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, Clock, Gift, TrendingUp, AlertTriangle } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { useVolunteer } from '../context/VolunteerContext';
import { useContent } from '../context/ContentContext';

interface DashboardProps {
    onNavigate: (page: string) => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { getCampaignStats } = useCRM();
  const { getVolunteerStats, volunteers } = useVolunteer();
  const { donationNeeds } = useContent();
  
  const campaignStats = getCampaignStats();
  const volunteerStats = getVolunteerStats();

  // Mock Data for Charts
  const activityData = [
    { name: 'Sem 1', horas: 40, visitas: 120 },
    { name: 'Sem 2', horas: 55, visitas: 140 },
    { name: 'Sem 3', horas: 45, visitas: 110 },
    { name: 'Sem 4', horas: 70, visitas: 180 },
  ];

  const donationTypeData = [
    { name: 'Monetario', value: 45 },
    { name: 'Insumos', value: 35 },
    { name: 'Ropa', value: 20 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Welcome */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500">Resumen ejecutivo del impacto de "Vida y Esperanza".</p>
        </div>
        <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Actualizado hoy
        </span>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Volunteers */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fuerza Voluntaria</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{volunteerStats.active}</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={20} /></div>
            </div>
            <div className="flex items-center text-xs">
                <span className="text-emerald-600 font-bold flex items-center mr-2">
                    <TrendingUp size={12} className="mr-1" /> +2
                </span>
                <span className="text-gray-400">este mes</span>
            </div>
        </div>

        {/* KPI 2: Hours */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Horas Donadas</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{volunteerStats.totalHours}</h3>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Clock size={20} /></div>
            </div>
            <div className="text-xs text-gray-400">
                Impacto directo en pacientes
            </div>
        </div>

        {/* KPI 3: Campaigns */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Campañas Activas</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{campaignStats.active}</h3>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><TrendingUp size={20} /></div>
            </div>
             <div className="text-xs text-gray-400">
                {campaignStats.planned} planificadas próximamente
            </div>
        </div>

        {/* KPI 4: Pending Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Por Revisar</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{volunteerStats.pending}</h3>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><AlertTriangle size={20} /></div>
            </div>
             <div className="text-xs text-gray-400">
                Solicitudes de voluntariado
            </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Chart: Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Actividad Mensual (Horas vs Visitas)</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                        <defs>
                            <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="visitas" stroke="#10b981" fillOpacity={1} fill="url(#colorVisitas)" />
                        <Area type="monotone" dataKey="horas" stroke="#3b82f6" fill="transparent" strokeDasharray="5 5"/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Secondary Chart: Donations Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Composición de Donaciones</h3>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={donationTypeData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {donationTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-2">
                {donationTypeData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[i]}}></span>
                            {d.name}
                        </div>
                        <span className="font-bold">{d.value}%</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Needs & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Insumos Críticos (Catálogo Web)</h3>
                <button onClick={() => onNavigate('admin-donations')} className="text-xs text-emerald-600 hover:underline">Gestionar</button>
            </div>
            <ul className="space-y-3">
                {donationNeeds.filter(n => n.priority === 'Alta').length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No hay insumos de alta prioridad marcados.</p>
                ) : (
                    donationNeeds.filter(n => n.priority === 'Alta').map(need => (
                        <li key={need.id} className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-100">
                            <span className="text-sm font-medium text-red-800">{need.name}</span>
                            <span className="text-xs bg-white px-2 py-1 rounded text-red-600 font-bold">ALTA</span>
                        </li>
                    ))
                )}
                {donationNeeds.filter(n => n.priority === 'Alta').length < 3 && (
                    <p className="text-xs text-center text-gray-400 mt-2">Mantén el catálogo actualizado para maximizar donaciones.</p>
                )}
            </ul>
        </div>

        <div className="bg-emerald-900 p-6 rounded-xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Planificación Semanal</h3>
                <p className="text-emerald-200 text-sm mb-6">Recuerda revisar las asignaciones de turno para el fin de semana.</p>
                <button onClick={() => onNavigate('admin-volunteers')} className="bg-white text-emerald-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-50 transition">
                    Ver Calendario (Próximamente)
                </button>
            </div>
            <Gift className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50" size={120} />
        </div>
      </div>

    </div>
  );
};