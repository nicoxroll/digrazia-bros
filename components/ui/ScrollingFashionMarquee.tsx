
import React, { useState, useEffect } from 'react';

export const ScrollingFashionMarquee: React.FC = () => {
  const [scrollPos, setScrollPos] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollPos(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const images = [
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop',
    '/images/2343468.jpg',
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop',
    '/images/7598133.jpg'
  ];

  return (
    <section className="py-40 bg-white overflow-hidden relative">
      <div 
        className="text-[20vw] font-serif font-bold text-nude-200 whitespace-nowrap leading-none absolute top-10 select-none pointer-events-none opacity-80"
        style={{ transform: `translateX(${-scrollPos * 0.5}px)` }}
      >
        ARTISAN LEGACY ARTISAN LEGACY ARTISAN LEGACY
      </div>

      <div className="relative z-10 flex gap-12 mt-20" style={{ transform: `translateX(${(scrollPos * 0.3) - 1000}px)` }}>
        {[...images, ...images].map((img, i) => (
          <div key={i} className="w-[450px] aspect-[3/4] rounded-[3rem] overflow-hidden shrink-0 shadow-2xl">
            <img src={img} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="gallery-item" />
          </div>
        ))}
      </div>

      <div 
        className="text-[20vw] font-serif font-bold text-nude-200 whitespace-nowrap leading-none absolute bottom-10 select-none pointer-events-none opacity-80"
        style={{ transform: `translateX(${(scrollPos * 0.4) - 2000}px)` }}
      >
        PURE DESIGN PURE DESIGN PURE DESIGN
      </div>
    </section>
  );
};
