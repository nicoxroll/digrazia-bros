
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { InventoryService } from '../../services/supabase';
import { Product } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { TableRowSkeleton } from '../../components/ui/AdminSkeletons';

export const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await InventoryService.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const ProductForm = ({ initialData, onSuccess }: { initialData?: Product | null, onSuccess: () => void }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [category, setCategory] = useState(initialData?.category || 'Living Room');
    const [price, setPrice] = useState(initialData?.price || 0);
    const [description, setDescription] = useState(initialData?.description || '');
    const [gallery, setGallery] = useState<string[]>(initialData?.images || []);
    const [primaryIndex, setPrimaryIndex] = useState(0);
    const [stock, setStock] = useState(initialData?.stock || 0);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
    const [isUrlInputOpen, setIsUrlInputOpen] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddImage = (url: string) => {
      if (url) setGallery([...gallery, url]);
    };

    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      setLastUploadedUrl(null);
      try {
        const url = await InventoryService.uploadImage(file);
        if (url) {
          handleAddImage(url);
          setLastUploadedUrl(url);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed. Please try again.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    const handleSubmit = async () => {
      if (!name || !price) {
        alert('Please fill in required fields');
        return;
      }

      setIsSaving(true);
      try {
        const productData = {
          name,
          category: category as any,
          price,
          description,
          images: gallery,
          image: gallery[primaryIndex] || gallery[0] || '',
          stock,
          rating: initialData?.rating || 5
        };

        if (initialData) {
          await InventoryService.updateProduct(initialData.id, productData);
        } else {
          await InventoryService.addProduct(productData);
        }
        onSuccess();
      } catch (error) {
        console.error('Save failed:', error);
        alert('Failed to save product');
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-8">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Piece Name</label>
            <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="e.g. Velvet Armchair" className="w-full bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20">
              <option>Living Room</option>
              <option>Bedroom</option>
              <option>Dining Room</option>
              <option>Office</option>
              <option>Decor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Price ($)</label>
            <input value={price} onChange={e => setPrice(parseFloat(e.target.value))} type="number" className="w-full bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Stock Inventory</label>
            <div className="flex items-center bg-nude-50 rounded-2xl overflow-hidden border border-nude-100">
               <button onClick={() => setStock(Math.max(0, stock - 1))} className="px-4 py-4 hover:bg-nude-100 text-nude-500 transition-colors border-r border-nude-100 active:scale-95">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
               </button>
               <input 
                  type="number" 
                  value={stock} 
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-center border-none outline-none font-bold text-nude-500 text-sm" 
                />
               <button onClick={() => setStock(stock + 1)} className="px-4 py-4 hover:bg-nude-100 text-nude-500 transition-colors border-l border-nude-100 active:scale-95">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
               </button>
            </div>
          </div>
        </div>

        {/* Gallery Manager */}
        <div className="space-y-4">
           <div className="flex flex-col gap-3 px-4">
             <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300">Gallery Assets</label>
             
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*" 
               onChange={handleFileChange}
             />

             {/* Improved Upload Button Area */}
             <div 
                className="bg-nude-50 border-2 border-dashed border-nude-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-nude-100 hover:border-pastel-clay/50 group cursor-pointer active:scale-[0.99]" 
                onClick={!isUploading ? handleUploadClick : undefined}
             >
                <div className={`p-2 rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 ${isUploading ? 'animate-pulse' : ''}`}>
                    {isUploading ? (
                        <div className="w-4 h-4 border-2 border-pastel-clay border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pastel-clay"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    )}
                </div>
                <div className="text-center">
                    <p className="text-xs font-bold text-nude-500">{isUploading ? 'Uploading...' : 'Click to Upload Image'}</p>
                    <p className="text-[9px] text-nude-300">Supports JPG, PNG, WEBP</p>
                </div>
             </div>

             {/* URL Display */}
             {lastUploadedUrl && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 bg-white rounded-full text-emerald-500 shadow-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-0.5">Upload Successful</p>
                        <p className="text-xs text-emerald-700 truncate font-mono select-all">{lastUploadedUrl}</p>
                    </div>
                    <button onClick={() => {navigator.clipboard.writeText(lastUploadedUrl)}} className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors" title="Copy URL">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                </div>
             )}
           </div>
           
           <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {gallery.map((url, i) => (
                <div key={i} className={`group/img relative aspect-square rounded-2xl overflow-hidden border-4 transition-all ${primaryIndex === i ? 'border-pastel-clay shadow-xl scale-105' : 'border-white hover:border-nude-100'}`}>
                   <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button onClick={() => setPrimaryIndex(i)} className={`p-2 rounded-full shadow-2xl transition-all hover:scale-110 ${primaryIndex === i ? 'bg-pastel-clay text-white' : 'bg-white text-nude-500'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={primaryIndex === i ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                      </button>
                      <button onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))} className="p-2 bg-white rounded-full text-red-400 hover:text-red-600 shadow-2xl hover:scale-110">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                   </div>
                   {primaryIndex === i && (
                     <div className="absolute top-2 left-2 bg-pastel-clay text-white px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest shadow-md">Primary</div>
                   )}
                </div>
              ))}
              {isUrlInputOpen ? (
                 <div className="aspect-square rounded-[2rem] border-2 border-nude-200 bg-nude-50 p-4 flex flex-col justify-center gap-3 animate-in zoom-in-95 duration-300">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-nude-300">Image URL</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white border border-nude-100 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-pastel-clay/20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                           handleAddImage(urlInput);
                           setUrlInput('');
                           setIsUrlInputOpen(false);
                        }
                        if (e.key === 'Escape') {
                           setIsUrlInputOpen(false);
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setIsUrlInputOpen(false)} className="flex-1 py-2 rounded-lg border border-nude-200 text-[10px] font-bold text-nude-400 hover:bg-white transition-colors">Cancel</button>
                      <button onClick={() => { if(urlInput) { handleAddImage(urlInput); setUrlInput(''); setIsUrlInputOpen(false); } }} className="flex-1 py-2 rounded-lg bg-pastel-clay text-white text-[10px] font-bold hover:bg-nude-500 transition-colors">Add</button>
                    </div>
                 </div>
              ) : (
                <button 
                  onClick={() => setIsUrlInputOpen(true)}
                  className="aspect-square rounded-[2rem] border-2 border-dashed border-nude-200 flex flex-col items-center justify-center hover:border-pastel-clay hover:bg-nude-50 transition-all gap-1 group"
                >
                  <div className="w-10 h-10 rounded-full bg-nude-50 flex items-center justify-center text-nude-200 group-hover:text-pastel-clay transition-colors shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-nude-200 group-hover:text-nude-400">Add URL</span>
                </button>
              )}
           </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Artisan's Note / Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the soul of this piece..." className="w-full h-32 bg-nude-50 border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 resize-none"></textarea>
        </div>
        
        <div className="flex justify-end gap-4 pt-6 border-t border-nude-100">
           <button onClick={handleSubmit} disabled={isSaving} className="px-10 py-4 bg-nude-500 text-white rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed">
             {isSaving ? 'Saving...' : (initialData ? 'Update Piece' : 'Add to Catalog')}
           </button>
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
              {isLoading ? (
                // Mostrar skeletons mientras carga
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map(p => (
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
                ))
              ) : (
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
      >
        <ProductForm onSuccess={() => { setIsAddModalOpen(false); loadProducts(); }} />
      </Modal>

      <Modal 
        isOpen={!!editingProduct} 
        onClose={() => setEditingProduct(null)} 
        title="Refine Catalog Piece"
      >
        <ProductForm initialData={editingProduct} onSuccess={() => { setEditingProduct(null); loadProducts(); }} />
      </Modal>

      <Modal 
        isOpen={!!deletingProduct} 
        onClose={() => setDeletingProduct(null)} 
        title="Decommission Asset"
        footer={
          <div className="flex gap-4">
            <button onClick={() => setDeletingProduct(null)} className="px-8 py-4 bg-white border border-nude-100 rounded-full text-nude-400 font-bold uppercase tracking-widest">Cancel</button>
            <button onClick={async () => {
              if (deletingProduct) {
                try {
                  await InventoryService.deleteProduct(deletingProduct.id);
                  loadProducts();
                  setDeletingProduct(null);
                } catch (error) {
                  console.error('Delete failed:', error);
                  alert('Failed to delete product');
                }
              }
            }} className="px-8 py-4 bg-red-500 text-white rounded-full font-bold uppercase tracking-widest shadow-xl">Confirm Removal</button>
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
