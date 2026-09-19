'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  CarFront,
  Compass,
  Star,
  Images,
  LayoutTemplate,
  X,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'SEO Settings', href: '/admin/seo', icon: Search },
  { name: 'Vehicles', href: '/admin/vehicles', icon: CarFront },
  { name: 'Occasions', href: '/admin/occasions', icon: Compass },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { name: 'Gallery', href: '/admin/gallery', icon: Images },
  { name: 'Content', href: '/admin/content', icon: LayoutTemplate },
];

export default function Sidebar({ isOpen = false, onClose = null }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(256);
  const hasMovedRef = useRef(false);
  const isCollapsedRef = useRef(false);
  const sidebarWidthRef = useRef(256);

  useEffect(() => {
    isCollapsedRef.current = isCollapsed;
  }, [isCollapsed]);

  useEffect(() => {
    sidebarWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem('admin_sidebar_collapsed');
      if (savedCollapsed !== null) {
        setIsCollapsed(savedCollapsed === 'true');
      }
      const savedWidth = localStorage.getItem('admin_sidebar_width');
      if (savedWidth) {
        const parsed = parseInt(savedWidth, 10);
        if (parsed >= 180 && parsed <= 380) {
          setSidebarWidth(parsed);
        }
      }
    } catch {}
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const handleMouseDown = (e) => {
    if (onClose) return;
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = isCollapsedRef.current ? 68 : sidebarWidthRef.current;
    hasMovedRef.current = false;
    setIsDragging(true);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = moveEvent.clientX - dragStartXRef.current;
      if (Math.abs(deltaX) > 3) {
        hasMovedRef.current = true;
      }
      const targetWidth = dragStartWidthRef.current + deltaX;

      if (targetWidth < 140) {
        setIsCollapsed(true);
        isCollapsedRef.current = true;
      } else {
        const clamped = Math.max(180, Math.min(360, targetWidth));
        setIsCollapsed(false);
        isCollapsedRef.current = false;
        setSidebarWidth(clamped);
        sidebarWidthRef.current = clamped;
      }
    };

    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (!hasMovedRef.current) {
        toggleCollapse();
      } else {
        try {
          localStorage.setItem('admin_sidebar_collapsed', String(isCollapsedRef.current));
          if (!isCollapsedRef.current) {
            localStorage.setItem('admin_sidebar_width', String(sidebarWidthRef.current));
          }
        } catch {}
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const collapsed = onClose ? false : isCollapsed;

  return (
    <aside
      style={{ width: collapsed ? 68 : sidebarWidth }}
      className={`relative bg-white dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 flex flex-col h-full border-r border-zinc-200/90 dark:border-zinc-800/80 shadow-xs shrink-0 select-none ${
        isDragging ? 'transition-none' : 'transition-[width] duration-300 ease-in-out'
      }`}
    >
      {!onClose && (
        <div
          role="separator"
          tabIndex={0}
          onMouseDown={handleMouseDown}
          title={
            collapsed
              ? 'Slide right or click to expand'
              : 'Slide left to collapse or click to toggle'
          }
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`hidden md:block absolute top-0 -right-1.5 w-3.5 h-full z-30 cursor-col-resize group/border select-none ${
            isDragging ? 'bg-teal-500/20' : ''
          }`}
        >
          <div
            className={`w-[2px] h-full mx-auto transition-colors duration-150 ${
              isDragging
                ? 'bg-teal-500 dark:bg-teal-400'
                : 'bg-transparent group-hover/border:bg-teal-500/60 dark:group-hover/border:bg-teal-400/60'
            }`}
          />
        </div>
      )}

      <div
        className={`h-16 flex items-center ${
          collapsed ? 'justify-center px-2' : 'justify-between px-5'
        } border-b border-zinc-200/90 dark:border-zinc-800/80 shrink-0 overflow-hidden`}
      >
        <Link
          href="/admin"
          onClick={handleLinkClick}
          className="flex items-center group cursor-pointer overflow-hidden whitespace-nowrap"
          title={collapsed ? 'Urban Cruise' : undefined}
        >
          {collapsed ? (
            <span className="text-[17px] font-black font-mono text-zinc-950 dark:text-white flex items-center gap-1">
              <span className="tracking-[0.08em]">U</span>
              <span className="text-teal-500 dark:text-teal-400 tracking-[0.08em]">C</span>
            </span>
          ) : (
            <span className="text-[17px] font-black font-mono text-zinc-950 dark:text-white flex items-center gap-2.5">
              <span className="tracking-[0.14em]">URBAN</span>
              <span className="text-teal-500 dark:text-teal-400 tracking-[0.14em]">CRUISE</span>
            </span>
          )}
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 cursor-pointer"
            title="Close sidebar"
          >
            <X className="w-4 h-4 stroke-[1.75]" />
          </button>
        )}
      </div>

      <nav className={`flex-1 overflow-y-auto ${collapsed ? 'py-2' : 'py-4'}`}>
        {!collapsed && (
          <div className="px-4 mb-2 flex items-center">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
              Operations
            </span>
          </div>
        )}

        <ul className={`space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(`${item.href}/`));

            if (collapsed) {
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    title={item.name}
                    className={`group flex items-center justify-center w-10 h-10 mx-auto rounded-lg active:scale-[0.96] transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-xs shadow-teal-700/20'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0 stroke-[1.75]" />
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide active:scale-[0.98] cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white font-bold shadow-xs shadow-teal-700/20'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-[18px] h-[18px] shrink-0 stroke-[1.75]" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={`${
          collapsed ? 'py-3 justify-center' : 'p-4 justify-between'
        } border-t border-zinc-200/90 dark:border-zinc-800/80 flex items-center text-[11px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0`}
      >
        {collapsed ? (
          <span className="text-[10px]">v2.0</span>
        ) : (
          <>
            <span>Urban Cruise v2.0</span>
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">
              Admin
            </span>
          </>
        )}
      </div>
    </aside>
  );
}
