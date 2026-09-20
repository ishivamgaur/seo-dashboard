"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Star,
  Plus,
  Edit2,
  X,
  Search,
  CheckCircle2,
  LayoutList,
  LayoutGrid,
  MessageSquare,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import DeleteButton from "@/components/common/DeleteButton";
import api from "@/lib/api";
import FilterSelect from "@/components/common/FilterSelect";

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const [formData, setFormData] = useState({
    id: null,
    customerName: "",
    review: "",
    rating: 5,
    customerImage: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [savedReview, setSavedReview] = useState(null);
  const reviewSnapshot = () =>
    JSON.stringify({
      customerName: formData.customerName,
      review: formData.review,
      rating: formData.rating,
      customerImage: formData.customerImage,
    });
  const reviewDirty = !!imageFile || !savedReview || reviewSnapshot() !== savedReview;

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/testimonials");
      if (res.data?.success) setTestimonials(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial list load on mount
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // single toast helper for this page (sonner renders it globally)
  const showToast = (msg) => toast.success(msg);

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchesSearch =
        t.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.review?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (ratingFilter !== "all") {
        return Number(t.rating) === Number(ratingFilter);
      }
      return true;
    });
  }, [testimonials, searchQuery, ratingFilter]);

  const isFilterActive = searchQuery !== "" || ratingFilter !== "all";

  const openModal = (t = null) => {
    setFormData(
      t
        ? {
            id: t.id,
            customerName: t.customerName || "",
            review: t.review || "",
            rating: t.rating || 5,
            customerImage: t.customerImage || "",
          }
        : {
            id: null,
            customerName: "",
            review: "",
            rating: 5,
            customerImage: "",
          }
    );
    setImageFile(null);
    setImagePreviewUrl(t?.customerImage || "");
    setSavedReview(
      JSON.stringify(
        t
          ? {
              customerName: t.customerName || "",
              review: t.review || "",
              rating: t.rating || 5,
              customerImage: t.customerImage || "",
            }
          : { customerName: "", review: "", rating: 5, customerImage: "" }
      )
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setImageFile(null);
    setImagePreviewUrl("");
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const form = new FormData();
    form.append("customerName", formData.customerName);
    form.append("review", formData.review);
    form.append("rating", formData.rating);
    if (imageFile) {
      form.append("customerImage", imageFile);
    } else if (formData.customerImage) {
      form.append("customerImage", formData.customerImage);
    }

    const url = formData.id ? `/testimonials/${formData.id}` : "/testimonials";
    const method = formData.id ? "put" : "post";

    try {
      const res = await api[method](url, form);
      if (res.status === 200 || res.status === 201) {
        closeModal();
        fetchTestimonials();
        showToast(formData.id ? "Review updated." : "Review created.");
      }
    } catch (err) {
      console.error("Failed to save testimonial:", err);
      toast.error(err.response?.data?.message || "Failed to save review.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setDeletingId(id);
    try {
      const res = await api.delete(`/testimonials/${id}`);
      if (res.status === 200) {
        fetchTestimonials();
        showToast("Review deleted.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full max-w-8xl min-h-full space-y-4 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
            Client Testimonials
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage verified client reviews and star ratings displayed across the public booking
            showroom.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#13161c] rounded-xl p-3 relative z-20 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
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

        <div className="flex items-center gap-2 overflow-visible">
          <FilterSelect
            label="Rating"
            value={ratingFilter}
            onChange={setRatingFilter}
            options={[
              { value: "all", label: "All Ratings" },
              { value: "5", label: "5 Stars" },
              { value: "4", label: "4 Stars" },
              { value: "3", label: "3 Stars" },
            ]}
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          <div className="flex items-center bg-[#f6f8fa] dark:bg-[#1a1e27] p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
              title="Table View"
            >
              <LayoutList className="w-3.5 h-3.5 stroke-[2]" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5 stroke-[2]" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {loading && testimonials.length === 0 ? (
        <div className="text-xs font-mono text-zinc-500 py-12 text-center">
          Loading client testimonials...
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-white dark:bg-[#13161c] rounded-xl p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
          <MessageSquare className="w-10 h-10 text-zinc-400 mx-auto mb-2 opacity-60" />
          <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-xs">
            {isFilterActive
              ? "No testimonials match your filter criteria."
              : "No reviews published yet."}
          </p>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Click Add Testimonial to publish verified client reviews.
          </p>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white dark:bg-[#13161c] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="px-3 sm:px-5 py-3.5 w-60 whitespace-nowrap">Client</th>
                  <th className="px-3 sm:px-5 py-3.5 w-44 whitespace-nowrap">Rating</th>
                  <th className="px-3 sm:px-5 py-3.5">Review Feedback</th>
                  <th className="px-3 sm:px-5 py-3.5 w-28 whitespace-nowrap">Status</th>
                  <th className="px-3 sm:px-5 py-3.5 w-24 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filteredTestimonials.map((t) => {
                  const avatarSrc = t.customerImage || t.customer_image;
                  const initial = (t.customerName || "C").charAt(0).toUpperCase();
                  const ratingVal = Number(t.rating) || 5;

                  return (
                    <tr
                      key={t.id}
                      className="text-zinc-900 dark:text-zinc-100 hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80 transition-colors"
                    >
                      <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full bg-[#f6f8fa] dark:bg-[#1a1e27] overflow-hidden flex items-center justify-center shrink-0 ring-1 ring-zinc-200/80 dark:ring-zinc-800">
                            {avatarSrc ? (
                              <Image
                                src={avatarSrc}
                                alt={t.customerName}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 select-none">
                                {initial}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-zinc-950 dark:text-white text-xs truncate">
                              {t.customerName}
                            </span>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400 stroke-[2]" />
                              <span>Verified Client</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= ratingVal
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-zinc-200 dark:text-zinc-800 fill-zinc-200 dark:fill-zinc-800"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-[11px] tabular-nums font-semibold text-zinc-500 dark:text-zinc-400">
                            {ratingVal.toFixed(1)}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 sm:px-5 py-3.5 text-zinc-600 dark:text-zinc-300 max-w-xl">
                        <p
                          className="line-clamp-2 leading-relaxed text-xs font-normal"
                          title={t.review}
                        >
                          &ldquo;{t.review}&rdquo;
                        </p>
                      </td>

                      <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                          Published
                        </span>
                      </td>

                      <td className="px-3 sm:px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openModal(t)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] rounded-md transition-colors cursor-pointer"
                            title="Edit Review"
                          >
                            <Edit2 className="w-4 h-4 stroke-[1.75]" />
                          </button>
                          <DeleteButton
                            onClick={() => handleDelete(t.id)}
                            title="Delete Review"
                            pending={deletingId === t.id}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTestimonials.map((t) => {
            const avatarSrc = t.customerImage || t.customer_image;
            const initial = (t.customerName || "C").charAt(0).toUpperCase();
            const ratingVal = Number(t.rating) || 5;

            return (
              <div
                key={t.id}
                className="bg-white dark:bg-[#13161c] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= ratingVal
                                ? "text-amber-400 fill-amber-400"
                                : "text-zinc-200 dark:text-zinc-800 fill-zinc-200 dark:fill-zinc-800"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[11px] tabular-nums font-semibold text-zinc-500 dark:text-zinc-400">
                        {ratingVal.toFixed(1)}
                      </span>
                    </div>

                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                      Published
                    </span>
                  </div>

                  <p className="text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed text-xs mb-5 line-clamp-4">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>

                <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8 h-8 rounded-full bg-[#f6f8fa] dark:bg-[#1a1e27] overflow-hidden flex items-center justify-center shrink-0 ring-1 ring-zinc-200/80 dark:ring-zinc-800">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={t.customerName}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="font-mono text-[11px] font-bold text-zinc-700 dark:text-zinc-300 select-none">
                          {initial}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-zinc-950 dark:text-white text-xs truncate block">
                        {t.customerName}
                      </span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-teal-600 dark:text-teal-400 stroke-[2]" />
                        <span>Verified Client</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openModal(t)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] rounded-md transition-colors cursor-pointer"
                      title="Edit Review"
                    >
                      <Edit2 className="w-4 h-4 stroke-[1.75]" />
                    </button>
                    <DeleteButton
                      onClick={() => handleDelete(t.id)}
                      title="Delete Review"
                      pending={deletingId === t.id}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#13161c] rounded-xl p-4 sm:p-6 shadow-xl w-full max-w-md overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
                  {formData.id ? "Edit Client Review" : "Add Client Review"}
                </h2>
                <span className="text-[11px] font-mono text-zinc-500">
                  Featured in verified social proof section on homepage
                </span>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
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

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Rating: {formData.rating}.0 Stars
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
                            ? "text-amber-400 fill-amber-400"
                            : "text-zinc-300 dark:text-zinc-700"
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
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Client Review Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Urban Cruise coordinated 4 Force Urbania vans for our leadership offsite in Jaipur. Pristine cleanliness and punctual chauffeurs."
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg p-3 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium leading-relaxed border-0 resize-none"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Client Photo (Optional)
                </label>

                {imagePreviewUrl && (
                  <div className="mb-2.5 flex items-center gap-3 p-2 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob preview urls can't use next/image */}
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold block">
                        Photo Loaded
                      </span>
                      <span className="text-[11px] text-zinc-400 truncate block">
                        {imageFile ? imageFile.name : "Current client avatar"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-center bg-[#f6f8fa]/50 dark:bg-[#1a1e27]/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full text-xs text-zinc-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 cursor-pointer"
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
                  disabled={saving || !reviewDirty}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-70 text-white font-bold rounded-lg text-xs uppercase tracking-wider active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
