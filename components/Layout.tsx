
import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Users, Calendar, BarChart3, Home, LogIn, LogOut, BookOpen, User as UserIcon, Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { useVolunteer } from '../context/VolunteerContext';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInferenceBanner, setShowInferenceBanner] = useState(false);
  const { branding, footerContent, socialContent } = useContent();
  const { user, isAuthenticated, logout } = useAuth();
  const { volunteers } = useVolunteer();

  // Logic to resolve profile image
  const getUserAvatar = () => {
    if (!user) return null;
    
    // If volunteer, try to find their uploaded image
    if (user.role === UserRole.VOLUNTEER && user.volunteerId) {
        const vol = volunteers.find(v => v.id === user.volunteerId);
        return vol?.profileImage || null;
    }
    return null; // Admins don't have profile images in this system yet
  };

  const userAvatar = getUserAvatar();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (currentPage === 'volunteer') {
      timer = setTimeout(() => {
        setShowInferenceBanner(true);
      }, 8000);
    } else {
      setShowInferenceBanner(false);
    }
    return () => clearTimeout(timer);
  }, [currentPage]);

  const navLinks = [
    { id: 'home', label: 'Inicio', icon: <Home size={18} /> },
    { id: 'about', label: 'Quiénes Somos', icon: <Users size={18} /> },
    { id: 'blog', label: 'Noticias', icon: <BookOpen size={18} /> },
    { id: 'volunteer', label: 'Ser Voluntaria', icon: <Heart size={18} /> },
    { id: 'donate', label: 'Cómo Ayudar', icon: <Heart size={18} /> },
  ];

  // Only show Admin link if logged in as Admin/Collab, otherwise logic handles redirection via Avatar
  if (isAuthenticated && user?.role !== UserRole.VOLUNTEER) {
      navLinks.push({ id: 'dashboard', label: 'Admin', icon: <BarChart3 size={18} /> });
  }

  const handleProfileClick = () => {
      if (!isAuthenticated) {
          onNavigate('login');
      } else if (user?.role === UserRole.VOLUNTEER) {
          onNavigate('portal');
      } else {
          onNavigate('dashboard');
      }
  };

  const handleLogout = () => {
      logout();
      onNavigate('home');
      setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      
      {/* Top Header (Social Links) */}
      {socialContent.isVisible && (
          <div className="bg-brand-900 text-white py-2 text-xs border-b border-brand-800">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                  <span className="font-medium hidden sm:block">{socialContent.topbarText || 'Síguenos en nuestras redes sociales'}</span>
                  <div className="flex gap-4 items-center ml-auto sm:ml-0 w-full sm:w-auto justify-end">
                      {socialContent.facebookUrl && (
                          <a href={socialContent.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition flex items-center gap-1">
                              <Facebook size={14} /> <span className="hidden md:inline">Facebook</span>
                          </a>
                      )}
                      {socialContent.instagramUrl && (
                          <a href={socialContent.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition flex items-center gap-1">
                              <Instagram size={14} /> <span className="hidden md:inline">Instagram</span>
                          </a>
                      )}
                      {socialContent.linkedinUrl && (
                          <a href={socialContent.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition flex items-center gap-1">
                              <Linkedin size={14} /> <span className="hidden md:inline">LinkedIn</span>
                          </a>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-brand-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer gap-3" 
              onClick={() => onNavigate('home')}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-brand-100">
                <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-800 leading-none">Vida y Esperanza</h1>
                <p className="text-xs text-brand-600 font-medium">La Serena</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
                <nav className="flex space-x-6">
                {navLinks.map((link) => (
                    <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                        currentPage === link.id || (currentPage === 'blog-post' && link.id === 'blog')
                        ? 'text-brand-600 border-b-2 border-brand-600 pb-1'
                        : 'text-gray-500 hover:text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-md'
                    }`}
                    >
                    {link.icon}
                    <span>{link.label}</span>
                    </button>
                ))}
                </nav>

                {/* Desktop Profile Badge */}
                {isAuthenticated ? (
                    <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                        <div 
                            onClick={handleProfileClick}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-brand-200 group-hover:border-brand-500 transition shadow-sm bg-brand-50 flex items-center justify-center text-brand-700 font-bold">
                                {userAvatar ? (
                                    <img src={userAvatar} alt="Perfil" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user?.name.charAt(0)}</span>
                                )}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-xs font-bold text-gray-700 group-hover:text-brand-600 truncate max-w-[100px]">{user?.name.split(' ')[0]}</span>
                                <span className="text-xs text-gray-400 uppercase">{user?.role === 'VOLUNTEER' ? 'Voluntaria' : 'Admin'}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => onNavigate('login')}
                        className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-800 pl-4 border-l border-gray-200"
                    >
                        <LogIn size={18} /> Ingresar
                    </button>
                )}
            </div>

            {/* Mobile Menu Button & Profile */}
            <div className="md:hidden flex items-center gap-4">
              
              {/* Mobile Profile Badge (Show next to menu button) */}
              {isAuthenticated && (
                  <div 
                    onClick={handleProfileClick}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-brand-200 cursor-pointer bg-brand-50 flex items-center justify-center text-brand-700 font-bold shadow-sm"
                  >
                        {userAvatar ? (
                            <img src={userAvatar} alt="Perfil" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.name.charAt(0)}</span>
                        )}
                  </div>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-brand-600 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-brand-100 py-2">
            <div className="container mx-auto px-4 space-y-2">
              {isAuthenticated && (
                  <div className="px-4 py-3 bg-brand-50 rounded-lg mb-2 flex items-center justify-between" onClick={() => { handleProfileClick(); setIsMenuOpen(false); }}>
                       <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
                                {userAvatar ? (
                                    <img src={userAvatar} alt="Perfil" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user?.name.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Hola, {user?.name}</p>
                                <p className="text-xs text-brand-600 font-medium">Ir a mi perfil</p>
                            </div>
                       </div>
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                        className="p-2 text-red-600 bg-white rounded-xl shadow-sm border border-red-100"
                       >
                           <LogOut size={20} />
                       </button>
                  </div>
              )}

              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium ${
                    currentPage === link.id
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                </button>
              ))}

              {!isAuthenticated && (
                  <button
                    onClick={() => {
                        onNavigate('login');
                        setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                  >
                      <div className="flex items-center space-x-3">
                          <LogIn size={18} />
                          <span>Iniciar Sesión</span>
                      </div>
                  </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Inference Engine Banner (Simulation) */}
      {showInferenceBanner && (
        <div className="fixed bottom-4 right-4 max-w-sm bg-white border-l-4 border-brand-500 shadow-xl rounded-r-lg p-4 z-50 animate-bounce-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Heart className="h-6 w-6 text-brand-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-brand-800">¿Te gustaría ser parte?</h3>
              <div className="mt-1 text-sm text-gray-600">
                Notamos tu interés en el voluntariado. ¡Tu tiempo puede cambiar vidas hoy!
              </div>
              <div className="mt-3">
                <button 
                  onClick={() => onNavigate('volunteer')}
                  className="text-sm font-medium text-brand-600 hover:text-brand-500"
                >
                  Inscribirme ahora &rarr;
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowInferenceBanner(false)}
              className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-500 bg-white">
                     <img src={branding.logoUrl} alt="Logo Footer" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold text-white">Vida y Esperanza</span>
              </div>
              <p className="text-brand-200 text-sm leading-relaxed mb-4">
                "Juntas damos vida y acompañamos la esperanza". <br/>
                Voluntarias hospitalarias transformando el cuidado en La Serena.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contacto</h3>
              <ul className="space-y-2 text-brand-200 text-sm">
                <li>Calle Anfión Muñoz #751, La Serena</li>
                <li>Hospital de La Serena - Unidad de Voluntariado</li>
                <li>+56 51 XXX XXXX</li>
                <li>contacto@vidayesperanzalaserena.cl</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-brand-200 text-sm">
                <li><button onClick={() => onNavigate('volunteer')} className="hover:text-white transition">Quiero ser voluntaria</button></li>
                <li><button onClick={() => onNavigate('donate')} className="hover:text-white transition">Hacer una donación</button></li>
                <li><button onClick={() => onNavigate('about')} className="hover:text-white transition">Nuestra Historia</button></li>
              </ul>
            </div>
            {/* Government Funding Section - DYNAMIC */}
            <div>
                <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm border-b border-brand-700 pb-2 inline-block">
                    Financiamiento
                </h3>
                <div className="bg-brand-800/50 p-4 rounded-xl border border-brand-700/50">
                    <p className="text-white text-[10px] font-bold leading-relaxed mb-3 uppercase tracking-wide">
                        {footerContent.legendText}
                    </p>
                    <div className="flex items-center gap-3">
                        {footerContent.goreLogo && (
                            <div className="bg-white p-2 rounded-lg h-16 w-auto flex items-center justify-center shadow-sm">
                                <img 
                                    src={footerContent.goreLogo} 
                                    alt="GORE Coquimbo" 
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                        )}
                        {footerContent.coreLogo && (
                            <div className="bg-white p-2 rounded-lg h-16 w-auto flex items-center justify-center shadow-sm">
                                <img 
                                    src={footerContent.coreLogo} 
                                    alt="CORE Coquimbo" 
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                        )}
                        {!footerContent.goreLogo && !footerContent.coreLogo && (
                            <span className="text-xs text-brand-300 italic">Logos no configurados</span>
                        )}
                    </div>
                </div>
            </div>
          </div>
          <div className="border-t border-brand-800 mt-8 pt-8 text-center text-xs text-brand-400">
            &copy; 2025 Corporación de Voluntariados "Vida y Esperanza". Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
