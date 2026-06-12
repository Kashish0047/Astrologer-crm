import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  User, 
  LogOut,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Consultations', href: '/dashboard/consultations', icon: MessageSquare },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname !== '/dashboard') return false;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col w-[260px] bg-surface-card border-r border-white/5 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
          <Moon className="w-4 h-4 text-white" fill="currentColor" />
        </div>
        <span className="text-lg font-cinzel font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200">AstroManager</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={active ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <item.icon className={`w-5 h-5 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
