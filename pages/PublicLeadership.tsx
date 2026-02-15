
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Loader2, Users, Briefcase, Quote } from 'lucide-react';

const PublicLeadership = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (error) throw error;
        if (data) setLeaders(data);
      } catch (err) {
        console.error("Error fetching leadership data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
      <Loader2 className="animate-spin text-[#d4af37] mb-4" size={48} />
      <p className="text-[#d4af37] font-black uppercase tracking-widest text-[10px]">Assembling the team...</p>
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen">
      {/* Header */}
      <div className="bg-[#042f24] py-32 md:py-48 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-islamic-pattern"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black text-white italic mb-8 tracking-tighter">Our Leadership</h1>
          <p className="text-[#d4af37] text-xl md:text-2xl italic max-w-2xl mx-auto leading-relaxed">
            A dedicated team of scholars and professionals guiding Jamiatul Haq into the future.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        {leaders.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-[#f0e6d2] shadow-sm max-w-4xl mx-auto">
             <Users size={80} className="text-[#d4af37]/10 mx-auto mb-8" />
             <h2 className="text-3xl font-black text-[#042f24] italic">Administrative Directory</h2>
             <p className="text-slate-400 font-medium mt-2">Team profiles are currently being updated. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {leaders.map((leader, i) => (
              <div key={leader.id} className="group animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden mb-12 shadow-2xl border-4 border-white group-hover:border-[#d4af37] transition-all duration-700">
                  <img 
                    src={leader.image_url || `https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=600`} 
                    alt={leader.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Mihrab Corner Ornament */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37] mihrab-shape -rotate-45 translate-x-1/2 -translate-y-1/2 group-hover:rotate-0 group-hover:translate-x-1/4 group-hover:-translate-y-1/4 transition-all duration-700"></div>
                  
                  {/* Badge Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 bg-[#042f24]/90 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <span className="bg-[#d4af37] text-[#042f24] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 inline-block">
                      {leader.role}
                    </span>
                    <h2 className="text-white text-3xl font-black italic leading-tight">{leader.name}</h2>
                  </div>
                </div>

                <div className="px-6 relative">
                  <Quote className="text-[#d4af37]/20 absolute -top-4 -left-2" size={48} />
                  <p className="text-slate-500 text-lg italic leading-relaxed relative z-10">
                    "{leader.bio || 'Guided by faith and dedicated to serving the Somerset community through education and outreach.'}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Philosophy Section */}
        <div className="mt-48 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div className="p-16 lg:p-24 bg-[#042f24] rounded-[5rem] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-5 bg-islamic-pattern"></div>
              <h3 className="text-4xl font-black text-[#d4af37] italic mb-8 flex items-center gap-4">
                <Users size={40} /> Collective Leadership
              </h3>
              <p className="text-xl text-white/70 leading-relaxed italic mb-10">
                Our board operates on the principle of Shura (consultation), ensuring that every decision made for Jamiatul Haq reflects the needs and values of our entire community.
              </p>
              <div className="grid grid-cols-2 gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37]">
                 <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#d4af37]"></div> Integrity</div>
                 <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#d4af37]"></div> Transparency</div>
                 <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#d4af37]"></div> Service</div>
                 <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#d4af37]"></div> Dedication</div>
              </div>
           </div>
           
           <div className="p-16 lg:p-24 bg-white rounded-[5rem] border-4 border-[#f0e6d2] shadow-sm flex flex-col justify-center">
              <span className="text-[#d4af37] font-black uppercase tracking-[0.4em] text-[10px] mb-4">Established 2002</span>
              <h3 className="text-4xl font-black text-[#042f24] italic mb-6">A Legacy of Service</h3>
              <p className="text-slate-500 text-lg leading-relaxed italic">
                From our founding, the Islamic Society of Franklin Township has been blessed with leaders who prioritize spiritual growth and community welfare. We continue that tradition today with a focus on education, social services, and interfaith dialogue.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLeadership;
