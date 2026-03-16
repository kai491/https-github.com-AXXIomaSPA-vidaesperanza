
import React from 'react';
import { LayoutDashboard, Users, Megaphone, LogOut, FileText, Heart, Monitor, UserCircle, BookOpen, Layers, PlusSquare, Palette, Settings, Layout, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { UserRole } from '../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { logout, user, hasPermission } = useAuth();
  const { branding, footerContent, socialContent } = useContent();

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  // Menu items for Administration
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard General', icon: <LayoutDashboard size={20} />, roles: [UserRole.SUPERADMIN, UserRole.COLLABORATOR] },
    { id: 'admin-volunteers', label: 'Gestión Voluntarias', icon: <Users size={20} />, roles: [UserRole.SUPERADMIN, UserRole.COLLABORATOR] },
    { id: 'admin-campaigns', label: 'Campañas CRM', icon: <Megaphone size={20} />, roles: [UserRole.SUPERADMIN, UserRole.COLLABORATOR] },
    { id: 'admin-donations', label: 'Catálogo Ayudas', icon: <Heart size={20} />, roles: [UserRole.SUPERADMIN, UserRole.COLLABORATOR] },
    { id: 'admin-blog', label: 'Gestión Blog', icon: <BookOpen size={20} />, roles: [UserRole.SUPERADMIN, UserRole.COLLABORATOR] },
  ];

  // Menu items for CMS
  const cmsItems = [
    { id: 'admin-home', label: 'Editar Inicio', icon: <Monitor size={18} />, roles: [UserRole.SUPERADMIN] },
    { id: 'admin-banners', label: 'Diseño Banners', icon: <Layout size={18} />, roles: [UserRole.SUPERADMIN] },
    { id: 'admin-about', label: 'Editar Nosotros', icon: <FileText size={18} />, roles: [UserRole.SUPERADMIN] },
    { id: 'admin-services', label: 'Nuestro Aporte', icon: <Layers size={18} />, roles: [UserRole.SUPERADMIN, UserRole.COLLABORATOR] },
    { id: 'admin-custom-pages', label: 'Páginas Libres', icon: <PlusSquare size={18} />, roles: [UserRole.SUPERADMIN] },
    { id: 'admin-branding', label: 'Identidad Visual', icon: <Palette size={18} />, roles: [UserRole.SUPERADMIN] },
    { id: 'admin-settings', label: 'Ajustes de Sistema', icon: <Settings size={18} />, roles: [UserRole.SUPERADMIN] },
  ];

  const userRole = user?.role || UserRole.VOLUNTEER;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-900 text-white flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-brand-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-400 bg-white">
                <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
             </div>
             <h2 className="text-lg font-bold">Vida y Esperanza</h2>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-800 px-2 py-0.5 rounded text-brand-100">
                {userRole === UserRole.SUPERADMIN ? 'SuperAdmin' : 'Colaborador'}
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
          <div>
            <p className="text-brand-400 text-xs font-bold uppercase mb-4 px-3">Gestión</p>
            <ul className="space-y-1">
              {adminMenuItems.filter(item => item.roles.includes(userRole)).map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      currentPage === item.id ? 'bg-brand-800 text-white' : 'text-brand-100 hover:bg-brand-800/50'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-brand-400 text-xs font-bold uppercase mb-4 px-3">Contenidos Web</p>
            <ul className="space-y-1">
              {cmsItems.filter(item => item.roles.includes(userRole)).map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      currentPage === item.id ? 'bg-brand-800 text-white' : 'text-brand-100 hover:bg-brand-800/50'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-brand-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-brand-400 truncate">{user?.username}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-brand-950 hover:bg-brand-950/50 text-brand-200 py-2 rounded-lg transition text-sm"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header (Only visible on small screens) */}
      <div className="md:hidden fixed top-0 w-full bg-brand-900 text-white z-50 px-4 py-3 flex justify-between items-center">
        <div className="font-bold flex items-center gap-2">
            <Heart className="fill-white" size={20} /> Admin
        </div>
        <button onClick={handleLogout}><LogOut size={20} /></button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col min-h-screen">
        
        {/* Top Header (Social Links - Display only in Admin for preview/consistency as requested) */}
        {socialContent.isVisible && (
            <div className="bg-white border-b border-gray-200 py-2 px-8 text-xs flex justify-between items-center text-gray-500">
                <span className="font-medium flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Preview Topbar</span>
                    {socialContent.topbarText}
                </span>
                <div className="flex gap-4 items-center">
                    {socialContent.facebookUrl && <Facebook size={14} className="text-blue-600" />}
                    {socialContent.instagramUrl && <Instagram size={14} className="text-pink-600" />}
                    {socialContent.linkedinUrl && <Linkedin size={14} className="text-blue-700" />}
                </div>
            </div>
        )}

        <div className="flex-1 md:p-8 p-4 mt-12 md:mt-0">
            {children}
        </div>
        
        {/* Admin Footer / Disclaimer */}
        <footer className="mt-auto pt-6 pb-6 px-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left opacity-70 hover:opacity-100 transition-opacity bg-white/50">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide max-w-md">
                {footerContent.legendText}
            </p>
            <div className="flex gap-2">
                {footerContent.goreLogo && (
                    <img 
                        src={footerContent.goreLogo} 
                        alt="GORE" 
                        className="h-10 w-auto object-contain bg-white rounded p-1 shadow-sm" 
                    />
                )}
                {footerContent.coreLogo && (
                    <img 
                        src={footerContent.coreLogo} 
                        alt="CORE" 
                        className="h-10 w-auto object-contain bg-white rounded p-1 shadow-sm" 
                    />
                )}
            </div>
        </footer>
      </main>
    </div>
  );
};
