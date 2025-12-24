import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ScrollingFashionMarquee } from "../components/ui/ScrollingFashionMarquee";
import { SmoothReveal } from "../components/ui/SmoothReveal";
import { PRODUCTS } from "../constants";
import { useParallax } from "../hooks/useParallax";
import { Product } from "../types";

declare global {
  interface Window {
    L: any;
  }
}

const ExpandingGridRow: React.FC<{
  products: Product[];
  onAddToCart: (p: Product) => void;
}> = ({ products, onAddToCart }) => {
  return (
    <div className="flex flex-col lg:flex-row w-full h-[70vh] lg:h-[80vh] overflow-hidden">
      {products.map((p) => (
        <Link
          to={`/product/${p.id}`}
          key={p.id}
          onClick={() => {
            window.scrollTo(0, 0);
            window.lenis?.scrollTo(0, { immediate: true });
          }}
          className="group relative flex-[1] hover:flex-[3] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden border-r last:border-0 border-white/10"
        >
          <img
            src={p.image}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt={p.name}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 text-white">
            <div className="pb-12">
              <p className="text-[10px] lg:text-xs uppercase tracking-[0.4em] font-bold mb-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                {p.category}
              </p>
              <h3 className="font-serif text-3xl lg:text-5xl font-bold mb-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                {p.name}
              </h3>
              <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-[1000ms]">
                <p className="text-xl lg:text-2xl font-light italic">
                  ${p.price.toLocaleString()}
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAddToCart(p);
                  }}
                  className="bg-white text-nude-500 p-3 rounded-full hover:bg-pastel-clay hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const ContactUs = forwardRef<HTMLElement>((props, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadLeaflet = async () => {
      if (!window.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        await new Promise((resolve) => {
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      const L = window.L;
      if (!mapInstanceRef.current) {
        // Plaza Moreno coordinates
        const lat = -34.9213;
        const lng = -57.9566;

        mapInstanceRef.current = L.map(mapRef.current, {
          center: [lat, lng],
          zoom: 15,
          scrollWheelZoom: false,
          zoomControl: false,
        });

        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 20,
          }
        ).addTo(mapInstanceRef.current);

        // Custom Icon using favicon
        const icon = L.icon({
          iconUrl: "/icon-cream.svg",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
          className: "drop-shadow-lg",
        });

        L.marker([lat, lng], { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(
            '<div class="text-center font-serif"><h3 class="font-bold">Digrazia Brothers</h3><p class="text-sm">Plaza Moreno</p></div>'
          )
          .openPopup();
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section
      ref={ref}
      className="py-40 px-8 bg-nude-50 overflow-hidden border-t border-nude-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <span className="text-pastel-clay uppercase tracking-[0.5em] font-bold text-sm block">
              Get in Touch
            </span>
            <h2 className="font-serif text-6xl md:text-8xl text-nude-500 font-bold leading-none tracking-tighter">
              Visit the <br />{" "}
              <span className="italic font-light">Studio.</span>
            </h2>

            <div className="space-y-8 pt-8">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-pastel-clay transition-colors group-hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-nude-300 font-bold mb-1">
                    Telephone
                  </p>
                  <p className="text-xl text-nude-500">+54 (221) 456-7890</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-pastel-clay transition-colors group-hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-nude-300 font-bold mb-1">
                    Email Concierge
                  </p>
                  <a
                    href="mailto:studio@digraziabros.com"
                    className="text-xl text-nude-500 hover:text-pastel-clay transition-colors underline decoration-nude-200 underline-offset-4"
                  >
                    studio@digraziabros.com
                  </a>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="https://wa.me/5492214567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-12 py-5 bg-nude-500 text-white rounded-full font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all hover:bg-black"
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
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z" />
                  </svg>
                  Chat via WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="aspect-square bg-white rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white relative z-10">
              <div
                ref={mapRef}
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 z-10"
                style={{ minHeight: "400px" }}
              />
            </div>
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-pastel-rose opacity-20 rounded-[4rem] -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
});
ContactUs.displayName = "ContactUs";

const Newsletter: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("newsletter");
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.scrollY;

        if (
          scrollPosition > sectionTop - window.innerHeight &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setScrollY(scrollPosition - sectionTop + window.innerHeight);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="newsletter"
      className="relative h-[70vh] flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/7034299.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollY * 0.1 - 80}px) scale(1.25)`,
        }}
      />
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      <div className="relative z-10 text-center max-w-2xl px-8">
        <span className="text-white/80 uppercase tracking-[0.4em] font-bold text-sm block mb-6">
          Stay Inspired
        </span>
        <h2 className="font-serif text-5xl md:text-7xl text-white font-bold mb-8">
          Join the <span className="italic font-light">Atelier</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Email Address"
            className="flex-1 bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-8 py-4 text-white placeholder:text-white/80 focus:outline-none focus:bg-white/20 transition-all"
          />
          <button className="bg-white text-nude-500 px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-pastel-clay hover:text-white transition-all">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export const Landing: React.FC<{
  onAddToCart: (p: Product) => void;
  contactRef: React.RefObject<HTMLElement>;
}> = ({ onAddToCart, contactRef }) => {
  const aboutRef = useRef<HTMLElement>(null);
  const featured = PRODUCTS.slice(0, 4);
  const scrollY = useParallax();

  return (
    <div className="pb-0">
      <section className="relative h-screen flex items-center px-8 overflow-hidden">
        <div
          className="absolute inset-0 z-0 scale-110"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2532&auto=format&fit=crop")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="absolute inset-0 bg-black/30 z-[1]" />

        <div
          className="relative z-10 max-w-4xl mx-auto text-center animate-in fade-in zoom-in duration-1000 mt-16"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        >
          <h1 className="font-serif text-7xl md:text-[10rem] text-white mb-8 leading-none drop-shadow-2xl font-bold tracking-tighter">
            Digrazia <br />
            <span className="italic font-light">Elegance</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-medium">
            Artisanal furniture crafted with soul. Experience the perfect
            harmony of nature and design in every curve.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pb-20">
            <Link
              to="/shop"
              className="px-12 py-5 bg-white text-nude-500 rounded-full font-bold uppercase tracking-widest hover:bg-pastel-clay hover:text-white transition-all shadow-2xl hover:scale-105"
            >
              The Collection
            </Link>
            <button
              onClick={() => window.lenis?.scrollTo(aboutRef.current)}
              className="px-12 py-5 bg-white/10 backdrop-blur-md text-white border border-white/40 rounded-full font-bold uppercase tracking-widest hover:bg-white/20 transition-all shadow-xl"
            >
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-40 px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <span className="text-pastel-clay uppercase tracking-[0.5em] font-bold text-sm block">
                AI-Powered Design
              </span>
              <h2 className="font-serif text-6xl md:text-8xl text-nude-500 font-bold leading-none tracking-tighter">
                Virtual <br />{" "}
                <span className="italic font-light">Visualization.</span>
              </h2>
              <p className="text-2xl text-nude-400 leading-relaxed font-light italic">
                "Experience your furniture in your space before it arrives."
              </p>
              <p className="text-lg text-nude-300 leading-relaxed">
                Our generative AI technology creates photorealistic simulations,
                allowing you to visualize how each piece will look and feel in
                your home environment.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[16/10] w-full rounded-[2rem] overflow-hidden shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/sillon.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={aboutRef} className="py-40 px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <SmoothReveal>
                <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Workshop"
                  />
                </div>
              </SmoothReveal>
            </div>
            <div className="space-y-12">
              <span className="text-pastel-clay uppercase tracking-[0.5em] font-bold text-sm block mb-4">
                Crafting Since 1984
              </span>
              <h2 className="font-serif text-6xl md:text-8xl text-nude-500 font-bold leading-none tracking-tighter">
                Hand-Carved <br />{" "}
                <span className="italic font-light">Elegance.</span>
              </h2>
              <p className="text-2xl text-nude-400 leading-relaxed font-light italic">
                "We don't just build furniture; we curate the silent moments of
                your life."
              </p>
              <p className="text-lg text-nude-300 leading-relaxed">
                At Digrazia Brothers, every piece of timber is a promise. From
                the rolling hills of Florence to your doorstep, our master
                artisans spend weeks refining every curve to perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ScrollingFashionMarquee />

      <section className="bg-nude-100 min-h-screen flex flex-col justify-center relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-pastel-clay/10 rounded-full blur-3xl -z-0"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div className="max-w-[1920px] mx-auto pt-20 px-8 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-8">
          <div className="space-y-4">
            <span className="text-pastel-clay uppercase tracking-[0.4em] font-bold text-xs">
              Exclusives
            </span>
            <h2 className="font-serif text-6xl text-nude-500 font-bold tracking-tight">
              Featured Curations
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-nude-500 font-bold tracking-widest uppercase text-xs border-b border-nude-500 pb-1 hover:text-pastel-clay hover:border-pastel-clay transition-all"
          >
            View Full Gallery &rarr;
          </Link>
        </div>

        <div className="relative z-10">
          <ExpandingGridRow products={featured} onAddToCart={onAddToCart} />
        </div>
      </section>

      <section className="py-40 px-8 bg-nude-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-7xl text-nude-500 text-center mb-40 font-bold tracking-tighter">
            The Journey
          </h2>
          <div className="space-y-40">
            {[
              {
                year: "1984",
                title: "The First Lathe",
                img: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=1000&auto=format&fit=crop",
              },
              {
                year: "1998",
                title: "Generational Craft",
                img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop",
              },
              {
                year: "2015",
                title: "Sustainable Future",
                img: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=1000&auto=format&fit=crop",
              },
            ].map((step, idx) => (
              <SmoothReveal key={idx}>
                <div
                  className={`flex flex-col ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-24 group`}
                >
                  <div className="w-full md:w-1/2 overflow-hidden rounded-[4rem] shadow-2xl relative">
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="w-full md:w-1/2 space-y-8">
                    <span className="font-serif italic text-9xl text-nude-300 leading-none select-none drop-shadow-sm font-bold">
                      {step.year}
                    </span>
                    <h3 className="text-5xl font-serif text-nude-500 font-bold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xl text-nude-400 leading-relaxed font-light">
                      Mastery isn't taught; it's inherited. Every generation of
                      Digrazia Brothers has added their own soul to the workshop
                      floor.
                    </p>
                  </div>
                </div>
              </SmoothReveal>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      <ContactUs ref={contactRef} />
    </div>
  );
};
