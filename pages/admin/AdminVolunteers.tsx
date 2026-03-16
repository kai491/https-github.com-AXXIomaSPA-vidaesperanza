
import React, { useState } from 'react';
import { useVolunteer } from '../../context/VolunteerContext';
import { VolunteerStatus, HospitalUnit, VolunteerGroup, Volunteer, Shift } from '../../types';
import { CheckCircle, XCircle, Clock, Search, Filter, Calendar as CalendarIcon, MapPin, Users, ChevronLeft, ChevronRight, Plus, Edit, X, Save, Phone, Mail, User, Trash2, Building, UserPlus } from 'lucide-react';

export const AdminVolunteers: React.FC = () => {
  const { volunteers, updateVolunteerStatus, updateVolunteerDetails, addVolunteer, shifts, addShift, updateShift, deleteShift } = useVolunteer();
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [editingVolunteer, setEditingVolunteer] = useState<Partial<Volunteer> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Shift Management State
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Partial<Shift>>({}); 

  // Filters
  const [filterHospital, setFilterHospital] = useState<HospitalUnit | 'Todos'>('Todos');
  const [filterGroup, setFilterGroup] = useState<VolunteerGroup | 'Todos'>('Todos');
  const [filterStatus, setFilterStatus] = useState<VolunteerStatus | 'Todos'>('Todos');
  const [filterEstablishment, setFilterEstablishment] = useState<string>('Todos');

  // Calendar State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const uniqueEstablishments = Array.from(new Set(volunteers.map(v => v.establishment).filter(Boolean))) as string[];

  const filteredVolunteers = volunteers.filter(vol => {
    if (filterHospital !== 'Todos' && vol.hospitalUnit !== filterHospital) return false;
    if (filterGroup !== 'Todos' && vol.group !== filterGroup) return false;
    if (filterStatus !== 'Todos' && vol.status !== filterStatus) return false;
    if (filterEstablishment !== 'Todos' && vol.establishment !== filterEstablishment) return false;
    return true;
  });

  const activeVolunteers = volunteers.filter(v => v.status === VolunteerStatus.ACTIVE);

  const getWeekDays = (dateString: string) => {
    const curr = new Date(dateString);
    const week = [];
    const day = curr.getDay() || 7; 
    if (day !== 1) curr.setHours(-24 * (day - 1));
    for (let i = 0; i < 7; i++) {
        week.push(new Date(curr));
        curr.setDate(curr.getDate() + 1);
    }
    return week;
  };

  const currentWeek = getWeekDays(selectedDate);

  // --- Handlers: Volunteer ---
  const handleEditClick = (vol: Volunteer) => {
    setEditingVolunteer({ ...vol });
    setIsCreating(false);
  };

  const handleCreateClick = () => {
    setEditingVolunteer({
        fullName: '',
        email: '',
        phone: '',
        status: VolunteerStatus.ACTIVE,
        establishment: 'Hospital de La Serena',
        hospitalUnit: 'Medicina Hombres',
        group: 'Grupo A (Lunes)',
        hoursThisMonth: 0
    });
    setIsCreating(true);
  };

  const handleSaveVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVolunteer) {
      if (isCreating) {
          // Usamos la función del contexto pero adaptada para admin (podemos pasar estado)
          await addVolunteer(editingVolunteer as any);
      } else {
          await updateVolunteerDetails(editingVolunteer.id!, editingVolunteer);
      }
      setEditingVolunteer(null);
      setIsCreating(false);
    }
  };

  // --- Handlers: Calendar / Shifts ---
  const handlePrevWeek = () => {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 7);
      setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextWeek = () => {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 7);
      setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleOpenAddShift = (dateOverride?: string) => {
    setEditingShift({
        date: dateOverride || selectedDate,
        startTime: '09:00',
        endTime: '13:00',
        status: 'Programado',
        hospitalUnit: 'Medicina Hombres',
        establishment: 'Hospital de La Serena'
    });
    setShiftModalOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
      setEditingShift({ ...shift });
      setShiftModalOpen(true);
  };

  const handleSaveShift = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingShift.volunteerId || !editingShift.date || !editingShift.startTime || !editingShift.endTime) {
          alert('Por favor completa los campos obligatorios');
          return;
      }
      try {
          if (editingShift.id) {
              await updateShift(editingShift.id, editingShift);
          } else {
              await addShift(editingShift as Omit<Shift, 'id'>);
          }
          setShiftModalOpen(false);
      } catch (error: any) {
          console.error("Error al guardar el turno:", error);
          alert(`No se pudo guardar el turno: ${error.message}`);
      }
  };

  const handleDeleteShift = () => {
      if(editingShift.id && window.confirm('¿Eliminar este turno del calendario?')) {
          deleteShift(editingShift.id);
          setShiftModalOpen(false);
      }
  };

  return (
    <div>
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Coordinación de Voluntariado</h1>
          <p className="text-gray-500">Gestión de fichas, asignación de grupos y calendario.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={handleCreateClick}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-md shadow-emerald-100"
            >
                <UserPlus size={18} /> Nueva Voluntaria
            </button>
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <button 
                    onClick={() => setActiveTab('list')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'list' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Fichas y Lista
                </button>
                <button 
                    onClick={() => setActiveTab('calendar')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'calendar' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Calendario Semanal
                </button>
            </div>
        </div>
      </div>

      {activeTab === 'list' && (
        <>
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center text-gray-500 font-semibold text-sm">
                    <Filter size={18} className="mr-2" /> Filtros:
                </div>
                <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                    <option value="Todos">Todos los Estados</option>
                    {Object.values(VolunteerStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    value={filterEstablishment}
                    onChange={(e) => setFilterEstablishment(e.target.value)}
                >
                    <option value="Todos">Todos los Recintos</option>
                    {uniqueEstablishments.map(est => <option key={est} value={est}>{est}</option>)}
                </select>
                <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    value={filterGroup}
                    onChange={(e) => setFilterGroup(e.target.value as any)}
                >
                    <option value="Todos">Todos los Grupos</option>
                    <option value="Grupo A (Lunes)">Grupo A (Lunes)</option>
                    <option value="Grupo B (Martes)">Grupo B (Martes)</option>
                    <option value="Grupo C (Miércoles)">Grupo C (Miércoles)</option>
                    <option value="Fines de Semana">Fines de Semana</option>
                </select>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">Voluntaria</th>
                        <th className="px-6 py-4">Establecimiento</th>
                        <th className="px-6 py-4">Asignación</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4">Disponibilidad Original</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredVolunteers.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">No se encontraron voluntarias con estos filtros.</td></tr>
                    ) : filteredVolunteers.map(vol => (
                        <tr key={vol.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{vol.fullName}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span className="flex items-center"><Mail size={10} className="mr-1"/>{vol.email}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            {vol.establishment ? (
                                <div className="flex items-center text-gray-700 font-medium">
                                    <Building size={14} className="mr-1.5 text-gray-400" />
                                    {vol.establishment}
                                </div>
                            ) : (
                                <span className="text-gray-400 italic text-xs">-</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            {vol.hospitalUnit ? (
                                <div className="space-y-1">
                                    <span className="flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                                        <MapPin size={10} className="mr-1" /> {vol.hospitalUnit}
                                    </span>
                                    <span className="flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                                        <Users size={10} className="mr-1" /> {vol.group || 'Sin grupo'}
                                    </span>
                                    {vol.location && (
                                        <div className="text-xs text-gray-500 pl-1 border-l-2 border-gray-200 mt-1">
                                            {vol.location}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span className="text-gray-400 italic text-xs">Sin asignar</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                vol.status === VolunteerStatus.ACTIVE ? 'bg-green-100 text-green-700' :
                                vol.status === VolunteerStatus.PENDING ? 'bg-yellow-100 text-yellow-700' :
                                vol.status === VolunteerStatus.TRAINING ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                                {vol.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                            {vol.availability || 'No especificada'}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                             <button 
                                onClick={() => handleEditClick(vol)}
                                className="text-emerald-600 hover:text-emerald-800 text-xs font-medium border border-emerald-200 px-3 py-1 rounded hover:bg-emerald-50 transition flex items-center gap-1 inline-flex"
                             >
                                <Edit size={12} /> Gestionar Ficha
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </>
      )}

      {/* Volunteer Edit/Create Modal */}
      {editingVolunteer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSaveVolunteer}>
                    {/* Modal Header */}
                    <div className="bg-emerald-900 text-white p-6 sticky top-0 z-10 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                                {editingVolunteer.fullName ? editingVolunteer.fullName.charAt(0) : '?'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{isCreating ? 'Alta de Nueva Voluntaria' : 'Ficha de Voluntaria'}</h2>
                                <p className="text-emerald-200 text-sm">{isCreating ? 'Ingresa los datos para registro directo' : 'Editando perfil y asignaciones'}</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => setEditingVolunteer(null)} className="text-emerald-200 hover:text-white transition">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-6">
                        
                        {/* Status Section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Estado Actual</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(VolunteerStatus).map(status => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setEditingVolunteer({...editingVolunteer, status: status})}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                                            editingVolunteer.status === status 
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Coordination Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Establecimiento / Recinto</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={editingVolunteer.establishment || ''} 
                                        onChange={e => setEditingVolunteer({...editingVolunteer, establishment: e.target.value})}
                                        placeholder="Ej: Hospital de La Serena"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad Hospitalaria</label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                    value={editingVolunteer.hospitalUnit || ''}
                                    onChange={e => setEditingVolunteer({...editingVolunteer, hospitalUnit: e.target.value as HospitalUnit})}
                                >
                                    <option value="">-- Sin Asignar --</option>
                                    <option value="Pediatría">Pediatría</option>
                                    <option value="Medicina Hombres">Medicina Hombres</option>
                                    <option value="Medicina Mujeres">Medicina Mujeres</option>
                                    <option value="Urgencias">Urgencias</option>
                                    <option value="Geriatría">Geriatría</option>
                                    <option value="Oncología">Oncología</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo / Turno</label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                    value={editingVolunteer.group || ''}
                                    onChange={e => setEditingVolunteer({...editingVolunteer, group: e.target.value as VolunteerGroup})}
                                >
                                    <option value="">-- Sin Asignar --</option>
                                    <option value="Grupo A (Lunes)">Grupo A (Lunes)</option>
                                    <option value="Grupo B (Martes)">Grupo B (Martes)</option>
                                    <option value="Grupo C (Miércoles)">Grupo C (Miércoles)</option>
                                    <option value="Grupo D (Jueves)">Grupo D (Jueves)</option>
                                    <option value="Grupo E (Viernes)">Grupo E (Viernes)</option>
                                    <option value="Fines de Semana">Fines de Semana</option>
                                </select>
                            </div>
                            
                            {/* MANUAL LOCATION FIELD */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lugar Específico (Detalle)</label>
                                <input 
                                    type="text" 
                                    value={editingVolunteer.location || ''} 
                                    onChange={e => setEditingVolunteer({...editingVolunteer, location: e.target.value})}
                                    placeholder="Ej: Sala 5, Torre Nueva, Box de Atención..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                             <h3 className="font-bold text-gray-800 flex items-center gap-2"><User size={18}/> Datos Personales</h3>
                             <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={editingVolunteer.fullName || ''} 
                                        onChange={e => setEditingVolunteer({...editingVolunteer, fullName: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Teléfono</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={editingVolunteer.phone || ''} 
                                        onChange={e => setEditingVolunteer({...editingVolunteer, phone: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs text-gray-500 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={editingVolunteer.email || ''} 
                                        onChange={e => setEditingVolunteer({...editingVolunteer, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                             </div>
                        </div>

                        {/* Motivation / Notes */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Motivación / Notas Internas</label>
                             <textarea 
                                rows={3}
                                value={editingVolunteer.motivation || ''}
                                onChange={e => setEditingVolunteer({...editingVolunteer, motivation: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                             />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                        <button 
                            type="button" 
                            onClick={() => setEditingVolunteer(null)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold shadow-md flex items-center gap-2 transition"
                        >
                            <Save size={18} /> {isCreating ? 'Registrar Voluntaria' : 'Guardar Ficha'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Shift Add/Edit Modal (Sin cambios necesarios aquí) */}
      {shiftModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <form onSubmit={handleSaveShift}>
                    <div className="bg-emerald-900 text-white p-4 rounded-t-xl flex justify-between items-center">
                        <h2 className="font-bold flex items-center gap-2">
                            <Clock size={20} /> {editingShift.id ? 'Editar Turno' : 'Nuevo Turno'}
                        </h2>
                        <button type="button" onClick={() => setShiftModalOpen(false)} className="hover:text-emerald-300">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Voluntaria</label>
                            <select 
                                required
                                value={editingShift.volunteerId || ''}
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    const selectedVol = volunteers.find(v => v.id === val);
                                    setEditingShift({
                                        ...editingShift, 
                                        volunteerId: val,
                                        hospitalUnit: selectedVol?.hospitalUnit || editingShift.hospitalUnit,
                                        establishment: selectedVol?.establishment || editingShift.establishment
                                    });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            >
                                <option value="">Selecciona una voluntaria...</option>
                                {activeVolunteers.map(v => (
                                    <option key={v.id} value={v.id}>{v.fullName} ({v.hospitalUnit || 'S/A'})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha</label>
                            <input 
                                required type="date" value={editingShift.date} 
                                onChange={e => setEditingShift({...editingShift, date: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Inicio</label>
                                <input 
                                    required type="time" value={editingShift.startTime} 
                                    onChange={e => setEditingShift({...editingShift, startTime: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Término</label>
                                <input 
                                    required type="time" value={editingShift.endTime} 
                                    onChange={e => setEditingShift({...editingShift, endTime: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                                />
                            </div>
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Establecimiento</label>
                            <input 
                                type="text" value={editingShift.establishment || ''} 
                                onChange={e => setEditingShift({...editingShift, establishment: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unidad</label>
                            <select 
                                required
                                value={editingShift.hospitalUnit || ''}
                                onChange={e => setEditingShift({...editingShift, hospitalUnit: e.target.value as HospitalUnit})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                            >
                                <option value="Pediatría">Pediatría</option>
                                <option value="Medicina Hombres">Medicina Hombres</option>
                                <option value="Medicina Mujeres">Medicina Mujeres</option>
                                <option value="Urgencias">Urgencias</option>
                                <option value="Geriatría">Geriatría</option>
                                <option value="Oncología">Oncología</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-b-xl flex justify-between items-center">
                        {editingShift.id ? (
                            <button type="button" onClick={handleDeleteShift} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium">
                                <Trash2 size={16} /> Eliminar
                            </button>
                        ) : <div></div>}
                        <div className="flex gap-2">
                             <button type="button" onClick={() => setShiftModalOpen(false)} className="px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-bold shadow-md">
                                {editingShift.id ? 'Guardar' : 'Crear Turno'}
                            </button>
                        </div>
                    </div>
                </form>
              </div>
          </div>
      )}

      {/* Calendar Tab Logic (Sin cambios necesarios aquí) */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                    <button onClick={handlePrevWeek} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                        <CalendarIcon size={20} className="text-emerald-600" />
                        <span>Semana del {currentWeek[0].toLocaleDateString()}</span>
                    </div>
                    <button onClick={handleNextWeek} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight /></button>
                </div>
                <button onClick={() => handleOpenAddShift()} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                    <Plus size={16} /> Asignar Turno
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {currentWeek.map((day, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-gray-200 min-h-[300px] flex flex-col group/day relative">
                         <div className={`text-center py-2 border-b border-gray-100 font-semibold text-sm ${idx === 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-50 text-gray-700'}`}>
                            {day.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                        </div>
                        <button onClick={() => handleOpenAddShift(day.toISOString().split('T')[0])} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-emerald-600 opacity-0 group-hover/day:opacity-100 transition z-10"><Plus size={14} /></button>
                        <div className="p-2 flex-1 space-y-2">
                            {shifts.filter(s => s.date === day.toISOString().split('T')[0]).map(shift => {
                                const vol = volunteers.find(v => v.id === shift.volunteerId);
                                return (
                                    <div key={shift.id} onClick={() => handleEditShift(shift)} className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded text-xs shadow-sm hover:bg-blue-100 transition cursor-pointer">
                                        <div className="font-bold text-gray-800 truncate">{vol?.fullName.split(' ')[0]}</div>
                                        <div className="text-blue-700 truncate font-medium">{shift.hospitalUnit}</div>
                                        <div className="text-gray-400 text-[10px] mt-1">{shift.startTime} - {shift.endTime}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};
