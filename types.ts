
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Living Room' | 'Bedroom' | 'Dining Room' | 'Office' | 'Decor';
  image: string;
  images?: string[];
  rating: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  isThinking?: boolean;
}

// ImageSize options compliant with gemini-3-pro-image-preview requirements.
export type ImageSize = '1K' | '2K' | '4K';

export interface AppConfig {
  id: number;
  ai_enabled: boolean;
  ai_chat_enabled: boolean;
  ai_simulation_enabled: boolean;
  use_test_images: boolean;
  maintenance_mode: boolean;
}
