import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSolid = solid || isScrolled;
  
  // Calculate final Z-index to ensure menu stays on top
  const zIndex = isMobileMenuOpen ? "z-[70]" : "z-40";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 ${zIndex} transition-all duration-500 h-20 ${
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
            onClick={() => window.lenis?.scrollTo(0)}
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
            onClick={() => window.lenis?.scrollTo(0)}
            className="hover:text-pastel-clay transition-colors"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => window.lenis?.scrollTo(0)}
            className="hover:text-pastel-clay transition-colors"
          >
            Collections
          </Link>
          <button
            onClick={onContactClick}
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
        className={`fixed inset-0 bg-white z-[70] transition-transform duration-300 md:hidden flex flex-col ${
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
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.lenis?.scrollTo(0);
              }}
              className="py-2 hover:text-pastel-clay transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.lenis?.scrollTo(0);
              }}
              className="py-2 hover:text-pastel-clay transition-colors"
            >
              Collections
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onContactClick?.();
              }}
              className="py-2 text-left hover:text-pastel-clay transition-colors uppercase tracking-widest font-bold"
            >
              Contact
            </button>
          </div>
        </div>
        
         {/* Footer branding inside menu */}
        <div className="p-8 border-t border-nude-100 bg-nude-50">
           <p className="text-[10px] text-nude-300 font-bold uppercase tracking-widest">
             © 2024 Digrazia Bros.
           </p>
        </div>
      </div>
    </nav>
  );
};
