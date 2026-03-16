import React, { useState } from 'react';
import { Heart, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { branding } = useContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (success) {
      onLoginSuccess();
    } else {
      setError('Credenciales inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center cursor-pointer flex flex-col items-center" onClick={onNavigateHome}>
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl overflow-hidden border-4 border-brand-500">
           <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-white">Vida y Esperanza</h1>
        <p className="text-brand-200">Acceso Sistema</p>
      </div>

      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
          <Lock size={20} className="text-brand-600" /> Iniciar Sesión
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-gray-100"
              placeholder="admin / colab / vol"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-gray-100"
              placeholder="••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Ingresar'}
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-2">
          <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
             <span className="font-bold">Usuarios Demo:</span><br/>
             SuperAdmin: admin / admin<br/>
             Colaborador: colab / colab<br/>
             Voluntario: vol / vol
          </div>
          <button onClick={onNavigateHome} className="text-sm text-gray-500 hover:text-brand-600 underline block w-full mt-4">
            Volver al sitio público
          </button>
        </div>
      </div>
    </div>
  );
};