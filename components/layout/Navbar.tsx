import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  solid?: boolean;
  onContactClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  solid,
  onContactClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stop Lenis scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      window.lenis?.stop();
    } else {
      window.lenis?.start();
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (path: string) => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      // Wait for menu to close and lenis to restart
      setTimeout(() => {
        if (location.pathname === path) {
          window.lenis?.scrollTo(0);
        }
      }, 300);
    } else {
      if (location.pathname === path) {
        window.lenis?.scrollTo(0);
      }
    }
  };

  const handleContactClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      setTimeout(() => {
        onContactClick?.();
      }, 300);
    } else {
      onContactClick?.();
    }
  };

  const isSolid = solid || isScrolled;
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 ${
        isSolid
          ? "bg-white/95 backdrop-blur-md border-b border-nude-100 shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-full transition-all ${
              isSolid
                ? "text-nude-500 hover:bg-nude-50"
                : "bg-white/20 backdrop-blur-md text-white border border-white/30"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMobileMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          <Link
            to="/"
            onClick={() => handleNavClick("/")}
            className={`font-serif text-xl md:text-3xl font-bold tracking-tighter transition-colors duration-500 flex items-center gap-2 md:gap-3 ${
              isSolid ? "text-nude-500" : "text-white drop-shadow-md"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 md:h-8 md:w-8"
            >
              <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
              <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
              <path d="M5 18v2" />
              <path d="M19 18v2" />
            </svg>
            <span className="whitespace-nowrap">
              DIGRAZIA <span className="font-light">Bros.</span>
            </span>
          </Link>
        </div>

        <div
          className={`hidden md:flex items-center gap-12 text-sm font-bold uppercase tracking-widest transition-colors duration-500 ${
            isSolid ? "text-nude-400" : "text-white/90 drop-shadow-sm"
          }`}
        >
          <Link
            to="/"
            onClick={() => handleNavClick("/")}
            className="hover:text-pastel-clay transition-colors"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => handleNavClick("/shop")}
            className="hover:text-pastel-clay transition-colors"
          >
            Collections
          </Link>
          <button
            onClick={handleContactClick}
            className="hover:text-pastel-clay transition-colors uppercase tracking-widest font-bold"
          >
            Contact
          </button>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={onOpenCart}
            className={`relative p-2 transition-colors duration-500 ${
              isSolid
                ? "text-nude-500 hover:bg-nude-100"
                : "text-white hover:bg-white/20"
            } rounded-full`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-pastel-clay text-white text-xs flex items-center justify-center rounded-full shadow-lg border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Container */}
      <aside 
        className={`fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white z-[70] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden flex flex-col shadow-2xl h-[100dvh] ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-nude-100 bg-white">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-serif text-xl font-bold tracking-tighter text-nude-500"
          >
            DIGRAZIA <span className="font-light">Bros.</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-xl bg-nude-50 text-nude-500 hover:bg-nude-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="flex flex-col gap-8 text-xl font-bold uppercase tracking-widest text-nude-500">
            <Link
              to="/"
              onClick={() => handleNavClick('/')}
              className="py-2 hover:text-pastel-clay transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => handleNavClick('/shop')}
              className="py-2 hover:text-pastel-clay transition-colors"
            >
              Collections
            </Link>
            <button
              onClick={handleContactClick}
              className="py-2 text-left hover:text-pastel-clay transition-colors uppercase tracking-widest font-bold"
            >
              Contact
            </button>
          </div>
        </div>
        
        <div className="p-8 border-t border-nude-100 bg-nude-50">
           {/* Bottom branding or content can go here if needed later */}
        </div>
      </aside>

    </nav>
  );
};
