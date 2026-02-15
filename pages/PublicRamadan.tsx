
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, MOCK_PROFILE } from '../services/supabase';
import { 
  Moon, Sun, Utensils, UserCheck, Calendar, Clock, 
  Sparkles, Loader2, Pin, ArrowRight, Star, Heart, AlertTriangle, Database, MessageSquare, CheckCircle, Info
} from 'lucide-react';

const PublicRamadan = () => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'available'>('all');

  useEffect(() => {
    const fetchRamadanData = async () => {
      try {
        const [scheduleRes, profileRes] = await Promise.all([
          supabase.from('ramadan_schedule').select('*').order('day_number', { ascending: true }),
          supabase.from('masjid_profile').select('*').single()
        ]);
        
        if (scheduleRes.error) throw scheduleRes.error;
        setSchedule(scheduleRes.data || []);
        setProfile(profileRes.data || MOCK_PROFILE);
      } catch (err: any) {
        console.error("Error fetching Ramadan data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRamadanData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
      <Loader2 className="animate-spin text-[#d4af37] mb-4" size={48} />
      <p className="text-[#d4af37] font-black uppercase tracking-widest text-[10px]">Preparing the Ramadan Hub...</p>
    </div>
  );

  if (error && (error.includes('PGRST205') || error.includes('not find the table'))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-4">
        <div className="max-w-xl w-full bg-white p-12 rounded-[4rem] border-4 border-dashed border-[#f0e6d2] text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Database size={40} />
          </div>
          <h2 className="text-3xl font-black text-[#042f24] italic mb-4">Database Setup Required</h2>
          <p className="text-slate-500 italic mb-8">
            The Iftar schedule table has not been created in your database yet.
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl text-left mb-8 border border-slate-100">
             <p className="text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-2">Instructions for Admin:</p>
             <ol className="text-xs font-bold text-slate-600 space-y-2 list-decimal ml-4">
               <li>Copy the SQL code from <strong>schema.sql</strong> in the project.</li>
               <li>Go to your Supabase Dashboard SQL Editor.</li>
               <li>Paste the code and click <strong>Run</strong>.</li>
               <li>Refresh this page.</li>
             </ol>
          </div>
        </div>
      </div>
    );
  }

  const filteredSchedule = filter === 'available' 
    ? schedule.filter(s => !s.is_sponsored) 
    : schedule;

  // Smart Date Logic
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const foundToday = schedule.find(s => s.gregorian_date === todayStr);
  const todayInfo = foundToday || (schedule.length > 0 ? schedule[0] : null);
  const isCurrentlyRamadan = !!foundToday;
  const currentYear = today.getFullYear();

  const adminPhone = profile?.phone?.replace(/[^0-9]/g, '') || '17323225221';

  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-32">
      <div className="bg-[#042f24] py-32 md:py-48 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-islamic-pattern pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[#d4af37] shadow-2xl">
               <Moon size={64} fill="currentColor" className="animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white italic mb-8 tracking-tighter leading-none">Ramadan Hub</h1>
          <p className="text-[#d4af37] text-xl md:text-2xl italic max-w-2xl mx-auto leading-relaxed">
            "O you who believe! Fasting is prescribed to you as it was prescribed to those before you, that you may attain Taqwa." (2:183)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
           <div className="bg-white p-12 rounded-[3.5rem] border-2 border-[#f0e6d2] shadow-2xl text-center flex flex-col items-center">
              <Sun className="text-[#d4af37] mb-6" size={48} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2">Suhoor Ends</h3>
              <p className="text-4xl font-black text-[#042f24] italic">{todayInfo?.suhoor_time || '--:--'}</p>
           </div>
           
           <div className="bg-[#042f24] p-12 rounded-[4rem] border-4 border-[#d4af37] shadow-2xl text-center flex flex-col items-center text-white scale-110">
              <div className="bg-[#d4af37] text-[#042f24] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
                RAMADAN {currentYear}
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#d4af37] mb-2">
                {isCurrentlyRamadan ? "Tonight's Iftar" : "Upcoming: Day 1 Iftar"}
              </h3>
              <p className="text-5xl font-black italic mb-2">{todayInfo?.iftar_time || '--:--'}</p>
              <p className="text-[10px] font-bold text-white/40 uppercase">Somerset local time</p>
           </div>

           <div className="bg-white p-12 rounded-[3.5rem] border-2 border-[#f0e6d2] shadow-2xl text-center flex flex-col items-center">
              <Utensils className="text-[#d4af37] mb-6" size={48} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2">Iftar / Maghrib</h3>
              <p className="text-4xl font-black text-[#042f24] italic">{todayInfo?.iftar_time || '--:--'}</p>
           </div>
        </div>

        <div className="mb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="bg-[#042f24] p-10 rounded-[3rem] text-white flex items-start gap-6 relative overflow-hidden group border-2 border-[#d4af37]/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 mihrab-shape -rotate-12 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="p-4 bg-[#d4af37] text-[#042f24] rounded-2xl shadow-xl font-black">1</div>
              <div>
                <h4 className="text-xl font-black italic text-[#d4af37] mb-2">Select a Date</h4>
                <p className="text-sm text-white/60 italic leading-relaxed">Browse the calendar below to find an available night for Iftar sponsorship.</p>
              </div>
           </div>
           <div className="bg-[#042f24] p-10 rounded-[3rem] text-white flex items-start gap-6 relative overflow-hidden group border-2 border-[#d4af37]/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 mihrab-shape -rotate-12 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="p-4 bg-[#d4af37] text-[#042f24] rounded-2xl shadow-xl font-black">2</div>
              <div>
                <h4 className="text-xl font-black italic text-[#d4af37] mb-2">WhatsApp Admin</h4>
                <p className="text-sm text-white/60 italic leading-relaxed">Click "Sponsor Now" to notify the board. Finalize the menu or donation amount.</p>
              </div>
           </div>
           <div className="bg-[#042f24] p-10 rounded-[3rem] text-white flex items-start gap-6 relative overflow-hidden group border-2 border-[#d4af37]/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 mihrab-shape -rotate-12 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="p-4 bg-[#d4af37] text-[#042f24] rounded-2xl shadow-xl font-black">3</div>
              <div>
                <h4 className="text-xl font-black italic text-[#d4af37] mb-2">We Publish</h4>
                <p className="text-sm text-white/60 italic leading-relaxed">Once confirmed, your name (or family name) will appear on the calendar below.</p>
              </div>
           </div>
        </div>

        <div className="bg-[#fdfbf7] p-16 rounded-[4rem] border-2 border-[#f0e6d2] mb-12 flex flex-col lg:flex-row justify-between items-center gap-10">
           <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-4xl font-black text-[#042f24] italic mb-4">Iftar Calendar</h2>
              <p className="text-slate-500 italic leading-relaxed">
                Hosting an Iftar is a beautiful way to gain reward. The Prophet (PBUH) said: "Whoever feeds a fasting person will have a reward like that of the fasting person..."
              </p>
           </div>
           <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setFilter('all')}
                className={`px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all ${filter === 'all' ? 'bg-[#042f24] text-[#d4af37]' : 'bg-white text-slate-400 border-2'}`}
              >
                Full Month
              </button>
              <button 
                onClick={() => setFilter('available')}
                className={`px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all ${filter === 'available' ? 'bg-[#d4af37] text-[#042f24]' : 'bg-white text-slate-400 border-2'}`}
              >
                Available Only
              </button>
           </div>
        </div>

        {schedule.length === 0 ? (
           <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-[#f0e6d2] shadow-sm">
             <Calendar size={64} className="text-[#d4af37]/20 mx-auto mb-6" />
             <h2 className="text-2xl font-black text-[#042f24] italic">Schedule being finalized</h2>
             <p className="text-slate-400 font-medium italic">Please check back closer to the start of Ramadan.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredSchedule.map((day) => (
               <div 
                key={day.id} 
                className={`bg-white rounded-[3.5rem] border-2 overflow-hidden shadow-sm transition-all group relative animate-in zoom-in-95 duration-500 ${
                  day.is_sponsored ? 'border-[#f0e6d2] grayscale-[0.3]' : 'border-[#d4af37] ring-4 ring-[#d4af37]/5'
                }`}
               >
                  <div className="absolute top-8 right-8 text-[#d4af37]/10 mihrab-shape w-32 h-32 -z-0 pointer-events-none"></div>
                  
                  <div className="p-10 relative z-10">
                     <div className="flex justify-between items-start mb-8">
                        <div className="bg-[#042f24] text-white px-5 py-2 rounded-2xl font-black text-xl italic shadow-xl">
                          {day.day_number}
                        </div>
                        <div className="text-right">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Date</h4>
                           <p className="text-sm font-black text-[#042f24] italic">
                              {new Date(day.gregorian_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })}
                           </p>
                        </div>
                     </div>

                     <div className="space-y-6 mb-10">
                        <div className="flex justify-between items-center bg-[#fdfbf7] p-4 rounded-2xl border border-slate-50">
                           <span className="text-[9px] font-black uppercase tracking-widest text-[#d4af37] flex items-center gap-2">
                              <Clock size={12} /> Suhoor Ends
                           </span>
                           <span className="font-black text-[#042f24]">{day.suhoor_time}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#fdfbf7] p-4 rounded-2xl border border-slate-50">
                           <span className="text-[9px] font-black uppercase tracking-widest text-[#d4af37] flex items-center gap-2">
                              <Sparkles size={12} /> Iftar Time
                           </span>
                           <span className="font-black text-[#042f24]">{day.iftar_time}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#fdfbf7] p-4 rounded-2xl border border-slate-50">
                           <span className="text-[9px] font-black uppercase tracking-widest text-[#d4af37] flex items-center gap-2">
                              <Star size={12} fill="currentColor" /> Taraweeh
                           </span>
                           <span className="font-black text-[#042f24] text-[10px] uppercase truncate max-w-[120px]">{day.taraweeh_imam || 'Qari'}</span>
                        </div>
                     </div>

                     <div className="pt-8 border-t-2 border-slate-50">
                        {day.is_sponsored ? (
                          <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-[2rem] border border-emerald-100/50">
                             <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
                                <CheckCircle size={20} />
                             </div>
                             <div className="flex-1 min-w-0">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Sponsored By</h5>
                                <p className="text-sm font-black text-[#042f24] truncate italic leading-none mt-1">{day.iftar_sponsor}</p>
                             </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                             <div className="flex items-center gap-4 opacity-40 px-2">
                                <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                                   <Heart size={20} />
                                </div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Available to Sponsor</h5>
                             </div>
                             <a 
                              href={`https://wa.me/${adminPhone}?text=Asalamu%20Alaikum,%20I%20would%20like%20to%20sponsor%20Iftar%20at%20Jamiatul%20Haq%20for%20Ramadan%20Day%20${day.day_number}%20(${new Date(day.gregorian_date).toLocaleDateString()}).%20Please%20let%20me%20know%20the%20next%20steps.%20JazakAllah%20Khair.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-5 bg-[#d4af37] text-[#042f24] rounded-[2rem] font-black uppercase tracking-widest text-[10px] text-center hover:bg-[#042f24] hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 relative z-10"
                             >
                               <MessageSquare size={16} /> Sponsor Now
                             </a>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}

        <div className="mt-20 p-16 bg-[#042f24] rounded-[4rem] text-white text-center border-4 border-[#064e3b] shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 opacity-5 bg-islamic-pattern pointer-events-none"></div>
           <div className="relative z-20">
             <Info size={40} className="text-[#d4af37] mx-auto mb-6" />
             <p className="text-xl italic leading-relaxed text-white/60 max-w-2xl mx-auto mb-8">
               All timings are calculated for Somerset, NJ. For moon sighting results and emergency alerts, please join our WhatsApp Community.
             </p>
             <Link to="/contact" className="inline-block text-[#d4af37] font-black uppercase tracking-widest text-[10px] border-b-2 border-[#d4af37] pb-1 hover:text-white hover:border-white transition-all">
               Contact Admin Office
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublicRamadan;
