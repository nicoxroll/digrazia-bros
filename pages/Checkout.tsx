
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { useSmoothContainerScroll } from '../hooks/useSmoothContainerScroll';

interface CheckoutProps {
  cart: CartItem[];
  onClear: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, onClear }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { initScroll } = useSmoothContainerScroll();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 150;
  const total = subtotal + shipping;

  useEffect(() => {
    if (scrollContainerRef.current) {
      initScroll(scrollContainerRef.current);
    }
  }, [initScroll]);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Success state
    onClear();
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-nude-50">
        <h2 className="font-serif text-5xl text-nude-500 mb-8 font-bold">Your basket is empty</h2>
        <button onClick={() => navigate('/shop')} className="px-12 py-5 bg-nude-500 text-white rounded-full font-bold uppercase tracking-widest hover:bg-black transition-all">Explore Collections</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-8 bg-nude-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {step < 3 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="space-y-12">
              <h2 className="font-serif text-6xl text-nude-500 font-bold tracking-tighter">Checkout.</h2>
              <form onSubmit={handleOrder} className="space-y-8 bg-white p-12 rounded-[3rem] shadow-sm border border-nude-100">
                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-pastel-clay">Shipping Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <input required placeholder="First Name" className="w-full bg-nude-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 transition-all" />
                    <input required placeholder="Last Name" className="w-full bg-nude-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 transition-all" />
                  </div>
                  <input required placeholder="Shipping Address" className="w-full bg-nude-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 transition-all" />
                  <div className="grid grid-cols-2 gap-6">
                    <input required placeholder="City" className="w-full bg-nude-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 transition-all" />
                    <input required placeholder="Postal Code" className="w-full bg-nude-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 transition-all" />
                  </div>
                </div>

                <div className="space-y-6 pt-8">
                  <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-pastel-clay">Payment Preview</h3>
                  <div className="p-6 bg-nude-50 rounded-2xl border border-nude-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-nude-500 rounded-md opacity-20"></div>
                      <span className="text-sm font-bold text-nude-400">Card ending in •••• 4421</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-pastel-clay cursor-pointer hover:underline">Edit</span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-nude-500 text-white py-6 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-black transition-all mt-12">
                  Complete Commission
                </button>
              </form>
            </div>

            <div className="space-y-12">
               <h3 className="font-serif text-3xl text-nude-500 font-bold">Order Summary</h3>
               <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-nude-100 space-y-8">
                  <div
                    ref={scrollContainerRef}
                    className="space-y-6 max-h-[400px] no-scrollbar"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                  >
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-6 items-center">
                        <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-nude-500">{item.name}</h4>
                          <p className="text-xs text-nude-300 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-serif font-bold text-nude-500">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-nude-50 pt-8 space-y-4">
                    <div className="flex justify-between text-nude-400">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-nude-400">
                      <span>Shipping Concierge</span>
                      <span>${shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-3xl font-serif font-bold text-nude-500 pt-4">
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-40 space-y-12 animate-in fade-in zoom-in duration-1000">
             <div className="w-32 h-32 bg-pastel-sage rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xl border-4 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17L4 12"/></svg>
             </div>
             <div className="space-y-4">
                <h2 className="font-serif text-7xl text-nude-500 font-bold tracking-tighter">Gratitude.</h2>
                <p className="text-xl text-nude-300 max-w-lg mx-auto leading-relaxed">Your order has been placed successfully. A dedicated concierge will reach out shortly to coordinate delivery.</p>
             </div>
             <button onClick={() => navigate('/')} className="px-12 py-5 bg-nude-500 text-white rounded-full font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl">Back to Studio</button>
          </div>
        )}
      </div>
    </div>
  );
};
