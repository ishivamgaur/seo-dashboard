"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  Car, 
  Calendar, 
  MessageSquare, 
  Image as ImageIcon, 
  FileText 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'SEO Settings', href: '/admin/seo', icon: Search },
  { name: 'Vehicles', href: '/admin/vehicles', icon: Car },
  { name: 'Occasions', href: '/admin/occasions', icon: Calendar },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Content', href: '/admin/content', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wider">
          URBAN <span className="text-[#FFAD00]">CRUISE</span>
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Precise active state matching
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`));
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#FFAD00] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Urban Cruise
        </div>
      </div>
    </div>
  );
}
