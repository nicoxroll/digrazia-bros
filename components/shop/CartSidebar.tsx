import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSmoothContainerScroll } from "../../hooks/useSmoothContainerScroll";
import { CartItem } from "../../types";

interface CartSidebarProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, q: number) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  items,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const navigate = useNavigate();
  const { initScroll } = useSmoothContainerScroll();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const total = items.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);

  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      initScroll(scrollContainerRef.current);
    }
  }, [isOpen, initScroll]);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-lg bg-white z-[60] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-nude-100 flex justify-between items-center">
            <h3 className="font-serif text-3xl text-nude-500 font-bold">
              Your Basket
            </h3>
            <button
              onClick={onClose}
              className="p-3 hover:bg-nude-50 rounded-full transition-colors text-nude-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex-1 p-8 space-y-10"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-nude-200"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <p className="text-nude-300 font-serif italic text-2xl">
                  The basket is empty.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-8 items-center border-b border-nude-50 pb-10 last:border-0"
                >
                  <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 shadow-md">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-serif text-2xl font-bold text-nude-500">
                      {item.name}
                    </h4>
                    <p className="text-pastel-clay font-bold text-lg">
                      ${item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-4 bg-nude-50 rounded-full px-4 py-2 border border-nude-100">
                        <button
                          onClick={() => onUpdate(item.id, item.quantity - 1)}
                          className="text-xl font-bold text-nude-400 hover:text-nude-500"
                        >
                          -
                        </button>
                        <span className="font-bold text-nude-500 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdate(item.id, item.quantity + 1)}
                          className="text-xl font-bold text-nude-400 hover:text-nude-500"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onUpdate(item.id, 0)}
                        className="text-xs uppercase tracking-widest font-bold text-red-300 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-10 border-t border-nude-100 bg-nude-50 space-y-6">
            <div className="flex justify-between font-bold text-3xl text-nude-500">
              <span className="font-serif">Subtotal</span>
              <span className="font-serif">${total.toLocaleString()}</span>
            </div>
            <button
              disabled={items.length === 0}
              onClick={handleCheckout}
              className="w-full bg-nude-500 text-white py-6 rounded-full font-bold uppercase tracking-widest shadow-2xl hover:bg-black transition-all disabled:opacity-30"
            >
              Secure Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
