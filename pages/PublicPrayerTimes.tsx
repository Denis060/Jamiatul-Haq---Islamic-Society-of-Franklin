
import React, { useState, useEffect } from 'react';
import { supabase, MOCK_PRAYER_TIMES, MOCK_PROFILE } from '../services/supabase';
import { Clock, Info, ShieldCheck, Moon, Loader2 } from 'lucide-react';

const PublicPrayerTimes = () => {
  const [prayers, setPrayers] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [prayerRes, profileRes] = await Promise.all([
          supabase.from('prayer_times_weekly').select('*').single(),
          supabase.from('masjid_profile').select('*').single()
        ]);
        
        setPrayers(prayerRes.data || MOCK_PRAYER_TIMES);
        setProfile(profileRes.data || MOCK_PROFILE);
      } catch (err) {
        setPrayers(MOCK_PRAYER_TIMES);
        setProfile(MOCK_PROFILE);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <Loader2 className="animate-spin text-[#d4af37]" size={48} />
    </div>
  );

  const prayerList = [
    { name: 'Fajr', time: prayers.fajr, iqamah: 'See Notes' },
    { name: 'Dhuhr', time: prayers.dhuhr, iqamah: 'See Notes' },
    { name: 'Asr', time: prayers.asr, iqamah: 'See Notes' },
    { name: 'Maghrib', time: prayers.maghrib, iqamah: 'Sunset' },
    { name: 'Isha', time: prayers.isha, iqamah: 'See Notes' },
    { name: 'Jumu’ah', time: prayers.jumua, iqamah: prayers.jumua },
  ];

  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-32">
      <div className="bg-[#042f24] pt-32 pb-48 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-islamic-pattern"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white italic mb-6">Congregational Prayers</h1>
          <p className="text-[#d4af37] max-w-2xl mx-auto text-xl font-medium tracking-wide">Timely schedules for your daily spiritual duties at Jamiatul Haq.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-20">
        <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border-[8px] border-white">
          <div className="bg-[#042f24] px-12 py-10 text-white border-b-8 border-[#d4af37]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#d4af37] text-[#042f24] rounded-2xl">
                  <Moon size={32} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-3xl font-black italic">Somerset, NJ</h2>
                  <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Live Schedule</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-white/10 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase">Method: local timing</span>
              </div>
            </div>
          </div>
          
          <div className="bg-islamic-pattern">
            {prayerList.map((p, i) => (
              <div key={p.name} className={`flex items-center justify-between px-12 py-8 group hover:bg-[#d4af37]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#fdfbf7]'} border-b border-[#f0e6d2] last:border-0`}>
                <div>
                  <h3 className="text-2xl font-black text-[#042f24] italic group-hover:text-[#d4af37] transition-colors">{p.name}</h3>
                </div>
                <div className="flex gap-12 md:gap-24">
                  <div className="text-center min-w-[80px]">
                    <span className="text-[10px] uppercase text-[#d4af37] font-black block mb-2 tracking-[0.2em]">Adhan</span>
                    <span className="text-2xl font-black text-[#042f24]">{p.time || '--:--'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#f0e6d2] p-10 flex gap-6 items-start">
            <div className="bg-[#042f24] p-2 rounded-lg text-[#d4af37]">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="font-black text-[#042f24] uppercase text-sm tracking-widest mb-2">Iqamah & Notices</h4>
              <p className="text-gray-700 leading-relaxed italic">
                {prayers.notes || "Iqamah times are generally 15-20 minutes after Adhan."} 
                Doors open 20 minutes before Fajr and close 30 minutes after Isha.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-[#f0e6d2] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 mihrab-shape -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-3xl font-black text-[#042f24] mb-6 italic">Jumu'ah Prayer</h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              Friday Khutbah starts at {prayers.jumua || "1:15 PM"}. We recommend arriving early as the hall fills up quickly. 
            </p>
            <div className="flex items-center gap-3 text-[#d4af37] font-black text-xl italic">
              <Clock size={24} /> {prayers.jumua || "1:15 PM"} Khutbah
            </div>
          </div>
          <div className="bg-[#042f24] p-10 rounded-[3rem] shadow-xl text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-islamic-pattern"></div>
             <h3 className="text-3xl font-black mb-6 italic text-[#d4af37]">Mosque Updates</h3>
             <p className="text-white/70 leading-relaxed mb-8">
               Get real-time iqamah changes and mosque announcements directly on your phone via our WhatsApp community.
             </p>
             {profile?.whatsapp_link ? (
               <a 
                 href={profile.whatsapp_link} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-block bg-[#d4af37] text-[#042f24] px-10 py-4 rounded-full font-black hover:bg-white transition-all uppercase text-sm tracking-widest shadow-lg"
               >
                 Join Community Group
               </a>
             ) : (
               <button 
                 disabled
                 className="bg-white/10 text-white/30 px-10 py-4 rounded-full font-black uppercase text-sm tracking-widest cursor-not-allowed border border-white/10"
               >
                 Link Coming Soon
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPrayerTimes;
