"use client";

import { usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const pathname = usePathname();
  // Fallback to avoid crash if AuthContext is not yet created
  const auth = useAuth() || { user: { name: 'Admin User' }, logout: () => {} };
  const { user, logout } = auth;

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 1) {
      const page = parts[1];
      return page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
    }
    return 'Dashboard';
  };

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <span className="text-sm font-medium">{user?.name || 'Admin'}</span>
        </div>
        
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-500 hover:text-[#FFAD00] transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
}
