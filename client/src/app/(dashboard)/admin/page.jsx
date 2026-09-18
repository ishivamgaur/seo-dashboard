'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CarFront, 
  Compass, 
  Star, 
  Images, 
  ArrowRight
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function DashboardOverview() {
  const [counts, setCounts] = useState({
    vehicles: 0,
    occasions: 0,
    testimonials: 0,
    gallery: 0,
  });
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [seoSnapshot, setSeoSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [vRes, oRes, tRes, gRes, sRes] = await Promise.all([
          fetch(`${API_BASE}/vehicles`).catch(() => ({ ok: false })),
          fetch(`${API_BASE}/occasions`).catch(() => ({ ok: false })),
          fetch(`${API_BASE}/testimonials`).catch(() => ({ ok: false })),
          fetch(`${API_BASE}/gallery`).catch(() => ({ ok: false })),
          fetch(`${API_BASE}/seo`).catch(() => ({ ok: false })),
        ]);

        const [vData, oData, tData, gData, sData] = await Promise.all([
          vRes.ok ? vRes.json() : { data: [] },
          oRes.ok ? oRes.json() : { data: [] },
          tRes.ok ? tRes.json() : { data: [] },
          gRes.ok ? gRes.json() : { data: [] },
          sRes.ok ? sRes.json() : { data: null },
        ]);

        const vehiclesList = Array.isArray(vData.data) ? vData.data : [];
        const occasionsList = Array.isArray(oData.data) ? oData.data : [];
        const testimonialsList = Array.isArray(tData.data) ? tData.data : [];
        const galleryList = Array.isArray(gData.data) ? gData.data : [];

        setCounts({
          vehicles: vehiclesList.length,
          occasions: occasionsList.length,
          testimonials: testimonialsList.length,
          gallery: galleryList.length,
        });

        setRecentVehicles(vehiclesList.slice(0, 4));
        setSeoSnapshot(sData.data || null);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const kpis = [
    {
      title: 'Active Vehicles',
      value: counts.vehicles.toString(),
      sub: 'Total fleet in inventory',
      icon: CarFront,
      href: '/admin/vehicles',
    },
    {
      title: 'Services & Occasions',
      value: counts.occasions.toString(),
      sub: 'Available travel packages',
      icon: Compass,
      href: '/admin/occasions',
    },
    {
      title: 'Client Reviews',
      value: counts.testimonials.toString(),
      sub: '5-star customer ratings',
      icon: Star,
      href: '/admin/testimonials',
    },
    {
      title: 'Gallery Media',
      value: counts.gallery.toString(),
      sub: 'Showroom fleet photos',
      icon: Images,
      href: '/admin/gallery',
    },
  ];

  return (
    <div className="w-full min-h-full space-y-4 font-sans antialiased">
      {/* KPI Cards Grid - Crisp pure white on neutral canvas in light mode, deep dark obsidian in dark mode */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={index}
              href={kpi.href}
              className="group flex flex-col justify-between rounded-xl bg-white dark:bg-[#13161c] p-4.5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md dark:hover:bg-[#171b23] active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
                    {kpi.title}
                  </h3>
                  {loading ? (
                    <div className="h-8 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse my-1" />
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white font-mono tabular-nums leading-none pt-0.5">
                      {kpi.value}
                    </p>
                  )}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 group-hover:bg-teal-100/90 dark:group-hover:bg-teal-900/60 group-hover:scale-105 transition-all shrink-0">
                  <Icon className="w-4.5 h-4.5 stroke-[1.8]" />
                </div>
              </div>

              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                {kpi.sub}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Main Operational Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Quick Actions & Priority Snapshot */}
        <div className="lg:col-span-8 space-y-4">
          {/* Quick Actions */}
          <div className="rounded-xl bg-white dark:bg-[#13161c] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                Quick Management Actions
              </h2>
              <span className="text-xs font-mono text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 rounded font-semibold">
                Live API
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/seo"
                className="group p-4 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] hover:bg-teal-50/50 dark:hover:bg-[#202531] transition-all cursor-pointer block"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  SEO & Meta Tags
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Canonical URLs, SERP previews, robots directives
                </p>
              </Link>

              <Link
                href="/admin/content"
                className="group p-4 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] hover:bg-teal-50/50 dark:hover:bg-[#202531] transition-all cursor-pointer block"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  Homepage Content
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Studio hero banners, about section, corporate contact
                </p>
              </Link>

              <Link
                href="/admin/vehicles"
                className="group p-4 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] hover:bg-teal-50/50 dark:hover:bg-[#202531] transition-all cursor-pointer block"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  Vehicle Showroom
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Drag and drop priority order, seating capacity, permits
                </p>
              </Link>

              <Link
                href="/admin/occasions"
                className="group p-4 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] hover:bg-teal-50/50 dark:hover:bg-[#202531] transition-all cursor-pointer block"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  Services & Occasions
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  16:9 widescreen cards, corporate and wedding travel
                </p>
              </Link>
            </div>
          </div>

          {/* Recent Vehicles Live Snapshot */}
          <div className="rounded-xl bg-white dark:bg-[#13161c] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                Showroom Inventory Priority Snapshot
              </h3>
              <Link
                href="/admin/vehicles"
                className="text-xs font-mono text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <span>Reorder Fleet</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentVehicles.length === 0 ? (
              <p className="text-xs font-mono text-zinc-500 py-4 text-center">No vehicles in inventory.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {recentVehicles.map((v, idx) => (
                  <div 
                    key={v.id} 
                    className="px-3.5 py-2.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27] hover:bg-teal-50/50 dark:hover:bg-[#202531] flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-zinc-400 text-xs w-5 shrink-0">#{idx + 1}</span>
                      <div className="w-10 h-7 bg-zinc-200/60 dark:bg-[#13161c] rounded overflow-hidden flex items-center justify-center shrink-0">
                        {v.image ? (
                          <img src={v.image} alt={v.vehicleName} className="object-contain w-full h-full" />
                        ) : (
                          <CarFront className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{v.vehicleName}</span>
                    </div>
                    <span className="font-mono tabular-nums text-zinc-500 dark:text-zinc-400 font-medium shrink-0 ml-2">
                      {v.seatingCapacity} Seats
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: System Status & SEO Health */}
        <div className="lg:col-span-4 space-y-4">
          {/* SEO Health Snapshot */}
          <div className="rounded-xl bg-white dark:bg-[#13161c] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                Live SEO Health
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-sans">
              <div className="p-3.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27]">
                <span className="text-zinc-400 dark:text-zinc-500 block text-[11px] font-mono uppercase tracking-wider font-medium">Page Title</span>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 mt-1.5 truncate" title={seoSnapshot?.metaTitle || 'Urban Cruise'}>
                  {seoSnapshot?.metaTitle || 'Urban Cruise - Vehicle Rentals'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27]">
                <span className="text-zinc-400 dark:text-zinc-500 block text-[11px] font-mono uppercase tracking-wider font-medium">Canonical URL</span>
                <p className="font-mono text-zinc-700 dark:text-zinc-300 mt-1.5 truncate text-[11px]">
                  {seoSnapshot?.canonicalUrl || 'https://urbancruise.in'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27] flex items-center justify-between">
                <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-mono uppercase tracking-wider font-medium">Search Robots</span>
                <span className="font-mono text-teal-700 dark:text-teal-300 font-semibold text-[11px] bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                  {seoSnapshot?.robotsIndex !== false ? 'index' : 'noindex'}, {seoSnapshot?.robotsFollow !== false ? 'follow' : 'nofollow'}
                </span>
              </div>
            </div>

            <div className="mt-3.5">
              <Link
                href="/admin/seo"
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center justify-between py-1 transition-colors"
              >
                <span>Edit Meta & Schemas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* System Services Card */}
          <div className="rounded-xl bg-white dark:bg-[#13161c] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                  System Services
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27]">
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">API Gateway</span>
                  <span className="font-mono text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded text-[11px]">PORT 5000</span>
                </div>
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27]">
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">Database</span>
                  <span className="font-mono text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded text-[11px]">MySQL</span>
                </div>
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27]">
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">Client Engine</span>
                  <span className="font-mono text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded text-[11px]">Next.js 16</span>
                </div>
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27]">
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">Theme Engine</span>
                  <span className="font-mono text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded text-[11px]">next-themes</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-2">
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 block font-medium">
                Zero-delay hydration & DnD active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
