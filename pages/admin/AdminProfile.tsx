
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Save, Loader2, Landmark, Clock, Share2, AlertCircle, Upload, X, ImageIcon, List, Database } from 'lucide-react';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [profile, setProfile] = useState({
    id: '',
    official_name: '',
    common_name: '',
    address: '',
    imam_name: '',
    phone: '',
    email: '',
    jumua_time: '',
    whatsapp_link: '',
    facilities_image_url: '',
    facilities_list: 'Ample Parking, Dedicated Wudu Area, Sisters Prayer Hall, Islamic Library'
  });

  const [prayers, setPrayers] = useState({
    id: '',
    fajr: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: '',
    jumua: '',
    notes: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const { data: prof, error: profErr } = await supabase
        .from('masjid_profile')
        .select('*')
        .maybeSingle();

      const { data: pray, error: prayErr } = await supabase
        .from('prayer_times_weekly')
        .select('*')
        .maybeSingle();

      if (prof) {
        setProfile(prof);
        if (prof.facilities_image_url) setImagePreview(prof.facilities_image_url);
      }
      if (pray) setPrayers(pray);

      if (profErr && profErr.code !== 'PGRST116') {
        console.error("Profile fetch error:", profErr);
        setError(profErr.message);
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingImage(true);
      setError(null);

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `facilities-${Date.now()}.${fileExt}`;
        const filePath = `masjid/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('events')
          .getPublicUrl(filePath);

        setProfile(prev => ({ ...prev, facilities_image_url: publicUrl }));
        setImagePreview(publicUrl);
      } catch (err: any) {
        setError("Image upload failed: " + err.message);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Create a clean copy of profile data
      const { id, updated_at, ...cleanProfile } = profile as any;
      const profileToSave = id ? { id, ...cleanProfile } : cleanProfile;

      const { error: profError } = await supabase.from('masjid_profile').upsert(profileToSave);

      if (profError) {
        if (profError.message.includes('facilities_image_url')) {
          throw new Error("SCHEMA MISMATCH: Please run the SQL script in your Supabase dashboard to add the 'facilities_image_url' column.");
        }
        throw profError;
      }

      const { id: pId, updated_at: pUp, ...cleanPrayers } = prayers as any;
      const prayersToSave = pId ? { id: pId, ...cleanPrayers } : cleanPrayers;

      const { error: prayError } = await supabase.from('prayer_times_weekly').upsert(prayersToSave);
      if (prayError) throw prayError;

      alert('Settings updated successfully, Alhamdulillah!');
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error saving changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40">
      <Loader2 className="animate-spin text-[#d4af37] mb-4" size={48} />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Records...</p>
    </div>
  );

  const inputClasses = "w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] focus:bg-white outline-none font-bold text-slate-900 transition-all shadow-sm";
  const darkInputClasses = "w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#d4af37] focus:bg-white/10 outline-none font-bold text-[#d4af37] transition-all placeholder:text-white/20";

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight">Masjid Settings</h1>
          <p className="text-slate-500 font-medium">Core identity and facilities management.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#042f24] text-[#d4af37] px-10 py-5 rounded-full font-black flex items-center gap-3 hover:bg-[#d4af37] hover:text-[#042f24] transition-all shadow-2xl uppercase text-xs tracking-widest disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save All Changes
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 p-8 rounded-[2.5rem] text-red-700 flex flex-col md:flex-row items-start gap-6 shadow-xl animate-in slide-in-from-top-4 duration-500">
          <div className="p-4 bg-red-100 rounded-2xl text-red-600">
            <Database size={32} />
          </div>
          <div className="flex-1">
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-2 flex items-center gap-2">
              <AlertCircle size={16} /> Database Synchronizaton Required
            </h4>
            <p className="text-sm font-bold italic leading-relaxed mb-4">{error}</p>
            {error.includes('SCHEMA') && (
              <div className="bg-white/50 p-4 rounded-xl border border-red-100">
                <p className="text-[10px] uppercase font-black mb-1">How to fix:</p>
                <ol className="text-[10px] font-bold space-y-1 list-decimal ml-4">
                  <li>Copy the code from <strong>schema.sql</strong> in this app.</li>
                  <li>Go to your <strong>Supabase Dashboard</strong>.</li>
                  <li>Open the <strong>SQL Editor</strong>.</li>
                  <li>Paste and click <strong>Run</strong>.</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          {/* Profile Card */}
          <div className="bg-white p-12 rounded-[3.5rem] border-2 border-[#f0e6d2] shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10 text-[#d4af37]">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <Landmark size={28} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest">General Info</h2>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Common Name</label>
                <input
                  value={profile.common_name}
                  onChange={e => setProfile({ ...profile, common_name: e.target.value })}
                  className={inputClasses}
                  placeholder="e.g. Jamiatul Haq"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Primary Address</label>
                <input
                  value={profile.address}
                  onChange={e => setProfile({ ...profile, address: e.target.value })}
                  className={inputClasses}
                  placeholder="Street, City, State, Zip"
                />
              </div>

              <div className="pt-4 border-t-2 border-slate-50">
                <div className="flex items-center gap-2 mb-4">
                  <Share2 size={16} className="text-[#d4af37]" />
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#042f24]">WhatsApp Community Link</label>
                </div>
                <input
                  value={profile.whatsapp_link || ''}
                  onChange={e => setProfile({ ...profile, whatsapp_link: e.target.value })}
                  className={`${inputClasses} border-[#d4af37]/20`}
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>
            </div>
          </div>

          {/* Facilities Card */}
          <div className="bg-white p-12 rounded-[3.5rem] border-2 border-[#f0e6d2] shadow-sm">
            <div className="flex items-center gap-4 mb-10 text-[#d4af37]">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <ImageIcon size={28} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest">Facilities Section</h2>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Facilities Photo</label>
                <div className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-dashed border-[#f0e6d2] bg-slate-50 group mb-4">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Facilities" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon size={48} className="mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">No Custom Photo<br />(Using Default)</span>
                    </div>
                  )}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#d4af37]" size={32} />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <input type="file" id="facilities-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <label htmlFor="facilities-upload" className="flex-1 bg-[#042f24] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center cursor-pointer hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2">
                    <Upload size={16} /> {imagePreview ? 'Change Photo' : 'Upload Custom Photo'}
                  </label>
                  {imagePreview && (
                    <button onClick={() => { setImagePreview(null); setProfile({ ...profile, facilities_image_url: '' }); }} className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37] mb-3 flex items-center gap-2">
                  <List size={14} /> Facilities Bullet Points
                </label>
                <textarea
                  value={profile.facilities_list}
                  onChange={e => setProfile({ ...profile, facilities_list: e.target.value })}
                  className={`${inputClasses} h-24 resize-none`}
                  placeholder="e.g. Ample Parking, Library, Sisters Hall..."
                />
                <p className="text-[8px] text-slate-400 font-bold uppercase mt-2">Enter items separated by commas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Card (Secondary Settings) */}
        <div className="bg-[#042f24] p-12 rounded-[3.5rem] shadow-2xl text-white relative border-4 border-[#064e3b] h-fit">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 mihrab-shape -rotate-12 translate-x-1/4 -translate-y-1/4"></div>

          <div className="flex items-center gap-4 mb-10 text-[#d4af37] relative z-10">
            <div className="p-3 bg-white/5 rounded-2xl">
              <Clock size={28} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest">Prayer Master Schedule</h2>
          </div>

          <div className="grid grid-cols-2 gap-8 relative z-10">
            {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumua'].map(p => (
              <div key={p}>
                <label className="block text-[10px] font-black uppercase text-white/40 mb-3 tracking-[0.2em]">{p}</label>
                <input
                  value={(prayers as any)[p]}
                  onChange={e => setPrayers({ ...prayers, [p]: e.target.value })}
                  placeholder="e.g. 5:15 AM"
                  className={darkInputClasses}
                />
              </div>
            ))}
          </div>

          <div className="mt-10 relative z-10">
            <label className="block text-[10px] font-black uppercase text-white/40 mb-3 tracking-[0.2em]">Schedule Notes</label>
            <textarea
              value={prayers.notes}
              onChange={e => setPrayers({ ...prayers, notes: e.target.value })}
              className={`${darkInputClasses} h-32 resize-none font-medium text-white/80`}
              placeholder="Iqamah times, Jumu'ah details..."
            />
          </div>
        </div>

        {/* Donation Settings Card */}
        <div className="bg-white p-12 rounded-[3.5rem] border-2 border-[#f0e6d2] shadow-sm relative overflow-hidden lg:col-span-2">
          <div className="flex items-center gap-4 mb-10 text-[#d4af37]">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <Landmark size={28} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest">Donation Links</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">PayPal Link</label>
              <input
                value={(profile as any).paypal_link || ''}
                onChange={e => setProfile({ ...profile, paypal_link: e.target.value } as any)}
                className={inputClasses}
                placeholder="https://paypal.me/..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Zelle (Email/Phone)</label>
              <input
                value={(profile as any).zelle_contact || ''}
                onChange={e => setProfile({ ...profile, zelle_contact: e.target.value } as any)}
                className={inputClasses}
                placeholder="admin@jamiatul-haq.org"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">LaunchGood Link</label>
              <input
                value={(profile as any).launchgood_link || ''}
                onChange={e => setProfile({ ...profile, launchgood_link: e.target.value } as any)}
                className={inputClasses}
                placeholder="https://launchgood.com/..."
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
              <div className="md:col-span-3 mb-2">
                <h4 className="text-sm font-black text-[#042f24] uppercase tracking-widest">Bank Transfer Details</h4>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Bank Name</label>
                <input
                  value={(profile as any).bank_name || ''}
                  onChange={e => setProfile({ ...profile, bank_name: e.target.value } as any)}
                  className={inputClasses}
                  placeholder="e.g. Chase Bank"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Account Number</label>
                <input
                  value={(profile as any).account_number || ''}
                  onChange={e => setProfile({ ...profile, account_number: e.target.value } as any)}
                  className={inputClasses}
                  placeholder="000000000"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Routing Number</label>
                <input
                  value={(profile as any).routing_number || ''}
                  onChange={e => setProfile({ ...profile, routing_number: e.target.value } as any)}
                  className={inputClasses}
                  placeholder="000000000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
