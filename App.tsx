
import React, { useState, useRef, useEffect } from 'react';
import { MemoryRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';

import { Product, CartItem } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { CartSidebar } from './components/shop/CartSidebar';
import { ChatWidget } from './components/ChatWidget';
import { AdminSidebar } from './components/admin/AdminSidebar';

// Pages
import { Landing } from './pages/Landing';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminSales } from './pages/admin/AdminSales';
import { AdminSettings } from './pages/admin/AdminSettings';

declare global {
  interface Window {
    L: any;
    lenis: any;
  }
}

const AppContent: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [isAdminSidebarCollapsed, setIsAdminSidebarCollapsed] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    window.lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  const scrollToContact = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => contactRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else {
      contactRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, q: number) => {
    setCart(prev => q <= 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity: q } : i));
  };

  const cartCount = cart.reduce((acc, cur) => acc + cur.quantity, 0);
  const isAdminView = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';

  return (
    <div className={`min-h-screen flex flex-col font-sans text-nude-500 bg-white selection:bg-pastel-clay selection:text-white ${isAdminView ? 'flex-row' : ''}`}>
      <ScrollToTop />
      
      {isAdminView && adminUser && (
        <AdminSidebar 
          isCollapsed={isAdminSidebarCollapsed} 
          onToggle={() => setIsAdminSidebarCollapsed(!isAdminSidebarCollapsed)} 
        />
      )}

      <div className="flex-1 flex flex-col">
        {!isAdminView && !isLoginPage && (
          <Navbar 
            cartCount={cartCount} 
            onOpenCart={() => setIsCartOpen(true)} 
            solid={location.pathname !== '/' && location.pathname !== '/shop' && !location.pathname.startsWith('/product/')} 
            onContactClick={scrollToContact} 
          />
        )}
        
        <main className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isAdminView && adminUser ? (isAdminSidebarCollapsed ? 'p-16 ml-24' : 'p-16 ml-80') : ''}`}>
          <Routes>
            <Route path="/" element={<Landing onAddToCart={addToCart} contactRef={contactRef} />} />
            <Route path="/shop" element={<Shop onAddToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} onClear={() => setCart([])} />} />
            <Route path="/login" element={<LoginPage onLogin={setAdminUser} />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={adminUser ? <AdminDashboard /> : <LoginPage onLogin={setAdminUser} />} />
            <Route path="/admin/inventory" element={adminUser ? <AdminInventory /> : <LoginPage onLogin={setAdminUser} />} />
            <Route path="/admin/sales" element={adminUser ? <AdminSales /> : <LoginPage onLogin={setAdminUser} />} />
            <Route path="/admin/settings" element={adminUser ? <AdminSettings /> : <LoginPage onLogin={setAdminUser} />} />
          </Routes>
        </main>

        {!isAdminView && !isLoginPage && <Footer onContactClick={scrollToContact} />}
      </div>
      
      {!isAdminView && !isLoginPage && <ChatWidget />}
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdate={updateQuantity} 
      />
    </div>
  );
};

const App: React.FC = () => (
  <MemoryRouter>
    <AppContent />
  </MemoryRouter>
);

export default App;
