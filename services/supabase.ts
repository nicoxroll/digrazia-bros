import { createClient } from "@supabase/supabase-js";
import { Product } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  async getConfig() {
    const { data, error } = await supabase
      .from("config")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.warn("Error fetching config, using defaults:", error);
      return {
        id: 1,
        ai_enabled: true,
        ai_chat_enabled: true,
        ai_simulation_enabled: true,
        use_test_images: true,
        maintenance_mode: false,
      };
    }
    return data;
  },

  async updateConfig(updates: Partial<any>) {
    const { data, error } = await supabase
      .from("config")
      .update(updates)
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
