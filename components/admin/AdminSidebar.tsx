
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const menuItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { label: 'Inventory', path: '/admin/inventory', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> },
    { label: 'Sales', path: '/admin/sales', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg> },
    { label: 'Settings', path: '/admin/settings', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-24' : 'w-80'} h-screen bg-white border-r border-nude-100 p-6 flex flex-col fixed left-0 top-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-50`}>
      <div className={`flex items-center mb-16 ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
        {!isCollapsed && (
          <Link to="/" className="font-serif text-2xl font-bold tracking-tighter text-nude-500 whitespace-nowrap overflow-hidden">
            DIGRAZIA <span className="font-light">Bros.</span>
          </Link>
        )}
        <button onClick={onToggle} className="p-2 hover:bg-nude-50 rounded-xl text-nude-300 transition-colors flex items-center justify-center">
          <svg className={`transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>
      
      <nav className="flex-1 space-y-4">
        {menuItems.map(item => (
          <Link 
            key={item.label} 
            to={item.path} 
            title={isCollapsed ? item.label : ''}
            className={`flex items-center rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${
              isCollapsed ? 'w-12 h-12 justify-center mx-auto px-0' : 'px-6 py-4'
            } ${
              location.pathname === item.path ? 'bg-nude-500 text-white shadow-xl' : 'text-nude-300 hover:bg-nude-50 hover:text-nude-500'
            }`}
          >
            <div className="shrink-0 flex items-center justify-center">{item.icon}</div>
            {!isCollapsed && <span className="ml-4 whitespace-nowrap overflow-hidden">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="pt-8 border-t border-nude-50">
        <Link to="/login" className={`flex items-center rounded-2xl text-sm font-bold uppercase tracking-widest text-red-300 hover:bg-red-50 hover:text-red-500 transition-all ${isCollapsed ? 'w-12 h-12 justify-center mx-auto px-0' : 'px-6 py-4'}`}>
          <div className="flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </div>
          {!isCollapsed && <span className="ml-4">Logout</span>}
        </Link>
      </div>
    </aside>
  );
};
