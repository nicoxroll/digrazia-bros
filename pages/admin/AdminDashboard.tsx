
import React from 'react';
import { PRODUCTS } from '../../constants';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Monthly Revenue', value: '$124,500', trend: '+12%', color: 'bg-nude-50' },
    { label: 'Active Commissions', value: '42', trend: '+5', color: 'bg-pastel-sage/20' },
    { label: 'Studio Inquiries', value: '158', trend: 'High', color: 'bg-pastel-rose/20' },
    { label: 'Member Satisfaction', value: '98%', trend: 'Stable', color: 'bg-pastel-cream/50' },
  ];

  // Logic for Pie Chart (Category Distribution)
  const categories = PRODUCTS.reduce((acc: any, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(categories).map(([name, value]: [string, any]) => ({ name, value }));
  const colors = ['#C2A68C', '#D4A373', '#E8F3EF', '#F9E4E1', '#EDE4D6'];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="font-serif text-5xl text-nude-500 font-bold tracking-tight">Studio Overview</h2>
          <p className="text-nude-300 font-medium tracking-widest uppercase text-[10px] mt-2">Welcome back, Director.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-white border border-nude-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-nude-400 hover:bg-nude-50 transition-all">Export Report</button>
          <button className="px-8 py-3 bg-nude-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-all">New Piece</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.color} p-6 lg:p-8 rounded-[3rem] border border-nude-100 space-y-4 shadow-sm transition-transform hover:-translate-y-1 overflow-hidden`}>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-nude-300 truncate">{stat.label}</p>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h4 className="font-serif text-3xl lg:text-4xl font-bold text-nude-500 break-words">{stat.value}</h4>
              <span className="text-[10px] font-bold text-pastel-clay shrink-0">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Bar Chart (Revenue Performance) */}
        <div className="bg-white rounded-[4rem] p-12 border border-nude-100 shadow-sm space-y-12">
           <div className="flex justify-between items-center">
             <h3 className="font-serif text-2xl font-bold text-nude-500">Revenue Performance</h3>
             <span className="text-[10px] uppercase tracking-widest font-bold text-nude-300">Last 6 Months</span>
           </div>
           <div className="h-72 flex items-end justify-between gap-6 px-4">
              {[45, 78, 56, 90, 65, 82].map((val, i) => (
                <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                  {/* Background track for the bar */}
                  <div className="absolute inset-0 bg-nude-50/50 rounded-t-2xl -z-1" />
                  <div 
                    className="w-full bg-nude-200 border border-nude-300 rounded-t-2xl group-hover:bg-pastel-clay group-hover:border-pastel-clay transition-all duration-500 ease-out shadow-sm" 
                    style={{ height: `${val}%` }} 
                  />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-nude-500 bg-white px-2 py-1 rounded-md shadow-sm border border-nude-100">
                      ${(val * 1200).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-6 text-center">
                    <span className="text-[10px] font-bold text-nude-400 uppercase tracking-widest">
                      {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i]}
                    </span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Product Type Pie Chart (Collection Mix) */}
        <div className="bg-white rounded-[4rem] p-12 border border-nude-100 shadow-sm space-y-12 flex flex-col">
          <div className="flex justify-between items-center">
             <h3 className="font-serif text-2xl font-bold text-nude-500">Collection Mix</h3>
             <span className="text-[10px] uppercase tracking-widest font-bold text-nude-300">By Category</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-12">
             <div className="relative w-52 h-52">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                   {pieData.map((d, i) => {
                      const total = pieData.reduce((a, b) => a + b.value, 0);
                      const percentage = (d.value / total) * 100;
                      let offset = 0;
                      for (let j = 0; j < i; j++) {
                        offset += (pieData[j].value / total) * 100;
                      }
                      return (
                        <circle
                          key={i}
                          cx="50" cy="50" r="40"
                          fill="transparent"
                          stroke={colors[i % colors.length]}
                          strokeWidth="16"
                          strokeDasharray={`${percentage} ${100 - percentage}`}
                          strokeDashoffset={-offset}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      );
                   })}
                   <circle cx="50" cy="50" r="30" fill="white" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-[10px] uppercase tracking-widest font-bold text-nude-200">Total Pieces</span>
                   <span className="text-3xl font-serif font-bold text-nude-500">{PRODUCTS.length}</span>
                </div>
             </div>
             <div className="space-y-4">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: colors[i % colors.length] }} />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-nude-400">{d.name}</span>
                      <span className="text-[11px] font-bold text-nude-500">{d.value} items</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[4rem] p-12 border border-nude-100 shadow-sm space-y-8">
          <h3 className="font-serif text-2xl font-bold text-nude-500">Recent Sales Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-nude-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-nude-50 rounded-2xl flex items-center justify-center text-nude-300 font-bold border border-nude-100">#</div>
                  <div>
                    <p className="font-bold text-sm text-nude-500">Order #842{i}</p>
                    <p className="text-xs text-nude-400">Serene Cloud Sofa</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-serif font-bold text-nude-500">$2,450</p>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Paid</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-nude-500 rounded-[4rem] p-12 text-white space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <h3 className="font-serif text-2xl font-bold relative z-10">Studio Insights</h3>
          <p className="text-white/70 text-sm leading-relaxed relative z-10 font-light">You have 4 bespoke commissions pending review. The artisans in the Florence workshop have updated their completion timelines. Inventory for "Dining Room" pieces is below 15%.</p>
          <button className="w-full bg-white text-nude-500 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-black hover:text-white transition-all relative z-10">View Studio Schedule</button>
        </div>
      </div>
    </div>
  );
};
