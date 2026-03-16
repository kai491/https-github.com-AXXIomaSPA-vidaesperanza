
import React from 'react';
import { ArrowLeft, Calendar, User, Tag, Share2, MousePointer2 } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { BlogBlock } from '../types';

interface BlogPostPageProps {
  postId: number;
  onBack: () => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId, onBack }) => {
  const { getPostById, categories } = useBlog();
  const post = getPostById(postId);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-4 font-bold">Publicación no encontrada.</p>
          <button onClick={onBack} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold">Volver al Blog</button>
        </div>
      </div>
    );
  }
  
  const blocks: BlogBlock[] = post.blocks || [];
  const category = categories.find(c => c.id === post.categoryId);

  return (
    <article className="bg-white min-h-screen font-sans">
      {/* Hero Header Mobile Optimized */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-emerald-950 overflow-hidden">
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent" />
        
        <div className="absolute top-6 left-6 z-20">
             <button 
                onClick={onBack} 
                className="flex items-center gap-2 text-white font-bold bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl hover:bg-white/20 transition active:scale-95"
            >
                <ArrowLeft size={20} /> <span className="hidden sm:inline">Volver</span>
            </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 text-white max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl">
                    {category?.name || 'General'}
                </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-8 drop-shadow-xl max-w-4xl">
                {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-emerald-100/80 font-medium">
                <span className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-800 rounded-full flex items-center justify-center font-bold">{post.author.charAt(0)}</div> {post.author}</span>
                <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl"><Calendar size={18}/> {new Date(post.publishDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
        </div>
      </div>

      {/* Content Renderer Mobile-First */}
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-24">
        
        {/* Render Blocks */}
        <div className="space-y-12">
            {blocks.map((block) => (
                <div key={block.id} className="animate-fadeIn">
                    {block.type === 'text' && (
                        <div 
                            className="prose prose-emerald prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed font-serif"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                    )}
                    {block.type === 'heading' && (
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                            {block.content}
                        </h2>
                    )}
                    {block.type === 'image' && (
                        <figure className="my-10">
                            <div className="rounded-[40px] overflow-hidden shadow-2xl border border-gray-100">
                                <img src={block.mediaUrl} alt={block.caption} className="w-full object-cover" />
                            </div>
                            {block.caption && (
                                <figcaption className="text-center text-sm text-gray-400 mt-4 font-medium italic">
                                    {block.caption}
                                </figcaption>
                            )}
                        </figure>
                    )}
                    {block.type === 'button' && (
                        <div className="flex justify-center my-8">
                            <a 
                                href={block.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-10 py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-3 ${
                                    block.buttonStyle === 'primary' 
                                    ? 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700' 
                                    : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                                }`}
                            >
                                <MousePointer2 size={20}/>
                                {block.content}
                            </a>
                        </div>
                    )}
                    {block.type === 'spacer' && <div className="h-12 w-full"></div>}
                </div>
            ))}
        </div>

        {/* Footer Meta & Share */}
        <div className="mt-24 pt-10 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-wrap gap-2">
                    <Tag className="text-emerald-500 mr-2" size={20} />
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer">
                            #{tag}
                        </span>
                    ))}
                </div>
                <button 
                    onClick={() => {
                        navigator.share?.({ title: post.title, url: window.location.href });
                    }}
                    className="flex items-center gap-3 bg-gray-50 text-gray-600 font-bold px-8 py-4 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                    <Share2 size={20} /> Compartir
                </button>
            </div>
        </div>
      </div>

      {/* Suggested Article Hint */}
      <div className="bg-emerald-50 py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-black text-emerald-900 mb-4">¿Te inspiró este artículo?</h3>
              <p className="text-emerald-800/70 mb-10 font-medium">Juntas damos vida y acompañamos la esperanza. Únete hoy mismo.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={() => window.location.hash = 'volunteer'} className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 transition">Quiero Ser Voluntaria</button>
                  <button onClick={() => window.location.hash = 'donate'} className="bg-white text-emerald-600 px-10 py-5 rounded-2xl font-black shadow-xl shadow-emerald-900/5 hover:bg-gray-50 transition border border-emerald-100">Hacer una Donación</button>
              </div>
          </div>
      </div>
    </article>
  );
};