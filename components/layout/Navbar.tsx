
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  solid?: boolean;
  onContactClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, solid, onContactClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolid = solid || isScrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 h-20 ${
      isSolid ? 'bg-white/95 backdrop-blur-md border-b border-nude-100 shadow-sm py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 rounded-full transition-all ${isSolid ? 'text-nude-500 hover:bg-nude-50' : 'bg-white/20 backdrop-blur-md text-white border border-white/30'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>

          <Link 
            to="/" 
            onClick={() => window.lenis?.scrollTo(0)}
            className={`font-serif text-xl md:text-3xl font-bold tracking-tighter transition-colors duration-500 flex items-center gap-2 md:gap-3 ${
            isSolid ? 'text-nude-500' : 'text-white drop-shadow-md'
          }`}>
            <img src="/icon-cream.svg" alt="Digrazia Bros" className="h-6 w-6 md:h-8 md:w-8" />
            <span className="whitespace-nowrap">DIGRAZIA <span className="font-light">Bros.</span></span>
          </Link>
        </div>
        
        <div className={`hidden md:flex items-center gap-12 text-sm font-bold uppercase tracking-widest transition-colors duration-500 ${
          isSolid ? 'text-nude-400' : 'text-white/90 drop-shadow-sm'
        }`}>
          <Link to="/" onClick={() => window.lenis?.scrollTo(0)} className="hover:text-pastel-clay transition-colors">Home</Link>
          <Link to="/shop" onClick={() => window.lenis?.scrollTo(0)} className="hover:text-pastel-clay transition-colors">Collections</Link>
          <button onClick={onContactClick} className="hover:text-pastel-clay transition-colors uppercase tracking-widest font-bold">Contact</button>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={onOpenCart} className={`relative p-2 transition-colors duration-500 ${
            isSolid ? 'text-nude-500 hover:bg-nude-100' : 'text-white hover:bg-white/20'
          } rounded-full`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-pastel-clay text-white text-xs flex items-center justify-center rounded-full shadow-lg border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-50 transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-12">
            <span className="font-serif text-2xl font-bold text-nude-500">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-nude-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex flex-col gap-8 text-xl font-bold uppercase tracking-widest text-nude-500">
            <Link to="/" onClick={() => { setIsMobileMenuOpen(false); window.lenis?.scrollTo(0); }} className="hover:text-pastel-clay transition-colors">Home</Link>
            <Link to="/shop" onClick={() => { setIsMobileMenuOpen(false); window.lenis?.scrollTo(0); }} className="hover:text-pastel-clay transition-colors">Collections</Link>
            <button onClick={() => { setIsMobileMenuOpen(false); onContactClick?.(); }} className="text-left hover:text-pastel-clay transition-colors uppercase tracking-widest font-bold">Contact</button>
          </div>
        </div>
      </div>
    </nav>
  );
};
