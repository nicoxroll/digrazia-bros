
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import { GeminiService } from '../services/geminiService';
import { useParallax } from '../hooks/useParallax';

const Lightbox: React.FC<{ 
  images: string[], 
  index: number, 
  onClose: () => void, 
  onNext: () => void, 
  onPrev: () => void 
}> = ({ images, index, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button 
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-4 z-[110]"
        onClick={onClose}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>

      <button 
        className="absolute left-8 text-white/50 hover:text-white transition-colors p-4 z-[110] bg-white/5 rounded-full"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img 
          src={images[index]} 
          className="w-auto h-auto max-w-full max-h-full object-contain select-none animate-in zoom-in-95 duration-500 shadow-2xl" 
          alt={`Gallery ${index}`} 
        />
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full absolute bottom-12 left-1/2 -translate-x-1/2">
            <p className="text-white font-mono text-sm tracking-widest uppercase">
            {index + 1} / {images.length}
            </p>
        </div>
      </div>

      <button 
        className="absolute right-8 text-white/50 hover:text-white transition-colors p-4 z-[110] bg-white/5 rounded-full"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
};

const ExpandingImageRow: React.FC<{ images: string[], onImageClick: (idx: number) => void }> = ({ images, onImageClick }) => {
  return (
    <div className="flex flex-col lg:flex-row w-full h-[70vh] lg:h-[80vh] overflow-hidden rounded-[4rem] shadow-2xl">
      {images.map((img, i) => (
        <div 
          key={i} 
          onClick={() => onImageClick(i)}
          className="group relative flex-[1] hover:flex-[3] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden cursor-zoom-in border-r last:border-0 border-white/10"
        >
          <img src={img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={`View ${i}`} />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
        </div>
      ))}
    </div>
  );
};

export const ProductDetail: React.FC<{ onAddToCart: (p: Product) => void }> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [visualPrompt, setVisualPrompt] = useState('');
  const [visualResult, setVisualResult] = useState<string | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollY = useParallax();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!product) return null;

  const galleryImages = [product.image, ...(product.images || [])].slice(0, 4);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setRoomImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVisualize = async () => {
    if (!roomImage) return;
    setIsVisualizing(true);
    setError(null);
    try {
      const furnitureB64 = await GeminiService.urlToBase64(product.image);
      const result = await GeminiService.visualizeInSpace(roomImage, product, visualPrompt, furnitureB64);
      setVisualResult(result);
    } catch (err) {
      console.error(err);
      setError("IA simulation encountered an issue. Please try later.");
    } finally {
      setIsVisualizing(false);
    }
  };

  const handleDownload = () => {
    if (!visualResult) return;
    const link = document.createElement('a');
    link.href = visualResult;
    link.download = `digrazia-bros-visualization-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white">
      {lightboxIndex !== null && (
        <Lightbox 
          images={galleryImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % galleryImages.length)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length)}
        />
      )}

      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-nude-50">
        <div className="absolute inset-0">
          <img 
            src={product.image} 
            className="w-full h-full object-cover" 
            alt={product.name} 
            style={{ transform: `translateY(${scrollY * 0.5}px) scale(1.1)` }}
          />
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>
        <div className="absolute bottom-16 left-8 lg:left-24 z-10 max-w-xl">
           <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors drop-shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
            <span className="uppercase tracking-widest text-xs font-bold">Back</span>
          </button>
          <p className="text-white/70 uppercase tracking-[0.3em] font-bold text-xs mb-3 drop-shadow-sm">{product.category}</p>
          <h1 className="font-serif text-6xl lg:text-8xl text-white mb-6 font-bold tracking-tighter drop-shadow-2xl">{product.name}</h1>
          <div className="flex items-center gap-8">
            <p className="text-3xl text-white font-serif italic drop-shadow-md">${product.price.toLocaleString()}</p>
            <button onClick={() => onAddToCart(product)} className="bg-white text-nude-500 px-10 py-5 rounded-full font-bold uppercase tracking-widest shadow-2xl hover:bg-pastel-clay hover:text-white transition-all">Add to Basket</button>
          </div>
        </div>
      </section>

      <section className="max-w-[1920px] mx-auto px-8 py-32 space-y-32">
        <div className="space-y-12 max-w-4xl">
           <span className="text-pastel-clay uppercase tracking-[0.5em] font-bold text-xs">The Concept</span>
           <p className="text-2xl text-nude-400 leading-relaxed font-light italic">"{product.description}"</p>
        </div>

        <ExpandingImageRow 
          images={galleryImages} 
          onImageClick={(idx) => setLightboxIndex(idx)} 
        />

        <section className="bg-nude-50 rounded-[5rem] p-12 lg:p-24 overflow-hidden relative mt-32">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="font-serif text-6xl text-nude-500 mb-12 font-bold tracking-tight">AI Scene Visualization</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8 text-left">
                <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-white rounded-3xl border-2 border-dashed border-nude-200 flex flex-col items-center justify-center cursor-pointer hover:border-pastel-clay transition-all overflow-hidden group">
                  {roomImage ? <img src={roomImage} className="w-full h-full object-cover" alt="Your room" /> : <p className="text-sm font-bold text-nude-300">Upload Room Photo</p>}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                
                {error && (
                  <div className="bg-white border-l-4 border-red-400 p-6 shadow-xl rounded-r-2xl animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-50 rounded-full text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      </div>
                      <div>
                        <p className="font-serif text-red-900 font-bold text-lg">Simulation Issue</p>
                        <p className="text-nude-400 text-sm">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={handleVisualize} disabled={!roomImage || isVisualizing} className="w-full bg-nude-500 text-white py-6 rounded-full font-bold uppercase tracking-widest">
                  {isVisualizing ? 'Simulating...' : 'Visualize in My Space'}
                </button>
              </div>
              <div className="aspect-square bg-white rounded-[4rem] shadow-2xl overflow-hidden relative border-8 border-white group">
                {visualResult ? (
                  <>
                    <img src={visualResult} className="w-full h-full object-cover animate-in fade-in" alt="Result" />
                    <button 
                      onClick={handleDownload}
                      className="absolute bottom-8 right-8 bg-white text-nude-500 p-4 rounded-full shadow-xl hover:bg-pastel-clay hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-300 z-20"
                      title="Download Visualization"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center italic text-nude-200">Your render appears here</div>
                )}
                {isVisualizing && <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center animate-pulse" />}
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};
