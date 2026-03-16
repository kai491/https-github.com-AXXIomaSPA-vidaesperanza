
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DonationItem, ServiceItem, CustomPage, HeroSlide, BrandingConfig, PageBanner, FooterConfig, SocialConfig } from '../types';
import { db } from '../services/db';

export interface HomeContent {
  introTitle: string;
  introText: string;
}

export interface AboutContent {
  history: string;
  mission: string;
  vision: string;
}

interface ContentContextType {
  loading: boolean;
  homeContent: HomeContent;
  updateHomeContent: (data: HomeContent) => Promise<void>;
  branding: BrandingConfig;
  updateBranding: (config: BrandingConfig) => Promise<void>;
  footerContent: FooterConfig;
  updateFooterContent: (config: FooterConfig) => Promise<void>;
  socialContent: SocialConfig;
  updateSocialContent: (config: SocialConfig) => Promise<void>;
  pageBanners: PageBanner[];
  updatePageBanner: (pageId: string, banner: PageBanner) => Promise<void>;
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => Promise<void>;
  updateHeroSlide: (id: number, slide: Partial<HeroSlide>) => Promise<void>;
  deleteHeroSlide: (id: number) => Promise<void>;
  aboutContent: AboutContent;
  updateAboutContent: (data: AboutContent) => Promise<void>;
  donationNeeds: DonationItem[];
  addDonationNeed: (item: Omit<DonationItem, 'id' | 'currentAmount'>) => Promise<void>;
  updateDonationProgress: (id: number, amountToAdd: number) => Promise<void>;
  removeDonationNeed: (id: number) => Promise<void>;
  services: ServiceItem[];
  addService: (item: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (id: number, item: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  customPages: CustomPage[];
  addCustomPage: (page: Omit<CustomPage, 'id' | 'lastModified'>) => Promise<void>;
  updateCustomPage: (id: number, page: Partial<CustomPage>) => Promise<void>;
  deleteCustomPage: (id: number) => Promise<void>;
  getPageBySlug: (slug: string) => CustomPage | undefined;
}

const defaultBranding: BrandingConfig = {
  logoUrl: 'https://i.imgur.com/k2yKx60.jpg',
  primaryColor: '#10b981',
  secondaryColor: '#3b82f6',
  fontFamily: 'Inter'
};

const defaultFooter: FooterConfig = {
    legendText: 'PROYECTO FINANCIADO POR FONDO SOCIAL GOBIERNO REGIONAL COQUIMBO 2025',
    goreLogo: '',
    coreLogo: ''
};

const defaultSocial: SocialConfig = {
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    isVisible: true,
    topbarText: 'Síguenos en nuestras redes oficiales'
};

const defaultHome: HomeContent = {
  introTitle: 'Por qué existimos',
  introText: 'Porque creemos que la salud no es solo tratamiento, sino también presencia, acompañamiento y dignidad. Nuestra labor es puente entre el equipo clínico y la persona hospitalizada, entre el miedo y la confianza.'
};

const defaultAbout: AboutContent = {
  history: 'Nacimos como "Vida y Esperanza", uno de los cuerpos de voluntariado permanente del Hospital de La Serena. En ese primer momento, la idea fue simple: estar presentes junto al paciente, ofrecer compañía y esperanza.',
  mission: 'Acompañar con dignidad, compasión y esperanza a pacientes y familias del Hospital de La Serena.',
  vision: 'Ser reconocidas como un voluntariado hospitalario referente en la Región de Coquimbo.'
};

const defaultBanners: PageBanner[] = [
    { pageId: 'about', title: 'Quiénes Somos', subtitle: 'Nuestra historia arranca hace más de una década en La Serena, impulsada por mujeres solidarias con vocación de servicio.', imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80' },
    { pageId: 'volunteer', title: 'Quiero Ser Voluntaria', subtitle: 'Únete a las mujeres que transforman el acompañamiento hospitalario en La Serena con amor, dignidad y esperanza.', imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1920&q=80' },
    { pageId: 'donate', title: 'Cómo Ayudar', subtitle: 'Tu aporte es clave. Cada contribución nos permite seguir acompañando y dignificando la estadía de los pacientes.', imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1920&q=80' },
    { pageId: 'blog', title: 'Blog y Noticias', subtitle: 'Historias de esperanza, novedades de nuestra gestión y convocatorias.', imageUrl: 'https://images.unsplash.com/photo-1494707924465-e1426acb48cb?auto=format&fit=crop&w=1920&q=80' }
];

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [branding, setBranding] = useState<BrandingConfig>(defaultBranding);
  const [footerContent, setFooterContent] = useState<FooterConfig>(defaultFooter);
  const [socialContent, setSocialContent] = useState<SocialConfig>(defaultSocial);
  const [homeContent, setHomeContent] = useState<HomeContent>(defaultHome);
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAbout);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [pageBanners, setPageBanners] = useState<PageBanner[]>(defaultBanners);
  const [donationNeeds, setDonationNeeds] = useState<DonationItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);

  useEffect(() => {
    const loadAndSeed = async () => {
        try {
            // 1. Cargar Settings (si no existen, grabarlos)
            let br = await db.content.get<BrandingConfig>('branding_config', null as any);
            if (!br) br = await db.content.set('branding_config', defaultBranding);
            
            let hc = await db.content.get<HomeContent>('homeContent', null as any);
            if (!hc) hc = await db.content.set('homeContent', defaultHome);
            
            let ac = await db.content.get<AboutContent>('aboutContent', null as any);
            if (!ac) ac = await db.content.set('aboutContent', defaultAbout);

            let pb = await db.content.get<PageBanner[]>('page_banners', null as any);
            if (!pb) pb = await db.content.set('page_banners', defaultBanners);

            // Fetch Footer dedicated table
            let fc = await db.content.getFooter();
            if (!fc.legendText && !fc.goreLogo) {
                await db.content.setFooter(defaultFooter);
                fc = defaultFooter;
            }

            // Fetch Social dedicated table
            let sc = await db.content.getSocials();
            // If empty (implied by just default values and no ID found usually, but getSocials handles it safely)
            if (!sc.topbarText && !sc.facebookUrl) {
                await db.content.setSocials(defaultSocial);
                sc = defaultSocial;
            }

            // 2. Cargar Listas
            let hs = await db.content.getList<HeroSlide>('hero_slides', []);
            if (hs.length === 0) {
                const defaultSlide = {
                    mediaType: 'image' as const,
                    mediaUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
                    title: 'Transformamos el cuidado en compañía',
                    subtitle: 'Somos Vida y Esperanza. Acompañamos con dignidad y compasión.',
                    buttons: [{ label: 'Quiero ser voluntaria', link: 'volunteer', style: 'primary' }],
                    isActive: true,
                    order: 1
                };
                try {
                    await db.content.createItem('hero_slides', defaultSlide);
                    hs = await db.content.getList<HeroSlide>('hero_slides', []);
                } catch (e) {
                    console.error("Error creating default hero slide:", e);
                    hs = [{ id: 1, ...defaultSlide }];
                }
            }

            let dn = await db.content.getList<DonationItem>('donationNeeds', []);
            if (dn.length === 0) {
                const initialNeeds = [
                    { name: 'Pañales Adulto', desc_text: 'Tallas M y G', priority: 'Alta', category: 'Higiene', target_amount: 100, current_amount: 45, unit: 'paquetes' },
                    { name: 'Útiles de Aseo', desc_text: 'Jabón, shampoo, cepillos', priority: 'Media', category: 'Higiene', target_amount: 50, current_amount: 12, unit: 'sets' }
                ];
                try {
                    for (const item of initialNeeds) await db.content.createItem('donationNeeds', item);
                    dn = await db.content.getList<DonationItem>('donationNeeds', []);
                } catch (e) {
                    console.error("Error creating default donation needs:", e);
                    dn = initialNeeds.map((n, i) => ({ id: i + 1, ...n, desc: n.desc_text, targetAmount: n.target_amount, currentAmount: n.current_amount } as any));
                }
            }

            let srv = await db.content.getList<ServiceItem>('content_services', []);
            if (srv.length === 0) {
                const initialServices = [
                    { title: 'Acompañamiento Emocional', description: 'Visitas regulares y compañía silenciosa.', icon: 'Smile' },
                    { title: 'Apoyo Material', description: 'Entrega de útiles de aseo y pañales.', icon: 'Heart' },
                    { title: 'Guía y Orientación', description: 'Ayuda técnica y humana para pacientes y familiares.', icon: 'Hand' }
                ];
                try {
                    for (const s of initialServices) await db.content.createItem('content_services', s);
                    srv = await db.content.getList<ServiceItem>('content_services', []);
                } catch (e) {
                    console.error("Error creating default services:", e);
                    srv = initialServices.map((s, i) => ({ id: i + 1, ...s }));
                }
            }

            const cp = await db.content.getList<CustomPage>('content_custom_pages', []);

            setBranding(br);
            setFooterContent(fc);
            setSocialContent(sc);
            setHomeContent(hc);
            setAboutContent(ac);
            setPageBanners(pb);
            setHeroSlides(hs);
            setDonationNeeds(dn);
            setServices(srv);
            setCustomPages(cp);
        } catch (e) {
            console.error("Error al sincronizar contenidos con Supabase", e);
        } finally {
            setLoading(false);
        }
    };
    loadAndSeed();
  }, []);

  // Helpers de color para branding dinámico
  const adjustBrightness = (hex: string, percent: number) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    r = Math.round(r * (1 + percent));
    g = Math.round(g * (1 + percent));
    b = Math.round(b * (1 + percent));
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-primary', branding.fontFamily);
    const generatePalette = (baseColor: string, prefix: string) => {
        root.style.setProperty(`--${prefix}-50`, adjustBrightness(baseColor, 0.9));
        root.style.setProperty(`--${prefix}-100`, adjustBrightness(baseColor, 0.7));
        root.style.setProperty(`--${prefix}-500`, baseColor);
        root.style.setProperty(`--${prefix}-600`, adjustBrightness(baseColor, -0.1));
        root.style.setProperty(`--${prefix}-900`, adjustBrightness(baseColor, -0.45));
    };
    generatePalette(branding.primaryColor, 'brand');
    generatePalette(branding.secondaryColor || '#3b82f6', 'accent');
  }, [branding]);

