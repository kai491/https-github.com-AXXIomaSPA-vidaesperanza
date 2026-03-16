
import { 
  Volunteer, Shift, Campaign, BlogPost, DonationItem, ServiceItem, 
  CustomPage, HeroSlide, BrandingConfig, FooterConfig, SocialConfig, User, UserRole,
  BlogCategory, BlogSubCategory, BlogBlock
} from '../types';
import { getSupabase } from './supabaseClient';

// --- MAPPERS ---
const mappers = {
    volunteer: {
        toApp: (raw: any): Volunteer => ({
            id: raw.id,
            fullName: raw.full_name,
            email: raw.email,
            phone: raw.phone,
            status: raw.status,
            hoursThisMonth: raw.hours_this_month,
            joinDate: raw.join_date,
            availability: typeof raw.availability === 'string' ? JSON.parse(raw.availability) : (raw.availability || []),
            motivation: raw.motivation,
            profileImage: raw.profile_image,
            establishment: raw.establishment,
            hospitalUnit: raw.hospital_unit,
            location: raw.location,
            group: raw.group_name,
            vaccinationStatus: raw.vaccination_status
        }),
        toDB: (app: Partial<Volunteer>) => ({
            full_name: app.fullName,
            email: app.email,
            phone: app.phone,
            status: app.status,
            hours_this_month: app.hoursThisMonth,
            join_date: app.joinDate,
            availability: app.availability !== undefined ? JSON.stringify(app.availability) : undefined,
            motivation: app.motivation,
            profile_image: app.profileImage,
            establishment: app.establishment,
            hospital_unit: app.hospitalUnit,
            location: app.location,
            group_name: app.group,
            vaccination_status: app.vaccinationStatus
        })
    },
    blog: {
        toApp: (raw: any): BlogPost => ({
            id: raw.id,
            title: raw.title,
            slug: raw.slug,
            excerpt: raw.excerpt,
            coverImage: raw.cover_image,
            author: raw.author,
            publishDate: raw.publish_date,
            status: raw.status,
            tags: typeof raw.tags === 'string' ? JSON.parse(raw.tags) : (raw.tags || []),
            categoryId: raw.category_id,
            subCategoryId: raw.subcategory_id
        }),
        toDB: (app: Partial<BlogPost>) => ({
            title: app.title,
            slug: app.slug,
            excerpt: app.excerpt,
            cover_image: app.coverImage,
            author: app.author,
            publish_date: app.publishDate,
            status: app.status,
            tags: app.tags !== undefined ? JSON.stringify(app.tags) : undefined,
            category_id: app.categoryId,
            subcategory_id: app.subCategoryId
        })
    },
    block: {
        toApp: (raw: any): BlogBlock => ({
            id: raw.id.toString(),
            type: raw.block_type,
            content: raw.content || '',
            mediaUrl: raw.media_url,
            caption: raw.caption,
            linkUrl: raw.link_url,
            buttonStyle: raw.button_style,
        }),
        toDB: (app: Partial<BlogBlock>, postId: number, order: number) => ({
            post_id: postId,
            block_order: order,
            block_type: app.type,
            content: app.content,
            media_url: app.mediaUrl,
            caption: app.caption,
            link_url: app.linkUrl,
            button_style: app.buttonStyle,
        })
    },
    category: {
        toApp: (raw: any): BlogCategory => ({
            id: raw.id,
            name: raw.name,
            slug: raw.slug,
            description: raw.description
        }),
        toDB: (app: Partial<BlogCategory>) => ({
            name: app.name,
            slug: app.slug,
            description: app.description
        })
    },
    subcategory: {
        toApp: (raw: any): BlogSubCategory => ({
            id: raw.id,
            categoryId: raw.category_id,
            name: raw.name,
            slug: raw.slug
        }),
        toDB: (app: Partial<BlogSubCategory>) => ({
            category_id: app.categoryId,
            name: app.name,
            slug: app.slug
        })
    },
    slide: {
        toApp: (raw: any): HeroSlide => ({
            id: raw.id,
            mediaType: raw.media_type,
            mediaUrl: raw.media_url,
            title: raw.title,
            subtitle: raw.subtitle,
            buttons: typeof raw.buttons === 'string' ? JSON.parse(raw.buttons) : (raw.buttons || []),
            isActive: raw.is_active,
            order: raw.slide_order
        }),
        toDB: (app: Partial<HeroSlide>) => ({
            media_type: app.mediaType,
            media_url: app.mediaUrl,
            title: app.title,
            subtitle: app.subtitle,
            buttons: app.buttons !== undefined ? JSON.stringify(app.buttons) : undefined,
            is_active: app.isActive,
            slide_order: app.order
        })
    },
    donation: {
        toApp: (raw: any): DonationItem => ({
            id: raw.id,
            name: raw.name,
            desc: raw.desc_text,
            priority: raw.priority,
            category: raw.category,
            targetAmount: raw.target_amount,
            currentAmount: raw.current_amount,
            unit: raw.unit
        }),
        toDB: (app: Partial<DonationItem>) => ({
            name: app.name,
            desc_text: app.desc,
            priority: app.priority,
            category: app.category,
            target_amount: app.targetAmount,
            current_amount: app.currentAmount,
            unit: app.unit
        })
    },
    footer: {
        toApp: (raw: any): FooterConfig => ({
            legendText: raw.legend_text,
            goreLogo: raw.gore_logo,
            coreLogo: raw.core_logo
        }),
        toDB: (app: FooterConfig) => ({
            legend_text: app.legendText,
            gore_logo: app.goreLogo,
            core_logo: app.coreLogo
        })
    },
    social: {
        toApp: (raw: any): SocialConfig => ({
            facebookUrl: raw.facebook_url || '',
            instagramUrl: raw.instagram_url || '',
            linkedinUrl: raw.linkedin_url || '',
            isVisible: raw.is_visible ?? true,
            topbarText: raw.topbar_text || ''
        }),
        toDB: (app: SocialConfig) => ({
            facebook_url: app.facebookUrl,
            instagram_url: app.instagramUrl,
            linkedin_url: app.linkedinUrl,
            is_visible: app.isVisible,
            topbar_text: app.topbarText
        })
    }
};

