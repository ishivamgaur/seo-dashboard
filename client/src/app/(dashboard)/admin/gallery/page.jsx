'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash, X } from 'lucide-react';
import Image from 'next/image';

export default function GalleryAdminPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ file: null, alt_tag: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const json = await res.json();
      if (json.success) setImages(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setFormData({ file: null, alt_tag: '' });
    setModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      setError('Please select an image');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData();
    form.append('image', formData.file);
    form.append('alt_tag', formData.alt_tag);

    try {
      const res = await fetch('/api/gallery', { method: 'POST', body: form });
      const json = await res.json();
      if (json.success) {
        setSuccess('Image uploaded successfully');
        fetchGallery();
        setTimeout(closeModal, 1500);
      } else {
        setError(json.message || 'Error uploading image');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchGallery();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Gallery</h1>
        <button onClick={openModal} className="bg-[#FFAD00] hover:bg-black text-white px-4 py-2 rounded-[8px] flex items-center gap-2">
          <Plus size={18} /> Upload Image
        </button>
      </div>

      {loading && images.length === 0 ? (
        <div className="text-zinc-500">Loading gallery...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white border border-zinc-200 rounded-[12px] overflow-hidden group relative">
              <div className="aspect-square relative w-full bg-zinc-100">
                {img.image_url && (
                  <Image src={img.image_url} alt={img.alt_tag || 'Gallery image'} fill className="object-cover" />
                )}
              </div>
              <div className="p-3 bg-white">
                <p className="text-sm font-medium text-zinc-900 truncate" title={img.alt_tag}>{img.alt_tag || 'No alt text'}</p>
              </div>
              <button 
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 bg-red-600/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      {!loading && images.length === 0 && <p className="text-zinc-500 mt-4">No images in gallery.</p>}

      {modalOpen && (
        <div className="bg-zinc-950/50 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-[12px] p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upload Image</h2>
              <button onClick={closeModal} className="text-zinc-500 hover:text-zinc-800"><X size={20} /></button>
            </div>
            {error && <div className="bg-red-50 text-red-800 p-3 rounded-[8px] mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-50 text-green-800 p-3 rounded-[8px] mb-4 text-sm">{success}</div>}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Image Alt Tag (SEO)" 
                value={formData.alt_tag} 
                onChange={(e) => setFormData({ ...formData, alt_tag: e.target.value })} 
                required 
                className="bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00] outline-none" 
              />
              <div className="border-2 border-dashed border-zinc-200 rounded-[8px] p-4 text-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} 
                  className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-50 file:text-zinc-700 hover:file:bg-zinc-100" 
                />
              </div>
              <button type="submit" disabled={loading} className="bg-[#FFAD00] hover:bg-black text-white px-4 py-2 rounded-[8px] mt-2">
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
