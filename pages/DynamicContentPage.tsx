
import React from 'react';
import { useContent } from '../context/ContentContext';
import { FileQuestion, ArrowLeft, Loader2 } from 'lucide-react';

interface DynamicContentPageProps {
  slug: string;
  onNavigateHome: () => void;
}

export const DynamicContentPage: React.FC<DynamicContentPageProps> = ({ slug, onNavigateHome }) => {
  const { getPageBySlug, loading } = useContent();
  const page = getPageBySlug(slug);

  // Si el sistema todavía está cargando datos de Supabase, mostramos el spinner
  if (loading) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
              <p className="text-gray-500 font-medium animate-pulse">Consultando base de datos...</p>
          </div>
      );
  }

  if (!page) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-gray-50 p-10 rounded-3xl border border-gray-100 shadow-sm animate-fadeIn">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileQuestion size={40} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Página no disponible</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
                El contenido solicitado para <span className="font-mono text-emerald-600 bg-emerald-50 px-2 rounded">/{slug}</span> no se encuentra en la base de datos activa.
            </p>
            <button 
                onClick={onNavigateHome}
                className="w-full bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition font-bold shadow-lg shadow-emerald-100"
            >
                Volver al Inicio
            </button>
        </div>
      </div>
    );
  }

  const createMarkup = (html: string) => {
    return { __html: html };
  };

  return (
    <div className="min-h-screen bg-white animate-fadeIn">
      {/* Header Dinámico */}
      <div className="bg-emerald-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{page.title}</h1>
            <div className="w-24 h-2 bg-emerald-500 mt-6 rounded-full shadow-lg"></div>
        </div>
      </div>

      {/* Cuerpo del Contenido */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
         <div 
            className="prose prose-emerald prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={createMarkup(page.content)}
        />
        
        <div className="mt-20 pt-10 border-t border-gray-100">
             <button 
                onClick={onNavigateHome}
                className="flex items-center text-emerald-600 font-bold hover:text-emerald-800 transition group"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
                Volver a la Página Principal
            </button>
        </div>
      </div>
    </div>
  );
};
