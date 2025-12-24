
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
          <p className="text-xl text-nude-400 leading-relaxed font-light italic">"Elevating human spaces through master craftsmanship and sustainable design."</p>
        </div>
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h5 className="font-bold mb-10 uppercase tracking-[0.3em] text-xs text-pastel-clay">Explore</h5>
            <ul className="space-y-6 text-sm font-medium text-nude-300">
              <li><Link to="/" className="hover:text-white transition-colors">Home Studio</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Collections</Link></li>
              <li><button className="hover:text-white transition-colors">The Legacy</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-10 uppercase tracking-[0.3em] text-xs text-pastel-clay">Concierge</h5>
            <ul className="space-y-6 text-sm font-medium text-nude-300">
              <li><Link to="/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
              <li><button className="hover:text-white transition-colors">Care Guide</button></li>
              <li><button onClick={onContactClick} className="hover:text-white transition-colors">Studio Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end justify-center">
           <div className="flex gap-12">
              <span className="text-nude-500 hover:text-pastel-clay cursor-pointer transition-all hover:scale-110"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></span>
              <span className="text-nude-500 hover:text-pastel-clay cursor-pointer transition-all hover:scale-110"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></span>
           </div>
           <p className="mt-12 text-[10px] text-nude-600 uppercase tracking-[0.4em] font-bold">© 2024 Digrazia Brothers Studio. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
