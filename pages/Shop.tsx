
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import { useParallax } from '../hooks/useParallax';

const ExpandingGridRow: React.FC<{ products: Product[], onAddToCart: (p: Product) => void }> = ({ products, onAddToCart }) => {
  return (
    <div className="flex flex-col lg:flex-row w-full h-[70vh] lg:h-[80vh] overflow-hidden">
      {products.map((p) => (
        <Link 
          to={`/product/${p.id}`} 
          key={p.id} 
          onClick={() => { window.scrollTo(0, 0); window.lenis?.scrollTo(0, { immediate: true }); }}
          className="group relative flex-[1] hover:flex-[3] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden border-r last:border-0 border-white/10"
        >
          <img src={p.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={p.name} />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 text-white">
            <div className="pb-12">
                <p className="text-[10px] lg:text-xs uppercase tracking-[0.4em] font-bold mb-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">{p.category}</p>
                <h3 className="font-serif text-3xl lg:text-5xl font-bold mb-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-150">{p.name}</h3>
                <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-[1000ms]">
                    <p className="text-xl lg:text-2xl font-light italic">${p.price.toLocaleString()}</p>
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(p); }}
                        className="bg-white text-nude-500 p-3 rounded-full hover:bg-pastel-clay hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export const Shop: React.FC<{ onAddToCart: (p: Product) => void }> = ({ onAddToCart }) => {
  const [filter, setFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const categories = ['All', 'Living Room', 'Bedroom', 'Dining Room', 'Office', 'Decor'];

  const filteredProducts = useMemo(() => {
    return filter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  }, [filter]);

  const productChunks = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < filteredProducts.length; i += 3) {
      chunks.push(filteredProducts.slice(i, i + 3));
    }
    return chunks;
  }, [filteredProducts]);

  const scrollY = useParallax();

  return (
    <div className="pb-24">
      <section className="relative h-screen flex items-center px-8 overflow-hidden mb-24">
        <div 
          className="absolute inset-0 z-0 scale-105" 
          style={{ 
            backgroundImage: 'url("https://images.pexels.com/photos/3614082/pexels-photo-3614082.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        <div 
          className="relative z-10 max-w-4xl mx-auto text-center px-4"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        >
          <h2 className="font-serif text-5xl sm:text-7xl md:text-[10rem] text-white mb-6 drop-shadow-xl font-bold tracking-tighter">Collections</h2>
        </div>
      </section>

      <div className="max-w-[1920px] mx-auto px-8">
        <div className="mb-8 border-b border-nude-50 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <h3 className="font-serif text-5xl text-nude-500 font-bold tracking-tight">The Gallery</h3>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-12 py-4 bg-white border border-nude-100 rounded-full text-xs font-bold uppercase tracking-widest text-nude-500 hover:bg-nude-50 transition-all shadow-sm flex items-center gap-3"
            >
              Filter Pieces <svg className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-wrap justify-center gap-4 py-6">
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)} className={`px-12 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === c ? 'bg-nude-500 text-white shadow-xl scale-105' : 'bg-white text-nude-400 border border-nude-100 hover:bg-nude-50'}`}>{c}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full bg-nude-50">
          {productChunks.map((chunk, idx) => (
            <ExpandingGridRow key={idx} products={chunk} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};
