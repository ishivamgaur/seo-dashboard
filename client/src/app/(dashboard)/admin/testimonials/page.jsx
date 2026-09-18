'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Star, Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import api from '@/lib/api';

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Matching Testimonial model: customerName, review, rating, customerImage
  const [formData, setFormData] = useState({ 
    id: null, 
    customerName: '', 
    review: '', 
    rating: 5, 
    customerImage: '' 
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const showToast = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials');
      if (res.data?.success) setTestimonials(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchesSearch = 
        t.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.review?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (ratingFilter !== 'all') {
        return Number(t.rating) === Number(ratingFilter);
      }
      return true;
    });
  }, [testimonials, searchQuery, ratingFilter]);

  const isFilterActive = searchQuery !== '' || ratingFilter !== 'all';

  const openModal = (t = null) => {
    setFormData(t ? { 
      id: t.id, 
      customerName: t.customerName || '', 
      review: t.review || '', 
      rating: t.rating || 5, 
      customerImage: t.customerImage || '' 
    } : { 
      id: null, 
      customerName: '', 
      review: '', 
      rating: 5, 
      customerImage: '' 
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append('customerName', formData.customerName);
    form.append('review', formData.review);
    form.append('rating', formData.rating);
    if (imageFile) {
      form.append('customerImage', imageFile);
    } else if (formData.customerImage) {
      form.append('customerImage', formData.customerImage);
    }

    const url = formData.id ? `/testimonials/${formData.id}` : '/testimonials';
    const method = formData.id ? 'put' : 'post';

    try {
      const res = await api[method](url, form);
      if (res.status === 200 || res.status === 201) {
        closeModal();
        fetchTestimonials();
        showToast(formData.id ? 'Review updated.' : 'Review created.');
      }
    } catch (err) {
      console.error('Failed to save testimonial:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await api.delete(`/testimonials/${id}`);
      if (res.status === 200) {
        fetchTestimonials();
        showToast('Review deleted.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-full space-y-4 font-sans antialiased">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
            Client Testimonials
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage customer reviews and 5-star ratings for the verified client review carousel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusMsg && (
            <span className="text-xs font-mono text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-3 py-1.5 rounded-lg font-medium">
              {statusMsg}
            </span>
          )}

          <button 
            type="button"
            onClick={() => openModal()} 
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Search & Rating Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#13161c] rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400 stroke-[1.75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by client or feedback..."
            className="w-full pl-9 pr-3 py-2 bg-[#f6f8fa] dark:bg-[#1a1e27] border-0 rounded-lg text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-teal-500 outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-mono text-zinc-400 uppercase mr-1 hidden lg:inline">Rating:</span>
          {['all', '5', '4'].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRatingFilter(star)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide cursor-pointer ${
                ratingFilter === star
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {star === 'all' ? 'All Ratings' : `${star} Stars`}
            </button>
          ))}

          {isFilterActive && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setRatingFilter('all');
              }}
              className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white underline ml-2 font-mono cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#13161c] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3.5">Client Name</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Review Feedback</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-zinc-500 font-mono">
                    Loading testimonials...
                  </td>
                </tr>
              ) : filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-12 text-center text-zinc-500 font-mono">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Star className="w-8 h-8 text-zinc-400 mx-auto" />
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300">No client reviews found</p>
                      <p className="text-xs text-zinc-500">Click Add Testimonial to publish verified client feedback.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((t) => (
                  <tr key={t.id} className="text-zinc-900 dark:text-zinc-100 hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-zinc-950 dark:text-white whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200 shrink-0">
                          {(t.customerName || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span>{t.customerName}</span>
                          <span className="block text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold">Verified Client</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                        <span className="ml-1.5 text-[11px] font-mono tabular-nums text-zinc-500">
                          {t.rating || 5}.0
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-300 max-w-lg leading-relaxed">
                      &ldquo;{t.review}&rdquo;
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openModal(t)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors mr-1 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 stroke-[1.75]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.75]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog with Interactive Star Picker */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#13161c] rounded-xl p-6 shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
                  {formData.id ? 'Edit Client Testimonial' : 'Add Client Testimonial'}
                </h2>
                <span className="text-[11px] font-mono text-zinc-500">
                  Featured in verified social proof section on homepage
                </span>
              </div>
              <button 
                type="button"
                onClick={closeModal} 
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Vikramaditya Singhania"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                />
              </div>

              {/* Interactive Star Rating Selector */}
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Rating: {formData.rating} Stars
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 rounded hover:scale-110 transition-transform cursor-pointer"
                      title={`${star} Stars`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= formData.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-2">
                    {formData.rating}.0 / 5.0
                  </span>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Client Review Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Urban Cruise coordinated 4 Force Urbania vans for our leadership offsite in Jaipur. Pristine cleanliness and punctual chauffeurs."
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium leading-relaxed border-0"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
