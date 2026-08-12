"use client";

import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/actions/settings";
import { SiteSettings, TikTokClip } from "@belihuloya/core";
import { CldUploadWidget } from "next-cloudinary";
import { Save, Loader2, Trash2, Video, Link as LinkIcon, Activity, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await updateSettings(settings);
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVideoUpload = (result: any) => {
    if (result.event !== "success") return;
    
    const newClip: TikTokClip = {
      id: result.info.asset_id,
      publicId: result.info.public_id,
      url: result.info.secure_url,
    };

    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tiktokClips: [...(prev.tiktokClips || []), newClip]
      };
    });
  };

  const removeVideo = (id: string) => {
    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tiktokClips: prev.tiktokClips.filter(clip => clip.id !== id)
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!settings) return <div>Failed to load settings</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-2">Site Settings</h1>
          <p className="text-slate-400">Manage your website's social links, pixels, and short videos.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Tracking Pixels Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <Activity className="text-orange-500 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Tracking Pixels</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Meta Pixel ID</label>
              <input
                type="text"
                value={settings.pixelIds?.meta || ""}
                onChange={e => setSettings({...settings, pixelIds: {...settings.pixelIds, meta: e.target.value}})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="e.g. 1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">TikTok Pixel ID</label>
              <input
                type="text"
                value={settings.pixelIds?.tiktok || ""}
                onChange={e => setSettings({...settings, pixelIds: {...settings.pixelIds, tiktok: e.target.value}})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="e.g. CD1234567890"
              />
            </div>
          </div>
        </section>

        {/* Social Links Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <LinkIcon className="text-blue-500 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Social Media Links</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Facebook URL</label>
              <input
                type="url"
                value={settings.socialLinks?.facebook || ""}
                onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, facebook: e.target.value}})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">TikTok URL</label>
              <input
                type="url"
                value={settings.socialLinks?.tiktok || ""}
                onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, tiktok: e.target.value}})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="https://tiktok.com/@..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">YouTube URL</label>
              <input
                type="url"
                value={settings.socialLinks?.youtube || ""}
                onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, youtube: e.target.value}})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Instagram URL</label>
              <input
                type="url"
                value={settings.socialLinks?.instagram || ""}
                onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, instagram: e.target.value}})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </section>

        {/* Fleet Settings Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <SettingsIcon className="text-emerald-500 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Global Fleet Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Default Daily Jeeps</label>
              <input
                type="number"
                min="1"
                value={settings.fleet?.default_daily_jeeps || 5}
                onChange={e => setSettings({...settings, fleet: {...(settings.fleet || { max_pax_per_jeep: 8, default_daily_jeeps: 5 }), default_daily_jeeps: parseInt(e.target.value) || 5}})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-2">The total number of jeeps available across all tours daily.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Max Pax per Jeep</label>
              <input
                type="number"
                min="1"
                value={settings.fleet?.max_pax_per_jeep || 8}
                onChange={e => setSettings({...settings, fleet: {...(settings.fleet || { default_daily_jeeps: 5, max_pax_per_jeep: 8 }), max_pax_per_jeep: parseInt(e.target.value) || 8}})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-2">Maximum number of passengers that fit in one physical jeep.</p>
            </div>
          </div>
        </section>

        {/* Video Management Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Video className="text-pink-500 w-6 h-6" />
              <h2 className="text-xl font-bold text-white">Homepage Short Videos (TikTok Clips)</h2>
            </div>
            <CldUploadWidget signatureEndpoint="/api/cloudinary/sign" onSuccess={handleVideoUpload} options={{ resourceType: 'video' }}>
              {({ open }) => (
                <button 
                  onClick={(e) => { e.preventDefault(); open(); }}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Upload Video
                </button>
              )}
            </CldUploadWidget>
          </div>

          {!settings.tiktokClips || settings.tiktokClips.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-950 rounded-xl border border-slate-800 border-dashed">
              No videos uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {settings.tiktokClips.map((clip, idx) => (
                <div key={clip.id} className="relative group bg-slate-950 rounded-xl border border-slate-800 overflow-hidden aspect-[9/16]">
                  <video 
                    src={clip.url} 
                    className="w-full h-full object-cover"
                    muted 
                    loop 
                    onMouseEnter={e => e.currentTarget.play()}
                    onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => removeVideo(clip.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors shadow-lg"
                      title="Delete Video"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-mono">
                    Video {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
