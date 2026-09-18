"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Car, CalendarCheck, MessageSquareQuote, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';

const kpis = [
  {
    title: 'Total Vehicles',
    value: '124',
    change: '+12%',
    trend: 'up',
    icon: Car,
  },
  {
    title: 'Active Bookings',
    value: '48',
    change: '+5%',
    trend: 'up',
    icon: CalendarCheck,
  },
  {
    title: 'Testimonials',
    value: '892',
    change: '+18%',
    trend: 'up',
    icon: MessageSquareQuote,
  },
  {
    title: 'SEO Score',
    value: '94/100',
    change: '+2',
    trend: 'up',
    icon: TrendingUp,
  },
];

const recentActivity = [
  { id: 1, action: 'New booking confirmed', details: 'SUV Premium - 3 days', time: '10 mins ago' },
  { id: 2, action: 'Vehicle maintenance completed', details: 'Sedan Economy - Oil change', time: '2 hours ago' },
  { id: 3, action: 'New testimonial received', details: '5 stars from John Doe', time: '5 hours ago' },
  { id: 4, action: 'SEO metric updated', details: 'Domain authority increased by 1', time: '1 day ago' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function DashboardOverview() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-950">Dashboard Overview</h1>
          <p className="mt-1 text-zinc-500">Monitor your fleet performance and key metrics.</p>
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {kpis.map((kpi, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FFAD00]/10 text-[#FFAD00]">
                  <kpi.icon size={24} strokeWidth={2} />
                </div>
                <div className="flex items-center space-x-1 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-600">
                  <ArrowUpRight size={16} />
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-zinc-500">{kpi.title}</h3>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
                  {kpi.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100, damping: 15 }}
          className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center space-x-2 border-b border-zinc-100 pb-4">
            <Activity className="text-zinc-400" size={20} />
            <h2 className="text-lg font-semibold text-zinc-950">Recent Activity</h2>
          </div>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-950">{activity.action}</p>
                  <p className="mt-0.5 text-sm text-zinc-500">{activity.details}</p>
                </div>
                <span className="text-xs font-medium text-zinc-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
