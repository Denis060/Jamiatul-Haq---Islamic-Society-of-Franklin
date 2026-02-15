
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, MOCK_PROFILE } from '../services/supabase';
import { Loader2, Megaphone, Calendar, Pin, Info, Sparkles, Download } from 'lucide-react';

const PublicAnnouncements = () => {
  const [news, setNews] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const [newsRes, profileRes] = await Promise.all([
          supabase
            .from('announcements')
            .select('*')
            .eq('status', 'published')
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: false }),
          supabase.from('masjid_profile').select('*').single()
        ]);
        
        if (newsRes.error) throw newsRes.error;
        setNews(newsRes.data || []);
        setProfile(profileRes.data || MOCK_PROFILE);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
      <Loader2 className="animate-spin text-[#d4af37] mb-4" size={48} />
      <p className="text-[#d4af37] font-black uppercase tracking-widest text-[10px]">Loading news feed...</p>
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-32">
      <div className="bg-[#042f24] py-32 md:py-48 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-islamic-pattern pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black text-white italic mb-8 tracking-tighter leading-none">News & Alerts</h1>
          <p className="text-[#d4af37] text-xl md:text-2xl italic max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest community messages, spiritual reminders, and Ramadan news.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
        {news.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-[#f0e6d2] shadow-2xl">
             <Megaphone size={80} className="text-[#d4af37]/10 mx-auto mb-8" />
             <h2 className="text-3xl font-black text-[#042f24] italic">No active news</h2>
             <p className="text-slate-400 font-medium mt-2 italic">Follow our WhatsApp group for real-time alerts.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {news.map((item, i) => (
              <div 
                key={item.id} 
                className={`group bg-white rounded-[4rem] border-2 overflow-hidden shadow-sm transition-all flex flex-col lg:flex-row relative animate-in fade-in slide-in-from-bottom-10 duration-700 ${
                  item.is_pinned ? 'border-[#d4af37] shadow-xl ring-4 ring-[#d4af37]/5' : 'border-[#f0e6d2] hover:border-[#d4af37]'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {item.is_pinned && (
                  <div className="absolute top-8 left-8 z-30">
                     <span className="bg-[#d4af37] text-[#042f24] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-2xl animate-pulse">
                       <Pin size={12} fill="currentColor" /> Urgent Update
                     </span>
                  </div>
                )}

                {item.image_url && (
                  <div className="lg:w-1/3 aspect-[4/5] lg:aspect-auto relative overflow-hidden bg-slate-50 border-r border-[#f0e6d2]">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent pointer-events-none"></div>
                  </div>
                )}

                <div className={`flex-1 p-12 lg:p-20 flex flex-col justify-center relative ${item.image_url ? '' : 'lg:w-full'}`}>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 mihrab-shape -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                   
                   <div className="flex flex-wrap items-center gap-6 mb-8">
                     <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-[0.4em] bg-[#fdfbf7] px-6 py-2 rounded-full border border-[#f0e6d2]">
                       {item.type}
                     </span>
                     <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] flex items-center gap-2">
                       <Calendar size={14} /> {new Date(item.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                     </span>
                   </div>

                   <h2 className="text-4xl lg:text-5xl font-black text-[#042f24] italic leading-tight mb-8 group-hover:text-[#d4af37] transition-colors">{item.title}</h2>
                   <p className="text-slate-500 text-lg lg:text-xl italic leading-relaxed whitespace-pre-wrap mb-10">
                     {item.body}
                   </p>

                   {item.type === 'Ramadan' && (
                     <div className="p-8 bg-emerald-50 rounded-[2.5rem] border-2 border-emerald-100 flex items-center gap-6 group/box hover:bg-emerald-100 transition-colors">
                        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl">
                           <Sparkles size={24} />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-black text-[#042f24] uppercase text-[10px] tracking-widest mb-1">Ramadan Mubarak</h4>
                           <p className="text-emerald-800 text-sm font-bold italic leading-tight">Click for the full prayer and Iftar schedule.</p>
                        </div>
                        <Link to="/ramadan" className="p-4 bg-white text-emerald-600 rounded-2xl shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
                           <Download size={20} />
                        </Link>
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-32 p-16 bg-[#042f24] rounded-[5rem] text-white relative overflow-hidden shadow-2xl text-center border-4 border-[#064e3b]">
           <div className="absolute inset-0 opacity-5 bg-islamic-pattern pointer-events-none"></div>
           
           <div className="relative z-20">
             <Info size={48} className="text-[#d4af37] mx-auto mb-8" />
             <h3 className="text-4xl font-black italic text-[#d4af37] mb-6">Never Miss an Update</h3>
             <p className="text-xl text-white/60 italic leading-relaxed max-w-2xl mx-auto mb-10">
               For the most immediate news including moon sighting results and emergency closures, please join our official WhatsApp Community.
             </p>
             {profile?.whatsapp_link ? (
               <a 
                href={profile.whatsapp_link} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block relative z-30 bg-[#d4af37] text-[#042f24] px-12 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl"
               >
                 Join WhatsApp Community
               </a>
             ) : (
               <button 
                disabled
                className="inline-block relative z-30 bg-white/10 text-white/30 px-12 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] cursor-not-allowed border border-white/10"
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

export default PublicAnnouncements;
