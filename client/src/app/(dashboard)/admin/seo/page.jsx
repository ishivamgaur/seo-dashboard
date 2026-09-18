"use client";

import { useState, useEffect } from 'react';
import api from '../../../../lib/api';

export default function SeoSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    focusKeywords: '',
    robotsIndex: true,
    robotsFollow: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/seo');
        if (response.data.success && response.data.data) {
          setFormData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch SEO settings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await api.post('/api/seo', formData);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'SEO settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to save settings.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFAD00]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-950">SEO Settings</h1>
        <p className="text-zinc-500 mt-1">Manage global search engine optimization preferences.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-zinc-950 mb-4">General SEO</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-950 mb-1" htmlFor="metaTitle">
                  Meta Title
                </label>
                <p className="text-xs text-zinc-500 mb-2">The default title tag for your site.</p>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle || ''}
                  onChange={handleChange}
                  className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00]/50 focus:border-[#FFAD00] transition-all outline-none"
                  placeholder="Enter meta title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-950 mb-1" htmlFor="metaDescription">
                  Meta Description
                </label>
                <p className="text-xs text-zinc-500 mb-2">The default description snippet in search results.</p>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00]/50 focus:border-[#FFAD00] transition-all outline-none resize-none"
                  placeholder="Enter meta description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-950 mb-1" htmlFor="canonicalUrl">
                  Canonical URL Base
                </label>
                <p className="text-xs text-zinc-500 mb-2">The base URL for resolving canonical links.</p>
                <input
                  type="url"
                  id="canonicalUrl"
                  name="canonicalUrl"
                  value={formData.canonicalUrl || ''}
                  onChange={handleChange}
                  className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00]/50 focus:border-[#FFAD00] transition-all outline-none"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-zinc-950 mb-4">Advanced Preferences</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-950 mb-1" htmlFor="focusKeywords">
                  Global Focus Keywords
                </label>
                <p className="text-xs text-zinc-500 mb-2">Comma-separated list of core keywords.</p>
                <input
                  type="text"
                  id="focusKeywords"
                  name="focusKeywords"
                  value={formData.focusKeywords || ''}
                  onChange={handleChange}
                  className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00]/50 focus:border-[#FFAD00] transition-all outline-none"
                  placeholder="seo, dashboard, analytics"
                />
              </div>

              <div className="pt-4 border-t border-zinc-100 space-y-4">
                <h3 className="text-sm font-medium text-zinc-950">Crawling Directives</h3>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="robotsIndex"
                    checked={formData.robotsIndex}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-[#FFAD00] focus:ring-[#FFAD00] border-zinc-300 rounded"
                  />
                  <div>
                    <span className="block text-sm font-medium text-zinc-950">Allow Indexing (index)</span>
                    <span className="block text-xs text-zinc-500 mt-0.5">Let search engines index your pages by default.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="robotsFollow"
                    checked={formData.robotsFollow}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-[#FFAD00] focus:ring-[#FFAD00] border-zinc-300 rounded"
                  />
                  <div>
                    <span className="block text-sm font-medium text-zinc-950">Follow Links (follow)</span>
                    <span className="block text-xs text-zinc-500 mt-0.5">Allow search engines to follow links on your pages.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#FFAD00] hover:bg-black text-white font-semibold rounded-[8px] px-6 py-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saving && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
