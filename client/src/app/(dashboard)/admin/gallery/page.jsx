"use client";

import React, { useState, useEffect, useMemo } from "react";
import SafeImage from "@/components/ui/SafeImage";
import {
  Plus,
  X,
  Images,
  Edit2,
  Upload,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  Search,
  LayoutList,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import DeleteButton from "@/components/common/DeleteButton";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "@/lib/api";

export default function GalleryAdminPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({ file: null, altTag: "" });
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState("");
  const [editAltTag, setEditAltTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const [editPhotoChanged, setEditPhotoChanged] = useState(false);
  const [savedEdit, setSavedEdit] = useState(null);
  const editDirty = !!editImageFile || editPhotoChanged || !savedEdit || editAltTag !== savedEdit;
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchGallery = async () => {
    try {
      const res = await api.get("/gallery");
      if (res.data?.success) setImages(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount gate keeps drag-drop client-only
    setIsMounted(true);
    fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // single toast helper for this page (sonner renders it globally)
  const showToast = (msg) => toast.success(msg);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const alt = (img.altTag || img.alt_tag || "").toLowerCase();
      return alt.includes(searchQuery.toLowerCase());
    });
  }, [images, searchQuery]);

  const isFilterActive = searchQuery.trim().length > 0;

  const openModal = () => {
    setFormData({ file: null, altTag: "" });
    setUploadPreviewUrl("");
    setModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setUploadPreviewUrl("");
    setError(null);
  };

  const openEditModal = (img) => {
    setEditingImage(img);
    setEditPhotoChanged(false);
    setEditAltTag(img.altTag || img.alt_tag || "");
    setSavedEdit(img.altTag || img.alt_tag || "");
    setEditImageFile(null);
    setEditPreviewUrl("");
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingImage(null);
    setEditAltTag("");
    setEditImageFile(null);
    setEditPreviewUrl("");
    setEditModalOpen(false);
  };

  const handleEditImageUpload = async () => {
    if (!editImageFile) return;
    if (editImageFile.size > 10 * 1024 * 1024) {
      toast.error(`Image is ${(editImageFile.size / 1048576).toFixed(1)}MB — maximum is 10MB.`);
      return;
    }
    setUploadingEditImage(true);
    try {
      const payload = new FormData();
      payload.append("image", editImageFile);
      const res = await api.post("/upload?folder=gallery&preset=standard", payload);
      const url = res.data?.data?.url;
      if (res.status === 200 && url) {
        setEditPreviewUrl(url);
        setEditImageFile(null);
        showToast("Photo uploaded. Save changes to publish it.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingEditImage(false);
    }
  };

  const handleEditFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setEditPreviewUrl(URL.createObjectURL(file));
      setEditPhotoChanged(true);
    }
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
      setError("Please select an image file to upload.");
      return;
    }
    if (formData.file.size > 10 * 1024 * 1024) {
      const mb = (formData.file.size / 1048576).toFixed(1);
      setError(`Image is ${mb}MB — maximum is 10MB.`);
      toast.error(`Image is ${mb}MB — maximum is 10MB.`);
      return;
    }
    setUploading(true);
    setError(null);

    const form = new FormData();
    form.append("images", formData.file);
    form.append("altTag", formData.altTag);

    try {
      const res = await api.post("/gallery", form);
      if (res.status === 201 || res.status === 200) {
        closeModal();
        fetchGallery();
        showToast("Image uploaded to gallery.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image.");
      toast.error(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateImage = async (e) => {
    e.preventDefault();
    if (!editingImage) return;

    setIsSubmitting(true);
    const form = new FormData();
    form.append("altTag", editAltTag);
    if (editImageFile) {
      form.append("image", editImageFile);
    } else if (editPreviewUrl && !editPreviewUrl.startsWith("blob:")) {
      form.append("imageUrl", editPreviewUrl);
    }

    try {
      const res = await api.put(`/gallery/${editingImage.id}`, form);
      if (res.status === 200) {
        closeEditModal();
        fetchGallery();
        showToast(
          editImageFile ? "Gallery photo and alt tag updated." : "Alt tag description updated."
        );
      }
    } catch (err) {
      console.error("Failed to update gallery photo:", err);
      toast.error(err.response?.data?.message || "Failed to update gallery image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    if (isFilterActive) {
      showToast("Clear search filter before reordering.");
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
      await api.patch("/gallery/reorder", { order: orderPayload });
      showToast("Gallery order updated.");
    } catch (err) {
      console.error("Failed to reorder gallery", err);
      toast.error("Failed to update gallery order.");
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
      await api.patch("/gallery/reorder", { order: orderPayload });
      showToast("Gallery order updated.");
    } catch (err) {
      console.error("Failed to reorder gallery", err);
      toast.error("Failed to update gallery order.");
      fetchGallery();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this gallery photo?")) return;
    setDeletingId(id);
    try {
      const res = await api.delete(`/gallery/${id}`);
      if (res.status === 200) {
        fetchGallery();
        showToast("Image deleted.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full max-w-8xl min-h-full space-y-4 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
            Fleet Gallery Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Reorder photos with drag and drop to customize the public homepage showroom
            presentation.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
          <div className="flex items-center bg-[#f6f8fa] dark:bg-[#1a1e27] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
              title="Table Reorder View"
            >
              <LayoutList className="w-3.5 h-3.5 stroke-[2]" />
              <span>Drag Reorder</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
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
            {isFilterActive
              ? "No photos match your search query."
              : "No images in gallery yet. Click Upload Image to add one."}
          </p>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white dark:bg-[#13161c] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[650px]">
              <div className="grid grid-cols-[144px_144px_minmax(0,1fr)_100px] items-center bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider text-[11px] border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="px-3 sm:px-5 py-3.5 whitespace-nowrap">Drag / Order</div>
                <div className="px-3 sm:px-5 py-3.5">Thumbnail</div>
                <div className="px-3 sm:px-5 py-3.5">SEO Alt Tag Description</div>
                <div className="px-3 sm:px-5 py-3.5 text-right">Actions</div>
              </div>

              {!isMounted ? (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {filteredImages.map((img, index) => {
                    const src = img.imagePath || img.image_url;
                    const alt = img.altTag || img.alt_tag || "Fleet Showcase Photo";

                    return (
                      <div
                        key={img.id}
                        className="grid grid-cols-[144px_144px_minmax(0,1fr)_100px] items-center text-xs text-zinc-900 dark:text-zinc-100 hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80 transition-colors"
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
                          <div className="relative w-24 h-16 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg overflow-hidden flex items-center justify-center">
                            {src ? (
                              <SafeImage
                                src={src}
                                alt={alt}
                                fill
                                sizes="112px"
                                className="object-contain"
                              />
                            ) : (
                              <Images className="w-5 h-5 text-zinc-400" />
                            )}
                          </div>
                        </div>
                        <div className="px-3 sm:px-5 py-3.5 font-medium text-zinc-950 dark:text-white min-w-0 pr-4">
                          <span className="truncate block" title={alt}>
                            {alt}
                          </span>
                        </div>
                        <div className="px-3 sm:px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openEditModal(img)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md mr-1 cursor-pointer transition-colors"
                            title="Edit Alt Tag"
                          >
                            <Edit2 className="w-4 h-4 stroke-[1.75]" />
                          </button>
                          <DeleteButton
                            onClick={() => handleDelete(img.id)}
                            pending={deletingId === img.id}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="gallery-list-droppable">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="divide-y divide-zinc-100 dark:divide-zinc-800/80"
                      >
                        {filteredImages.map((img, index) => {
                          const id = img.id.toString();
                          const src =
                            img.imagePath ||
                            img.image_path ||
                            img.image_url ||
                            img.image ||
                            img.url;
                          const alt = img.altTag || img.alt_tag || "Fleet Showcase Photo";

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
                                  className={`grid grid-cols-[144px_144px_minmax(0,1fr)_100px] items-center text-xs text-zinc-900 dark:text-zinc-100 transition-colors ${
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
                                            : "Drag to reorder showroom position"
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
                                            index === filteredImages.length - 1 || isFilterActive
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
                                    <div className="relative w-24 h-16 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg overflow-hidden flex items-center justify-center">
                                      {src ? (
                                        <SafeImage
                                          src={src}
                                          alt={alt}
                                          fill
                                          sizes="112px"
                                          className="object-contain"
                                        />
                                      ) : (
                                        <Images className="w-5 h-5 text-zinc-400" />
                                      )}
                                    </div>
                                  </div>

                                  <div className="px-3 sm:px-5 py-3.5 font-medium text-zinc-950 dark:text-white min-w-0 pr-4">
                                    <span className="truncate block" title={alt}>
                                      {alt}
                                    </span>
                                  </div>

                                  <div className="px-3 sm:px-5 py-3.5 text-right whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={() => openEditModal(img)}
                                      className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors mr-1 cursor-pointer"
                                      title="Edit Alt Tag"
                                    >
                                      <Edit2 className="w-4 h-4 stroke-[1.75]" />
                                    </button>
                                    <DeleteButton
                                      onClick={() => handleDelete(img.id)}
                                      pending={deletingId === img.id}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, index) => {
            const src = img.imagePath || img.image_path || img.image_url || img.image || img.url;
            const alt = img.altTag || img.alt_tag || "Fleet Showcase Photo";

            return (
              <div
                key={img.id}
                className="group bg-white dark:bg-[#13161c] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full bg-[#f6f8fa] dark:bg-[#1a1e27] overflow-hidden">
                  {src ? (
                    <SafeImage
                      src={src}
                      alt={alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 320px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                      <Images className="w-8 h-8 mb-1 opacity-50" />
                      <span className="text-[11px] font-mono">No Image</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-semibold tracking-wider select-none shadow-sm">
                    {index + 1}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                      Alt Tag SEO
                    </span>
                    <p
                      className="text-xs font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-relaxed"
                      title={alt}
                    >
                      {alt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100/80 dark:border-zinc-800/60">
                    <div className="inline-flex items-center gap-1 bg-[#f6f8fa] dark:bg-[#1a1e27] p-1 rounded-lg">
                      <button
                        type="button"
                        disabled={index === 0 || isFilterActive}
                        onClick={() => handleMove(index, -1)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                        title="Move Earlier"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 stroke-[2]" />
                      </button>
                      <span className="font-mono text-xs tabular-nums font-semibold text-zinc-500 dark:text-zinc-400 px-1.5 select-none">
                        {index + 1}
                      </span>
                      <button
                        type="button"
                        disabled={index === filteredImages.length - 1 || isFilterActive}
                        onClick={() => handleMove(index, 1)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                        title="Move Later"
                      >
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(img)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] rounded-md transition-colors cursor-pointer"
                        title="Edit Alt Tag"
                      >
                        <Edit2 className="w-4 h-4 stroke-[1.75]" />
                      </button>
                      <DeleteButton
                        onClick={() => handleDelete(img.id)}
                        title="Delete Photo"
                        pending={deletingId === img.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#13161c] rounded-xl p-4 sm:p-6 shadow-xl w-full max-w-md">
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
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
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
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Image File
                </label>

                {uploadPreviewUrl && (
                  <div className="mb-3 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center gap-3">
                    <div className="w-20 h-14 bg-white dark:bg-black rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-zinc-200/80 dark:border-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element -- blob preview urls can't use next/image */}
                      <img
                        src={uploadPreviewUrl}
                        alt="Preview"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-teal-600 dark:text-teal-400 font-bold block">
                        File Selected
                      </span>
                      <p className="text-[11px] text-zinc-500 truncate">{formData.file?.name}</p>
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
                  disabled={uploading || !formData.file}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-70 text-white font-bold rounded-lg text-xs uppercase tracking-wider active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#13161c] rounded-xl p-4 sm:p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
                  Edit Gallery Photo
                </h2>
                <span className="text-[11px] font-mono text-zinc-500">
                  Replace image file and update Google SEO alt tag
                </span>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>

            <form onSubmit={handleUpdateImage} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                    Photo Preview
                  </label>
                  {editPreviewUrl && (
                    <span className="text-[10px] font-mono font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md">
                      New Photo Selected
                    </span>
                  )}
                </div>

                <div className="relative aspect-[16/10] w-full bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-xl overflow-hidden flex items-center justify-center border border-zinc-200/60 dark:border-zinc-800">
                  {editPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- blob preview urls can't use next/image
                    <img
                      src={editPreviewUrl}
                      alt="New selection preview"
                      className="object-cover w-full h-full"
                    />
                  ) : editingImage.imagePath ||
                    editingImage.image_path ||
                    editingImage.image_url ||
                    editingImage.image ||
                    editingImage.url ? (
                    <SafeImage
                      src={
                        editingImage.imagePath ||
                        editingImage.image_path ||
                        editingImage.image_url ||
                        editingImage.image ||
                        editingImage.url
                      }
                      alt={editAltTag || "Fleet Showcase Photo"}
                      fill
                      sizes="(max-width: 768px) 90vw, 480px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-400 py-8">
                      <Images className="w-8 h-8 mb-1 opacity-50" />
                      <span className="text-[11px] font-mono">No Image Preview</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-semibold select-none shadow-sm">
                    Position {images.findIndex((i) => i.id === editingImage.id) + 1 || 1}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-2.5">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 stroke-[1.75] text-zinc-500 dark:text-zinc-400" />
                    <span>{editPreviewUrl ? "Choose Different Photo" : "Replace Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileSelect}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleEditImageUpload}
                    disabled={!editImageFile || uploadingEditImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shrink-0 cursor-pointer transition-all"
                  >
                    {uploadingEditImage && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{uploadingEditImage ? "Uploading..." : "Upload"}</span>
                  </button>

                  {editPreviewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditImageFile(null);
                        setEditPreviewUrl("");
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 stroke-[1.75]" />
                      <span>Revert Original</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Alt Tag Description
                </label>
                <textarea
                  rows={3}
                  value={editAltTag}
                  onChange={(e) => setEditAltTag(e.target.value)}
                  required
                  placeholder="Describe this fleet photo for search engine ranking..."
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white border-0 rounded-lg p-3 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium resize-none leading-relaxed"
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
                  disabled={isSubmitting || !editDirty}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider active:scale-[0.98] shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
