
import React, { useState } from 'react';

export const AdminSettings: React.FC = () => {
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="font-serif text-5xl text-nude-500 font-bold tracking-tight">Studio Configuration</h2>
          <p className="text-nude-300 font-medium tracking-widest uppercase text-[10px] mt-2">Refine your brand's digital presence.</p>
        </div>
        <button className="px-10 py-4 bg-nude-500 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-black transition-all hover:scale-105 active:scale-95">
          Publish Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: General & Branding */}
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-white p-12 rounded-[3rem] border border-nude-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-nude-50 rounded-xl flex items-center justify-center text-nude-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9H21"/><path d="M9 21V12"/><path d="M15 21V12"/><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"/></svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-nude-500">General Branding</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Studio Name</label>
                <input type="text" defaultValue="Digrazia Brothers" className="w-full bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Legal HQ</label>
                <input type="text" defaultValue="La Plata, Buenos Aires" className="w-full bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Tagline / Mission</label>
              <textarea defaultValue="Artisanal furniture crafted with soul. Experience the perfect harmony of nature and design." className="w-full h-32 bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 resize-none"></textarea>
            </div>
          </section>

          <section className="bg-white p-12 rounded-[3rem] border border-nude-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-pastel-sage/30 rounded-xl flex items-center justify-center text-pastel-clay">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 className="font-serif text-2xl font-bold text-nude-500">Concierge AI</h3>
              </div>
              <button 
                onClick={() => setIsAiEnabled(!isAiEnabled)}
                className={`w-14 h-8 rounded-full transition-all relative ${isAiEnabled ? 'bg-emerald-400' : 'bg-nude-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${isAiEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">AI Model</label>
                <select className="w-full bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20">
                  <option>Gemini 3 Flash (Fast)</option>
                  <option>Gemini 3 Pro (Expert)</option>
                  <option>Nano Banana (Image Gen)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Voice Personality</label>
                <select className="w-full bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20">
                  <option>Sophisticated Artisan</option>
                  <option>Modern Minimalist</option>
                  <option>Friendly Interior Designer</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Contact & Security */}
        <div className="space-y-12">
          <section className="bg-white p-10 rounded-[3rem] border border-nude-100 shadow-sm space-y-8">
            <h3 className="font-serif text-xl font-bold text-nude-500">Studio Links</h3>
            <div className="space-y-6">
              {[
                { label: 'WhatsApp Concierge', val: '+54 9 221 456 7890' },
                { label: 'Instagram Handle', val: '@digraziabros' },
                { label: 'Studio Email', val: 'studio@digraziabros.com' },
              ].map((link, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-nude-300 ml-2">{link.label}</label>
                  <input type="text" defaultValue={link.val} className="w-full bg-nude-50 border border-nude-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pastel-clay/20" />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-pastel-rose/10 p-10 rounded-[3rem] border border-pastel-rose/20 space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-nude-500">Status Control</h3>
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
             </div>
             <div className="flex items-center justify-between py-2">
                <span className="text-xs font-bold text-nude-400 uppercase tracking-widest">Maintenance Mode</span>
                <button 
                  onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                  className={`w-12 h-6 rounded-full transition-all relative ${isMaintenanceMode ? 'bg-red-400' : 'bg-nude-100'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${isMaintenanceMode ? 'left-6.5' : 'left-0.5'}`} />
                </button>
             </div>
             <p className="text-[10px] text-nude-300 italic leading-relaxed">
               Enabling maintenance mode will temporarily restrict access to the shop while you finalize the new collection curations.
             </p>
          </section>

          <div className="p-10 bg-nude-500 rounded-[3rem] text-white space-y-6 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="font-serif text-xl font-bold relative z-10">Studio Logs</h3>
            <div className="space-y-3 relative z-10 opacity-70">
              <p className="text-[9px] uppercase tracking-widest">Last published: Today, 14:22</p>
              <p className="text-[9px] uppercase tracking-widest">Admin session: 4h active</p>
              <p className="text-[9px] uppercase tracking-widest">Server Status: Ethereal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
