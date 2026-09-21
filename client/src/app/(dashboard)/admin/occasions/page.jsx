"use client";

import React, { useState, useEffect, useMemo } from "react";
import SafeImage from "@/components/ui/SafeImage";
import {
  Edit2,
  Plus,
  X,
  Compass,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import DeleteButton from "@/components/common/DeleteButton";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "@/lib/api";

export default function OccasionsPage() {
  const [occasions, setOccasions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [savedOccasion, setSavedOccasion] = useState(null);
  const occasionSnapshot = () => JSON.stringify({ title, description, imageUrl });
  const occasionDirty = !!image || !savedOccasion || occasionSnapshot() !== savedOccasion;

  const fetchOccasions = async () => {
    try {
      const res = await api.get("/occasions");
      if (res.data?.success) setOccasions(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch occasions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount gate keeps drag-drop client-only
    setIsMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial list load on mount
    fetchOccasions();
  }, []);

  // single toast helper for this page (sonner renders it globally)
  const showToast = (msg) => toast.success(msg);

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
      showToast("Clear search filter before reordering.");
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
      await api.patch("/occasions/reorder", { order: orderPayload });
      showToast("Occasions display order updated.");
    } catch (err) {
      console.error("Failed to reorder occasions", err);
      toast.error("Failed to update display order.");
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
      await api.patch("/occasions/reorder", { order: orderPayload });
      showToast("Occasions display order updated.");
    } catch (err) {
      console.error("Failed to reorder occasions", err);
      toast.error("Failed to update display order.");
      fetchOccasions();
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;
    if (image.size > 10 * 1024 * 1024) {
      toast.error(`Image is ${(image.size / 1048576).toFixed(1)}MB — maximum is 10MB.`);
      return;
    }
    setUploadingImage(true);
    try {
      const payload = new FormData();
      payload.append("image", image);
      const res = await api.post("/upload?folder=occasions&preset=standard", payload);
      const url = res.data?.data?.url;
      if (res.status === 200 && url) {
        setImageUrl(url);
        setImagePreviewUrl(url);
        setImage(null);
        showToast("Image uploaded. Save the occasion to publish it.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
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
    formData.append("title", title);
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    } else if (imageUrl) {
      formData.append("image", imageUrl);
    }

    const occasionId = editingOccasion?.id;
    const url = editingOccasion ? `/occasions/${occasionId}` : "/occasions";
    const method = editingOccasion ? "put" : "post";

    setSaving(true);
    try {
      const res = await api[method](url, formData);
      if (res.status === 200 || res.status === 201) {
        setIsModalOpen(false);
        resetForm();
        fetchOccasions();
        showToast(
          editingOccasion ? "Occasion updated successfully." : "Occasion created successfully."
        );
      }
    } catch (error) {
      console.error("Failed to save occasion:", error);
      toast.error(error.response?.data?.message || "Failed to save occasion.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this occasion?")) return;
    setDeletingId(id);
    try {
      const res = await api.delete(`/occasions/${id}`);
      if (res.status === 200) {
        fetchOccasions();
        showToast("Occasion deleted successfully.");
      }
    } catch (error) {
      console.error("Failed to delete occasion:", error);
      toast.error(error.response?.data?.message || "Failed to delete occasion.");
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setEditingOccasion(null);
    setTitle("");
    setDescription("");
    setImage(null);
    setImageUrl("");
    setImagePreviewUrl("");
  };

  const openAddModal = () => {
    resetForm();
    setSavedOccasion(JSON.stringify({ title: "", description: "", imageUrl: "" }));
    setIsModalOpen(true);
  };

  const openEditModal = (occasion) => {
    setEditingOccasion(occasion);
    setTitle(occasion.title || "");
    setDescription(occasion.description || "");
    setImage(null);
    setImageUrl(occasion.image || "");
    setImagePreviewUrl(occasion.image || "");
    setSavedOccasion(
      JSON.stringify({
        title: occasion.title || "",
        description: occasion.description || "",
        imageUrl: occasion.image || "",
      })
    );
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-8xl min-h-full space-y-4 font-sans antialiased">
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
      </div>

      <div className="bg-white dark:bg-[#13161c] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[860px] w-full divide-y divide-zinc-100 dark:divide-zinc-800/80">
            <div className="grid grid-cols-[144px_144px_200px_minmax(0,1fr)_100px] items-center bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
              <div className="px-3 sm:px-5 py-3.5 whitespace-nowrap">Drag / Order</div>
              <div className="px-3 sm:px-5 py-3.5">16:9 Banner</div>
              <div className="px-3 sm:px-5 py-3.5">Title</div>
              <div className="px-3 sm:px-5 py-3.5">Description</div>
              <div className="px-3 sm:px-5 py-3.5 text-right">Actions</div>
            </div>

            {isLoading ? (
              <div className="px-5 py-8 text-center text-zinc-500 font-mono text-xs">
                Loading occasions...
              </div>
            ) : filteredOccasions.length === 0 ? (
              <div className="px-5 py-12 text-center text-zinc-500 font-mono text-xs">
                <div className="max-w-sm mx-auto space-y-2">
                  <Compass className="w-8 h-8 text-zinc-400 mx-auto" />
                  <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                    No occasions match criteria
                  </p>
                  <p className="text-xs text-zinc-500">
                    Click Add Occasion to register a new travel service.
                  </p>
                </div>
              </div>
            ) : !isMounted ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filteredOccasions.map((o, index) => (
                  <div
                    key={o.id}
                    className="grid grid-cols-[144px_144px_200px_minmax(0,1fr)_100px] items-center text-xs text-zinc-900 dark:text-zinc-100 hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80 transition-colors"
                  >
                    <div className="px-3 sm:px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="p-1 text-zinc-300 dark:text-zinc-600">
                          <GripVertical className="w-3.5 h-3.5 stroke-[1.75]" />
                        </div>
                        <div className="flex flex-col -space-y-0.5 opacity-25">
                          <span className="p-0.5 text-zinc-400">
                            <ArrowUp className="w-2.5 h-2.5 stroke-[2]" />
                          </span>
                          <span className="p-0.5 text-zinc-400">
                            <ArrowDown className="w-2.5 h-2.5 stroke-[2]" />
                          </span>
                        </div>
                        <span className="font-mono text-xs tabular-nums font-semibold text-zinc-500 dark:text-zinc-400 w-5 text-center select-none">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 sm:px-5 py-3.5">
                      <div className="relative w-28 h-16 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg overflow-hidden flex items-center justify-center">
                        {o.image ? (
                          <SafeImage
                            src={o.image}
                            alt={o.title}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        ) : (
                          <Compass className="w-5 h-5 text-zinc-400" />
                        )}
                      </div>
                    </div>
                    <div className="px-3 sm:px-5 py-3.5 font-bold text-zinc-950 dark:text-white truncate">
                      <span title={o.title}>{o.title}</span>
                    </div>
                    <div className="px-3 sm:px-5 py-3.5 min-w-0 overflow-hidden">
                      <p
                        className="text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed text-xs break-words overflow-hidden"
                        title={o.description}
                      >
                        {o.description}
                      </p>
                    </div>
                    <div className="px-3 sm:px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEditModal(o)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors mr-1 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 stroke-[1.75]" />
                      </button>
                      <DeleteButton
                        onClick={() => handleDelete(o.id)}
                        pending={deletingId === o.id}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="occasions-list-droppable">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="divide-y divide-zinc-100 dark:divide-zinc-800/80"
                    >
                      {filteredOccasions.map((o, index) => {
                        const id = o.id.toString();
                        return (
                          <Draggable
                            key={id}
                            draggableId={id}
                            index={index}
                            isDragDisabled={isFilterActive}
                          >
                            {(providedDrag, snapshot) => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                style={providedDrag.draggableProps.style}
                                className={`grid grid-cols-[144px_144px_200px_minmax(0,1fr)_100px] items-center text-xs text-zinc-900 dark:text-zinc-100 transition-colors ${
                                  snapshot.isDragging
                                    ? "bg-white dark:bg-[#13161c] shadow-2xl ring-2 ring-teal-500 rounded-xl z-50"
                                    : "hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80"
                                }`}
                              >
                                <div className="px-3 sm:px-5 py-3.5 whitespace-nowrap">
                                  <div className="flex items-center gap-4">
                                    <button
                                      type="button"
                                      {...providedDrag.dragHandleProps}
                                      disabled={isFilterActive}
                                      className={`p-1 rounded transition-colors ${
                                        isFilterActive
                                          ? "opacity-30 cursor-not-allowed text-zinc-400"
                                          : "hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-grab active:cursor-grabbing"
                                      }`}
                                      title={
                                        isFilterActive
                                          ? "Clear search to reorder"
                                          : "Drag to reorder occasion position"
                                      }
                                    >
                                      <GripVertical className="w-3.5 h-3.5 stroke-[1.75]" />
                                    </button>

                                    <div className="flex flex-col -space-y-0.5">
                                      <button
                                        type="button"
                                        disabled={index === 0 || isFilterActive}
                                        onClick={() => handleMove(index, -1)}
                                        className="p-0.5 rounded hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] disabled:opacity-20 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                                        title="Move Up"
                                      >
                                        <ArrowUp className="w-2.5 h-2.5 stroke-[2]" />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={
                                          index === filteredOccasions.length - 1 || isFilterActive
                                        }
                                        onClick={() => handleMove(index, 1)}
                                        className="p-0.5 rounded hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] disabled:opacity-20 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                                        title="Move Down"
                                      >
                                        <ArrowDown className="w-2.5 h-2.5 stroke-[2]" />
                                      </button>
                                    </div>

                                    <span className="font-mono text-xs tabular-nums font-semibold text-zinc-500 dark:text-zinc-400 w-5 text-center select-none">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>

                                <div className="px-3 sm:px-5 py-3.5">
                                  <div className="relative w-28 h-16 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg overflow-hidden flex items-center justify-center">
                                    {o.image ? (
                                      <SafeImage
                                        src={o.image}
                                        alt={o.title}
                                        fill
                                        sizes="112px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <Compass className="w-5 h-5 text-zinc-400" />
                                    )}
                                  </div>
                                </div>

                                <div className="px-3 sm:px-5 py-3.5 font-bold text-zinc-950 dark:text-white truncate">
                                  <span title={o.title}>{o.title}</span>
                                </div>

                                <div className="px-3 sm:px-5 py-3.5 min-w-0 overflow-hidden">
                                  <p
                                    className="text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed text-xs break-words overflow-hidden"
                                    title={o.description}
                                  >
                                    {o.description}
                                  </p>
                                </div>

                                <div className="px-3 sm:px-5 py-3.5 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(o)}
                                    className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors mr-1 cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 stroke-[1.75]" />
                                  </button>
                                  <DeleteButton
                                    onClick={() => handleDelete(o.id)}
                                    pending={deletingId === o.id}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#13161c] rounded-2xl p-4 sm:p-6 shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-5 pb-3">
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                  {editingOccasion ? "Edit Service Occasion" : "Add Service Occasion"}
                </h2>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
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
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
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
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
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

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Banner Image (16:9 Aspect Ratio)
                </label>

                {imagePreviewUrl && (
                  <div className="mb-3 p-2.5 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] flex items-center gap-3">
                    <div className="w-24 h-14 bg-white dark:bg-[#13161c] rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element -- blob preview urls can't use next/image */}
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
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

                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs cursor-pointer border-0"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={!image || uploadingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shrink-0 cursor-pointer transition-all"
                  >
                    {uploadingImage && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                  </button>
                </div>
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
                  disabled={saving || !occasionDirty}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-70 text-white font-semibold rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Occasion"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
