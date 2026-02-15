
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Save, Loader2, Landmark, Clock, Share2, AlertCircle } from 'lucide-react';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    official_name: '',
    common_name: '',
    address: '',
    imam_name: '',
    phone: '',
    email: '',
    jumua_time: '',
    whatsapp_link: ''
  });

  const [prayers, setPrayers] = useState({
    fajr: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: '',
    jumua: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      // Explicitly select columns to avoid "*" issues with cache
      const { data: prof, error: profErr } = await supabase
        .from('masjid_profile')
        .select('id, official_name, common_name, address, imam_name, phone, email, jumua_time, whatsapp_link')
        .maybeSingle();
      
      const { data: pray, error: prayErr } = await supabase
        .from('prayer_times_weekly')
        .select('*')
        .maybeSingle();
      
      if (prof) setProfile(prof);
      if (pray) setPrayers(pray);
      
      if (profErr && profErr.code !== 'PGRST116') {
        console.error("Profile fetch error:", profErr);
        if (profErr.message.includes('whatsapp_link')) {
          setError("Database Schema Mismatch: The 'whatsapp_link' column is missing. Please run the SQL in schema.sql.");
        }
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Prepare data for saving
      const profileData: any = { ...profile };
      
      // Upsert Profile
      const { error: profError } = await supabase.from('masjid_profile').upsert(profileData);
      if (profError) {
        if (profError.message.includes('whatsapp_link')) {
          throw new Error("The 'whatsapp_link' column was not found in your database. Please run the updated SQL in the 'schema.sql' file to fix this.");
        }
        throw profError;
      }

      // Upsert Prayers
      const { error: prayError } = await supabase.from('prayer_times_weekly').upsert(prayers);
      if (prayError) throw prayError;

      alert('Settings updated successfully, Bismillah!');
      fetchData(); // Refresh to get the latest IDs
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error saving changes. Please check your connection.');
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

  const inputClasses = "w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] focus:bg-white outline-none font-bold text-slate-900 transition-all";
  const darkInputClasses = "w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#d4af37] focus:bg-white/10 outline-none font-bold text-[#d4af37] transition-all placeholder:text-white/20";

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight">Masjid Settings</h1>
          <p className="text-slate-500 font-medium">Core identity and schedule management.</p>
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
        <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[2rem] text-red-700 flex items-start gap-4 shadow-sm animate-in fade-in duration-300">
          <AlertCircle className="shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-black uppercase text-xs tracking-widest mb-1">Configuration Required</h4>
            <p className="text-sm font-medium italic leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
                onChange={e => setProfile({...profile, common_name: e.target.value})} 
                className={inputClasses}
                placeholder="e.g. Jamiatul Haq"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Official Legal Name</label>
              <input 
                value={profile.official_name} 
                onChange={e => setProfile({...profile, official_name: e.target.value})} 
                className={inputClasses}
                placeholder="Islamic Society of Franklin Township"
              />
            </div>
            
            <div className="pt-4 border-t-2 border-slate-50">
              <div className="flex items-center gap-2 mb-4">
                <Share2 size={16} className="text-[#d4af37]" />
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#042f24]">Community Link (WhatsApp/Telegram)</label>
              </div>
              <input 
                value={profile.whatsapp_link || ''} 
                onChange={e => setProfile({...profile, whatsapp_link: e.target.value})} 
                className={`${inputClasses} border-[#d4af37]/20`}
                placeholder="https://chat.whatsapp.com/..."
              />
              <p className="mt-2 text-[9px] text-slate-400 font-bold uppercase italic">This link will be used for the "Join Community Group" button on the website.</p>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Primary Address</label>
              <input 
                value={profile.address} 
                onChange={e => setProfile({...profile, address: e.target.value})} 
                className={inputClasses}
                placeholder="Street, City, State, Zip"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Imam Name</label>
                <input 
                  value={profile.imam_name} 
                  onChange={e => setProfile({...profile, imam_name: e.target.value})} 
                  className={inputClasses}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Phone</label>
                <input 
                  value={profile.phone} 
                  onChange={e => setProfile({...profile, phone: e.target.value})} 
                  className={inputClasses}
                  placeholder="732-000-0000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Card */}
        <div className="bg-[#042f24] p-12 rounded-[3.5rem] shadow-2xl text-white relative border-4 border-[#064e3b]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 mihrab-shape -rotate-12 translate-x-1/4 -translate-y-1/4"></div>
          
          <div className="flex items-center gap-4 mb-10 text-[#d4af37] relative z-10">
            <div className="p-3 bg-white/5 rounded-2xl">
              <Clock size={28} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest">Master Schedule</h2>
          </div>

          <div className="grid grid-cols-2 gap-8 relative z-10">
            {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumua'].map(p => (
              <div key={p}>
                <label className="block text-[10px] font-black uppercase text-white/40 mb-3 tracking-[0.2em]">{p}</label>
                <input 
                  value={(prayers as any)[p]} 
                  onChange={e => setPrayers({...prayers, [p]: e.target.value})} 
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
              onChange={e => setPrayers({...prayers, notes: e.target.value})}
              className={`${darkInputClasses} h-32 resize-none font-medium text-white/80`}
              placeholder="Iqamah times, Jumu'ah details, or seasonal changes..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
