"use client";

import React, { useState, useEffect, Suspense } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Save,
  Code,
  Search,
  Share2,
  Plus,
  X,
  Copy,
  Globe,
  Check,
  Loader2,
  Edit2,
} from "lucide-react";
import DeleteButton from "@/components/common/DeleteButton";
import { toast } from "sonner";
import api from "@/lib/api";

const VALID_TABS = ["meta", "social", "schemas"];

function SeoSettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab");
  const initialTab = VALID_TABS.includes(tabParam) ? tabParam : "meta";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ogFile, setOgFile] = useState(null);
  const [twitterFile, setTwitterFile] = useState(null);
  const [ogPreviewUrl, setOgPreviewUrl] = useState("");
  const [twitterPreviewUrl, setTwitterPreviewUrl] = useState("");
  const [uploadingSocial, setUploadingSocial] = useState(null);

  const handleSocialUpload = async (which) => {
    const file = which === "og" ? ogFile : twitterFile;
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`Image is ${(file.size / 1048576).toFixed(1)}MB — maximum is 10MB.`);
      return;
    }
    setUploadingSocial(which);
    try {
      const payload = new FormData();
      payload.append("image", file);
      const res = await api.post("/upload?folder=seo&preset=social", payload);
      const url = res.data?.data?.url;
      if (res.status === 200 && url) {
        if (which === "og") {
          setFormData((prev) => ({ ...prev, ogImage: url }));
          setOgPreviewUrl(url);
          setOgFile(null);
        } else {
          setFormData((prev) => ({ ...prev, twitterImage: url }));
          setTwitterPreviewUrl(url);
          setTwitterFile(null);
        }
        showToast("success", "Social image uploaded. Save to publish it.");
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingSocial(null);
    }
  };
  const [schemaSaving, setSchemaSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [savedMeta, setSavedMeta] = useState(null);

  useEffect(() => {
    const currentTabInUrl = searchParams.get("tab");
    if (!currentTabInUrl || !VALID_TABS.includes(currentTabInUrl)) {
      router.replace(`${pathname}?tab=meta`, { scroll: false });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- keeps tab in sync with url
      setActiveTab("meta");
    } else if (currentTabInUrl !== activeTab) {
      setActiveTab(currentTabInUrl);
    }
  }, [searchParams, pathname, router]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    router.replace(`${pathname}?tab=${tabKey}`, { scroll: false });
  };

  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    focusKeywords: "",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  });
  const metaDirty =
    !!ogFile ||
    !!twitterFile ||
    !savedMeta ||
    JSON.stringify(formData) !== JSON.stringify(savedMeta);

  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [editingSchema, setEditingSchema] = useState(null);

  const [schemaType, setSchemaType] = useState("organization");

  const [orgName, setOrgName] = useState("Urban Cruise");
  const [legalName, setLegalName] = useState("Urban Cruise India Private Limited");
  const [siteUrl, setSiteUrl] = useState("https://urbancruise.in");
  const [logoUrl, setLogoUrl] = useState(
    "https://urbancruise.in/wp-content/uploads/gurugramlogo.webp"
  );
  const [telephone, setTelephone] = useState("+91 98765 43210");
  const [streetAddress, setStreetAddress] = useState("Plot No. 42, Sector 18");
  const [addressLocality, setAddressLocality] = useState("Gurugram");
  const [addressRegion, setAddressRegion] = useState("Haryana");
  const [postalCode, setPostalCode] = useState("122008");
  const [priceRange, setPriceRange] = useState("₹₹ - ₹₹₹");

  const [faqItems, setFaqItems] = useState([
    {
      question: "What vehicles are available in your fleet?",
      answer:
        "We offer 9, 12, 16, and 20 seater tempo travellers, Force Urbania luxury vans, and Volvo luxury coaches.",
    },
    {
      question: "Do you provide outstation chauffeur services?",
      answer:
        "Yes, all our vehicles operate with verified commercial all-India tourist permits and experienced drivers.",
    },
  ]);

  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: "Home", url: "https://urbancruise.in" },
    { name: "Fleet", url: "https://urbancruise.in/#vehicles" },
  ]);

  const fetchSettings = async () => {
    try {
      const [seoRes, schemaRes] = await Promise.all([
        api.get("/seo").catch(() => ({ data: {} })),
        api.get("/schemas?all=true").catch(() => ({ data: {} })),
      ]);

      if (seoRes.data?.data) {
        setFormData((prev) => ({
          ...prev,
          ...seoRes.data.data,
        }));
        setSavedMeta({ ...seoRes.data.data });
        setOgPreviewUrl(seoRes.data.data.ogImage || "");
        setTwitterPreviewUrl(seoRes.data.data.twitterImage || "");
      }

      if (schemaRes.data?.data) {
        const schemaList = Array.isArray(schemaRes.data.data) ? schemaRes.data.data : [];
        setSchemas(schemaList);
        if (schemaList.length > 0 && !selectedSchema) {
          setSelectedSchema(schemaList[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch SEO configurations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial settings load on mount
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // single toast helper for this page (sonner renders it globally)
  const showToast = (type, text) => (type === "success" ? toast.success(text) : toast.error(text));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (value !== undefined && value !== null) payload.append(key, value);
      }
      if (ogFile) payload.append("ogImageFile", ogFile);
      if (twitterFile) payload.append("twitterImageFile", twitterFile);

      const response = await api.put("/seo", payload);
      if (response.status === 200) {
        const saved = response.data?.data || {};
        setFormData((prev) => ({ ...prev, ...saved }));
        setSavedMeta({ ...formData, ...saved });
        setOgPreviewUrl(saved.ogImage || formData.ogImage || "");
        setTwitterPreviewUrl(saved.twitterImage || formData.twitterImage || "");
        setOgFile(null);
        setTwitterFile(null);
        showToast("success", "SEO configurations saved. Live <head> tags updated.");
      } else {
        showToast("error", response.data?.message || "Failed to save settings.");
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || "Error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopySchema = () => {
    if (!selectedSchema) return;
    const text =
      typeof selectedSchema.schemaData === "string"
        ? selectedSchema.schemaData
        : JSON.stringify(selectedSchema.schemaData, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("success", "JSON-LD schema copied to clipboard.");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleSchema = async (schemaId, currentStatus) => {
    try {
      await api.patch(`/schemas/${schemaId}/toggle`);
      setSchemas((prev) =>
        prev.map((s) => (s.id === schemaId ? { ...s, isActive: !currentStatus } : s))
      );
      if (selectedSchema?.id === schemaId) {
        setSelectedSchema((prev) => ({ ...prev, isActive: !currentStatus }));
      }
      showToast("success", "Schema active state updated.");
    } catch (err) {
      showToast("error", "Failed to toggle schema state.");
    }
  };

  const handleDeleteSchema = async (schemaId) => {
    if (!confirm("Are you sure you want to delete this JSON-LD schema?")) return;
    setDeletingId(schemaId);
    try {
      await api.delete(`/schemas/${schemaId}`);
      setSchemas((prev) => prev.filter((s) => s.id !== schemaId));
      if (selectedSchema?.id === schemaId) {
        setSelectedSchema(null);
      }
      showToast("success", "Schema deleted.");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete schema.");
    } finally {
      setDeletingId(null);
    }
  };

  const generateJsonLd = () => {
    if (schemaType === "organization") {
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: orgName,
        legalName: legalName,
        url: siteUrl,
        logo: logoUrl,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: telephone,
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["en", "hi"],
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: streetAddress,
          addressLocality: addressLocality,
          addressRegion: addressRegion,
          postalCode: postalCode,
          addressCountry: "IN",
        },
      };
    }

    if (schemaType === "local_business") {
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: orgName,
        image: logoUrl,
        telephone: telephone,
        priceRange: priceRange,
        address: {
          "@type": "PostalAddress",
          streetAddress: streetAddress,
          addressLocality: addressLocality,
          addressRegion: addressRegion,
          postalCode: postalCode,
          addressCountry: "IN",
        },
        url: siteUrl,
      };
    }

    if (schemaType === "website") {
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: orgName,
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/#vehicles`,
          "query-input": "required name=search_term_string",
        },
      };
    }

    if (schemaType === "faq") {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      };
    }

    if (schemaType === "breadcrumb") {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      };
    }

    return {};
  };

  const handleSaveSchema = async (e) => {
    e.preventDefault();
    setSchemaSaving(true);
    const generatedData = generateJsonLd();

    const payload = {
      schemaType,
      schemaData: generatedData,
      isActive: editingSchema ? editingSchema.isActive : true,
    };

    try {
      if (editingSchema) {
        const res = await api.put(`/schemas/${editingSchema.id}`, payload);
        if (res.status === 200) {
          showToast("success", `${schemaType.toUpperCase()} schema updated.`);
        }
      } else {
        const res = await api.post("/schemas", payload);
        if (res.status === 201) {
          showToast("success", `${schemaType.toUpperCase()} schema created.`);
        }
      }
      setIsSchemaModalOpen(false);
      setEditingSchema(null);
      fetchSettings();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to save schema.");
    } finally {
      setSchemaSaving(false);
    }
  };

  const [savedSchemaSig, setSavedSchemaSig] = useState(null);
  const schemaSignature = (type = schemaType) =>
    JSON.stringify({
      schemaType: type,
      orgName,
      legalName,
      siteUrl,
      logoUrl,
      telephone,
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      priceRange,
      faqItems,
      breadcrumbItems,
    });
  const schemaDirty = !savedSchemaSig || schemaSignature() !== savedSchemaSig;

  const openCreateSchemaModal = () => {
    setEditingSchema(null);
    setSchemaType("organization");
    setSavedSchemaSig(schemaSignature("organization"));
    setIsSchemaModalOpen(true);
  };

  const openEditSchemaModal = (schema) => {
    const raw = schema.schemaData;
    let data = raw;
    if (typeof raw === "string") {
      try {
        data = JSON.parse(raw);
      } catch {
        data = {};
      }
    }
    data = data && typeof data === "object" ? data : {};

    setEditingSchema(schema);
    setSchemaType(schema.schemaType);
    setOrgName(data.name || "");
    setLegalName(data.legalName || "");
    setSiteUrl(data.url || "");
    setLogoUrl(data.logo || data.image || "");
    setTelephone(data.telephone || data.contactPoint?.telephone || "");
    setPriceRange(data.priceRange || "");
    const addr = data.address || {};
    setStreetAddress(addr.streetAddress || "");
    setAddressLocality(addr.addressLocality || "");
    setAddressRegion(addr.addressRegion || "");
    setPostalCode(addr.postalCode || "");
    const faqNext =
      Array.isArray(data.mainEntity) && data.mainEntity.length > 0
        ? data.mainEntity.map((q) => ({
            question: q.name || "",
            answer: q.acceptedAnswer?.text || "",
          }))
        : [{ question: "", answer: "" }];
    const crumbNext =
      Array.isArray(data.itemListElement) && data.itemListElement.length > 0
        ? data.itemListElement.map((b) => ({ name: b.name || "", url: b.item || "" }))
        : [{ name: "Home", url: "" }];
    setFaqItems(faqNext);
    setBreadcrumbItems(crumbNext);
    setSavedSchemaSig(
      JSON.stringify({
        schemaType: schema.schemaType,
        orgName: data.name || "",
        legalName: data.legalName || "",
        siteUrl: data.url || "",
        logoUrl: data.logo || data.image || "",
        telephone: data.telephone || data.contactPoint?.telephone || "",
        streetAddress: addr.streetAddress || "",
        addressLocality: addr.addressLocality || "",
        addressRegion: addr.addressRegion || "",
        postalCode: addr.postalCode || "",
        priceRange: data.priceRange || "",
        faqItems: faqNext,
        breadcrumbItems: crumbNext,
      })
    );
    setIsSchemaModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 font-mono text-xs text-zinc-500">
        Loading SEO configurations...
      </div>
    );
  }

  const titleLength = (formData.metaTitle || "").length;
  const descLength = (formData.metaDescription || "").length;

  return (
    <div className="w-full max-w-8xl min-h-full space-y-4 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
            SEO & Schema Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure global meta tags, Open Graph cards, crawling directives, and structured
            JSON-LD schemas.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange("meta")}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide active:scale-[0.98] cursor-pointer whitespace-nowrap transition-all ${
            activeTab === "meta"
              ? "bg-teal-600 text-white shadow-xs font-bold"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27]"
          }`}
        >
          <Search className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>Meta & Crawling</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("social")}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide active:scale-[0.98] cursor-pointer whitespace-nowrap transition-all ${
            activeTab === "social"
              ? "bg-teal-600 text-white shadow-xs font-bold"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27]"
          }`}
        >
          <Share2 className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>Social (OG & Twitter)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("schemas")}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide active:scale-[0.98] cursor-pointer whitespace-nowrap transition-all ${
            activeTab === "schemas"
              ? "bg-teal-600 text-white shadow-xs font-bold"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27]"
          }`}
        >
          <Code className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>JSON-LD Schemas ({schemas.length})</span>
        </button>
      </div>

      {activeTab === "meta" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 bg-white dark:bg-[#13161c] rounded-xl p-6 shadow-xs space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Core Meta Directives
              </h2>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                    Meta Title
                  </label>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      titleLength > 60 ? "text-amber-500" : "text-teal-500"
                    }`}
                  >
                    {titleLength} / 60 chars (Optimal 40-60)
                  </span>
                </div>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle || ""}
                  onChange={handleChange}
                  placeholder="Urban Cruise - Vehicle Rentals & Chauffeur Services India"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                    Meta Description
                  </label>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      descLength > 160 ? "text-amber-500" : "text-teal-500"
                    }`}
                  >
                    {descLength} / 160 chars (Optimal 120-160)
                  </span>
                </div>
                <textarea
                  rows={4}
                  name="metaDescription"
                  value={formData.metaDescription || ""}
                  onChange={handleChange}
                  placeholder="Book luxury tempo travellers, Force Urbania vans, and Volvo coaches..."
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium leading-relaxed border-0"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="url"
                  name="canonicalUrl"
                  value={formData.canonicalUrl || ""}
                  onChange={handleChange}
                  placeholder="https://urbancruise.in"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Focus Keywords
                </label>
                <input
                  type="text"
                  name="focusKeywords"
                  value={formData.focusKeywords || ""}
                  onChange={handleChange}
                  placeholder="tempo traveller rental, force urbania, luxury bus hire, wedding car rental"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                />
              </div>
            </div>

            <div className="md:col-span-5 space-y-4 text-xs">
              <div className="bg-white dark:bg-[#13161c] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60 mb-3">
                  <span className="font-mono text-xs uppercase font-bold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Google Search Preview</span>
                  </span>
                  <span className="text-[10px] font-mono text-teal-500">Live SERP</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] space-y-1 font-sans">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                      U
                    </div>
                    <div className="text-[11px] leading-tight">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                        Urban Cruise
                      </span>
                      <span className="text-zinc-500 text-[10px] truncate block max-w-xs">
                        {formData.canonicalUrl || "https://urbancruise.in"}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1 pt-1">
                    {formData.metaTitle ||
                      "Urban Cruise - Vehicle Rentals & Chauffeur Services India"}
                  </h4>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {formData.metaDescription ||
                      "Book luxury tempo travellers, Force Urbania vans, and Volvo coaches across 15 Indian cities."}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#13161c] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase font-bold text-zinc-950 dark:text-white mb-3">
                    Bot Directives
                  </h3>

                  <div className="space-y-2">
                    <label className="flex items-start gap-3 p-3 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] cursor-pointer">
                      <input
                        type="checkbox"
                        name="robotsIndex"
                        checked={Boolean(formData.robotsIndex)}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 rounded border-0 text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <span className="block font-bold text-zinc-900 dark:text-zinc-100">
                          Allow Search Indexing (index)
                        </span>
                        <span className="text-[11px] text-zinc-500 leading-normal block mt-0.5">
                          Permit Googlebot and search crawlers to index the homepage.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] cursor-pointer">
                      <input
                        type="checkbox"
                        name="robotsFollow"
                        checked={Boolean(formData.robotsFollow)}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 rounded border-0 text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <span className="block font-bold text-zinc-900 dark:text-zinc-100">
                          Follow Outbound Links (follow)
                        </span>
                        <span className="text-[11px] text-zinc-500 leading-normal block mt-0.5">
                          Instruct bots to follow hyperlinks on the page.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-4">
                  <span className="text-[11px] font-mono text-zinc-500">
                    Directive: {Boolean(formData.robotsIndex) ? "index" : "noindex"},{" "}
                    {Boolean(formData.robotsFollow) ? "follow" : "nofollow"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !metaDirty}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 stroke-[2]" />
              )}
              <span>{saving ? "Saving..." : "Save Meta Configuration"}</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === "social" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-white dark:bg-[#13161c] rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Open Graph Protocol (Facebook / WhatsApp / LinkedIn)
              </h2>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  og:title
                </label>
                <input
                  type="text"
                  name="ogTitle"
                  value={formData.ogTitle || ""}
                  onChange={handleChange}
                  placeholder="Urban Cruise - Vehicle Rentals & Chauffeur Services"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  og:description
                </label>
                <textarea
                  rows={3}
                  name="ogDescription"
                  value={formData.ogDescription || ""}
                  onChange={handleChange}
                  placeholder="Book luxury tempo travellers, Force Urbania vans, and Volvo coaches across 15 cities."
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium leading-relaxed border-0"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  og:image URL
                </label>
                <input
                  type="url"
                  name="ogImage"
                  value={formData.ogImage || ""}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0] || null;
                      setOgFile(file);
                      setOgPreviewUrl((prev) => {
                        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
                        return file ? URL.createObjectURL(file) : formData.ogImage || "";
                      });
                    }}
                    className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => handleSocialUpload("og")}
                    disabled={!ogFile || uploadingSocial}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shrink-0 cursor-pointer transition-all"
                  >
                    {uploadingSocial === "og" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{uploadingSocial === "og" ? "Uploading..." : "Upload"}</span>
                  </button>
                </div>
                {ogFile && (
                  <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400 mt-1">
                    New upload: {ogFile.name} (replaces the URL above on save)
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <span className="text-[10px] font-mono text-zinc-400 block mb-2">
                  LIVE OPEN GRAPH SHARE PREVIEW:
                </span>
                <div className="rounded-xl overflow-hidden bg-[#f6f8fa] dark:bg-[#1a1e27]">
                  <div className="relative aspect-[1.91/1] w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {ogPreviewUrl ? (
                      <SafeImage
                        src={ogPreviewUrl}
                        alt="OG Preview"
                        fill
                        sizes="(max-width: 768px) 90vw, 640px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[11px] font-mono text-zinc-400">og:image preview</span>
                    )}
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                      URBANCRUISE.IN
                    </span>
                    <h5 className="font-bold text-zinc-900 dark:text-white truncate mt-0.5">
                      {formData.ogTitle || "Urban Cruise - Vehicle Rentals"}
                    </h5>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">
                      {formData.ogDescription ||
                        "Book luxury tempo travellers, Force Urbania vans, and Volvo coaches."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#13161c] rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Twitter Card (X Protocol)
              </h2>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  twitter:title
                </label>
                <input
                  type="text"
                  name="twitterTitle"
                  value={formData.twitterTitle || ""}
                  onChange={handleChange}
                  placeholder="Urban Cruise - Commercial Fleet in India"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  twitter:description
                </label>
                <textarea
                  rows={3}
                  name="twitterDescription"
                  value={formData.twitterDescription || ""}
                  onChange={handleChange}
                  placeholder="Official chauffeur and bus fleet portal across Delhi NCR, Mumbai, and Bengaluru."
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium leading-relaxed border-0"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  twitter:image URL
                </label>
                <input
                  type="url"
                  name="twitterImage"
                  value={formData.twitterImage || ""}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0] || null;
                      setTwitterFile(file);
                      setTwitterPreviewUrl((prev) => {
                        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
                        return file ? URL.createObjectURL(file) : formData.twitterImage || "";
                      });
                    }}
                    className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => handleSocialUpload("twitter")}
                    disabled={!twitterFile || uploadingSocial}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shrink-0 cursor-pointer transition-all"
                  >
                    {uploadingSocial === "twitter" && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    <span>{uploadingSocial === "twitter" ? "Uploading..." : "Upload"}</span>
                  </button>
                </div>
                {twitterFile && (
                  <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400 mt-1">
                    New upload: {twitterFile.name} (replaces the URL above on save)
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <span className="text-[10px] font-mono text-zinc-400 block mb-2">
                  LIVE TWITTER SUMMARY CARD:
                </span>
                <div className="rounded-xl overflow-hidden bg-[#f6f8fa] dark:bg-[#1a1e27]">
                  <div className="relative aspect-[2/1] w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {twitterPreviewUrl || formData.ogImage ? (
                      <SafeImage
                        src={twitterPreviewUrl || formData.ogImage}
                        alt="Twitter Preview"
                        fill
                        sizes="(max-width: 768px) 90vw, 640px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[11px] font-mono text-zinc-400">
                        twitter:image preview
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h5 className="font-bold text-zinc-900 dark:text-white truncate">
                      {formData.twitterTitle || formData.ogTitle || "Urban Cruise Fleet"}
                    </h5>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">
                      {formData.twitterDescription ||
                        formData.ogDescription ||
                        "Commercial chauffeur services across India."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !metaDirty}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 stroke-[2]" />
              )}
              <span>{saving ? "Saving..." : "Save Social Metadata"}</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === "schemas" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              Dynamic JSON-LD Schema Settings
            </h3>
            <button
              type="button"
              onClick={openCreateSchemaModal}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2]" />
              <span>Generate New Schema</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
            <div className="md:col-span-5 space-y-3">
              {schemas.map((s) => {
                const isSelected = selectedSchema?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSchema(s)}
                    className={`p-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-500"
                        : "bg-white dark:bg-[#13161c] hover:bg-zinc-50 dark:hover:bg-[#1a1e27]"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs uppercase tracking-wider font-mono text-zinc-950 dark:text-white block">
                        {s.schemaType.replace("_", " ")}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {s.isActive ? "Active (Injected in Head)" : "Disabled"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditSchemaModal(s);
                        }}
                        className="p-1 rounded-md text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Edit schema"
                      >
                        <Edit2 className="w-3.5 h-3.5 stroke-[1.75]" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSchema(s.id, s.isActive);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                          s.isActive
                            ? "bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                        title="Toggle head injection"
                      >
                        {s.isActive ? "Active" : "Off"}
                      </button>

                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSchema(s.id);
                        }}
                        title="Delete schema"
                        pending={deletingId === s.id}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="md:col-span-7 bg-white dark:bg-[#13161c] rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between min-w-0">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                  <span className="font-mono text-xs uppercase font-bold text-teal-600 dark:text-teal-400 truncate min-w-0 flex-1">
                    {selectedSchema?.schemaType?.replace("_", " ") || "Schema"} JSON-LD Markup
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopySchema}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono transition-colors cursor-pointer"
                      title="Copy schema JSON"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-teal-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {selectedSchema?.isActive ? "Auto-injected" : "Inactive"}
                    </span>
                  </div>
                </div>

                <pre className="p-3 sm:p-4 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-[11px] overflow-auto max-w-full max-h-96 leading-relaxed">
                  {selectedSchema?.schemaData
                    ? typeof selectedSchema.schemaData === "string"
                      ? JSON.stringify(JSON.parse(selectedSchema.schemaData), null, 2)
                      : JSON.stringify(selectedSchema.schemaData, null, 2)
                    : "// Select a schema from the list"}
                </pre>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4 text-[11px] text-zinc-500 font-mono">
                Valid Schema.org syntax validated against Google Rich Results standards.
              </div>
            </div>
          </div>
        </div>
      )}

      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#13161c] rounded-xl p-4 sm:p-6 shadow-xl w-full max-w-xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
                  JSON-LD Schema Generator
                </h2>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Forms auto-compile to valid Schema.org structure
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSchemaModalOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>

            <form onSubmit={handleSaveSchema} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Supported Schema Type
                </label>
                <select
                  value={schemaType}
                  onChange={(e) => setSchemaType(e.target.value)}
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono font-bold border-0"
                >
                  <option value="organization">Organization Schema</option>
                  <option value="local_business">Local Business Schema</option>
                  <option value="website">Website Schema</option>
                  <option value="faq">FAQ Schema</option>
                  <option value="breadcrumb">Breadcrumb Schema</option>
                </select>
              </div>

              {schemaType === "organization" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Organization Legal Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Legal Name
                    </label>
                    <input
                      type="text"
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={addressLocality}
                        onChange={(e) => setAddressLocality(e.target.value)}
                        className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        value={addressRegion}
                        onChange={(e) => setAddressRegion(e.target.value)}
                        className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {schemaType === "local_business" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                        City / Locality
                      </label>
                      <input
                        type="text"
                        value={addressLocality}
                        onChange={(e) => setAddressLocality(e.target.value)}
                        className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        value={addressRegion}
                        onChange={(e) => setAddressRegion(e.target.value)}
                        className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Price Range
                    </label>
                    <input
                      type="text"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      placeholder="₹₹ - ₹₹₹"
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                    />
                  </div>
                </div>
              )}

              {schemaType === "website" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Website Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Target URL
                    </label>
                    <input
                      type="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                      required
                    />
                  </div>
                </div>
              )}

              {schemaType === "faq" && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono uppercase font-bold text-zinc-500 text-[11px]">
                      FAQ Question Items
                    </span>
                    <button
                      type="button"
                      onClick={() => setFaqItems([...faqItems, { question: "", answer: "" }])}
                      className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-mono cursor-pointer"
                    >
                      + Add Question
                    </button>
                  </div>

                  {faqItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg space-y-2 bg-[#f6f8fa] dark:bg-[#1a1e27]"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[11px] text-zinc-400">Q#{idx + 1}</span>
                        {faqItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setFaqItems(faqItems.filter((_, i) => i !== idx))}
                            className="text-zinc-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Question title"
                        value={item.question}
                        onChange={(e) => {
                          const updated = [...faqItems];
                          updated[idx].question = e.target.value;
                          setFaqItems(updated);
                        }}
                        className="w-full bg-white dark:bg-[#13161c] text-zinc-900 dark:text-white rounded px-2.5 py-1.5 text-xs border-0 outline-none focus:ring-1 focus:ring-teal-500"
                        required
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer text"
                        value={item.answer}
                        onChange={(e) => {
                          const updated = [...faqItems];
                          updated[idx].answer = e.target.value;
                          setFaqItems(updated);
                        }}
                        className="w-full bg-white dark:bg-[#13161c] text-zinc-900 dark:text-white rounded px-2.5 py-1.5 text-xs leading-relaxed border-0 outline-none focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {schemaType === "breadcrumb" && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono uppercase font-bold text-zinc-500 text-[11px]">
                      Breadcrumb Navigation Steps
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setBreadcrumbItems([...breadcrumbItems, { name: "", url: "" }])
                      }
                      className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-mono cursor-pointer"
                    >
                      + Add Step
                    </button>
                  </div>

                  {breadcrumbItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-zinc-400 w-6">#{idx + 1}</span>
                      <input
                        type="text"
                        placeholder="Page Name (e.g. Fleet)"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...breadcrumbItems];
                          updated[idx].name = e.target.value;
                          setBreadcrumbItems(updated);
                        }}
                        className="flex-1 bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded px-2.5 py-1.5 text-xs border-0 outline-none focus:ring-1 focus:ring-teal-500"
                        required
                      />
                      <input
                        type="url"
                        placeholder="https://..."
                        value={item.url}
                        onChange={(e) => {
                          const updated = [...breadcrumbItems];
                          updated[idx].url = e.target.value;
                          setBreadcrumbItems(updated);
                        }}
                        className="flex-1 bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded px-2.5 py-1.5 text-xs font-mono border-0 outline-none focus:ring-1 focus:ring-teal-500"
                        required
                      />
                      {breadcrumbItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setBreadcrumbItems(breadcrumbItems.filter((_, i) => i !== idx))
                          }
                          className="text-zinc-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <button
                  type="button"
                  onClick={() => setIsSchemaModalOpen(false)}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={schemaSaving || !schemaDirty}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all"
                >
                  {schemaSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{schemaSaving ? "Saving..." : "Generate & Save Schema"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeoSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64 font-mono text-xs text-zinc-500">
          Loading SEO configurations...
        </div>
      }
    >
      <SeoSettingsContent />
    </Suspense>
  );
}
