
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlogPost, BlogPostStatus, BlogCategory, BlogSubCategory, BlogBlock } from '../types';
import { db } from '../services/db';

interface BlogContextType {
  posts: BlogPost[];
  categories: BlogCategory[];
  subCategories: BlogSubCategory[];
  loading: boolean;
  addPost: (post: Omit<BlogPost, 'id' | 'publishDate' | 'blocks'>, blocks: BlogBlock[]) => Promise<void>;
  updatePost: (id: number, post: Partial<BlogPost>, blocks: BlogBlock[]) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  addCategory: (cat: Omit<BlogCategory, 'id'>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  addSubCategory: (sub: Omit<BlogSubCategory, 'id'>) => Promise<void>;
  deleteSubCategory: (id: number) => Promise<void>;
  getPublishedPosts: (categoryId?: number, subCategoryId?: number) => BlogPost[];
  getPostById: (id: number) => BlogPost | undefined;
  getPostBySlug: (slug: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [subCategories, setSubCategories] = useState<BlogSubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
        const [postsRaw, catsData, subsData] = await Promise.all([
            db.blog.getPosts(),
            db.blog.getCategories(),
            db.blog.getSubCategories()
        ]);

        const postsWithBlocks = postsRaw.map(rawPost => {
            const post = db.mappers.blog.toApp(rawPost);
            if (rawPost.blog_content_blocks) {
                post.blocks = (rawPost.blog_content_blocks || [])
                    .sort((a: any, b: any) => a.block_order - b.block_order)
                    .map(db.mappers.block.toApp);
            } else if (rawPost.content) {
                console.warn(`MIGRATING post ID ${post.id}`);
                try {
                    post.blocks = JSON.parse(rawPost.content);
                } catch {
                    post.blocks = [{ id: 'fallback', type: 'text', content: rawPost.content as string }];
                }
            } else {
                post.blocks = [];
            }
            return post;
        });

        let finalCats = catsData;
        if (catsData.length === 0) {
            try {
                const defaultCat = await db.blog.createCategory({ name: 'General', slug: 'general', description: 'Noticias generales' });
                finalCats = [defaultCat];
            } catch (seedError) {
                console.error("Error creating default category:", seedError);
            }
        }

        setPosts(postsWithBlocks);
        setCategories(finalCats);
        setSubCategories(subsData);

    } catch (e: any) {
        console.error("Error loading blog data:", e.message || e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addPost = async (post: Omit<BlogPost, 'id' | 'publishDate' | 'blocks'>, blocks: BlogBlock[]) => {
    try {
        const newPost = await db.blog.create(post, blocks);
        setPosts(prev => [newPost, ...prev]);
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
  };

  const updatePost = async (id: number, updatedFields: Partial<BlogPost>, blocks: BlogBlock[]) => {
    try {
        await db.blog.update(id, updatedFields, blocks);
        setPosts(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields, blocks } : p)));
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
  };

  const deletePost = async (id: number) => {
    try {
        await db.blog.delete(id);
        setPosts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
        console.error("Error deleting post:", error);
    }
  };

  const addCategory = async (cat: Omit<BlogCategory, 'id'>) => {
      try {
          const newCat = await db.blog.createCategory(cat);
          setCategories(prev => [...prev, newCat]);
      } catch (error) {
          console.error("Error adding category:", error);
          throw error;
      }
  };

  const deleteCategory = async (id: number) => {
    try {
        await db.blog.deleteCategory(id);
        setCategories(prev => prev.filter(c => c.id !== id));
        setSubCategories(prev => prev.filter(s => s.categoryId !== id));
        setPosts(prev => prev.map(p => p.categoryId === id ? { ...p, categoryId: undefined, subCategoryId: undefined } : p));
    } catch (error) {
        console.error("Error deleting category:", error);
    }
  };

  const addSubCategory = async (sub: Omit<BlogSubCategory, 'id'>) => {
      try {
          const newSub = await db.blog.createSubCategory(sub);
          setSubCategories(prev => [...prev, newSub]);
      } catch (error) {
          console.error("Error adding subcategory:", error);
          throw error;
      }
  };

  const deleteSubCategory = async (id: number) => {
    try {
        await db.blog.deleteSubCategory(id);
        setSubCategories(prev => prev.filter(s => s.id !== id));
        setPosts(prev => prev.map(p => p.subCategoryId === id ? { ...p, subCategoryId: undefined } : p));
    } catch (error) {
        console.error("Error deleting subcategory:", error);
    }
  };

  const getPublishedPosts = (categoryId?: number, subCategoryId?: number) => {
    let filtered = posts.filter(p => p.status === BlogPostStatus.PUBLISHED);
    if (categoryId) filtered = filtered.filter(p => p.categoryId === categoryId);
    if (subCategoryId) filtered = filtered.filter(p => p.subCategoryId === subCategoryId);
    return filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  };

  const getPostById = (id: number) => posts.find(p => p.id === id);
  const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug);

  return (
    <BlogContext.Provider value={{ 
        posts, categories, subCategories, loading, 
        addPost, updatePost, deletePost, addCategory, deleteCategory, addSubCategory, deleteSubCategory,
        getPublishedPosts, getPostById, getPostBySlug 
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be used within a BlogProvider');
  return context;
};
