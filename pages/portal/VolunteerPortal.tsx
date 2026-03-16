
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useVolunteer } from '../../context/VolunteerContext';
import { LogOut, Calendar, Clock, User, Mail, Shield, Phone, Edit2, Save, X, Camera } from 'lucide-react';

interface VolunteerPortalProps {
  onNavigate: (page: string) => void;
}

export const VolunteerPortal: React.FC<VolunteerPortalProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { volunteers, getShiftsByVolunteer, updateVolunteerDetails } = useVolunteer();

  // Find the volunteer profile linked to the logged-in user
  const volunteerProfile = volunteers.find(v => v.id === user?.volunteerId);
  // Ensure shifts are dynamic based on current state
  const myShifts = user?.volunteerId ? getShiftsByVolunteer(user.volunteerId) : [];

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      phone: '',
      profileImage: ''
  });

  // Init form data when profile loads
  useEffect(() => {
    if (volunteerProfile) {
        setFormData({
            fullName: volunteerProfile.fullName,
            email: volunteerProfile.email,
            phone: volunteerProfile.phone,
            profileImage: volunteerProfile.profileImage || ''
        });
    }
  }, [volunteerProfile]);

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
      if (volunteerProfile) {
          updateVolunteerDetails(volunteerProfile.id, {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              profileImage: formData.profileImage
          });
          setIsEditing(false);
      }
  };

  if (!volunteerProfile) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Error de Perfil</h2>
                <p className="text-gray-600">No se encontró una ficha de voluntario asociada a tu usuario.</p>
                <button onClick={handleLogout} className="mt-4 text-emerald-600 hover:underline">Cerrar Sesión</button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-emerald-800">
                <Shield size={28} />
                <h1 className="text-2xl font-bold">Portal Voluntario</h1>
            </div>
            <button 
                onClick={handleLogout}
                className="flex md:hidden items-center gap-2 text-red-600 font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-red-50"
            >
                <LogOut size={18} /> Salir
            </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            
            {/* Profile Card (Editable) */}
            <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                    {/* Header Background */}
                    <div className="h-24 bg-gradient-to-r from-emerald-600 to-emerald-500"></div>
                    
                    {/* Avatar Logic */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white flex items-center justify-center">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-emerald-600">{formData.fullName.charAt(0)}</span>
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={24} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="pt-16 pb-6 px-6 text-center">
                        {!isEditing ? (
                            <>
                                <h2 className="text-xl font-bold text-gray-900">{volunteerProfile.fullName}</h2>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full mt-2 inline-block ${
                                    volunteerProfile.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {volunteerProfile.status}
                                </span>

                                <div className="mt-6 space-y-4 text-left">
                                     <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Establecimiento</span>
                                        <span className="text-sm font-medium text-gray-700 text-right">{volunteerProfile.establishment || '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Unidad</span>
                                        <span className="text-sm font-medium text-gray-700">{volunteerProfile.hospitalUnit || '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Grupo</span>
                                        <span className="text-sm font-medium text-gray-700">{volunteerProfile.group || '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Teléfono</span>
                                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            {volunteerProfile.phone}
                                        </span>
                                    </div>
                                     <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]" title={volunteerProfile.email}>
                                            {volunteerProfile.email}
                                        </span>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-lg flex items-center justify-between">
                                        <span className="text-xs font-bold text-emerald-800 uppercase">Horas Mes</span>
                                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                                            <Clock size={16} /> {volunteerProfile.hoursThisMonth}h
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-col gap-2">
                                     <button 
                                        onClick={() => setIsEditing(true)}
                                        className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                                    >
                                        <Edit2 size={16} /> Editar Mis Datos
                                     </button>
                                     <button 
                                        onClick={handleLogout}
                                        className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center justify-center gap-2 transition border border-red-100"
                                    >
                                        <LogOut size={16} /> Cerrar Sesión
                                     </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4 text-left mt-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        value={formData.fullName} 
                                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Teléfono</label>
                                    <input 
                                        type="text" 
                                        value={formData.phone} 
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        value={formData.email} 
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={handleSave}
                                        className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Guardar
                                    </button>
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Coordination Messages */}
                <div className="bg-white rounded-xl shadow-sm border border-l-4 border-l-blue-500 border-gray-200 p-6">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Mail size={20} className="text-blue-500" /> Mensajes de Coordinación
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-900">
                            <strong>Importante:</strong> Recordar uso de doble mascarilla en unidad de Geriatría esta semana por brote respiratorio.
                        </div>
                         <div className="p-3 border-b border-gray-100 text-sm text-gray-600">
                            Reunión de grupo mensual: Próximo Martes 18:00 hrs vía Zoom.
                        </div>
                    </div>
                </div>

                {/* Shifts Schedule */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Calendar size={20} className="text-emerald-600" /> Mis Turnos Próximos
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Sincronizado en tiempo real</span>
                    </div>
                    
                    {myShifts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            No tienes turnos programados próximamente.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {myShifts.map(shift => (
                                <div key={shift.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-emerald-200 transition group">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white border border-gray-200 rounded-lg p-2 text-center min-w-[60px] group-hover:border-emerald-300 transition-colors">
                                            <div className="text-xs text-gray-500 uppercase font-bold">{new Date(shift.date).toLocaleDateString('es-ES', {month:'short'})}</div>
                                            <div className="text-xl font-bold text-gray-800">{new Date(shift.date).getDate() + 1}</div> {/* Adjust for timezone if needed, usually simple Date handles it */}
                                        </div>
                                        <div>
                                            <div className="text-xs text-emerald-600 font-bold mb-0.5">{shift.establishment}</div>
                                            <p className="font-bold text-gray-800">{shift.hospitalUnit}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>{shift.startTime} - {shift.endTime}</span>
                                                {/* If location exists in profile, show hint */}
                                                {volunteerProfile.location && (
                                                    <span className="text-xs bg-gray-200 px-1.5 rounded">{volunteerProfile.location}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                        shift.status === 'Completado' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {shift.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};
