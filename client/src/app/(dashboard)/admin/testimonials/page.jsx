'use client';

import React, { useState, useEffect } from 'react';
import { Star, Plus, Edit, Trash, X } from 'lucide-react';
import Image from 'next/image';

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', content: '', rating: 5, image: null });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const json = await res.json();
      if (json.success) setTestimonials(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (t = null) => {
    setFormData(t ? { id: t.id, name: t.name, content: t.content, rating: t.rating, image: null } : { id: null, name: '', content: '', rating: 5, image: null });
    setModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData();
    form.append('name', formData.name);
    form.append('content', formData.content);
    form.append('rating', formData.rating);
    if (formData.image) form.append('image', formData.image);

    const url = formData.id ? `/api/testimonials/${formData.id}` : '/api/testimonials';
    const method = formData.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: form });
      const json = await res.json();
      if (json.success) {
        setSuccess(json.message || 'Testimonial saved');
        fetchTestimonials();
        setTimeout(closeModal, 1500);
      } else {
        setError(json.message || 'Error saving');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Testimonials</h1>
        <button onClick={() => openModal()} className="bg-[#FFAD00] hover:bg-black text-white px-4 py-2 rounded-[8px] flex items-center gap-2">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[12px] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="p-4 font-medium text-zinc-600">Client</th>
              <th className="p-4 font-medium text-zinc-600">Rating</th>
              <th className="p-4 font-medium text-zinc-600">Content</th>
              <th className="p-4 font-medium text-zinc-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="p-4 flex items-center gap-3">
                  {t.image_url ? (
                    <Image src={t.image_url} alt={t.name} width={40} height={40} className="rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-zinc-200 rounded-full" />
                  )}
                  <span className="font-medium text-zinc-900">{t.name}</span>
                </td>
                <td className="p-4 flex text-[#FFAD00]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill={i < t.rating ? '#FFAD00' : 'none'} stroke={i < t.rating ? '#FFAD00' : '#D4D4D8'} />
                  ))}
                </td>
                <td className="p-4 text-zinc-600 truncate max-w-xs">{t.content}</td>
                <td className="p-4 text-right">
                  <button onClick={() => openModal(t)} className="text-blue-600 hover:text-blue-800 p-2"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800 p-2"><Trash size={16} /></button>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && !loading && (
              <tr><td colSpan="4" className="p-4 text-center text-zinc-500">No testimonials found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="bg-zinc-950/50 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-[12px] p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{formData.id ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={closeModal} className="text-zinc-500 hover:text-zinc-800"><X size={20} /></button>
            </div>
            {error && <div className="bg-red-50 text-red-800 p-3 rounded-[8px] mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-50 text-green-800 p-3 rounded-[8px] mb-4 text-sm">{success}</div>}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="Client Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00] outline-none" />
              <textarea placeholder="Testimonial Content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows={4} className="bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00] outline-none" />
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-700">Rating:</label>
                <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className="bg-white border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00] outline-none">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} className="text-sm" />
              <button type="submit" disabled={loading} className="bg-[#FFAD00] hover:bg-black text-white px-4 py-2 rounded-[8px] mt-2">
                {loading ? 'Saving...' : 'Save Testimonial'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
