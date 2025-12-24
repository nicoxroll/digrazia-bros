
import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { TableRowSkeleton } from '../../components/ui/AdminSkeletons';

const MOCK_SALES = [
  { id: '1001', customer: 'Isabella Rossellini', product: 'Serene Cloud Sofa', price: 2450, date: 'Mar 12, 2024', status: 'Fulfilled' },
  { id: '1002', customer: 'Luca Guadagnino', product: 'Marble Nesting Tables', price: 560, date: 'Mar 10, 2024', status: 'Processing' },
  { id: '1003', customer: 'Monica Bellucci', product: 'Ethereal Bed Frame', price: 1750, date: 'Mar 08, 2024', status: 'Commissioned' },
  { id: '1004', customer: 'Ennio Morricone', product: 'Rose Quartz Lamp', price: 240, date: 'Mar 05, 2024', status: 'Shipped' },
  { id: '1005', customer: 'Sofia Loren', product: 'Nordic Dining Table', price: 1200, date: 'Mar 02, 2024', status: 'Fulfilled' },
  { id: '1006', customer: 'Alain Delon', product: 'Minimalist Oak Desk', price: 890, date: 'Feb 28, 2024', status: 'Shipped' },
];

export const AdminSales: React.FC = () => {
  const [editingSale, setEditingSale] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Simular 1.2 segundos de carga

    return () => clearTimeout(timer);
  }, []);

  const filteredSales = useMemo(() => {
    return MOCK_SALES.filter(sale => {
      const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) || sale.id.includes(searchTerm);
      const matchesStatus = statusFilter === 'All' || sale.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h2 className="font-serif text-5xl text-nude-500 font-bold tracking-tight">Sales Ledger</h2>
          <p className="text-nude-300 font-medium tracking-widest uppercase text-[10px] mt-2">Historical studio transactions.</p>
        </div>
        <button className="px-8 py-3 bg-white border border-nude-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-nude-400">Export Ledger</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <input 
            type="text" 
            placeholder="Search by Client or Order ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-nude-100 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 text-sm"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-nude-200" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-nude-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 text-sm font-bold uppercase tracking-widest text-nude-400"
        >
          <option value="All">All Statuses</option>
          <option value="Commissioned">Commissioned</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Fulfilled">Fulfilled</option>
        </select>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-nude-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-nude-50 border-b border-nude-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300">Order ID</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300">Customer</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300">Piece</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300">Revenue</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300">Status</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-nude-300 text-right">Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nude-50">
              {isLoading ? (
                // Mostrar skeletons durante la carga
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : paginatedSales.length > 0 ? paginatedSales.map(sale => (
                <tr key={sale.id} className="group hover:bg-nude-50/30 transition-colors">
                  <td className="px-10 py-8 font-mono text-[10px] font-bold text-nude-200">#{sale.id}</td>
                  <td className="px-10 py-8">
                    <span className="font-bold text-nude-500">{sale.customer}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-xs text-nude-300 font-medium">{sale.product}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="font-serif font-bold text-nude-500">${sale.price.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      sale.status === 'Fulfilled' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      sale.status === 'Processing' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-pastel-clay/10 text-pastel-clay border-pastel-clay/20'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => setEditingSale(sale)}
                      className="p-3 bg-white border border-nude-100 rounded-full text-nude-300 hover:text-nude-500 hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center text-nude-300 italic">No sales found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-8 bg-nude-50 border-t border-nude-100 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-nude-300">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-3 rounded-xl bg-white border border-nude-100 text-nude-300 disabled:opacity-30 hover:text-nude-500 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-3 rounded-xl bg-white border border-nude-100 text-nude-300 disabled:opacity-30 hover:text-nude-500 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={!!editingSale} 
        onClose={() => setEditingSale(null)} 
        title="Update Transaction Status"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setEditingSale(null)} className="px-6 py-3 bg-white border border-nude-100 rounded-full text-nude-400 font-bold uppercase tracking-widest hover:bg-nude-50 transition-colors">Cancel</button>
            <button onClick={() => setEditingSale(null)} className="px-6 py-3 bg-nude-500 text-white rounded-full font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-all">Apply Update</button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-6 bg-nude-50 rounded-2xl space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-nude-300">Client Details</p>
            <h4 className="font-serif text-2xl text-nude-500 font-bold">{editingSale?.customer}</h4>
            <p className="text-sm text-nude-400">{editingSale?.product} • ${editingSale?.price?.toLocaleString()}</p>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Fulfillment Status</label>
            <select defaultValue={editingSale?.status} className="w-full bg-nude-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20">
              <option>Commissioned</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Fulfilled</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nude-300 ml-4">Studio Notes</label>
            <textarea placeholder="Add private studio observations..." className="w-full h-24 bg-nude-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pastel-clay/20 resize-none"></textarea>
          </div>
        </div>
      </Modal>
    </div>
  );
};
