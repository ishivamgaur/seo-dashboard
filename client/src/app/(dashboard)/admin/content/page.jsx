'use client';

import React, { useState, useEffect } from 'react';

const Card = ({ children, title }) => (
  <div className="bg-white rounded-[12px] border border-zinc-200 shadow-sm p-6 mb-6">
    {title && <h2 className="text-xl font-semibold mb-4 text-zinc-800">{title}</h2>}
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-zinc-700 mb-1">{label}</label>}
    <input
      className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00] focus:outline-none"
      {...props}
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-zinc-700 mb-1">{label}</label>}
    <textarea
      className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00] focus:outline-none"
      {...props}
    />
  </div>
);

const Button = ({ children, type = 'button', ...props }) => (
  <button
    type={type}
    className="bg-[#FFAD00] hover:bg-black text-white px-4 py-2 rounded-[8px] transition-colors"
    {...props}
  >
    {children}
  </button>
);

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [statusMsg, setStatusMsg] = useState('');

  const [heroForm, setHeroForm] = useState({ heading: '', subHeading: '', ctaText: '', ctaUrl: '', bannerImage: null });
  const [aboutForm, setAboutForm] = useState({ title: '', description: '', featuredImage: null });
  const [contactForm, setContactForm] = useState({ phone: '', email: '', address: '', mapEmbed: '' });
  const [schemaForm, setSchemaForm] = useState({ organization: '', faq: '', breadcrumb: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, aboutRes, contactRes, schemaRes] = await Promise.all([
          fetch('/api/hero').then(res => res.ok ? res.json() : {}),
          fetch('/api/about').then(res => res.ok ? res.json() : {}),
          fetch('/api/contact').then(res => res.ok ? res.json() : {}),
          fetch('/api/schema').then(res => res.ok ? res.json() : {})
        ]);
        if (heroRes.data) setHeroForm(prev => ({ ...prev, ...heroRes.data }));
        if (aboutRes.data) setAboutForm(prev => ({ ...prev, ...aboutRes.data }));
        if (contactRes.data) setContactForm(prev => ({ ...prev, ...contactRes.data }));
        if (schemaRes.data) setSchemaForm(prev => ({ ...prev, ...schemaRes.data }));
      } catch (err) {
        console.error('Failed to fetch initial data', err);
      }
    };
    fetchData();
  }, []);

  const showToast = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(heroForm).forEach(key => {
      if (heroForm[key] !== null) formData.append(key, heroForm[key]);
    });
    try {
      const res = await fetch('/api/hero', { method: 'POST', body: formData });
      if (res.ok) showToast('Hero section updated successfully');
    } catch (err) {
      showToast('Error updating hero section');
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(aboutForm).forEach(key => {
      if (aboutForm[key] !== null) formData.append(key, aboutForm[key]);
    });
    try {
      const res = await fetch('/api/about', { method: 'POST', body: formData });
      if (res.ok) showToast('About section updated successfully');
    } catch (err) {
      showToast('Error updating about section');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) showToast('Contact info updated successfully');
    } catch (err) {
      showToast('Error updating contact info');
    }
  };

  const handleSchemaSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schemaForm)
      });
      if (res.ok) showToast('Schema updated successfully');
    } catch (err) {
      showToast('Error updating schema');
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'about', label: 'About Section' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'schema', label: 'Schema Markup' }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Content Management</h1>
        {statusMsg && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-[8px] text-sm">{statusMsg}</div>
        )}
      </div>

      <div className="flex space-x-2 mb-6 border-b border-zinc-200 pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-[8px] font-medium transition-colors ${activeTab === tab.id ? 'bg-zinc-100 text-black border-b-2 border-[#FFAD00]' : 'text-zinc-500 hover:text-black hover:bg-zinc-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'hero' && (
          <Card title="Hero Section">
            <form onSubmit={handleHeroSubmit}>
              <Input label="Heading" value={heroForm.heading} onChange={e => setHeroForm({...heroForm, heading: e.target.value})} />
              <Input label="Sub Heading" value={heroForm.subHeading} onChange={e => setHeroForm({...heroForm, subHeading: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="CTA Text" value={heroForm.ctaText} onChange={e => setHeroForm({...heroForm, ctaText: e.target.value})} />
                <Input label="CTA URL" value={heroForm.ctaUrl} onChange={e => setHeroForm({...heroForm, ctaUrl: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Banner Image</label>
                <input type="file" onChange={e => setHeroForm({...heroForm, bannerImage: e.target.files[0]})} className="w-full text-zinc-700" accept="image/*" />
              </div>
              <Button type="submit">Save Hero Section</Button>
            </form>
          </Card>
        )}

        {activeTab === 'about' && (
          <Card title="About Section">
            <form onSubmit={handleAboutSubmit}>
              <Input label="Title" value={aboutForm.title} onChange={e => setAboutForm({...aboutForm, title: e.target.value})} />
              <Textarea label="Description" rows={4} value={aboutForm.description} onChange={e => setAboutForm({...aboutForm, description: e.target.value})} />
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Featured Image</label>
                <input type="file" onChange={e => setAboutForm({...aboutForm, featuredImage: e.target.files[0]})} className="w-full text-zinc-700" accept="image/*" />
              </div>
              <Button type="submit">Save About Section</Button>
            </form>
          </Card>
        )}

        {activeTab === 'contact' && (
          <Card title="Contact Info">
            <form onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                <Input label="Email" type="email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
              </div>
              <Textarea label="Address" rows={2} value={contactForm.address} onChange={e => setContactForm({...contactForm, address: e.target.value})} />
              <Textarea label="Map Embed (HTML/Iframe)" rows={3} value={contactForm.mapEmbed} onChange={e => setContactForm({...contactForm, mapEmbed: e.target.value})} />
              <Button type="submit">Save Contact Info</Button>
            </form>
          </Card>
        )}

        {activeTab === 'schema' && (
          <Card title="Schema Markup (JSON-LD)">
            <form onSubmit={handleSchemaSubmit}>
              <Textarea label="Organization Schema" rows={4} value={schemaForm.organization} onChange={e => setSchemaForm({...schemaForm, organization: e.target.value})} placeholder="{ '@context': 'https://schema.org', '@type': 'Organization', ... }" />
              <Textarea label="FAQ Schema" rows={4} value={schemaForm.faq} onChange={e => setSchemaForm({...schemaForm, faq: e.target.value})} />
              <Textarea label="Breadcrumb Schema" rows={4} value={schemaForm.breadcrumb} onChange={e => setSchemaForm({...schemaForm, breadcrumb: e.target.value})} />
              <Button type="submit">Save Schema Markup</Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
