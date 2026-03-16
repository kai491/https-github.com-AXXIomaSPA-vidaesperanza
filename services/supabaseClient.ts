
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- CREDENCIALES PERMANENTES ---
// Se priorizan las variables de entorno, pero se incluye un fallback duro 
// para garantizar que la app NUNCA pida credenciales en nuevos navegadores.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pywioprkrzszfrfaakir.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5d2lvcHJrcnpzemZyZmFha2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjQ3MzIsImV4cCI6MjA4MTY0MDczMn0.ZPKL3bCvb7iWBCmsB-YVU7oV5_OF5nmtQKRyQrTyh90';

export const isUsingEnvCredentials = true; // Forzamos true para que la UI sepa que están "blindadas"

export const getStoredCredentials = () => {
    return { 
        url: SUPABASE_URL, 
        key: SUPABASE_ANON_KEY 
    };
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

    const { url, key } = getStoredCredentials();

    try {
        internalInstance = createClient(url, key, {
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

// --- HERRAMIENTA DE DIAGNÓSTICO GLOBAL ---
// Permite al usuario ejecutar window.debugSupabase() en la consola del navegador
if (typeof window !== 'undefined') {
    (window as any).debugSupabase = async () => {
        console.log("%c--- DIAGNÓSTICO DE CONEXIÓN SUPABASE ---", "color: #10b981; font-weight: bold; font-size: 14px;");
        const creds = getStoredCredentials();
        console.log("URL Configurada:", creds.url);
        console.log("Anon Key (truncada):", creds.key.substring(0, 20) + "...");
        console.log("Origen de credenciales:", import.meta.env.VITE_SUPABASE_URL ? "Variables de Entorno" : "Hardcoded Fallback");
        
        console.log("Probando conexión real...");
        const result = await testSupabaseConnection(creds.url, creds.key);
        
        if (result.ok) {
            console.log("%c✅ CONEXIÓN EXITOSA: La base de datos responde correctamente.", "color: #10b981; font-weight: bold;");
            
            // Probar si las tablas existen
            const client = createClient(creds.url, creds.key);
            const tables = ['volunteers', 'app_users', 'settings', 'blog_posts'];
            console.log("Verificando tablas críticas...");
            
            for (const table of tables) {
                const { error, data } = await client.from(table).select('count', { count: 'exact', head: true });
                if (error) {
                    console.error(`❌ Tabla "${table}": ERROR - ${error.message}`);
                    if (error.message.includes('relation') && error.message.includes('does not exist')) {
                        console.warn(`   HINT: Parece que no has ejecutado el script SQL para crear la tabla "${table}".`);
                    }
                } else {
                    console.log(`✅ Tabla "${table}": OK`);
                }
            }

            // Probar login de admin
            console.log("Verificando usuario admin...");
            const { data: adminUser, error: adminError } = await client.from('app_users').select('username').eq('username', 'admin').single();
            if (adminError) {
                console.warn("⚠️ Usuario 'admin' no encontrado en la tabla 'app_users'. Se usará el fallback local.");
            } else {
                console.log("✅ Usuario 'admin' encontrado en la base de datos.");
            }
        } else {
            console.error("%c❌ FALLO DE CONEXIÓN:", "color: #ef4444; font-weight: bold;", result.error);
            console.log("%cPOSIBLES CAUSAS:", "font-weight: bold;");
            console.log("1. La URL de Supabase es incorrecta.");
            console.log("2. La Anon Key es incorrecta o ha expirado.");
            console.log("3. El proyecto de Supabase está pausado o eliminado.");
            console.log("4. Problemas de red o firewall bloqueando supabase.co");
        }
        console.log("%c---------------------------------------", "color: #10b981;");
        return "Diagnóstico completado. Revisa los mensajes arriba.";
    };
    
    console.log("%cℹ️ Tip: Escribe debugSupabase() en esta consola para diagnosticar la conexión.", "color: #3b82f6; font-style: italic;");
}
