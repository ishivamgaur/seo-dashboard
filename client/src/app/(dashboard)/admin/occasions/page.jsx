'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Edit2, Trash2, Plus, X, Compass, ArrowUp, ArrowDown, GripVertical, Search } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '@/lib/api';

export default function OccasionsPage() {
  const [occasions, setOccasions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Form state matching Occasion model (title, description, image)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const fetchOccasions = async () => {
    try {
      const res = await api.get('/occasions');
      if (res.data?.success) setOccasions(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch occasions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchOccasions();
  }, []);

  const showToast = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const filteredOccasions = useMemo(() => {
    return occasions.filter((o) => {
      return (
        o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [occasions, searchQuery]);

  const isFilterActive = searchQuery.trim().length > 0;

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    if (isFilterActive) {
      showToast('Clear search filter before reordering.');
      return;
    }

    const newOccasions = Array.from(occasions);
    const [moved] = newOccasions.splice(result.source.index, 1);
    newOccasions.splice(result.destination.index, 0, moved);

    setOccasions(newOccasions);

    const orderPayload = newOccasions.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    try {
      await api.patch('/occasions/reorder', { order: orderPayload });
      showToast('Occasions display order updated.');
    } catch (err) {
      console.error('Failed to reorder occasions', err);
      fetchOccasions();
    }
  };

  const handleMove = async (index, direction) => {
    const newOccasions = [...occasions];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOccasions.length) return;

    const [moved] = newOccasions.splice(index, 1);
    newOccasions.splice(targetIndex, 0, moved);

    setOccasions(newOccasions);

    const orderPayload = newOccasions.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    try {
      await api.patch('/occasions/reorder', { order: orderPayload });
      showToast('Occasions display order updated.');
    } catch (err) {
      console.error('Failed to reorder occasions', err);
      fetchOccasions();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    if (image) {
      formData.append('image', image);
    } else if (imageUrl) {
      formData.append('image', imageUrl);
    }

    const occasionId = editingOccasion?.id;
    const url = editingOccasion ? `/occasions/${occasionId}` : '/occasions';
    const method = editingOccasion ? 'put' : 'post';

    try {
      const res = await api[method](url, formData);
      if (res.status === 200 || res.status === 201) {
        setIsModalOpen(false);
        resetForm();
        fetchOccasions();
        showToast(editingOccasion ? 'Occasion updated successfully.' : 'Occasion created successfully.');
      }
    } catch (error) {
      console.error('Failed to save occasion:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this occasion?')) return;
    try {
      const res = await api.delete(`/occasions/${id}`);
      if (res.status === 200) {
        fetchOccasions();
        showToast('Occasion deleted successfully.');
      }
    } catch (error) {
      console.error('Failed to delete occasion:', error);
    }
  };

  const resetForm = () => {
    setEditingOccasion(null);
    setTitle('');
    setDescription('');
    setImage(null);
    setImageUrl('');
    setImagePreviewUrl('');
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (occasion) => {
    setEditingOccasion(occasion);
    setTitle(occasion.title || '');
    setDescription(occasion.description || '');
    setImage(null);
    setImageUrl(occasion.image || '');
    setImagePreviewUrl(occasion.image || '');
    setIsModalOpen(true);
  };

  return (
    <div className="w-full min-h-full space-y-4 font-sans antialiased">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
            Services & Occasions Management
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Drag rows via grip handle to reorder travel occasion cards on the live homepage.
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
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Add Occasion</span>
          </button>
        </div>
      </div>

      {/* Search & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#13161c] rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400 stroke-[1.75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search occasions by title or description..."
            className="w-full pl-9 pr-3 py-2 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-teal-500 outline-none font-medium border-0"
          />
        </div>

        {isFilterActive && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white underline font-mono cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#13161c] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3.5 w-20 text-center">Drag / Order</th>
                <th className="px-5 py-3.5 w-36">16:9 Banner</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            {isLoading ? (
              <tbody className="divide-y divide-zinc-100/70 dark:divide-zinc-800/40">
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-zinc-500 font-mono">
                    Loading occasions...
                  </td>
                </tr>
              </tbody>
            ) : filteredOccasions.length === 0 ? (
              <tbody className="divide-y divide-zinc-100/70 dark:divide-zinc-800/40">
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-zinc-500 font-mono">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Compass className="w-8 h-8 text-zinc-400 mx-auto" />
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300">No occasions match criteria</p>
                      <p className="text-xs text-zinc-500">Click Add Occasion to register a new travel service.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : !isMounted ? (
              <tbody className="divide-y divide-zinc-100/70 dark:divide-zinc-800/40">
                {filteredOccasions.map((o, index) => (
                  <tr key={o.id} className="text-zinc-900 dark:text-zinc-100 hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80 transition-colors">
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-mono text-zinc-400 text-xs">#{index + 1}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="relative w-28 h-16 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg overflow-hidden flex items-center justify-center">
                        {o.image ? (
                          <img src={o.image} alt={o.title} className="object-cover w-full h-full" />
                        ) : (
                          <Compass className="w-5 h-5 text-zinc-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-zinc-950 dark:text-white">
                      {o.title}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-300 max-w-md line-clamp-2">
                      {o.description}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEditModal(o)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors mr-1 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 stroke-[1.75]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(o.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.75]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="occasions-table-droppable" ignoreContainerClipping>
                  {(provided) => (
                    <tbody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="divide-y divide-zinc-100/70 dark:divide-zinc-800/40"
                    >
                      {filteredOccasions.map((o, index) => {
                        const id = o.id.toString();
                        return (
                          <Draggable key={id} draggableId={id} index={index} isDragDisabled={isFilterActive}>
                            {(providedDrag, snapshot) => (
                              <tr
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                className={`text-zinc-900 dark:text-zinc-100 transition-colors ${
                                  snapshot.isDragging
                                    ? 'bg-teal-50 dark:bg-[#1a1e27] shadow-xl ring-2 ring-teal-500 z-50'
                                    : 'hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80'
                                }`}
                              >
                                {/* Drag Grip Handle */}
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      {...providedDrag.dragHandleProps}
                                      disabled={isFilterActive}
                                      className={`p-1.5 rounded-md transition-colors ${
                                        isFilterActive
                                          ? 'opacity-30 cursor-not-allowed text-zinc-400'
                                          : 'hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-grab active:cursor-grabbing'
                                      }`}
                                      title={isFilterActive ? 'Clear search to reorder' : 'Drag to reorder occasion position'}
                                    >
                                      <GripVertical className="w-4 h-4 stroke-[2]" />
                                    </button>

                                    <div className="flex flex-col gap-0.5">
                                      <button
                                        type="button"
                                        disabled={index === 0 || isFilterActive}
                                        onClick={() => handleMove(index, -1)}
                                        className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-500 dark:text-zinc-400 transition-colors"
                                        title="Move Up"
                                      >
                                        <ArrowUp className="w-3 h-3 stroke-[2]" />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={index === filteredOccasions.length - 1 || isFilterActive}
                                        onClick={() => handleMove(index, 1)}
                                        className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-20 text-zinc-500 dark:text-zinc-400 transition-colors"
                                        title="Move Down"
                                      >
                                        <ArrowDown className="w-3 h-3 stroke-[2]" />
                                      </button>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-5 py-3.5">
                                  <div className="relative w-28 h-16 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg overflow-hidden flex items-center justify-center">
                                    {o.image ? (
                                      <img src={o.image} alt={o.title} className="object-cover w-full h-full" />
                                    ) : (
                                      <Compass className="w-5 h-5 text-zinc-400" />
                                    )}
                                  </div>
                                </td>

                                <td className="px-5 py-3.5 font-bold text-zinc-950 dark:text-white">
                                  <div className="flex items-center gap-2">
                                    <span>{o.title}</span>
                                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                                      Pos #{index + 1}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-300 max-w-md line-clamp-2">
                                  {o.description}
                                </td>

                                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(o)}
                                    className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors mr-1 cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 stroke-[1.75]" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(o.id)}
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#13161c] rounded-2xl p-6 shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-5 pb-3">
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                  {editingOccasion ? 'Edit Service Occasion' : 'Add Service Occasion'}
                </h2>
                <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                  Widescreen 16:9 banner displays without cropping
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Occasion Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Destination Wedding Transportation"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                  required
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Luxury buses, vans, and chauffeur-driven convoys for baraat, guest transfers, and events."
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                  required
                />
              </div>

              {/* 16:9 Banner Image with Live Preview Card */}
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Banner Image (16:9 Aspect Ratio)
                </label>

                {imagePreviewUrl && (
                  <div className="mb-3 p-2.5 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] flex items-center gap-3">
                    <div className="w-24 h-14 bg-white dark:bg-[#13161c] rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                      <img src={imagePreviewUrl} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-teal-600 dark:text-teal-400 font-bold block">
                        16:9 Preview Active
                      </span>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {image ? image.name : imageUrl}
                      </p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs mb-2 cursor-pointer border-0"
                  accept="image/*"
                />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (!image) setImagePreviewUrl(e.target.value);
                  }}
                  placeholder="Or paste Cloudinary / WebP Image URL"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-[#f6f8fa] dark:bg-[#1a1e27] hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-lg font-semibold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all"
                >
                  Save Occasion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
