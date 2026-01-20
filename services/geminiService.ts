import { GoogleGenAI } from "@google/genai";
import { DISABLE_GEMINI } from "../constants";
import { ImageSize, Product } from "../types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export class GeminiService {
  /**
   * Checks if the API Key is provided in the environment.
   */
  static isConfigured(): boolean {
    const apiKey = import.meta.env.VITE_API_KEY || (typeof process !== 'undefined' ? process.env.VITE_API_KEY : undefined);
    return Boolean(apiKey && apiKey !== "" && apiKey !== "undefined");
  }

  private client: GoogleGenAI;

  constructor() {
    const apiKey = import.meta.env.VITE_API_KEY || (typeof process !== 'undefined' ? process.env.VITE_API_KEY : undefined);

    if (!apiKey) {
      console.warn("Gemini API Key is not configured");
       // Handle missing key gracefully if needed, or let throw later
    }
    this.client = new GoogleGenAI(apiKey || "");
  }

  /**
   * Chat with history context
   */
  static async chat(history: Message[], useTestImages: boolean = false) {
    if (DISABLE_GEMINI) return { role: "assistant", content: "AI is disabled." };
    if (!this.isConfigured()) return { role: "assistant", content: "API Key missing." };

    try {
      const ai = this.getAI();
      const lastMessage = history[history.length - 1];

      // Convert history to format for generateContent with contents array
      const contents = history.slice(0, -1).map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // Add the latest message
      contents.push({
        role: "user",
        parts: [{ text: lastMessage.content }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: "You are a helpful and quick assistant for Digrazia Brothers, a luxury furniture store. Keep answers concise and elegant. Use Markdown for formatting. If the user asks for design advice, be sophisticated.",
        },
      });
      
      return {
        role: "assistant",
        content: response.text,
      };
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      throw error;
    }
  }

  /**
   * Fast text responses using gemini-3-flash-preview.
   */
  static async quickChat(prompt: string) {
    if (DISABLE_GEMINI) return null;
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction:
            "You are a helpful and quick assistant for Digrazia Brothers, a luxury furniture store. Keep answers concise and elegant. Use Markdown for formatting.",
        },
      });
      return response.text;
    } catch (error: any) {
      if (error.message === "API_KEY_MISSING") return null;
      throw error;
    }
  }

  /**
   * Advanced reasoning with thinking budget using gemini-3-pro-preview.
   */
  static async deepChat(prompt: string) {
    if (DISABLE_GEMINI) return null;
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert interior designer and furniture specialist for Digrazia Brothers. Provide deep insights, material details, and styling advice. Use your thinking capacity for complex design queries. Use Markdown for formatting.",
          thinkingConfig: { thinkingBudget: 32768 },
        },
      });
      return response.text;
    } catch (error: any) {
      if (error.message === "API_KEY_MISSING") return null;
      throw error;
    }
  }

  /**
   * High-quality image generation using gemini-3-pro-image-preview.
   */
  static async generateVisual(prompt: string, size: ImageSize) {
    if (DISABLE_GEMINI) return null;
    if (!this.isConfigured()) return null;

    if (
      typeof window !== "undefined" &&
      !(await (window as any).aistudio?.hasSelectedApiKey())
    ) {
      await (window as any).aistudio?.openSelectKey();
    }

    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [
          {
            text: `Create a professional high-end furniture studio photo for Digrazia Brothers: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }

  /**
   * Helper to convert an image URL or Blob to Base64
   */
  static async urlToBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Just return the raw base64 string without data prefix, 
        // to be consistent with how we use it in visualizeInSpace for the furniture image
        // BUT wait, visualizeInSpace was updated to handle roomImage with prefix.
        // Let's make this return valid Base64 string only
        const res = reader.result as string;
        const base64 = res.includes(',') ? res.split(',')[1] : res;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Contextual image editing/placement using gemini-2.5-flash-image.
   */
  static async visualizeInSpace(
    roomImageBase64: string,
    product: Product,
    userPrompt: string,
    furnitureImageBase64: string
  ) {
    if (DISABLE_GEMINI) return null;
    if (!this.isConfigured()) return null;

    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: roomImageBase64.replace(/^data:image\/\w+;base64,/, ""),
              mimeType: "image/jpeg",
            },
          },
          {
            inlineData: {
              data: furnitureImageBase64, // Already stripped of prefix in urlToBase64? No, urlToBase64 strips it.
              mimeType: "image/jpeg",
            },
          },
          {
            text: `Image 1 is a photo of my room. Image 2 is the "${product.name}" furniture. Please realistically place the furniture from Image 2 into the room shown in Image 1. Maintain perspective, lighting, and shadow consistency. Additional instructions: ${userPrompt}`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }
}
