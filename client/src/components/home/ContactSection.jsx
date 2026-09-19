'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

const ContactSection = ({ data }) => {
  const phone = data?.phone || '+91 98765 43210';
  const email = data?.email || 'bookings@urbancruise.in';
  const address = data?.address || 'Plot No. 42, Sector 18, Gurugram, Haryana 122008, India';
  const mapEmbed = data?.mapEmbed || '';

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '9 Seater Tempo Traveller',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <section 
      className="relative py-20 md:py-28 bg-white dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 border-t border-zinc-200/80 dark:border-zinc-800 transition-colors duration-150" 
      id="contact"
    >
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-1">
            Reservations & Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2 text-balance">
            Contact Urban Cruise
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base font-normal text-pretty">
            Direct reservation desk for corporate rentals, wedding convoys, and outstation bus bookings across 15 cities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-zinc-50 dark:bg-[#121418] border border-zinc-200/90 dark:border-zinc-800 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
                Direct Help Desk
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700 shrink-0">
                    <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400 stroke-[1.75]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Phone / WhatsApp</h5>
                    <a 
                      href={`tel:${phone.replace(/\s+/g, '')}`} 
                      className="font-mono tabular-nums text-zinc-950 dark:text-white text-base font-bold hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700 shrink-0">
                    <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 stroke-[1.75]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Email Inquiry</h5>
                    <a 
                      href={`mailto:${email}`} 
                      className="text-zinc-950 dark:text-white text-sm sm:text-base font-bold hover:text-teal-600 dark:hover:text-teal-400 transition-colors break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700 shrink-0">
                    <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 stroke-[1.75]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Corporate Office</h5>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-normal text-pretty">
                      {address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200/70 dark:border-zinc-800 mt-8 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>24/7 Operations</span>
              <span>All-India Permits</span>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-zinc-50 dark:bg-[#121418] border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white mb-1">
              Request a Quotation
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 font-normal text-pretty">
              Receive route-specific rates within 15 minutes.
            </p>

            {formSubmitted ? (
              <div className="p-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center flex flex-col items-center">
                <CheckCircle2 className="w-10 h-10 text-teal-600 dark:text-teal-400 mb-2 stroke-[1.75]" />
                <h4 className="text-teal-950 dark:text-teal-100 font-bold text-base">Inquiry Dispatched</h4>
                <p className="text-teal-800 dark:text-teal-300 text-xs mt-1">Our dispatch team will connect via phone and email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-mono font-medium text-zinc-600 dark:text-zinc-400 tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Vikramaditya Rao"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-[border-color,box-shadow] text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-mono font-medium text-zinc-600 dark:text-zinc-400 tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-[border-color,box-shadow] text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono font-medium text-zinc-600 dark:text-zinc-400 tracking-wider mb-1.5">
                    Fleet Category
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-[border-color,box-shadow] text-sm font-medium"
                  >
                    <option value="9 Seater Tempo Traveller">9 Seater Tempo Traveller</option>
                    <option value="12 Seater Tempo Traveller">12 Seater Tempo Traveller</option>
                    <option value="16 Seater Tempo Traveller">16 Seater Tempo Traveller</option>
                    <option value="Force Urbania Luxury Van">Force Urbania Luxury Van</option>
                    <option value="20 Seater Mini Bus">20 Seater Mini Bus</option>
                    <option value="Luxury Volvo Coach">Luxury Volvo Coach (45-55 Seats)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono font-medium text-zinc-600 dark:text-zinc-400 tracking-wider mb-1.5">
                    Trip Specification
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Origin, destination, journey dates, and passenger group size."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-[border-color,box-shadow] text-sm font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-[background-color,transform] duration-150 ease-out active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  <span>Submit Booking Request</span>
                  <Send className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
