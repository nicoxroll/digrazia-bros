
import { GoogleGenAI } from "@google/genai";
import { ImageSize, Product } from "../types";

export class GeminiService {
  /**
   * Checks if the API Key is provided in the environment.
   */
  static isConfigured(): boolean {
    return !!process.env.API_KEY && process.env.API_KEY !== 'undefined' && process.env.API_KEY !== '';
  }

  private static getAI() {
    if (!this.isConfigured()) {
      throw new Error("API_KEY_MISSING");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Fast text responses using gemini-3-flash-preview.
   */
  static async quickChat(prompt: string) {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a helpful and quick assistant for Digrazia Brothers, a luxury furniture store. Keep answers concise and elegant. Use Markdown for formatting.",
        }
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
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are an expert interior designer and furniture specialist for Digrazia Brothers. Provide deep insights, material details, and styling advice. Use your thinking capacity for complex design queries. Use Markdown for formatting.",
          thinkingConfig: { thinkingBudget: 32768 }
        }
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
    if (!this.isConfigured()) return null;

    if (typeof window !== 'undefined' && !(await (window as any).aistudio?.hasSelectedApiKey())) {
      await (window as any).aistudio?.openSelectKey();
    }

    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Create a professional high-end furniture studio photo for Digrazia Brothers: ${prompt}` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
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
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Contextual image editing/placement using gemini-2.5-flash-image.
   */
  static async visualizeInSpace(roomImageBase64: string, product: Product, userPrompt: string, furnitureImageBase64: string) {
    if (!this.isConfigured()) return null;
    
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: roomImageBase64.split(',')[1],
              mimeType: 'image/jpeg'
            }
          },
          {
            inlineData: {
              data: furnitureImageBase64,
              mimeType: 'image/jpeg'
            }
          },
          {
            text: `Image 1 is a photo of my room. Image 2 is the "${product.name}" furniture. Please realistically place the furniture from Image 2 into the room shown in Image 1. Maintain perspective, lighting, and shadow consistency. Additional instructions: ${userPrompt}`
          }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }
}
