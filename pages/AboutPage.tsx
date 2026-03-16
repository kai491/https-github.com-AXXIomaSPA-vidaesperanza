
import React from 'react';
import { useContent } from '../context/ContentContext';
import { StandardHero } from '../components/StandardHero';

export const AboutPage: React.FC = () => {
  const { aboutContent, pageBanners } = useContent();
  const banner = pageBanners.find(b => b.pageId === 'about');

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Centralized Standard Hero */}
      <StandardHero 
        title={banner?.title || 'Quiénes Somos'} 
        subtitle={banner?.subtitle || 'Nuestra historia y valores.'} 
        imageUrl={banner?.imageUrl}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-gray-100">
          
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-emerald-50 pb-4">Nuestra Historia</h2>
            <div className="prose prose-lg text-gray-600 space-y-4 whitespace-pre-line leading-relaxed">
              <p>{aboutContent.history}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100/50">
              <h3 className="text-xl font-bold text-emerald-900 mb-4 uppercase tracking-wider text-sm">Misión</h3>
              <p className="text-gray-700 whitespace-pre-line italic leading-relaxed">
                "{aboutContent.mission}"
              </p>
            </div>
            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100/50">
              <h3 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wider text-sm">Visión</h3>
              <p className="text-gray-700 whitespace-pre-line italic leading-relaxed">
                "{aboutContent.vision}"
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-emerald-50 pb-4">Nuestros Valores Fundamentales</h2>
            <ul className="grid sm:grid-cols-2 gap-6">
              {[
                { label: 'Humanidad', desc: 'Ponemos a la persona en el centro.' },
                { label: 'Solidaridad', desc: 'Compartimos nuestros recursos y tiempo.' },
                { label: 'Respeto', desc: 'Valoramos la dignidad de cada paciente.' },
                { label: 'Compromiso', desc: 'Asumimos nuestra labor con constancia.' }
              ].map((val, idx) => (
                <li key={idx} className="flex items-start bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-4 font-bold">✓</span>
                    <span className="text-gray-700"><strong>{val.label}:</strong> {val.desc}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
