import { createClient } from "@supabase/supabase-js";
import { Product } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey && 
         supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined';
};

if (!isSupabaseConfigured()) {
  console.warn("Missing Supabase environment variables. Backend features will be disabled.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder"
);

export const InventoryService = {
  async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  async addProduct(product: Omit<Product, "id">) {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    // First get the current product to merge with updates
    const { data: currentProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Merge updates with current data
    const updatedProduct = { ...currentProduct, ...updates };

    // Use upsert instead of update to avoid CORS PATCH issues
    const { data, error } = await supabase
      .from("products")
      .upsert(updatedProduct, { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
  },

  async uploadImage(file: File) {
    // Convert to WebP and compress
    const webpBlob = await new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("WebP conversion failed"));
          },
          "image/webp",
          0.8
        ); // 0.8 quality for efficiency
      };
      img.onerror = (e) => reject(e);
      img.src = URL.createObjectURL(file);
    });

    const fileName = `${Math.random()}.webp`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, webpBlob, {
        contentType: "image/webp",
        cacheControl: "3600",
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);

    return data.publicUrl;
  },
};

export const ConfigService = {
  isConfigured: isSupabaseConfigured,

  async get() {
    if (!isSupabaseConfigured()) return { data: null, error: null };
    
    // We try to access config, falling back to basic defaults if table missing
    const { data, error } = await supabase
      .from("config")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      // Return null data so caller knows to use defaults
      return { data: null, error };
    }
    return { data: data as any, error: null };
  },

  async update(updates: Partial<any>) {
    if (!isSupabaseConfigured()) return;

    // Get current config first to ensure we have all fields
    const { data: currentConfig } = await supabase
      .from("config")
      .select("*")
      .eq("id", 1)
      .single();

    // Default config fallback
    const baseConfig = currentConfig || {
      id: 1,
      ai_enabled: true,
      ai_chat_enabled: true,
      ai_simulation_enabled: true,
      use_test_images: true,
      maintenance_mode: false,
    };

    // Merge updates
    const newConfig = { ...baseConfig, ...updates };

    // Use upsert instead of update to avoid CORS PATCH issues
    const { data, error } = await supabase
      .from("config")
      .upsert(newConfig, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async initialize(config: any) {
    if (!isSupabaseConfigured()) return;

    const { data, error } = await supabase
      .from("config")
      .upsert(config)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
