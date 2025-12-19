
import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const InventoryService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  },

  async addProduct(product: Omit<Product, 'id'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadImage(file: File) {
    // Convert to WebP and compress
    const webpBlob = await new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('WebP conversion failed'));
        }, 'image/webp', 0.8); // 0.8 quality for efficiency
      };
      img.onerror = (e) => reject(e);
      img.src = URL.createObjectURL(file);
    });

    const fileName = `${Math.random()}.webp`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, webpBlob, {
        contentType: 'image/webp',
        cacheControl: '3600'
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