// --- CORE FETCHERS ---
async function safeFetchMapped<T>(table: string, mapper: (raw: any) => T, defaults: T[] = []): Promise<T[]> {
    const client = getSupabase();
    if (!client) return defaults;
    
    try {
        const { data, error } = await client.from(table).select('*').order('id', { ascending: true });
        if (error) {
            console.error(`Error fetching from ${table}:`, error);
            return defaults;
        }
        if (!data) return defaults;
        
        return data.map(mapper);
    } catch (e) {
        console.error(`Exception fetching from ${table}:`, e);
        return defaults;
    }
}

// --- API EXPORT ---
export const db = {
  // EXPOSE MAPPERS
  mappers, 

  system: {
      checkHealth: async (): Promise<{ ok: boolean; error?: string }> => {
          const client = getSupabase();
          if (!client) return { ok: false, error: "Cliente no inicializado" };
          try {
              // Intentamos una consulta simple. Si falla por falta de tabla, 
              // pero no por falta de conexión/auth, consideramos que está OK.
              const { error } = await client.from('app_users').select('id').limit(1);
              
              if (error) {
                  // Si el error es que la tabla no existe, la conexión es válida pero la DB está vacía
                  if (error.message.includes('relation') && error.message.includes('does not exist')) {
                      return { ok: true };
                  }
                  // Errores de API Key o URL
                  if (error.message.includes('JWT') || error.message.includes('API key') || error.message.includes('fetch')) {
                      return { ok: false, error: error.message };
                  }
                  // Otros errores
                  return { ok: false, error: error.message };
              }
              return { ok: true };
          } catch (e: any) {
              return { ok: false, error: e.message };
          }
      }
  },

  volunteers: {
    getAll: () => safeFetchMapped('volunteers', mappers.volunteer.toApp),
    create: async (data: Omit<Volunteer, 'id'>) => {
        const client = getSupabase();
        if (!client) throw new Error("DB No Connected");
        const { data: res, error } = await client.from('volunteers').insert(mappers.volunteer.toDB(data)).select().single();
        if (error) throw error;
        return mappers.volunteer.toApp(res);
    },
    update: async (id: number, updates: Partial<Volunteer>) => {
        const client = getSupabase();
        if (!client) return;
        await client.from('volunteers').update(mappers.volunteer.toDB(updates)).eq('id', id);
    },
    delete: async (id: number) => {
        const client = getSupabase();
        if (!client) return;
        await client.from('volunteers').delete().eq('id', id);
    }
  },

  shifts: {
    getAll: async () => {
        const client = getSupabase();
        if (!client) return [];
        const { data } = await client.from('shifts').select('*');
        return (data || []).map(raw => ({
            id: raw.id,
            volunteerId: raw.volunteer_id,
            date: raw.date,
            startTime: raw.start_time,
            endTime: raw.end_time,
            establishment: raw.establishment,
            hospitalUnit: raw.hospital_unit,
            status: raw.status
        })) as unknown as Shift[];
    },
    create: async (data: Omit<Shift, 'id'>) => {
        const client = getSupabase();
        if (!client) throw new Error("DB No Connected");
        const { data: res, error } = await client.from('shifts').insert({
            volunteer_id: data.volunteerId,
            date: data.date,
            start_time: data.startTime,
            end_time: data.endTime,
            establishment: data.establishment,
            hospital_unit: data.hospitalUnit,
            status: data.status
        }).select().single();
        if (error) throw error;
        return { ...data, id: res.id };
    },
    update: async (id: number, updates: Partial<Shift>) => {
        const client = getSupabase();
        if (!client) return;
        const dbUpdates: any = {};
        if (updates.volunteerId) dbUpdates.volunteer_id = updates.volunteerId;
        if (updates.date) dbUpdates.date = updates.date;
        if (updates.startTime) dbUpdates.start_time = updates.startTime;
        if (updates.endTime) dbUpdates.end_time = updates.endTime;
        if (updates.status) dbUpdates.status = updates.status;
        await client.from('shifts').update(dbUpdates).eq('id', id);
    },
    delete: async (id: number) => {
        const client = getSupabase();
        if (!client) throw new Error("DB No Connected");
        const { error } = await client.from('shifts').delete().eq('id', id);
        if (error) throw error;
    }
  },

  crm: {
    getCampaigns: () => safeFetchMapped('campaigns', (raw) => ({
        id: raw.id,
        name: raw.name,
        objective: raw.objective,
        startDate: raw.start_date,
        endDate: raw.end_date,
        channel: raw.channel,
        targetAudience: raw.target_audience,
        status: raw.status,
        budget: raw.budget,
        notes: raw.notes
    })),
    create: async (data: Omit<Campaign, 'id'>) => {
        const client = getSupabase();
        if (!client) throw new Error("DB No Connected");
        const { data: res, error } = await client.from('campaigns').insert({
            name: data.name,
            objective: data.objective,
            start_date: data.startDate,
            end_date: data.endDate,
            channel: data.channel,
            target_audience: data.targetAudience,
            status: data.status,
            budget: data.budget,
            notes: data.notes
        }).select().single();
        if (error) throw error;
        return { ...data, id: res?.id };
    },
    update: async (id: number, updates: Partial<Campaign>) => {
        const client = getSupabase();
        if (!client) return;
        const dbUpdates: any = { ...updates };
        if (updates.startDate) dbUpdates.start_date = updates.startDate;
        if (updates.endDate) dbUpdates.end_date = updates.endDate;
        if (updates.targetAudience) dbUpdates.target_audience = updates.targetAudience;
        await client.from('campaigns').update(dbUpdates).eq('id', id);
    },
    delete: async (id: number) => {
        const client = getSupabase();
        if (!client) return;
        await client.from('campaigns').delete().eq('id', id);
    }
  },

  blog: {
    getPosts: async (): Promise<any[]> => {
        const client = getSupabase();
        if (!client) return [];
        const { data, error } = await client.from('blog_posts').select('*, blog_content_blocks(*)').order('publish_date', { ascending: false });
        if (error) {
            if (error.message.includes('relation "public.blog_content_blocks" does not exist')) {
                console.warn('MIGRATION: "blog_content_blocks" table not found. Fetching legacy post format.');
                const { data: legacyData, error: legacyError } = await client.from('blog_posts').select('*').order('publish_date', { ascending: false });
                if (legacyError) throw legacyError;
                return legacyData || [];
            }
            throw error;
        }
        return data || [];
    },
    getCategories: () => safeFetchMapped('blog_categories', mappers.category.toApp),
    getSubCategories: () => safeFetchMapped('blog_subcategories', mappers.subcategory.toApp),
    
    createCategory: async (data: Omit<BlogCategory, 'id'>) => {
        const client = getSupabase();
        if (!client) throw new Error("DB No Connected");
        const { data: res, error } = await client.from('blog_categories').insert(mappers.category.toDB(data)).select().single();
        if (error) throw error;
        return mappers.category.toApp(res);
    },
    
    createSubCategory: async (data: Omit<BlogSubCategory, 'id'>) => {
        const client = getSupabase();
        if (!client) throw new Error("DB No Connected");
        const { data: res, error } = await client.from('blog_subcategories').insert(mappers.subcategory.toDB(data)).select().single();
        if (error) throw error;
        return mappers.subcategory.toApp(res);
    },

    create: async (postData: Omit<BlogPost, 'id' | 'publishDate' | 'blocks'>, blocks: BlogBlock[]) => {
        const client = getSupabase();
        if (!client) throw new Error("DB No Connected");
        const postPayload = mappers.blog.toDB({ ...postData, publishDate: new Date().toISOString() });
        const { data: postRes, error: postError } = await client.from('blog_posts').insert(postPayload).select().single();
        if (postError) throw postError;
        const newPostId = postRes.id;
        if (blocks && blocks.length > 0) {
            const blocksPayload = blocks.map((block, index) => mappers.block.toDB(block, newPostId, index));
            const { error: blocksError } = await client.from('blog_content_blocks').insert(blocksPayload);
            if (blocksError) {
                await client.from('blog_posts').delete().eq('id', newPostId);
                throw blocksError;
            }
        }
        const newPost = mappers.blog.toApp(postRes);
        newPost.blocks = blocks.map(b => ({...b}));
        return newPost;
    },
    update: async (id: number, postUpdates: Partial<BlogPost>, blocks: BlogBlock[]) => {
        const client = getSupabase();
        if (!client) return;
        const postPayload = mappers.blog.toDB(postUpdates);
        const { error: postError } = await client.from('blog_posts').update(postPayload).eq('id', id);
        if (postError) throw postError;
        const { error: deleteError } = await client.from('blog_content_blocks').delete().eq('post_id', id);
        if (deleteError) throw deleteError;
        if (blocks && blocks.length > 0) {
            const blocksPayload = blocks.map((block, index) => mappers.block.toDB(block, id, index));
            const { error: insertError } = await client.from('blog_content_blocks').insert(blocksPayload);
            if (insertError) throw insertError;
        }
    },
    delete: async (id: number) => {
        const client = getSupabase();
        if (!client) return;
        await client.from('blog_content_blocks').delete().eq('post_id', id);
        const { error } = await client.from('blog_posts').delete().eq('id', id);
        if (error) throw error;
    },
    deleteCategory: async (id: number) => {
        const client = getSupabase();
        if (!client) return;
        await client.from('blog_subcategories').delete().eq('category_id', id);
        const { error } = await client.from('blog_categories').delete().eq('id', id);
        if (error) throw error;
    },
    deleteSubCategory: async (id: number) => {
        const client = getSupabase();
        if (!client) return;
        const { error } = await client.from('blog_subcategories').delete().eq('id', id);
        if (error) throw error;
    }
  },

  content: {
    async get<T>(key: string, defaultVal: T): Promise<T> {
        const client = getSupabase();
        if (!client) return defaultVal;
        try {
            const { data } = await client.from('settings').select('value').eq('key', key).maybeSingle();
            return data ? data.value : defaultVal;
        } catch {
            return defaultVal;
        }
    },
    async set<T>(key: string, value: T): Promise<T> {
        const client = getSupabase();
        if (!client) return value;
        try {
            const { error } = await client.from('settings').upsert({ key, value }, { onConflict: 'key' });
            if (error) console.error(`Error saving setting ${key}:`, error);
        } catch (e) {
            console.error(`Exception saving setting ${key}:`, e);
        }
        return value;
    },
    async getList<T>(key: string, defaultVal: T[]): Promise<T[]> {
        const client = getSupabase();
        if (!client) return defaultVal;
        if (key === 'hero_slides') return await safeFetchMapped('hero_slides', mappers.slide.toApp, defaultVal as any) as any;
        if (key === 'donationNeeds') return await safeFetchMapped('donation_needs', mappers.donation.toApp, defaultVal as any) as any;
        if (key === 'content_services') {
            const { data } = await client.from('services').select('*').order('id');
            return (data || defaultVal) as T[];
        }
        if (key === 'content_custom_pages') {
            const { data } = await client.from('custom_pages').select('*');
            return (data || []).map(raw => ({
                id: raw.id,
                slug: raw.slug,
                title: raw.title,
                content: raw.content,
                isVisible: raw.is_visible,
                lastModified: raw.last_modified
            })) as any;
        }
        return defaultVal;
    },
    async getFooter(): Promise<FooterConfig> {
        const client = getSupabase();
        if (!client) return { legendText: '', goreLogo: '', coreLogo: '' };
        try {
            const { data } = await client.from('footer_settings').select('*').single();
            if (data) return mappers.footer.toApp(data);
            return { legendText: '', goreLogo: '', coreLogo: '' };
        } catch {
            return { legendText: '', goreLogo: '', coreLogo: '' };
        }
    },
    async setFooter(config: FooterConfig): Promise<void> {
        const client = getSupabase();
        if (!client) return;
        try {
            const { error } = await client.from('footer_settings').upsert({ id: 1, ...mappers.footer.toDB(config) }, { onConflict: 'id' });
            if (error) console.error('Error saving footer:', error);
        } catch (e) {
            console.error('Exception saving footer:', e);
        }
    },
    async getSocials(): Promise<SocialConfig> {
        const client = getSupabase();
        if (!client) return { facebookUrl: '', instagramUrl: '', linkedinUrl: '', isVisible: true, topbarText: '' };
        try {
            const { data } = await client.from('social_config').select('*').single();
            if (data) return mappers.social.toApp(data);
            return { facebookUrl: '', instagramUrl: '', linkedinUrl: '', isVisible: true, topbarText: '' };
        } catch {
            return { facebookUrl: '', instagramUrl: '', linkedinUrl: '', isVisible: true, topbarText: '' };
        }
    },
    async setSocials(config: SocialConfig): Promise<void> {
        const client = getSupabase();
        if (!client) return;
        try {
            const { error } = await client.from('social_config').upsert({ id: 1, ...mappers.social.toDB(config) }, { onConflict: 'id' });
            if (error) console.error('Error saving socials:', error);
        } catch (e) {
            console.error('Exception saving socials:', e);
        }
    },
    async createItem<T>(key: string, item: any): Promise<T> {
        const client = getSupabase();
        if (!client) throw new Error("DB No Connected");
        let table = key;
        let payload = item;
        if (key === 'hero_slides') { table = 'hero_slides'; payload = mappers.slide.toDB(item); }
        if (key === 'donationNeeds') { table = 'donation_needs'; payload = mappers.donation.toDB(item); }
        if (key === 'content_services') table = 'services';
        if (key === 'content_custom_pages') {
            table = 'custom_pages';
            payload = { slug: item.slug, title: item.title, content: item.content, is_visible: item.isVisible };
        }

        const { data, error } = await client.from(table).insert(payload).select().single();
        if (error) throw error;
        
        if (key === 'hero_slides') return mappers.slide.toApp(data) as any;
        if (key === 'donationNeeds') return mappers.donation.toApp(data) as any;
        return data;
    },
    async updateItem<T extends {id: number}>(key: string, id: number, updates: Partial<T>): Promise<T[]> {
        const client = getSupabase();
        if (!client) return [];
        let table = key;
        let payload = updates as any;
        if (key === 'hero_slides') { table = 'hero_slides'; payload = mappers.slide.toDB(updates as any); }
        if (key === 'donationNeeds') { table = 'donation_needs'; payload = mappers.donation.toDB(updates as any); }
        if (key === 'content_services') table = 'services';
        if (key === 'content_custom_pages') {
            table = 'custom_pages';
            payload = { ...updates };
            if (Object.prototype.hasOwnProperty.call(updates, 'isVisible')) {
                (payload as any).is_visible = (updates as any).isVisible;
                delete (payload as any).isVisible;
            }
        }

        const { error } = await client.from(table).update(payload).eq('id', id);
        if (error) throw error;
        return db.content.getList<T>(key, []);
    },
    async deleteItem(key: string, id: number): Promise<void> {
        const client = getSupabase();
        if (!client) return;
        const tableMap: Record<string, string> = {
            'hero_slides': 'hero_slides',
            'content_services': 'services',
            'donationNeeds': 'donation_needs',
            'content_custom_pages': 'custom_pages'
        };
        await client.from(tableMap[key] || key).delete().eq('id', id);
    }
  },

  auth: {
      login: async (username: string, pass: string): Promise<User | null> => {
        const client = getSupabase();
        if (!client) return null;
        try {
            const { data } = await client.from('app_users').select('*').eq('username', username).eq('password', pass).maybeSingle();
            
            // FALLBACK PARA DEMO (Si no existen en la DB aún)
            if (!data) {
                if (username === 'admin' && pass === 'admin') 
                    return { id: 1, username: 'admin', name: 'SuperAdmin', role: UserRole.SUPERADMIN };
                if (username === 'colab' && pass === 'colab') 
                    return { id: 2, username: 'colab', name: 'Colaborador Demo', role: UserRole.COLLABORATOR };
                if (username === 'vol' && pass === 'vol') 
                    return { id: 3, username: 'vol', name: 'Voluntaria Demo', role: UserRole.VOLUNTEER, volunteerId: 1 };
                return null;
            }

            return {
                id: data.id,
                username: data.username,
                name: data.name,
                role: data.role,
                volunteerId: data.volunteer_id
            };
        } catch {
            return null;
        }
      },
      getUser: async (): Promise<User | null> => {
          const u = localStorage.getItem('auth_user');
          try {
              return u ? JSON.parse(u) as User : null;
          } catch (e) {
              console.error("Error parsing auth_user in db.ts", e);
              return null;
          }
      },
      setUser: async (user: User | null): Promise<void> => {
          if(user) localStorage.setItem('auth_user', JSON.stringify(user));
          else localStorage.removeItem('auth_user');
      }
  }
};
