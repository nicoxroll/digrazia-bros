
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { GeminiService } from '../services/geminiService';
import { Message } from '../types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to **Digrazia Brothers**. How can I help you design your dream space today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check for image generation intent
      const isImageRequest = /(generar|crear|hacer|generate|create|draw).*(imagen|image|foto|photo|visual)/i.test(input);

      if (isImageRequest) {
        const imageBase64 = await GeminiService.generateVisual(input, '1K');
        if (imageBase64) {
           const botMessage: Message = {
             role: 'assistant',
             content: 'Here is a bespoke visualization based on your request.',
             image: imageBase64
           };
           setMessages(prev => [...prev, botMessage]);
           return;
        }
      }

      let response = await GeminiService.quickChat(input);
      
      // Fallback if API key is not present
      if (response === null) {
        response = "Por favor, contáctanos al siguiente número: **+54 (221) 456-7890** para una atención personalizada.";
      }

      const botMessage: Message = {
        role: 'assistant',
        content: response,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-96 h-[550px] flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-nude-200 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-6 bg-nude-100 flex justify-between items-center border-b border-nude-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-nude-200">
                 <img src="/icon-cream.svg" alt="Concierge" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-nude-500 text-lg">Studio Concierge</h3>
                <p className="text-[10px] uppercase tracking-widest text-nude-400 font-bold">Live Assistance</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-nude-200 rounded-full transition-colors text-nude-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[9px] uppercase tracking-widest font-bold text-nude-300 mb-1 px-2">
                  {m.role === 'user' ? 'CLIENT' : 'CONCIERGE'}
                </span>
                <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed prose prose-sm prose-stone ${
                  m.role === 'user' 
                    ? 'bg-nude-400 text-white rounded-tr-none shadow-sm' 
                    : 'bg-nude-50 text-nude-500 border border-nude-100 rounded-tl-none'
                }`}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                  {m.image && (
                    <div className="mt-4 relative group rounded-xl overflow-hidden">
                      <img src={m.image} alt="Generated Design" className="w-full h-auto rounded-xl shadow-sm" />
                      <a 
                        href={m.image} 
                        download={`digrazia-design-${Date.now()}.png`}
                        className="absolute bottom-3 right-3 bg-white/90 p-2.5 rounded-full shadow-lg hover:bg-white transition-all text-nude-500 opacity-0 group-hover:opacity-100 hover:scale-110"
                        title="Download Design"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] uppercase tracking-widest font-bold text-nude-300 mb-1 px-2">CONCIERGE</span>
                <div className="bg-nude-50 p-4 rounded-2xl animate-pulse text-nude-400 border border-nude-100 rounded-tl-none">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-nude-200 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-nude-200 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-nude-200 rounded-full animate-bounce delay-150"></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-nude-100 bg-nude-50 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How can we assist you?"
              className="flex-1 bg-white border border-nude-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-pastel-clay/20 focus:border-pastel-clay outline-none transition-all placeholder:text-nude-200"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-nude-500 text-white p-3 rounded-2xl hover:bg-black transition-all disabled:opacity-50 shadow-md active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-nude-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group border-4 border-white overflow-hidden"
        >
          <img src="/icon-cream.svg" alt="Chat" className="w-8 h-8 brightness-0 invert" />
        </button>
      )}
    </div>
  );
};
