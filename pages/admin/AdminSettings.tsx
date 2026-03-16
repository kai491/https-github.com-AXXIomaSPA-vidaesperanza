
import React, { useState, useEffect } from 'react';
import { Database, Save, RefreshCw, AlertCircle, Trash2, Key, Globe, ShieldCheck, XCircle, Loader2 } from 'lucide-react';
import { getStoredCredentials, setStoredCredentials, clearCredentials, isUsingEnvCredentials } from '../../services/supabaseClient';
import { db } from '../../services/db';

interface AdminSettingsProps {
    onBack: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onBack }) => {
    const creds = getStoredCredentials();
    const [url, setUrl] = useState(creds.url || '');
    const [key, setKey] = useState(creds.key || '');
    const [isSaved, setIsSaved] = useState(false);
    
    // Health Check State
    const [healthStatus, setHealthStatus] = useState<'checking' | 'ok' | 'error'>('checking');
    const [healthError, setHealthError] = useState<string | null>(null);

    const checkDB = async () => {
        setHealthStatus('checking');
        const status = await db.system.checkHealth();
        if (status.ok) {
            setHealthStatus('ok');
            setHealthError(null);
        } else {
            setHealthStatus('error');
            setHealthError(status.error || 'Error desconocido');
        }
    };

    useEffect(() => {
        checkDB();
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setStoredCredentials(url, key);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleReset = () => {
        if(window.confirm('¿Estás seguro de que deseas desconectar la base de datos? Se te pedirá configurar las credenciales nuevamente.')) {
            clearCredentials();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Ajustes del Sistema</h1>
                        <p className="text-gray-500">Configuración técnica de la plataforma y base de datos.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Status Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Estado Conexión</h2>
                            
                            {healthStatus === 'checking' && (
                                <div className="flex items-center gap-3 text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <Loader2 size={20} className="animate-spin" />
                                    <span className="text-sm font-bold">Verificando...</span>
                                </div>
                            )}

                            {healthStatus === 'ok' && (
                                <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100 animate-pulse">
                                    <ShieldCheck size={20} />
                                    <span className="text-sm font-bold">Conexión Activa</span>
                                </div>
                            )}

                            {healthStatus === 'error' && (
                                <div className="flex flex-col gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                    <div className="flex items-center gap-3">
                                        <XCircle size={20} />
                                        <span className="text-sm font-bold">Error de Conexión</span>
                                    </div>
                                    <p className="text-[10px] text-red-800 font-mono mt-1 break-words">
                                        {healthError}
                                    </p>
                                </div>
                            )}

                            <button 
                                onClick={checkDB}
                                className="mt-4 w-full text-xs text-gray-400 hover:text-brand-600 flex items-center justify-center gap-1 transition"
                            >
                                <RefreshCw size={12} /> Re-verificar ahora
                            </button>

                            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                                La aplicación está utilizando almacenamiento remoto para todos los datos de voluntarios, campañas y contenidos.
                            </p>
                        </div>

                        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                            <h2 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                                <AlertCircle size={16} /> Zona de Peligro
                            </h2>
                            <p className="text-xs text-red-700 mb-4 leading-relaxed">
                                Si desconectas la base de datos, la aplicación dejará de funcionar hasta que ingreses nuevas credenciales válidas.
                            </p>
                            <button 
                                onClick={handleReset}
                                disabled={isUsingEnvCredentials}
                                className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${isUsingEnvCredentials ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
                            >
                                <Trash2 size={14} /> Desconectar Supabase
                            </button>
                        </div>
                    </div>

                    {/* Configuration Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                                <Database size={18} className="text-emerald-600" />
                                <h2 className="font-bold text-gray-800">Credenciales de Supabase</h2>
                            </div>
                            
                            <form onSubmit={handleSave} className="p-8 space-y-6">
                                {isUsingEnvCredentials ? (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex gap-3 mb-2">
                                        <ShieldCheck className="text-emerald-600 flex-shrink-0" size={20} />
                                        <p className="text-xs text-emerald-800 leading-relaxed">
                                            Las credenciales están configuradas de forma permanente mediante <strong>Variables de Entorno</strong>. No es necesario ni posible modificarlas desde esta interfaz.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mb-2">
                                        <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                                        <p className="text-xs text-blue-800 leading-relaxed">
                                            Estos cambios reiniciarán la aplicación automáticamente para aplicar la nueva configuración de conexión.
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                        <Globe size={14} /> Project URL
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={url}
                                        onChange={e => setUrl(e.target.value)}
                                        placeholder="https://xyz...supabase.co"
                                        disabled={isUsingEnvCredentials}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono disabled:bg-gray-100 disabled:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                        <Key size={14} /> API Key (anon/public)
                                    </label>
                                    <input 
                                        type="password" 
                                        required
                                        value={key}
                                        onChange={e => setKey(e.target.value)}
                                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                                        disabled={isUsingEnvCredentials}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono disabled:bg-gray-100 disabled:text-gray-500"
                                    />
                                </div>

                                {!isUsingEnvCredentials && (
                                    <div className="pt-4 flex items-center justify-between">
                                        <button 
                                            type="button"
                                            onClick={() => { setUrl(creds.url || ''); setKey(creds.key || ''); }}
                                            className="text-sm font-medium text-gray-500 hover:text-gray-800 flex items-center gap-1 transition"
                                        >
                                            <RefreshCw size={14} /> Descartar Cambios
                                        </button>
                                        
                                        <button 
                                            type="submit" 
                                            className={`bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-emerald-700 transition flex items-center gap-2 ${isSaved ? 'bg-emerald-500' : ''}`}
                                        >
                                            <Save size={18} /> {isSaved ? '¡Guardado!' : 'Actualizar Conexión'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
