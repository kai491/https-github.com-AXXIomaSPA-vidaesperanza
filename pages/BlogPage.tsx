
import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Tag, FolderOpen, Search, ChevronRight } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useContent } from '../context/ContentContext';
import { StandardHero } from '../components/StandardHero';

interface BlogPageProps {
  onNavigatePost: (id: number) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigatePost }) => {
  const { categories, getPublishedPosts } = useBlog();
  const { pageBanners } = useContent();
  const [activeCategory, setActiveCategory] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  
  const banner = pageBanners.find(b => b.pageId === 'blog');
  const allPosts = getPublishedPosts(activeCategory);
  
  const filteredPosts = allPosts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <StandardHero 
        title={banner?.title || 'Blog y Noticias'} 
        subtitle={banner?.subtitle || 'Últimas novedades de nuestro voluntariado.'} 
        imageUrl={banner?.imageUrl}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* BARRA LATERAL (Categorías & Search) - Desktop First Sidebar */}
            <aside className="lg:col-span-3 space-y-6">
                {/* Search Box */}
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-emerald-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar artículos..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Categories Navigation */}
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FolderOpen size={16} className="text-emerald-500" /> Explorar Temas
                    </h3>
                    <nav className="space-y-1">
                        <button 
                            onClick={() => setActiveCategory(undefined)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                activeCategory === undefined ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-gray-600 hover:bg-emerald-50'
                            }`}
                        >
                            <span>Todos los Temas</span>
                            {activeCategory === undefined && <ChevronRight size={14}/>}
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                    activeCategory === cat.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-gray-600 hover:bg-emerald-50'
                                }`}
                            >
                                <span>{cat.name}</span>
                                {activeCategory === cat.id && <ChevronRight size={14}/>}
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* LISTADO DE POSTS */}
            <main className="lg:col-span-9">
                <div className="grid md:grid-cols-2 gap-8">
                    {filteredPosts.map(post => (
                        <article 
                            key={post.id} 
                            className="bg-white rounded-[40px] shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full group"
                        >
                            <div className="h-64 overflow-hidden relative cursor-pointer" onClick={() => onNavigatePost(post.id)}>
                                <img 
                                    src={post.coverImage || 'https://via.placeholder.com/600x400?text=Vida+y+Esperanza'} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                    <span className="bg-white/95 backdrop-blur-md text-emerald-900 text-[10px] font-extrabold px-4 py-2 rounded-2xl uppercase tracking-widest shadow-lg">
                                        {categories.find(c => c.id === post.categoryId)?.name || 'General'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 md:p-10 flex-1 flex flex-col">
                                <div className="flex items-center text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-6 gap-6">
                                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-emerald-500"/> {new Date(post.publishDate).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1.5"><User size={14} className="text-emerald-500"/> {post.author.split(' ')[0]}</span>
                                </div>
                                
                                <h2 
                                    className="text-2xl font-black text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors cursor-pointer leading-[1.2]"
                                    onClick={() => onNavigatePost(post.id)}
                                >
                                    {post.title}
                                </h2>
                                
                                <p className="text-gray-500 text-sm mb-10 line-clamp-3 flex-1 leading-relaxed font-medium">
                                    {post.excerpt}
                                </p>

                                <button 
                                    onClick={() => onNavigatePost(post.id)}
                                    className="mt-auto bg-gray-50 text-emerald-600 font-black text-xs uppercase tracking-widest py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-50 active:scale-95"
                                >
                                    Leer Artículo <ArrowRight size={18} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[40px] shadow-sm border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={32} className="text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No se encontraron artículos</h3>
                        <p className="text-gray-400 mt-2">Intenta con otra búsqueda o selecciona otra categoría.</p>
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
};
