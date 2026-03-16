
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- CREDENCIALES PERMANENTES ---
// Se priorizan las variables de entorno, pero se incluye un fallback duro 
// para garantizar que la app NUNCA pida credenciales en nuevos navegadores.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pywioprkrzszfrfaakir.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5d2lvcHJrcnpzemZyZmFha2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjQ3MzIsImV4cCI6MjA4MTY0MDczMn0.ZPKL3bCvb7iWBCmsB-YVU7oV5_OF5nmtQKRyQrTyh90';

export const isUsingEnvCredentials = true; // Siempre true ahora

export const getStoredCredentials = () => {
    return { url: SUPABASE_URL, key: SUPABASE_ANON_KEY };
};

// Mantenemos estas funciones por compatibilidad con AdminSettings si se usaban,
// pero ya no guardarán nada que afecte la conexión principal.
export const setStoredCredentials = (url: string, key: string) => {
    console.warn("setStoredCredentials está obsoleto. Las credenciales están hardcodeadas/en entorno.");
};

export const clearCredentials = () => {
    console.warn("clearCredentials está obsoleto. Las credenciales están hardcodeadas/en entorno.");
};

// Instancia única (Singleton)
let internalInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
    if (internalInstance) {
        return internalInstance;
    }

    try {
        internalInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });
        return internalInstance;
    } catch (e) {
        console.error("Critical Connection Error:", e);
        throw e;
    }
};

export const testSupabaseConnection = async (url: string, key: string): Promise<{ ok: boolean; error?: string }> => {
    try {
        const testClient = createClient(url, key);
        const { error } = await testClient.from('settings').select('key').limit(1);
        
        if (error && (error.message.includes('JWT') || error.message.includes('API key'))) {
            return { ok: false, error: "La clave API (anon key) parece ser inválida." };
        }
        
        if (error && !error.message.includes('relation "public.settings" does not exist')) {
            return { ok: false, error: `Fallo la conexión: ${error.message}` };
        }
        
        return { ok: true };
    } catch (e: any) {
        return { ok: false, error: `Error de conexión: ${e.message}` };
    }
};

export const supabase = getSupabase();
