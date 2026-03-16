import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Smile, Users, BookOpen, Hand, Star, Sun, ChevronLeft, ChevronRight, ShieldCheck, HandHeart, MessageCircleHeart } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useBlog } from '../context/BlogContext';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Heart: <Heart className="text-white" size={24} />,
  Users: <Users className="text-white" size={24} />,
  Smile: <Smile className="text-white" size={24} />,
  Hand: <Hand className="text-white" size={24} />,
  Star: <Star className="text-white" size={24} />,
  Sun: <Sun className="text-white" size={24} />
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { homeContent, services, heroSlides } = useContent();
  const { getPublishedPosts } = useBlog();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const recentPosts = getPublishedPosts().slice(0, 5);
  const activeSlides = heroSlides ? heroSlides.filter(s => s.isActive) : [];

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const handlePostClick = (id: number) => onNavigate('blog-post', { id });

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

  return (
    <div className="flex flex-col font-sans text-gray-800">
      
      {/* 1. HERO SLIDER REPAIRED */}
      <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-gray-900">
        {activeSlides.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-900 text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Vida y Esperanza</h1>
                    <p className="text-xl opacity-60">Acompañando con dignidad y compasión.</p>
                </div>
            </div>
        ) : (
            activeSlides.map((slide, index) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className="absolute inset-0 bg-black">
                        {slide.mediaType === 'video' ? (
                            <video className="w-full h-full object-cover opacity-60" autoPlay loop muted playsInline>
                                <source src={slide.mediaUrl} type="video/mp4" />
                            </video>
                        ) : (
                            <img src={slide.mediaUrl} alt={slide.title} className="w-full h-full object-cover opacity-70" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    <div className="relative z-20 container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center">
                        <div className={`max-w-4xl transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <span className="inline-block py-1 px-4 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                                Voluntariado Hospitalario La Serena
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                                {slide.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl font-light leading-relaxed">
                                {slide.subtitle}
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                {slide.buttons && slide.buttons.filter(btn => btn.label).map((btn, btnIdx) => (
                                    <button
                                        key={btnIdx}
                                        onClick={() => onNavigate(btn.link)}
                                        className={`inline-flex items-center justify-center px-8 py-4 text-sm font-bold rounded-xl transition-all transform hover:-translate-y-1 ${
                                            btn.style === 'primary' 
                                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' 
                                            : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30'
                                        }`}
                                    >
                                        {btn.label}
                                        {btn.style === 'primary' && <ArrowRight className="ml-2 h-4 w-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))
        )}

        {/* Improved Controls */}
        {activeSlides.length > 1 && (
            <div className="absolute bottom-10 right-10 z-30 flex gap-4">
                <button onClick={prevSlide} className="p-4 text-white/70 hover:text-white border border-white/20 hover:bg-white/10 rounded-full transition-all backdrop-blur-md">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} className="p-4 text-white/70 hover:text-white border border-white/20 hover:bg-white/10 rounded-full transition-all backdrop-blur-md">
                    <ChevronRight size={24} />
                </button>
            </div>
        )}
      </div>

      {/* 2. INTRO SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">Propósito</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-6">{homeContent.introTitle}</h2>
            <p className="text-xl text-gray-600 leading-relaxed font-light italic">
              "{homeContent.introText}"
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <div className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-emerald-600 group-hover:rotate-6 transition-all">
                    <ShieldCheck className="text-emerald-600 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Dignidad</h3>
                <p className="text-gray-500 leading-relaxed">Defendemos el trato respetuoso para cada paciente, sin excepciones.</p>
             </div>
             <div className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-blue-600 group-hover:-rotate-6 transition-all">
                    <HandHeart className="text-blue-600 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Presencia</h3>
                <p className="text-gray-500 leading-relaxed">Sostenemos la mano y ofrecemos escucha activa cuando el silencio pesa.</p>
             </div>
             <div className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-purple-600 group-hover:rotate-6 transition-all">
                    <MessageCircleHeart className="text-purple-600 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Confianza</h3>
                <p className="text-gray-500 leading-relaxed">Somos el vínculo humano entre el equipo clínico y las familias.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. LATEST NEWS */}
      {recentPosts.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Noticias y Actualidad</h2>
                </div>
                <button onClick={() => onNavigate('blog')} className="text-emerald-600 font-bold hover:underline flex items-center gap-2">
                    Ver todas <ArrowRight size={18}/>
                </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {recentPosts.slice(0, 3).map(post => (
                    <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300" onClick={() => handlePostClick(post.id)}>
                        <img src={post.coverImage} alt={post.title} className="w-full h-56 object-cover"/>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{post.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                            <span className="text-emerald-600 font-bold text-sm">Leer más &rarr;</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. SERVICES */}
      <section className="py-24 bg-emerald-950 text-white relative">
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-16">Nuestras Áreas de Acción</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(service => (
              <div key={service.id} className="bg-white/5 backdrop-blur-lg rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-all text-center group">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  {ICON_MAP[service.icon] || <Heart className="text-white" size={24} />}
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-emerald-100/60 leading-relaxed text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};