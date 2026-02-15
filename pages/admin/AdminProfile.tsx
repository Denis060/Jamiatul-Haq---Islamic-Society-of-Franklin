
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Save, Loader2, Landmark, Clock, MapPin, Phone, Mail } from 'lucide-react';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    official_name: '',
    common_name: '',
    address: '',
    imam_name: '',
    phone: '',
    email: '',
    jumua_time: ''
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
    const { data: prof } = await supabase.from('masjid_profile').select('*').single();
    const { data: pray } = await supabase.from('prayer_times_weekly').select('*').single();
    
    if (prof) setProfile(prof);
    if (pray) setPrayers(pray);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Upsert Profile
    await supabase.from('masjid_profile').upsert({ id: (profile as any).id, ...profile });
    // Upsert Prayers
    await supabase.from('prayer_times_weekly').upsert({ id: (prayers as any).id, ...prayers });
    
    setSaving(false);
    alert('Settings updated successfully, Bismillah!');
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#d4af37]" size={48} /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#042f24] italic">Masjid Settings</h1>
          <p className="text-slate-500 font-medium">Core identity and schedule management.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#042f24] text-[#d4af37] px-8 py-4 rounded-full font-black flex items-center gap-2 hover:bg-[#d4af37] hover:text-[#042f24] transition-all shadow-xl uppercase text-xs tracking-widest disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Profile Card */}
        <div className="bg-white p-10 rounded-[3rem] border-2 border-[#f0e6d2] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8 text-[#d4af37]">
            <Landmark size={24} />
            <h2 className="text-xl font-black uppercase tracking-widest">General Info</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Common Name</label>
              <input value={profile.common_name} onChange={e => setProfile({...profile, common_name: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] outline-none font-bold" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Official Legal Name</label>
              <input value={profile.official_name} onChange={e => setProfile({...profile, official_name: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] outline-none font-bold" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Primary Address</label>
              <input value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] outline-none font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Imam Name</label>
                <input value={profile.imam_name} onChange={e => setProfile({...profile, imam_name: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] outline-none font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Phone</label>
                <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] outline-none font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Card */}
        <div className="bg-[#042f24] p-10 rounded-[3rem] shadow-2xl text-white">
          <div className="flex items-center gap-3 mb-8 text-[#d4af37]">
            <Clock size={24} />
            <h2 className="text-xl font-black uppercase tracking-widest">Master Schedule</h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumua'].map(p => (
              <div key={p}>
                <label className="block text-[10px] font-black uppercase text-white/40 mb-2 tracking-widest">{p}</label>
                <input 
                  value={(prayers as any)[p]} 
                  onChange={e => setPrayers({...prayers, [p]: e.target.value})} 
                  placeholder="e.g. 5:15 AM"
                  className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#d4af37] outline-none font-bold text-[#d4af37]" 
                />
              </div>
            ))}
          </div>
          <div className="mt-8">
            <label className="block text-[10px] font-black uppercase text-white/40 mb-2 tracking-widest">Schedule Notes</label>
            <textarea 
              value={prayers.notes} 
              onChange={e => setPrayers({...prayers, notes: e.target.value})}
              className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#d4af37] outline-none font-medium h-24"
              placeholder="e.g. Iqamah is 15 mins after Adhan..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
