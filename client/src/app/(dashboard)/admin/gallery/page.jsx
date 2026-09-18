'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  X, 
  Images, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  GripVertical, 
  Search, 
  LayoutList, 
  LayoutGrid 
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '@/lib/api';

export default function GalleryAdminPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [formData, setFormData] = useState({ file: null, altTag: '' });
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState('');
  const [editAltTag, setEditAltTag] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    fetchGallery();
  }, []);

  const showToast = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const fetchGallery = async () => {
    try {
      const res = await api.get('/gallery');
      if (res.data?.success) setImages(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const alt = (img.altTag || img.alt_tag || '').toLowerCase();
      return alt.includes(searchQuery.toLowerCase());
    });
  }, [images, searchQuery]);

  const isFilterActive = searchQuery.trim().length > 0;

  const openModal = () => {
    setFormData({ file: null, altTag: '' });
    setUploadPreviewUrl('');
    setModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setUploadPreviewUrl('');
    setError(null);
  };

  const openEditModal = (img) => {
    setEditingImage(img);
    setEditAltTag(img.altTag || img.alt_tag || '');
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingImage(null);
    setEditModalOpen(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setUploadPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      setError('Please select an image file to upload.');
      return;
    }
    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append('images', formData.file);
    form.append('altTag', formData.altTag);

    try {
      const res = await api.post('/gallery', form);
      if (res.status === 201 || res.status === 200) {
        closeModal();
        fetchGallery();
        showToast('Image uploaded to gallery.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAlt = async (e) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      const res = await api.put(`/gallery/${editingImage.id}`, { altTag: editAltTag });
      if (res.status === 200) {
        closeEditModal();
        fetchGallery();
        showToast('Alt tag updated successfully.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    if (isFilterActive) {
      showToast('Clear search filter before reordering.');
      return;
    }

    const newImages = Array.from(images);
    const [moved] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, moved);

    setImages(newImages);

    const orderPayload = newImages.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    try {
      await api.patch('/gallery/reorder', { order: orderPayload });
      showToast('Gallery order updated.');
    } catch (err) {
      console.error('Failed to reorder gallery', err);
      fetchGallery();
    }
  };

  const handleMove = async (index, direction) => {
    const newImages = [...images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    const [moved] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, moved);

    setImages(newImages);

    const orderPayload = newImages.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    try {
      await api.patch('/gallery/reorder', { order: orderPayload });
      showToast('Gallery order updated.');
    } catch (err) {
      console.error('Failed to reorder gallery', err);
      fetchGallery();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this gallery photo?')) return;
    try {
      const res = await api.delete(`/gallery/${id}`);
      if (res.status === 200) {
        fetchGallery();
        showToast('Image deleted.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-full space-y-4 font-sans antialiased">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
            Fleet Gallery Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Reorder photos with drag and drop to customize the public homepage showroom presentation.
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
            onClick={openModal} 
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Search & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#13161c] rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400 stroke-[1.75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery photos by alt tag..."
            className="w-full pl-9 pr-3 py-2 bg-[#f6f8fa] dark:bg-[#1a1e27] border-0 rounded-lg text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-teal-500 outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          {isFilterActive && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white underline font-mono cursor-pointer"
            >
              Clear Search
            </button>
          )}

          {/* View Switcher */}
          <div className="flex items-center bg-[#f6f8fa] dark:bg-[#1a1e27] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
              title="Table Reorder View"
            >
              <LayoutList className="w-3.5 h-3.5 stroke-[2]" />
              <span>Drag Reorder</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
              title="Grid Showcase View"
            >
              <LayoutGrid className="w-3.5 h-3.5 stroke-[2]" />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {loading && images.length === 0 ? (
        <div className="text-xs font-mono text-zinc-500 py-12 text-center">
          Loading gallery photos...
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-white dark:bg-[#13161c] rounded-xl p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
          <Images className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
          <p className="text-xs font-mono text-zinc-500">
            {isFilterActive ? 'No photos match your search query.' : 'No images in gallery yet. Click Upload Image to add one.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE REORDER VIEW (Kanban Drag & Drop Table) */
        <div className="bg-white dark:bg-[#13161c] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3.5 w-24 text-center">Drag / Order</th>
                  <th className="px-5 py-3.5 w-36">Thumbnail</th>
                  <th className="px-5 py-3.5">SEO Alt Tag Description</th>
                  <th className="px-5 py-3.5 w-32">Position</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              {!isMounted ? (
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {filteredImages.map((img, index) => {
                    const src = img.imagePath || img.image_url;
                    const alt = img.altTag || img.alt_tag || 'Fleet Showcase Photo';

                    return (
                      <tr key={img.id} className="text-zinc-900 dark:text-zinc-100 hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80 transition-colors">
                        <td className="px-4 py-3.5 text-center">
                          <span className="font-mono text-zinc-400 text-xs">#{index + 1}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="relative w-24 h-16 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg overflow-hidden flex items-center justify-center">
                            {src ? (
                              <img src={src} alt={alt} className="object-contain w-full h-full" />
                            ) : (
                              <Images className="w-5 h-5 text-zinc-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-zinc-950 dark:text-white max-w-md">
                          {alt}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50">
                            Pos #{index + 1}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openEditModal(img)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md mr-1 cursor-pointer"
                            title="Edit Alt Tag"
                          >
                            <Edit2 className="w-4 h-4 stroke-[1.75]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(img.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 stroke-[1.75]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="gallery-table-droppable" ignoreContainerClipping>
                    {(provided) => (
                      <tbody
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="divide-y divide-zinc-100 dark:divide-zinc-800/80"
                      >
                        {filteredImages.map((img, index) => {
                          const id = img.id.toString();
                          const src = img.imagePath || img.image_url;
                          const alt = img.altTag || img.alt_tag || 'Fleet Showcase Photo';

                          return (
                            <Draggable key={id} draggableId={id} index={index} isDragDisabled={isFilterActive}>
                              {(providedDrag, snapshot) => (
                                <tr
                                  ref={providedDrag.innerRef}
                                  {...providedDrag.draggableProps}
                                  className={`text-zinc-900 dark:text-zinc-100 ${
                                    snapshot.isDragging
                                      ? 'bg-teal-50/80 dark:bg-teal-950/30 shadow-xl ring-2 ring-teal-500 z-50'
                                      : 'hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80 transition-colors'
                                  }`}
                                >
                                  {/* Drag Grip Handle & Up/Down Arrows */}
                                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        {...providedDrag.dragHandleProps}
                                        disabled={isFilterActive}
                                        className={`p-1.5 rounded-md ${
                                          isFilterActive
                                            ? 'opacity-30 cursor-not-allowed text-zinc-400'
                                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-grab active:cursor-grabbing'
                                        }`}
                                        title={isFilterActive ? 'Clear search to reorder' : 'Drag to reorder showroom position'}
                                      >
                                        <GripVertical className="w-4 h-4 stroke-[2]" />
                                      </button>

                                      <div className="flex flex-col gap-0.5">
                                        <button
                                          type="button"
                                          disabled={index === 0 || isFilterActive}
                                          onClick={() => handleMove(index, -1)}
                                          className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-500 dark:text-zinc-400 cursor-pointer"
                                          title="Move Up"
                                        >
                                          <ArrowUp className="w-3 h-3 stroke-[2]" />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={index === filteredImages.length - 1 || isFilterActive}
                                          onClick={() => handleMove(index, 1)}
                                          className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-500 dark:text-zinc-400 cursor-pointer"
                                          title="Move Down"
                                        >
                                          <ArrowDown className="w-3 h-3 stroke-[2]" />
                                        </button>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Thumbnail Preview */}
                                  <td className="px-5 py-3.5">
                                    <div className="relative w-24 h-16 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg overflow-hidden flex items-center justify-center">
                                      {src ? (
                                        <img src={src} alt={alt} className="object-contain w-full h-full" />
                                      ) : (
                                        <Images className="w-5 h-5 text-zinc-400" />
                                      )}
                                    </div>
                                  </td>

                                  {/* Alt Tag */}
                                  <td className="px-5 py-3.5 font-medium text-zinc-950 dark:text-white max-w-md">
                                    <div className="flex items-center gap-2">
                                      <span className="truncate" title={alt}>{alt}</span>
                                    </div>
                                  </td>

                                  {/* Position */}
                                  <td className="px-5 py-3.5 font-mono">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50">
                                      Pos #{index + 1}
                                    </span>
                                  </td>

                                  {/* Actions */}
                                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={() => openEditModal(img)}
                                      className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors mr-1 cursor-pointer"
                                      title="Edit Alt Tag"
                                    >
                                      <Edit2 className="w-4 h-4 stroke-[1.75]" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(img.id)}
                                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4 stroke-[1.75]" />
                                    </button>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </tbody>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </table>
          </div>
        </div>
      ) : (
        /* GRID SHOWCASE VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, index) => {
            const src = img.imagePath || img.image_url;
            const alt = img.altTag || img.alt_tag || 'Fleet Showcase Photo';

            return (
              <div 
                key={img.id} 
                className="bg-white dark:bg-[#13161c] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow duration-150"
              >
                {/* Image Stage */}
                <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-900 p-2 flex items-center justify-center ring-1 ring-black/[0.04] dark:ring-white/[0.04]">
                  {src ? (
                    <img 
                      src={src} 
                      alt={alt} 
                      className="object-contain w-full h-full" 
                    />
                  ) : (
                    <Images className="w-8 h-8 text-zinc-400" />
                  )}

                  {/* Position Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/75 text-white px-2 py-1 rounded-lg shadow-sm font-mono text-[10px] font-bold">
                    <span>Pos #{index + 1}</span>
                  </div>

                  {/* Top Right Action Controls */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => openEditModal(img)}
                      className="bg-black/75 hover:bg-teal-600 text-white p-1.5 rounded-lg cursor-pointer shadow-sm"
                      title="Edit Alt Tag"
                    >
                      <Edit2 className="w-3.5 h-3.5 stroke-[1.75]" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      className="bg-black/75 hover:bg-red-600 text-white p-1.5 rounded-lg cursor-pointer shadow-sm"
                      title="Delete image"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                    </button>
                  </div>

                  {/* Bottom Reorder Controls */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0 || isFilterActive}
                      onClick={() => handleMove(index, -1)}
                      className="p-1.5 rounded-lg bg-black/75 hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs cursor-pointer"
                      title="Move Left / Earlier"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === filteredImages.length - 1 || isFilterActive}
                      onClick={() => handleMove(index, 1)}
                      className="p-1.5 rounded-lg bg-black/75 hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs cursor-pointer"
                      title="Move Right / Later"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate" title={alt}>
                    {alt}
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    Pos #{index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal with Live Preview */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#13161c] rounded-xl p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
                  Upload Fleet Image
                </h2>
                <span className="text-[11px] font-mono text-zinc-500">
                  PNG, JPG, or WebP photo for showroom grid
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

            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-xs">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  SEO Alt Tag Description
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Force Urbania Luxury Van Rear View" 
                  value={formData.altTag} 
                  onChange={(e) => setFormData({ ...formData, altTag: e.target.value })} 
                  required 
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white border-0 rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium" 
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Image File
                </label>
                
                {uploadPreviewUrl && (
                  <div className="mb-3 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center gap-3">
                    <div className="w-20 h-14 bg-white dark:bg-black rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-zinc-200/80 dark:border-zinc-800">
                      <img src={uploadPreviewUrl} alt="Preview" className="object-contain w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-teal-600 dark:text-teal-400 font-bold block">
                        File Selected
                      </span>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {formData.file?.name}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 text-center bg-zinc-50 dark:bg-zinc-900/60">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileSelect} 
                    className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 cursor-pointer" 
                  />
                </div>
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
                  disabled={loading} 
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  {loading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Alt Tag Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#13161c] rounded-xl p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
                Edit SEO Alt Tag
              </h2>
              <button 
                type="button"
                onClick={closeEditModal} 
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateAlt} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Alt Tag Description
                </label>
                <input 
                  type="text" 
                  value={editAltTag} 
                  onChange={(e) => setEditAltTag(e.target.value)} 
                  required 
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white border-0 rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  Update Alt Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