  const updateBranding = async (config: BrandingConfig) => {
      const res = await db.content.set('branding_config', config);
      setBranding(res);
  };

  const updateFooterContent = async (config: FooterConfig) => {
      await db.content.setFooter(config);
      setFooterContent(config);
  };

  const updateSocialContent = async (config: SocialConfig) => {
      await db.content.setSocials(config);
      setSocialContent(config);
  };

  const updateHomeContent = async (data: HomeContent) => {
      const res = await db.content.set('homeContent', data);
      setHomeContent(res);
  };

  const updateAboutContent = async (data: AboutContent) => {
      const res = await db.content.set('aboutContent', data);
      setAboutContent(res);
  };

  const updatePageBanner = async (pageId: string, banner: PageBanner) => {
    const newBanners = pageBanners.map(b => b.pageId === pageId ? banner : b);
    const res = await db.content.set('page_banners', newBanners);
    setPageBanners(res);
  };
  
  const addHeroSlide = async (slide: Omit<HeroSlide, 'id'>) => {
    const newSlide = (await db.content.createItem('hero_slides', slide)) as HeroSlide;
    setHeroSlides(prev => [...prev, newSlide]);
  };

  const updateHeroSlide = async (id: number, slide: Partial<HeroSlide>) => {
    const updatedList = await db.content.updateItem<HeroSlide>('hero_slides', id, slide);
    setHeroSlides(updatedList);
  };

