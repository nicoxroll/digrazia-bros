
import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onContactClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onContactClick }) => {
  return (
    <footer className="bg-[#1a120b] py-32 px-8 border-t border-nude-900 text-white">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-24">
        <div className="space-y-8">
          <h4 className="font-serif text-4xl font-bold tracking-tighter text-white">DIGRAZIA <span className="font-light text-pastel-clay">Bros.</span></h4>
          <p className="text-xl text-nude-300 leading-relaxed font-light italic">"Elevating human spaces through master craftsmanship and sustainable design."</p>
        </div>
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h5 className="font-bold mb-10 uppercase tracking-[0.3em] text-xs text-pastel-clay">Explore</h5>
            <ul className="space-y-6 text-sm font-medium text-nude-100">
              <li><Link to="/" className="hover:text-white transition-colors">Home Studio</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Collections</Link></li>
              <li><button className="hover:text-white transition-colors">The Legacy</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-10 uppercase tracking-[0.3em] text-xs text-pastel-clay">Concierge</h5>
            <ul className="space-y-6 text-sm font-medium text-nude-100">
              <li><Link to="/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
              <li><button className="hover:text-white transition-colors">Care Guide</button></li>
              <li><button onClick={onContactClick} className="hover:text-white transition-colors">Studio Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end justify-center">
           <div className="flex gap-12">
              <span className="text-nude-400 hover:text-pastel-clay cursor-pointer transition-all hover:scale-110"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></span>
              <span className="text-nude-400 hover:text-pastel-clay cursor-pointer transition-all hover:scale-110"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></span>
           </div>
           <p className="mt-12 text-[10px] text-nude-500 uppercase tracking-[0.4em] font-bold">© 2024 Digrazia Brothers Studio. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
