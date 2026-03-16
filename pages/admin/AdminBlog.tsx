
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Save, X, Image as ImageIcon, 
  Type, MousePointer2, MoveDown, MoveUp, Layers, Settings, Tag, 
  FolderPlus, ChevronRight, FileText, Layout, Upload, Check, Loader2, Bold, Italic, List
} from 'lucide-react';
import { useBlog } from '../../context/BlogContext';
import { BlogPost, BlogPostStatus, BlogBlock, BlogBlockType, BlogCategory, BlogSubCategory } from '../../types';
import { RichTextToolbar } from '../../components/admin/RichTextToolbar';

interface AdminBlogProps {
  onBack: () => void;
}

// --- SUB-COMPONENTE EDITOR DE BLOQUES ---
const BlockEditor: React.FC<{
    block: BlogBlock;
    index: number;
    total: number;
    onUpdate: (id: string, updates: Partial<BlogBlock>) => void;
    onMove: (index: number, direction: 'up' | 'down') => void;
    onDelete: (id: string) => void;
    onImageUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ block, index, total, onUpdate, onMove, onDelete, onImageUpload }) => {
    const textRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div className="relative group/block bg-gray-50/30 rounded-3xl -mx-6 border-2 border-transparent hover:border-emerald-100 hover:bg-emerald-50/20 transition-all">
            {/* Controles del Bloque (Siempre visibles) */}
            <div className="absolute -left-14 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-20 group-hover/block:opacity-100 transition-opacity">
                <button type="button" onClick={() => onMove(index, 'up')} disabled={index === 0} className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-emerald-600 shadow-md disabled:opacity-30"><MoveUp size={16}/></button>
                <button type="button" onClick={() => onDelete(block.id)} className="p-2 bg-white border border-gray-200 rounded-xl text-red-400 hover:bg-red-50 shadow-md"><Trash2 size={16}/></button>
                <button type="button" onClick={() => onMove(index, 'down')} disabled={index === total - 1} className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-emerald-600 shadow-md disabled:opacity-30"><MoveDown size={16}/></button>
            </div>

            <div className="p-6">
                {block.type === 'text' && (
                    <div>
                        <RichTextToolbar textareaRef={textRef} onContentChange={(newContent) => onUpdate(block.id, { content: newContent })} />
                        <textarea 
                            ref={textRef}
                            className="w-full bg-white border border-gray-200 rounded-b-lg p-4 outline-none text-gray-800 leading-relaxed font-serif text-lg focus:border-emerald-400"
                            value={block.content} onChange={e => onUpdate(block.id, { content: e.target.value })}
                            rows={6} placeholder="Escribe el cuerpo del texto aquí..."
                        />
                    </div>
                )}
                {block.type === 'heading' && (
                    <input 
                        className="w-full bg-transparent border-b-2 border-gray-200 focus:border-emerald-500 outline-none text-2xl font-black text-gray-900 py-2"
                        value={block.content} onChange={e => onUpdate(block.id, { content: e.target.value })}
                        placeholder="Subtítulo de sección..."
                    />
                )}
                {block.type === 'image' && (
                    <div className="space-y-4">
                        <div className="h-72 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 relative group/img-preview">
                            {block.mediaUrl ? (
                                <img src={block.mediaUrl} className="w-full h-full object-cover" />
                            ) : <div className="text-center text-gray-400"><ImageIcon size={48} className="mx-auto mb-2 opacity-20"/></div>}
                        </div>
                        <div className="space-y-3">
                            <div className="flex flex-col md:flex-row gap-3">
                                <label className="flex-1 bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3 cursor-pointer hover:border-emerald-400 transition shadow-sm">
                                    <Upload size={18} className="text-emerald-600"/>
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Subir desde PC</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => onImageUpload(block.id, e)} />
                                </label>
                            </div>
                            <input 
                                type="text" placeholder="Pie de foto descriptivo (opcional)..." value={block.caption} onChange={e => onUpdate(block.id, { caption: e.target.value })}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs italic"
                            />
                        </div>
                    </div>
                )}
                {block.type === 'button' && (
                    <div className="flex flex-col md:flex-row items-center gap-6 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                        <div className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${block.buttonStyle === 'primary' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'border-2 border-emerald-600 text-emerald-600'}`}>
                            {block.content || 'Vista Previa'}
                        </div>
                        <div className="flex-1 grid gap-3 w-full">
                            <input type="text" placeholder="Texto del botón (CTA)" value={block.content} onChange={e => onUpdate(block.id, { content: e.target.value })} className="px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                            <div className="flex gap-2">
                                <input type="text" placeholder="URL Destino" value={block.linkUrl} onChange={e => onUpdate(block.id, { linkUrl: e.target.value })} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono"/>
                                <select value={block.buttonStyle} onChange={e => onUpdate(block.id, { buttonStyle: e.target.value as any })} className="px-2 border border-gray-200 rounded-lg text-xs font-bold uppercase bg-white">
                                    <option value="primary">Sólido</option><option value="outline">Borde</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AdminBlog: React.FC<AdminBlogProps> = ({ onBack }) => {
  const { 
    posts, categories, subCategories, addPost, updatePost, deletePost, 
    addCategory, deleteCategory, addSubCategory, deleteSubCategory
  } = useBlog();
  
  const [activeView, setActiveView] = useState<'posts' | 'categories' | 'editor'>('posts');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string, onConfirm: () => void } | null>(null);

  const [postMeta, setPostMeta] = useState({ title: '', slug: '', excerpt: '', coverImage: '', author: 'Coordinación Vida y Esperanza', status: BlogPostStatus.DRAFT, categoryId: 0, subCategoryId: 0, tags: '' });
  const [blocks, setBlocks] = useState<BlogBlock[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newSubCat, setNewSubCat] = useState({ name: '', categoryId: 0 });

  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => { if (file.size > 2 * 1024 * 1024) { setAlertMessage("Imagen demasiado grande (máx 2MB)."); return reject("File too large"); } const reader = new FileReader(); reader.onload = () => resolve(reader.result as string); reader.onerror = reject; reader.readAsDataURL(file); });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) { try { const data = await processFile(e.target.files[0]); setPostMeta(prev => ({ ...prev, coverImage: data })); } catch (e) {} } };
  const handleBlockImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) { try { const data = await processFile(e.target.files[0]); updateBlock(id, { mediaUrl: data }); } catch (e) {} } };

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleDeletePost = (id: number) => {
      setConfirmDialog({
          message: "¿Seguro que deseas eliminar este artículo?",
          onConfirm: () => {
              deletePost(id);
              setConfirmDialog(null);
          }
      });
  };

  const handleDeleteCategory = (id: number) => {
      setConfirmDialog({
          message: "¿Seguro que deseas eliminar esta categoría? Todas sus subcategorías y los vínculos en los posts serán eliminados.",
          onConfirm: () => {
              deleteCategory(id);
              setConfirmDialog(null);
          }
      });
  };

  const handleDeleteSubCategory = (id: number) => {
      setConfirmDialog({
          message: "¿Seguro que deseas eliminar esta subcategoría?",
          onConfirm: () => {
              deleteSubCategory(id);
              setConfirmDialog(null);
          }
      });
  };

  const handleEditPost = (post: BlogPost) => {
    setPostMeta({ 
        title: post.title, 
        slug: post.slug, 
        excerpt: post.excerpt, 
        coverImage: post.coverImage, 
        author: post.author, 
        status: post.status, 
        categoryId: post.categoryId || 0, 
        subCategoryId: post.subCategoryId || 0, 
        tags: post.tags.join(', ') 
    });
    setBlocks(post.blocks || [{ id: Date.now().toString(), type: 'text', content: '' }]);
    setEditingPostId(post.id); 
    setActiveView('editor');
  };

  const handleCreatePost = () => {
    setPostMeta({ title: '', slug: '', excerpt: '', coverImage: '', author: 'Coordinación Vida y Esperanza', status: BlogPostStatus.DRAFT, categoryId: 0, subCategoryId: 0, tags: '' });
    setBlocks([{ id: Date.now().toString(), type: 'text', content: '' }]);
    setEditingPostId(null); setActiveView('editor');
  };

  const addBlock = (type: BlogBlockType) => setBlocks([...blocks, { id: Math.random().toString(36).substr(2, 9), type, content: '', mediaUrl: '', caption: '', linkUrl: '', buttonStyle: 'primary' }]);
  const updateBlock = (id: string, updates: Partial<BlogBlock>) => setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  const deleteBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks]; const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newBlocks.length) return;
    [newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]]; setBlocks(newBlocks);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!postMeta.title) return setAlertMessage("El título es obligatorio");
    
    setIsSaving(true);
    
    const postData = { 
        title: postMeta.title, 
        slug: postMeta.slug || generateSlug(postMeta.title), 
        excerpt: postMeta.excerpt, 
        coverImage: postMeta.coverImage, 
        author: postMeta.author, 
        status: postMeta.status, 
        tags: postMeta.tags.split(',').map(t => t.trim()).filter(Boolean), 
        categoryId: postMeta.categoryId || undefined, 
        subCategoryId: postMeta.subCategoryId || undefined 
    };

    try { 
        if (editingPostId) { await updatePost(editingPostId, postData, blocks); } 
        else { await addPost(postData, blocks); } 
        setActiveView('posts'); 
    } 
    catch (err: any) { setAlertMessage("Error al guardar: " + (err.message || err)); } 
    finally { setIsSaving(false); }
  };

  const handleAddCategory = async () => { 
      if (!newCatName) return; 
      try { 
          await addCategory({ name: newCatName, slug: generateSlug(newCatName) }); 
          setNewCatName(''); 
      } catch (e: any) { 
          console.error(e);
          const msg = e.message || (typeof e === 'object' ? JSON.stringify(e) : String(e));
          setAlertMessage(`Error al crear categoría: ${msg}`); 
      } 
  };
  
  const handleAddSubCategory = async () => { 
      if (!newSubCat.name || !newSubCat.categoryId) return; 
      try { 
          await addSubCategory({ name: newSubCat.name, slug: generateSlug(newSubCat.name), categoryId: newSubCat.categoryId }); 
          setNewSubCat({ name: '', categoryId: 0 }); 
      } catch (e: any) { 
          console.error(e);
          const msg = e.message || (typeof e === 'object' ? JSON.stringify(e) : String(e));
          setAlertMessage(`Error al crear subcategoría: ${msg}`); 
      } 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-emerald-900 text-white p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-white/10"><Layout className="text-emerald-400" /><h1 className="font-bold text-lg">Panel de Blog</h1></div>
        <nav className="space-y-1">
            <button onClick={() => setActiveView('posts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeView === 'posts' ? 'bg-white/10 text-white' : 'text-emerald-100 hover:bg-white/5'}`}><FileText size={18} /> Entradas</button>
            <button onClick={() => setActiveView('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeView === 'categories' ? 'bg-white/10 text-white' : 'text-emerald-100 hover:bg-white/5'}`}><Layers size={18} /> Categorías</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        {alertMessage && (
            <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center gap-2 shadow-lg">
                <span>{alertMessage}</span>
                <button onClick={() => setAlertMessage(null)} className="text-red-700 hover:text-red-900"><X size={16} /></button>
            </div>
        )}
        {confirmDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Acción</h3>
                    <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setConfirmDialog(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">Cancelar</button>
                        <button onClick={confirmDialog.onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Confirmar</button>
                    </div>
                </div>
            </div>
        )}
        {activeView === 'posts' && (
            <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-10">
                    <div><h2 className="text-3xl font-extrabold text-gray-900">Entradas del Blog</h2><p className="text-gray-500">Gestiona todos los artículos y noticias.</p></div>
                    <button onClick={handleCreatePost} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition"><Plus size={20} /> Crear Nueva Entrada</button>
                </div>
                <div className="grid gap-4">{posts.map(post => (<div key={post.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-lg transition group"><div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0"><img src={post.coverImage || 'https://i.imgur.com/k2yKx60.jpg'} className="w-full h-full object-cover" /></div><div className="flex-1"><div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-gray-900 group-hover:text-emerald-600">{post.title}</h3><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${post.status === 'Publicado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>{post.status}</span></div><div className="flex items-center gap-4 text-xs text-gray-400"><span className="flex items-center gap-1"><FolderPlus size={12}/> {categories.find(c => c.id === post.categoryId)?.name || 'S/C'}</span><span>{new Date(post.publishDate).toLocaleDateString()}</span></div></div><div className="flex items-center gap-2 opacity-0 group-hover:opacity-100"><button onClick={() => handleEditPost(post)} className="p-2 bg-gray-50 text-emerald-600 rounded-xl hover:bg-emerald-100"><Edit2 size={18}/></button><button onClick={() => handleDeletePost(post.id)} className="p-2 bg-gray-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 size={18}/></button></div></div>))}{posts.length === 0 && <p className="text-center py-10 text-gray-400">No hay entradas aún.</p>}</div>
            </div>
        )}
        {activeView === 'categories' && (
            <div className="animate-fadeIn">
                 <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Categorías y Subcategorías</h2><p className="text-gray-500 mb-10">Organiza tus contenidos.</p>
                 <div className="grid lg:grid-cols-2 gap-10">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg"><Layers size={20} className="text-emerald-600"/> Nueva Categoría</h3><div className="space-y-4"><input type="text" placeholder="Nombre (ej: Salud Hospitalaria)" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" /><button onClick={handleAddCategory} className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100">Crear Categoría</button></div><div className="mt-8 space-y-3"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Existentes</p>{categories.map(cat => (<div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group"><div><span className="font-bold text-gray-700">{cat.name}</span><p className="text-[10px] text-gray-400 font-mono">/{cat.slug}</p></div><button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 opacity-0 group-hover:opacity-100"><X size={16}/></button></div>))}</div></div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg"><FolderPlus size={20} className="text-emerald-600"/> Nueva Subcategoría</h3><div className="space-y-4"><select value={newSubCat.categoryId} onChange={e => setNewSubCat({...newSubCat, categoryId: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-sm focus:ring-2 focus:ring-emerald-500"><option value={0}>Selecciona Categoría Padre</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input type="text" placeholder="Nombre (ej: Pediatría)" value={newSubCat.name} onChange={e => setNewSubCat({...newSubCat, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" /><button onClick={handleAddSubCategory} className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100">Vincular</button></div><div className="mt-8 space-y-3"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jerarquía Actual</p>{subCategories.map(sub => (<div key={sub.id} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 group"><div><span className="text-[10px] text-emerald-600 font-bold uppercase">{categories.find(c => c.id === sub.categoryId)?.name}</span><p className="font-bold text-gray-700">{sub.name}</p></div><button onClick={() => handleDeleteSubCategory(sub.id)} className="text-red-400 opacity-0 group-hover:opacity-100"><X size={16}/></button></div>))}</div></div>
                 </div>
            </div>
        )}
        {activeView === 'editor' && (
            <div className="animate-fadeIn"><form onSubmit={handleSavePost} className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 pb-20">
                <div className="lg:col-span-12 flex justify-between items-center mb-4"><button type="button" onClick={() => setActiveView('posts')} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold"><ArrowLeft size={20}/> Volver</button><div className="flex gap-3"><button type="submit" disabled={isSaving} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-emerald-100 disabled:opacity-50">{isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}{isSaving ? 'Guardando...' : 'Guardar'}</button></div></div>
                <div className="lg:col-span-8 space-y-6"><div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-gray-100"><input type="text" placeholder="Título del Artículo..." value={postMeta.title} onChange={e => setPostMeta({...postMeta, title: e.target.value, slug: generateSlug(e.target.value)})} className="w-full text-4xl font-black text-gray-900 border-none outline-none mb-6 placeholder:text-gray-200" /><textarea placeholder="Escribe un resumen o bajada que invite a leer..." value={postMeta.excerpt} onChange={e => setPostMeta({...postMeta, excerpt: e.target.value})} className="w-full text-lg text-gray-500 border-none outline-none resize-none mb-10 italic border-l-4 border-emerald-100 pl-4" rows={2} /><div className="space-y-4">{blocks.map((block, idx) => <BlockEditor key={block.id} block={block} index={idx} total={blocks.length} onUpdate={updateBlock} onMove={moveBlock} onDelete={deleteBlock} onImageUpload={handleBlockImageUpload} />)}</div><div className="mt-16 pt-16 border-t border-dashed border-gray-200"><p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Añadir Bloque</p><div className="flex flex-wrap justify-center gap-4"><button type="button" onClick={() => addBlock('text')} className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-emerald-600 hover:text-white font-black text-xs uppercase tracking-widest shadow-sm"><Type size={18}/> Párrafo</button><button type="button" onClick={() => addBlock('heading')} className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-emerald-600 hover:text-white font-black text-xs uppercase tracking-widest shadow-sm"><ChevronRight size={18}/> Subtítulo</button><button type="button" onClick={() => addBlock('image')} className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-emerald-600 hover:text-white font-black text-xs uppercase tracking-widest shadow-sm"><ImageIcon size={18}/> Imagen</button><button type="button" onClick={() => addBlock('button')} className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-emerald-600 hover:text-white font-black text-xs uppercase tracking-widest shadow-sm"><MousePointer2 size={18}/> Botón</button></div></div></div></div>
                <div className="lg:col-span-4"><div className="sticky top-10 bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><Settings size={20} className="text-emerald-600"/> Publicación</h3>
                    <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Estado</label><select value={postMeta.status} onChange={e => setPostMeta({...postMeta, status: e.target.value as BlogPostStatus})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500"><option value="Borrador">Borrador</option><option value="Publicado">Publicado</option></select></div>
                    <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Imagen de Portada</label><div className="h-40 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 relative group"><label htmlFor="cover-upload" className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"><Upload size={24} className="mb-2"/> <span className="text-xs font-bold">Cambiar Imagen</span></label>{postMeta.coverImage ? <img src={postMeta.coverImage} className="w-full h-full object-cover"/> : <ImageIcon size={32} className="text-gray-300"/>}</div><input id="cover-upload" type="file" className="hidden" accept="image/*" onChange={handleCoverUpload}/></div>
                    <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Categoría</label><select value={postMeta.categoryId} onChange={e => setPostMeta({...postMeta, categoryId: Number(e.target.value), subCategoryId: 0})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500"><option value={0}>-- Sin Asignar --</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    {postMeta.categoryId !== 0 && subCategories.filter(s => s.categoryId === postMeta.categoryId).length > 0 && <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Subcategoría</label><select value={postMeta.subCategoryId} onChange={e => setPostMeta({...postMeta, subCategoryId: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500"><option value={0}>-- Sin Asignar --</option>{subCategories.filter(s => s.categoryId === postMeta.categoryId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}
                    <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Etiquetas</label><input type="text" placeholder="salud, niños, campaña" value={postMeta.tags} onChange={e => setPostMeta({...postMeta, tags: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500"/></div>
                </div></div>
            </form></div>
        )}
      </main>
    </div>
  );
};