  const deleteHeroSlide = async (id: number) => {
    await db.content.deleteItem('hero_slides', id);
    setHeroSlides(prev => prev.filter(s => s.id !== id));
  };

  const addDonationNeed = async (item: Omit<DonationItem, 'id' | 'currentAmount'>) => {
    const newItem = (await db.content.createItem('donationNeeds', { ...item, currentAmount: 0 })) as DonationItem;
    setDonationNeeds(prev => [...prev, newItem]);
  };

  const updateDonationProgress = async (id: number, amountToAdd: number) => {
    const current = donationNeeds.find(d => d.id === id);
    if (!current) return;
    const newAmount = Math.max(0, current.currentAmount + amountToAdd);
    const updatedList = await db.content.updateItem<DonationItem>('donationNeeds', id, { currentAmount: newAmount });
    setDonationNeeds(updatedList);
  };

  const removeDonationNeed = async (id: number) => {
    await db.content.deleteItem('donationNeeds', id);
    setDonationNeeds(prev => prev.filter(i => i.id !== id));
  };

  const addService = async (item: Omit<ServiceItem, 'id'>) => {
    const newItem = (await db.content.createItem('content_services', item)) as ServiceItem;
    setServices(prev => [...prev, newItem]);
  };

  const updateService = async (id: number, item: Partial<ServiceItem>) => {
    const updatedList = await db.content.updateItem<ServiceItem>('content_services', id, item);
    setServices(updatedList);
  };

  const deleteService = async (id: number) => {
    await db.content.deleteItem('content_services', id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addCustomPage = async (page: Omit<CustomPage, 'id' | 'lastModified'>) => {
    const newItem = (await db.content.createItem('content_custom_pages', { ...page, lastModified: new Date().toISOString() })) as CustomPage;
    setCustomPages(prev => [...prev, newItem]);
  };

  const updateCustomPage = async (id: number, page: Partial<CustomPage>) => {
    const updatedList = await db.content.updateItem<CustomPage>('content_custom_pages', id, { ...page, lastModified: new Date().toISOString() });
    setCustomPages(updatedList);
  };

  const deleteCustomPage = async (id: number) => {
    await db.content.deleteItem('content_custom_pages', id);
    setCustomPages(prev => prev.filter(p => p.id !== id));
  };

  const getPageBySlug = (slug: string) => customPages.find(p => p.slug === slug && p.isVisible);

  return (
    <ContentContext.Provider value={{
      loading,
      homeContent, updateHomeContent,
      branding, updateBranding,
      footerContent, updateFooterContent,
      socialContent, updateSocialContent,
      pageBanners, updatePageBanner,
      heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide,
      aboutContent, updateAboutContent,
      donationNeeds, addDonationNeed, updateDonationProgress, removeDonationNeed,
      services, addService, updateService, deleteService,
      customPages, addCustomPage, updateCustomPage, deleteCustomPage, getPageBySlug
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
