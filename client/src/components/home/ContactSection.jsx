'use client';

import React, { useState } from 'react';
import Reveal from './Reveal';
import SectionShell from '@/components/ui/SectionShell';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const ALT_FADE = 'from-[#eceff3] to-[#dde7df] dark:from-[#090a0d] dark:to-[#0c0f14]';

const inputCls =
  'w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-sm border-0';

const labelCls =
  'block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5';

const ContactSection = ({ data, vehicles = [] }) => {
  const phone = data?.phone || '+91 98765 43210';
  const email = data?.email || 'bookings@urbancruise.in';
  const address = data?.address || 'Plot No. 42, Sector 18, Gurugram, Haryana 122008, India';
  const mapEmbed = data?.mapEmbed || '';

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', vehicle: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const infoRows = [
    {
      label: 'Phone',
      value: (
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="hover:text-teal-600 dark:hover:text-teal-400"
        >
          {phone}
        </a>
      ),
      valueCls: 'font-mono tabular-nums font-bold text-zinc-950 dark:text-white',
    },
    {
      label: 'Email',
      value: (
        <a href={`mailto:${email}`} className="hover:text-teal-600 dark:hover:text-teal-400">
          {email}
        </a>
      ),
      valueCls: 'font-semibold text-zinc-950 dark:text-white break-all',
    },
    {
      label: 'Address',
      value: address,
      valueCls: 'text-zinc-600 dark:text-zinc-300',
    },
  ];

  const isIframe = mapEmbed.trim().startsWith('<iframe');

  return (
    <SectionShell id="contact" tone="alt" fade={ALT_FADE}>
      <SectionHeader eyebrow="Contact" title="Book your trip" />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <Reveal>
          <Card className="h-full p-5 sm:p-6">
            <dl className="space-y-2.5">
              {infoRows.map((row) => (
                <div
                  key={row.label}
                  className="px-3.5 py-2.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27]"
                >
                  <dt className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
                    {row.label}
                  </dt>
                  <dd className={`mt-1 text-sm ${row.valueCls}`}>{row.value}</dd>
                </div>
              ))}
            </dl>

            {mapEmbed && (
              <div className="mt-3 rounded-xl overflow-hidden bg-[#f6f8fa] dark:bg-black aspect-video">
                {isIframe ? (
                  <div
                    className="[&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 w-full h-full"
                    dangerouslySetInnerHTML={{ __html: mapEmbed }}
                  />
                ) : (
                  <iframe
                    title="Office location"
                    src={mapEmbed}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                )}
              </div>
            )}
          </Card>
        </Reveal>

        <Reveal delay={0.12}>
          <Card className="h-full p-5 sm:p-6">
            {sent ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-300 py-10 text-center">
                Thank you. We will contact you shortly.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 ..."
                    className={`${inputCls} font-mono`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Vehicle</label>
                  <select
                    value={form.vehicle}
                    onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.vehicleName}>
                        {v.vehicleName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Dates, route, passengers"
                    className={`${inputCls} placeholder:text-zinc-400`}
                  />
                </div>
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-end">
                  <Button type="submit" size="md">
                    Send request
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </Reveal>
      </div>
    </SectionShell>
  );
};

export default ContactSection;
