"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Save, LayoutTemplate, Building2, PhoneCall, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const VALID_CONTENT_TABS = ["hero", "about", "contact"];

function ContentManagementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab");
  const initialTab = VALID_CONTENT_TABS.includes(tabParam) ? tabParam : "hero";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentTabInUrl = searchParams.get("tab");
    if (!currentTabInUrl || !VALID_CONTENT_TABS.includes(currentTabInUrl)) {
      router.replace(`${pathname}?tab=hero`, { scroll: false });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- keeps tab in sync with url
      setActiveTab("hero");
    } else if (currentTabInUrl !== activeTab) {
      setActiveTab(currentTabInUrl);
    }
  }, [searchParams, pathname, router]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.replace(`${pathname}?tab=${tabId}`, { scroll: false });
  };

  const [heroForm, setHeroForm] = useState({
    heading: "",
    subHeading: "",
    ctaText: "",
    ctaUrl: "",
    secondaryCtaText: "",
    secondaryCtaUrl: "",
    badgeText: "",
    bannerImage: "",
  });
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState("");
  const [savedHero, setSavedHero] = useState(null);

  const [aboutForm, setAboutForm] = useState({
    sectionTitle: "",
    description: "",
    featuredImage: "",
  });
  const [aboutFile, setAboutFile] = useState(null);
  const [aboutPreview, setAboutPreview] = useState("");
  const [savedAbout, setSavedAbout] = useState(null);

  const [contactForm, setContactForm] = useState({
    phone: "",
    email: "",
    address: "",
    mapEmbed: "",
  });
  const [savedContact, setSavedContact] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, aboutRes, contactRes] = await Promise.all([
          api.get("/hero").catch(() => ({ data: {} })),
          api.get("/about").catch(() => ({ data: {} })),
          api.get("/contact").catch(() => ({ data: {} })),
        ]);

        if (heroRes.data?.data) {
          const h = heroRes.data.data;
          setHeroForm({
            heading: h.heading || "",
            subHeading: h.subHeading || "",
            ctaText: h.ctaText || "",
            ctaUrl: h.ctaUrl || "",
            secondaryCtaText: h.secondaryCtaText || "",
            secondaryCtaUrl: h.secondaryCtaUrl || "",
            badgeText: h.badgeText || "",
            bannerImage: h.bannerImage || "",
          });
          setHeroPreview(h.bannerImage || "");
          setSavedHero({
            heading: h.heading || "",
            subHeading: h.subHeading || "",
            ctaText: h.ctaText || "",
            ctaUrl: h.ctaUrl || "",
            secondaryCtaText: h.secondaryCtaText || "",
            secondaryCtaUrl: h.secondaryCtaUrl || "",
            badgeText: h.badgeText || "",
            bannerImage: h.bannerImage || "",
          });
        }

        if (aboutRes.data?.data) {
          const a = aboutRes.data.data;
          setAboutForm({
            sectionTitle: a.sectionTitle || "",
            description: a.description || "",
            featuredImage: a.featuredImage || "",
          });
          setAboutPreview(a.featuredImage || "");
          setSavedAbout({
            sectionTitle: a.sectionTitle || "",
            description: a.description || "",
            featuredImage: a.featuredImage || "",
          });
        }

        if (contactRes.data?.data) {
          const c = contactRes.data.data;
          setContactForm({
            phone: c.phone || "",
            email: c.email || "",
            address: c.address || "",
            mapEmbed: c.mapEmbed || "",
          });
          setSavedContact({
            phone: c.phone || "",
            email: c.email || "",
            address: c.address || "",
            mapEmbed: c.mapEmbed || "",
          });
        }
      } catch (err) {
        console.error("Failed to load content settings:", err);
      }
    };

    fetchData();
  }, []);

  // single toast helper for this page (sonner renders it globally)
  const showToast = (type, text) => (type === "success" ? toast.success(text) : toast.error(text));
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);

  const uploadSingleImage = async (file, folder, preset) => {
    const payload = new FormData();
    payload.append("image", file);
    const res = await api.post(`/upload?folder=${folder}&preset=${preset}`, payload);
    if (res.status === 200 && res.data?.data?.url) return res.data.data.url;
    throw new Error("Image upload failed.");
  };

  const handleHeroFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroFile(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const tooBig = (file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      showToast("error", `Image is ${(file.size / 1048576).toFixed(1)}MB — maximum is 10MB.`);
      return true;
    }
    return false;
  };

  const handleHeroUpload = async () => {
    if (!heroFile) return;
    if (tooBig(heroFile)) return;
    setUploadingHero(true);
    try {
      const url = await uploadSingleImage(heroFile, "hero", "standard");
      setHeroForm((prev) => ({ ...prev, bannerImage: url }));
      setHeroPreview(url);
      setHeroFile(null);
      showToast("success", "Banner uploaded. Save the section to publish it.");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingHero(false);
    }
  };

  const handleAboutUpload = async () => {
    if (!aboutFile) return;
    if (tooBig(aboutFile)) return;
    setUploadingAbout(true);
    try {
      const url = await uploadSingleImage(aboutFile, "about", "standard");
      setAboutForm((prev) => ({ ...prev, featuredImage: url }));
      setAboutPreview(url);
      setAboutFile(null);
      showToast("success", "Photo uploaded. Save the section to publish it.");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingAbout(false);
    }
  };

  const handleAboutFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAboutFile(file);
      setAboutPreview(URL.createObjectURL(file));
    }
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("heading", heroForm.heading);
      formData.append("subHeading", heroForm.subHeading);
      formData.append("ctaText", heroForm.ctaText);
      formData.append("ctaUrl", heroForm.ctaUrl);
      formData.append("secondaryCtaText", heroForm.secondaryCtaText);
      formData.append("secondaryCtaUrl", heroForm.secondaryCtaUrl);
      formData.append("badgeText", heroForm.badgeText);
      if (heroFile) {
        formData.append("bannerImage", heroFile);
      } else if (heroForm.bannerImage) {
        formData.append("bannerImage", heroForm.bannerImage);
      }

      const res = await api.put("/hero", formData);
      if (res.status === 200) {
        setSavedHero({
          ...heroForm,
          bannerImage: heroFile
            ? res.data?.data?.bannerImage || heroForm.bannerImage
            : heroForm.bannerImage,
        });
        setHeroFile(null);
        showToast("success", "Hero section updated successfully.");
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to update hero section.");
    } finally {
      setLoading(false);
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("sectionTitle", aboutForm.sectionTitle);
      formData.append("description", aboutForm.description);
      if (aboutFile) {
        formData.append("featuredImage", aboutFile);
      } else if (aboutForm.featuredImage) {
        formData.append("featuredImage", aboutForm.featuredImage);
      }

      const res = await api.put("/about", formData);
      if (res.status === 200) {
        setSavedAbout({
          ...aboutForm,
          featuredImage: aboutFile
            ? res.data?.data?.featuredImage || aboutForm.featuredImage
            : aboutForm.featuredImage,
        });
        setAboutFile(null);
        showToast("success", "About section updated successfully.");
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to update about section.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/contact", contactForm);
      if (res.status === 200) {
        setSavedContact({ ...contactForm });
        showToast("success", "Contact info updated successfully.");
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to update contact info.");
    } finally {
      setLoading(false);
    }
  };

  const isDirty = (current, saved) => !saved || JSON.stringify(current) !== JSON.stringify(saved);
  const heroDirty = !!heroFile || isDirty(heroForm, savedHero);
  const aboutDirty = !!aboutFile || isDirty(aboutForm, savedAbout);
  const contactDirty = isDirty(contactForm, savedContact);

  const tabs = [
    { id: "hero", label: "Hero Section", icon: LayoutTemplate },
    { id: "about", label: "About Us Section", icon: Building2 },
    { id: "contact", label: "Contact & Corporate Hub", icon: PhoneCall },
  ];

  return (
    <div className="w-full max-w-8xl min-h-full space-y-4 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
            Homepage Content Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Modify studio hero headlines, company story, and official corporate contact information.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 pb-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide active:scale-[0.98] cursor-pointer whitespace-nowrap transition-all ${
                isActive
                  ? "bg-teal-600 text-white shadow-xs font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27]"
              }`}
            >
              <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "hero" && (
        <div className="bg-white dark:bg-[#13161c] rounded-xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Hero Section Content
              </h2>
              <span className="text-[11px] font-mono text-zinc-500">
                Above-the-fold headline, CTA button, and studio visual
              </span>
            </div>
            <Link
              href="/#hero"
              target="_blank"
              className="text-xs font-mono text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View Live Hero</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <form onSubmit={handleHeroSubmit} className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                  Main Headline
                </label>
                <span className="text-[10px] font-mono text-zinc-400">
                  {heroForm.heading.length} chars
                </span>
              </div>
              <input
                type="text"
                required
                value={heroForm.heading}
                onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                placeholder="e.g. Commercial fleet and chauffeur rentals in India"
                className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                  Sub Heading
                </label>
                <span className="text-[10px] font-mono text-zinc-400">
                  {heroForm.subHeading.length} chars
                </span>
              </div>
              <input
                type="text"
                value={heroForm.subHeading}
                onChange={(e) => setHeroForm({ ...heroForm, subHeading: e.target.value })}
                placeholder="Pan-India Force Urbania and luxury van rentals..."
                className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={heroForm.ctaText}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                  placeholder="e.g. Reserve a vehicle"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  CTA Target Link
                </label>
                <input
                  type="text"
                  value={heroForm.ctaUrl}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaUrl: e.target.value })}
                  placeholder="#contact"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaText}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                  placeholder="e.g. View fleet"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Secondary Target Link
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaUrl}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaUrl: e.target.value })}
                  placeholder="#vehicles"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                Pill Badge Text
              </label>
              <input
                type="text"
                value={heroForm.badgeText}
                onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                placeholder="e.g. Urban Cruise Fleet"
                className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
              />
            </div>

            <div>
              <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                Banner Studio Photograph
              </label>

              {heroPreview && (
                <div className="mb-3 p-2.5 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] flex items-center gap-3">
                  <div className="w-24 h-14 bg-white dark:bg-black rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob preview urls can't use next/image */}
                    <img
                      src={heroPreview}
                      alt="Hero Banner Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-teal-600 dark:text-teal-400 font-bold block">
                      Live Studio Visual
                    </span>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {heroFile ? heroFile.name : heroForm.bannerImage}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="file"
                  onChange={handleHeroFile}
                  className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 cursor-pointer"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={handleHeroUpload}
                  disabled={!heroFile || uploadingHero}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shrink-0 cursor-pointer transition-all"
                >
                  {uploadingHero && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{uploadingHero ? "Uploading..." : "Upload"}</span>
                </button>
              </div>
              <input
                type="url"
                value={heroForm.bannerImage}
                onChange={(e) => {
                  setHeroForm({ ...heroForm, bannerImage: e.target.value });
                  if (!heroFile) setHeroPreview(e.target.value);
                }}
                placeholder="Or paste Cloudinary / WebP Studio URL"
                className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-end">
              <button
                type="submit"
                disabled={loading || !heroDirty}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 stroke-[2]" />
                )}
                <span>{loading ? "Saving..." : "Save Hero Section"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "about" && (
        <div className="bg-white dark:bg-[#13161c] rounded-xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                About Us Section Content
              </h2>
              <span className="text-[11px] font-mono text-zinc-500">
                Company narrative, fleet standards, and featured photograph
              </span>
            </div>
            <Link
              href="/#about"
              target="_blank"
              className="text-xs font-mono text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View Live About</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <form onSubmit={handleAboutSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                required
                value={aboutForm.sectionTitle}
                onChange={(e) => setAboutForm({ ...aboutForm, sectionTitle: e.target.value })}
                placeholder="About Urban Cruise"
                className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
              />
            </div>

            <div>
              <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                Description
              </label>
              <textarea
                rows={5}
                required
                value={aboutForm.description}
                onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                placeholder="Urban Cruise is India's premier luxury vehicle rental and ground mobility provider..."
                className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium leading-relaxed border-0"
              />
            </div>

            <div>
              <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                Featured Image
              </label>

              {aboutPreview && (
                <div className="mb-3 p-2.5 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] flex items-center gap-3">
                  <div className="w-24 h-14 bg-white dark:bg-black rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob preview urls can't use next/image */}
                    <img
                      src={aboutPreview}
                      alt="About Featured Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-teal-600 dark:text-teal-400 font-bold block">
                      Featured Photo Active
                    </span>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {aboutFile ? aboutFile.name : aboutForm.featuredImage}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="file"
                  onChange={handleAboutFile}
                  className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 cursor-pointer"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={handleAboutUpload}
                  disabled={!aboutFile || uploadingAbout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shrink-0 cursor-pointer transition-all"
                >
                  {uploadingAbout && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{uploadingAbout ? "Uploading..." : "Upload"}</span>
                </button>
              </div>
              <input
                type="url"
                value={aboutForm.featuredImage}
                onChange={(e) => {
                  setAboutForm({ ...aboutForm, featuredImage: e.target.value });
                  if (!aboutFile) setAboutPreview(e.target.value);
                }}
                placeholder="Or paste Unsplash / Cloudinary image URL"
                className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-end">
              <button
                type="submit"
                disabled={loading || !aboutDirty}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 stroke-[2]" />
                )}
                <span>{loading ? "Saving..." : "Save About Section"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="bg-white dark:bg-[#13161c] rounded-xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Contact & Operations Hub
              </h2>
              <span className="text-[11px] font-mono text-zinc-500">
                Official booking hotline, customer service email, and map location
              </span>
            </div>
            <Link
              href="/#contact"
              target="_blank"
              className="text-xs font-mono text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View Live Contact</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Direct Phone / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Operations Email
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="bookings@urbancruise.in"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                Corporate Address
              </label>
              <textarea
                rows={2}
                required
                value={contactForm.address}
                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                placeholder="Plot No. 42, Sector 18, Gurugram, Haryana 122008, India"
                className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
              />
            </div>

            <div>
              <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                Google Map Embed URL / Iframe
              </label>
              <textarea
                rows={3}
                value={contactForm.mapEmbed}
                onChange={(e) => setContactForm({ ...contactForm, mapEmbed: e.target.value })}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-end">
              <button
                type="submit"
                disabled={loading || !contactDirty}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 stroke-[2]" />
                )}
                <span>{loading ? "Saving..." : "Save Contact Info"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function ContentManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64 font-mono text-xs text-zinc-500">
          Loading content...
        </div>
      }
    >
      <ContentManagementContent />
    </Suspense>
  );
}
