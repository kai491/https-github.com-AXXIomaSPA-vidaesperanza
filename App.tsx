
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout'; 
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { DonationPage } from './pages/DonationPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { DynamicContentPage } from './pages/DynamicContentPage'; 
import { Dashboard } from './pages/Dashboard';
import { AdminHome } from './pages/admin/AdminHome';
import { AdminBanners } from './pages/admin/AdminBanners';
import { AdminAbout } from './pages/admin/AdminAbout';
import { AdminDonations } from './pages/admin/AdminDonations';
import { AdminCampaigns } from './pages/admin/AdminCampaigns';
import { AdminVolunteers } from './pages/admin/AdminVolunteers'; 
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminServices } from './pages/admin/AdminServices'; 
import { AdminCustomPages } from './pages/admin/AdminCustomPages'; 
import { AdminBranding } from './pages/admin/AdminBranding'; 
import { AdminSettings } from './pages/admin/AdminSettings';
import { VolunteerPortal } from './pages/portal/VolunteerPortal'; 
import { LoginPage } from './pages/LoginPage';
import { ContentProvider, useContent } from './context/ContentContext';
import { CRMProvider } from './context/CRMContext';
import { VolunteerProvider } from './context/VolunteerContext';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';

import { db } from './services/db';
import { Loader2 } from 'lucide-react';

const FullPageLoader: React.FC<{ title: string; subtitle: string; icon?: React.ReactNode }> = ({ title, subtitle, icon }) => (
    <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center text-white p-6 text-center animate-fadeIn">
        <div className="relative mb-6">
            {icon || <Loader2 className="animate-spin text-emerald-400" size={64} />}
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-emerald-200 max-w-sm mx-auto">{subtitle}</p>
    </div>
);

const AppRoutes: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentParams, setCurrentParams] = useState<any>(null);
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { loading: contentLoading } = useContent();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
          const [page, param] = hash.split('/');
          setCurrentPage(page);
          if (param) setCurrentParams({ slug: param, id: param }); 
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string, params?: any) => {
    let hash = page;
    if (params && params.slug) hash = `${page}/${params.slug}`;
    else if (params && params.id) hash = `${page}/${params.id}`; 
    
    window.location.hash = hash;
    setCurrentPage(page);
    setCurrentParams(params);
    window.scrollTo(0, 0);
  };

  const isAdminRoute = currentPage.startsWith('admin') || currentPage === 'dashboard';
  const isPortalRoute = currentPage === 'portal';

  useEffect(() => {
    if (isAdminRoute && isAuthenticated && user?.role === UserRole.VOLUNTEER) {
      navigate('portal');
    }
  }, [isAdminRoute, isAuthenticated, user]);

  if (authLoading || contentLoading) {
      return <FullPageLoader title="Sincronizando Vida y Esperanza" subtitle="Cargando datos de voluntariado, campañas y contenidos..." />;
  }

  if (currentPage === 'login') {
      return <LoginPage onLoginSuccess={() => {
        let currentUser: any = {};
        try {
            const storedUser = localStorage.getItem('auth_user');
            currentUser = storedUser ? JSON.parse(storedUser) : {};
            if (!currentUser) currentUser = {};
        } catch (e) {
            console.error("Error parsing auth_user", e);
        }
        navigate(currentUser?.role === UserRole.VOLUNTEER ? 'portal' : 'dashboard');
      }} onNavigateHome={() => navigate('home')} />;
  }

  if (isAdminRoute) {
    if (!isAuthenticated) return <LoginPage onLoginSuccess={() => navigate('dashboard')} onNavigateHome={() => navigate('home')} />;
    if (user?.role === UserRole.VOLUNTEER) return null;

    return (
      <AdminLayout currentPage={currentPage} onNavigate={navigate}>
        {currentPage === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {currentPage === 'admin-volunteers' && <AdminVolunteers />}
        {currentPage === 'admin-campaigns' && <AdminCampaigns onBack={() => navigate('dashboard')} />}
        {currentPage === 'admin-donations' && <AdminDonations onBack={() => navigate('dashboard')} />}
        {currentPage === 'admin-blog' && <AdminBlog onBack={() => navigate('dashboard')} />}
        {currentPage === 'admin-home' && <AdminHome onBack={() => navigate('dashboard')} />}
        {currentPage === 'admin-banners' && <AdminBanners onBack={() => navigate('dashboard')} />}
        {currentPage === 'admin-about' && <AdminAbout onBack={() => navigate('dashboard')} />}
        {currentPage === 'admin-services' && <AdminServices onBack={() => navigate('dashboard')} />}
        {currentPage === 'admin-custom-pages' && <AdminCustomPages onBack={() => navigate('dashboard')} onNavigateToPage={(slug) => navigate('page', { slug })} />}
        {currentPage === 'admin-branding' && <AdminBranding onBack={() => navigate('dashboard')} />}
        {currentPage === 'admin-settings' && <AdminSettings onBack={() => navigate('dashboard')} />}
      </AdminLayout>
    );
  }

  if (isPortalRoute) {
     if (!isAuthenticated) return <LoginPage onLoginSuccess={() => navigate('portal')} onNavigateHome={() => navigate('home')} />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={navigate}>
      {currentPage === 'home' && <HomePage onNavigate={navigate} />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'blog' && <BlogPage onNavigatePost={(id) => navigate('blog-post', { id })} />}
      {currentPage === 'blog-post' && currentParams?.id && <BlogPostPage postId={parseInt(currentParams.id)} onBack={() => navigate('blog')} />}
      {currentPage === 'volunteer' && <VolunteerPage />}
      {currentPage === 'donate' && <DonationPage />}
      {currentPage === 'page' && currentParams?.slug && <DynamicContentPage slug={currentParams.slug} onNavigateHome={() => navigate('home')} />}
      {currentPage === 'portal' && <VolunteerPortal onNavigate={navigate} />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ContentProvider>
        <CRMProvider>
          <VolunteerProvider>
            <BlogProvider>
                <AppRoutes />
            </BlogProvider>
          </VolunteerProvider>
        </CRMProvider>
      </ContentProvider>
    </AuthProvider>
  );
};

export default App;
