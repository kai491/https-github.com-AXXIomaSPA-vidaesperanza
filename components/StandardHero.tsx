
import React from 'react';

interface StandardHeroProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export const StandardHero: React.FC<StandardHeroProps> = ({ title, subtitle, imageUrl }) => {
  const defaultImage = "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1920&q=80";
  
  return (
    <div className="relative h-[400px] w-full bg-emerald-900 overflow-hidden flex items-center justify-center">
      {/* Background with parallax-like effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl || defaultImage} 
          alt={title} 
          className="w-full h-full object-cover opacity-30 transform scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent" />
      </div>

      {/* Decorative patterns */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center animate-fadeIn">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md">
          {title}
        </h1>
        <p className="text-xl text-emerald-100 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
          {subtitle}
        </p>
        <div className="w-20 h-1.5 bg-brand-500 mx-auto mt-8 rounded-full shadow-lg"></div>
      </div>
    </div>
  );
};
