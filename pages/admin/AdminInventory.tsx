
import React, { useState, useMemo, useRef } from 'react';
import { PRODUCTS } from '../../constants';
import { Product } from '../../types';
import { Modal } from '../../components/ui/Modal';

export const AdminInventory: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const ProductForm = ({ initialData }: { initialData?: Product | null }) => {
    const [gallery, setGallery] = useState<string[]>(initialData?.images || []);
    const [primaryIndex, setPrimaryIndex] = useState(0);
    const [stock, setStock] = useState(initialData?.stock || 0);
    const [isUploading, setIsUploading] = useState(false);

    const handleAddImage = (url: string) => {
      if (url) setGallery([...gallery, url]);
    };

    const handleUploadClick = () => {
      setIsUploading(true);
      // Simulate Supabase upload with a slight delay
      setTimeout(() => {
        const simulatedUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random()*10000000)}?q=80&w=2000&auto=format&fit=crop`;
        handleAddImage(simulatedUrl);
        setIsUploading(false);
      }, 1200);
    };

    return (
      <div className="space-y-12">
        <style>{`
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}</style>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Piece Name</label>
            <input defaultValue={initialData?.name} type="text" placeholder="e.g. Velvet Armchair" className="w-full bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Category</label>
            <select defaultValue={initialData?.category} className="w-full bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20">
              <option>Living Room</option>
              <option>Bedroom</option>
              <option>Dining Room</option>
              <option>Office</option>
              <option>Decor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Price ($)</label>
            <input defaultValue={initialData?.price} type="number" className="w-full bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Stock Inventory</label>
            <div className="flex items-center bg-nude-50 rounded-2xl overflow-hidden border border-nude-100">
               <button onClick={() => setStock(Math.max(0, stock - 1))} className="px-6 py-4 hover:bg-nude-100 text-nude-500 transition-colors border-r border-nude-100 active:scale-95">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
               </button>
               <input 
                  type="number" 
                  value={stock} 
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-center border-none outline-none font-bold text-nude-500" 
                />
               <button onClick={() => setStock(stock + 1)} className="px-6 py-4 hover:bg-nude-100 text-nude-500 transition-colors border-l border-nude-100 active:scale-95">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
               </button>
            </div>
          </div>
        </div>

        {/* Gallery Manager */}
        <div className="space-y-6">
           <div className="flex justify-between items-center px-4">
             <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300">Gallery Assets</label>
             <button onClick={handleUploadClick} disabled={isUploading} className="text-[10px] font-bold uppercase tracking-widest text-pastel-clay hover:underline flex items-center gap-2">
               {isUploading ? (
                 <>
                   <div className="w-2 h-2 rounded-full bg-pastel-clay animate-ping" />
                   Uploading...
                 </>
               ) : (
                 'Upload to Studio +'
               )}
             </button>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {gallery.map((url, i) => (
                <div key={i} className={`group/img relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all ${primaryIndex === i ? 'border-pastel-clay shadow-xl scale-105' : 'border-white hover:border-nude-100'}`}>
                   <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <button onClick={() => setPrimaryIndex(i)} className={`p-3 rounded-full shadow-2xl transition-all hover:scale-110 ${primaryIndex === i ? 'bg-pastel-clay text-white' : 'bg-white text-nude-500'}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={primaryIndex === i ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                      </button>
                      <button onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))} className="p-3 bg-white rounded-full text-red-400 hover:text-red-600 shadow-2xl hover:scale-110">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                   </div>
                   {primaryIndex === i && (
                     <div className="absolute top-3 left-3 bg-pastel-clay text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest shadow-md">Primary Piece</div>
                   )}
                </div>
              ))}
              <button 
                onClick={() => {
                  const url = prompt('Enter Image URL from your collection:');
                  if (url) handleAddImage(url);
                }}
                className="aspect-square rounded-[2rem] border-2 border-dashed border-nude-200 flex flex-col items-center justify-center hover:border-pastel-clay hover:bg-nude-50 transition-all gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-nude-50 flex items-center justify-center text-nude-200 group-hover:text-pastel-clay transition-colors shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-nude-200 group-hover:text-nude-400">Add via URL</span>
              </button>
           </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Artisan's Note / Description</label>
          <textarea defaultValue={initialData?.description} placeholder="Describe the soul of this piece..." className="w-full h-40 bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 resize-none"></textarea>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h2 className="font-serif text-5xl text-nude-500 font-bold tracking-tight">Active Inventory</h2>
          <p className="text-nude-300 font-medium tracking-widest uppercase text-[10px] mt-2">Manage your master catalog.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-10 py-4 bg-nude-500 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-all hover:scale-105 active:scale-95"
        >
          Add New Catalog Piece
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <input 
            type="text" 
            placeholder="Search pieces..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-nude-100 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 text-sm"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-nude-200" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 text-sm font-bold uppercase tracking-widest text-nude-400"
        >
          <option value="All">All Categories</option>
          <option value="Living Room">Living Room</option>
          <option value="Bedroom">Bedroom</option>
          <option value="Dining Room">Dining Room</option>
          <option value="Office">Office</option>
          <option value="Decor">Decor</option>
        </select>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-nude-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-nude-50 border-b border-nude-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300">Piece</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300">Category</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300">Current Stock</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300">Price</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nude-50">
              {paginatedProducts.length > 0 ? paginatedProducts.map(p => (
                <tr key={p.id} className="group hover:bg-nude-50/30 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-nude-100 relative group-hover:scale-110 transition-transform duration-500">
                        <img src={p.image} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-nude-500 text-base">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-xs uppercase tracking-widest text-nude-300 font-bold">{p.category}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${p.stock < 5 ? 'bg-red-400 animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]'}`} />
                      <div className="flex flex-col">
                        <span className={`font-bold ${p.stock < 5 ? 'text-red-400' : 'text-nude-500'}`}>{p.stock} units</span>
                        {p.stock < 5 && <span className="text-[8px] uppercase tracking-tighter text-red-300 font-bold">Low Availability</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="font-serif font-bold text-nude-500 text-lg">${p.price.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingProduct(p)}
                        className="p-3 bg-white border border-nude-100 rounded-full text-nude-300 hover:text-nude-500 hover:shadow-md transition-all active:scale-95"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <button 
                        onClick={() => setDeletingProduct(p)}
                        className="p-3 bg-white border border-nude-100 rounded-full text-nude-300 hover:text-red-500 hover:shadow-md transition-all active:scale-95"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-nude-300 italic">No pieces found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-8 bg-nude-50 border-t border-nude-100 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-nude-300">Viewing Page {currentPage} of {totalPages}</span>
            <div className="flex gap-3">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-3 rounded-xl bg-white border border-nude-100 text-nude-300 disabled:opacity-30 hover:text-nude-500 hover:shadow-sm transition-all active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-3 rounded-xl bg-white border border-nude-100 text-nude-300 disabled:opacity-30 hover:text-nude-500 hover:shadow-sm transition-all active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add to Collection"
        footer={<button onClick={() => setIsAddModalOpen(false)} className="px-12 py-5 bg-nude-500 text-white rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-black transition-all">Add to Catalog</button>}
      >
        <ProductForm />
      </Modal>

      <Modal 
        isOpen={!!editingProduct} 
        onClose={() => setEditingProduct(null)} 
        title="Refine Catalog Piece"
        footer={<button onClick={() => setEditingProduct(null)} className="px-12 py-5 bg-nude-500 text-white rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-black transition-all">Save Changes</button>}
      >
        <ProductForm initialData={editingProduct} />
      </Modal>

      <Modal 
        isOpen={!!deletingProduct} 
        onClose={() => setDeletingProduct(null)} 
        title="Decommission Asset"
        footer={
          <div className="flex gap-4">
            <button onClick={() => setDeletingProduct(null)} className="px-8 py-4 bg-white border border-nude-100 rounded-full text-nude-400 font-bold uppercase tracking-widest">Cancel</button>
            <button onClick={() => setDeletingProduct(null)} className="px-8 py-4 bg-red-500 text-white rounded-full font-bold uppercase tracking-widest shadow-xl">Confirm Removal</button>
          </div>
        }
      >
        <div className="text-center space-y-6">
           <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_10px_20px_rgba(239,68,68,0.1)]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
           </div>
           <p className="text-xl text-nude-400 font-light italic">Are you certain you wish to remove <span className="font-bold text-nude-500 not-italic">"{deletingProduct?.name}"</span> from the master catalog? This action is permanent and will affect studio records.</p>
        </div>
      </Modal>
    </div>
  );
};
