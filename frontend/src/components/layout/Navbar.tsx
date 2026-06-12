import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/dashboard/clients')) return 'Clients';
    if (path.startsWith('/dashboard/appointments')) return 'Appointments';
    if (path.startsWith('/dashboard/consultations')) return 'Consultations';
    if (path.startsWith('/dashboard/payments')) return 'Payments';
    if (path.startsWith('/dashboard/profile')) return 'Profile';
    return '';
  };

  return (
    <header className="h-16 border-b border-white/5 bg-surface-card/50 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-white">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Homepage</span>
        </Link>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">Astrologer</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
