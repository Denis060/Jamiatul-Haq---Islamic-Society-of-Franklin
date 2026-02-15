
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Loader2, Users } from 'lucide-react';

const PublicLeadership = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      const { data } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true });
      if (data) setLeaders(data);
      setLoading(false);
    };
    fetchLeaders();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <Loader2 className="animate-spin text-[#d4af37]" size={48} />
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen">
      <div className="bg-[#042f24] py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-islamic-pattern"></div>
        <h1 className="text-5xl md:text-7xl font-black text-white italic mb-6">Leadership</h1>
        <p className="text-[#d4af37] max-w-2xl mx-auto text-xl">Guided by knowledge and dedicated to community service.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-24">
        {leaders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[4rem] border-2 border-[#f0e6d2] shadow-sm">
             <Users size={64} className="text-[#d4af37]/10 mx-auto mb-6" />
             <h2 className="text-2xl font-black text-[#042f24] italic">Administrative updates in progress</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {leaders.map((leader, i) => (
              <div key={leader.id} className="group">
                <div className="relative overflow-hidden rounded-[3.5rem] mb-10 shadow-sacred aspect-[4/5] border-4 border-[#f0e6d2] group-hover:border-[#d4af37] transition-all duration-500">
                  <img 
                    src={leader.image_url || `https://picsum.photos/400/500?grayscale&random=${i}`} 
                    alt={leader.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#042f24] via-transparent to-transparent flex items-end p-12">
                    <div>
                      <span className="text-[#d4af37] font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">{leader.role}</span>
                      <h2 className="text-white text-4xl font-black italic">{leader.name}</h2>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border-2 border-[#f0e6d2] shadow-sm relative">
                  <div className="absolute -top-4 left-10 w-8 h-8 bg-[#d4af37] mihrab-shape"></div>
                  <p className="text-slate-600 leading-relaxed text-lg italic">
                    "{leader.bio}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-32 p-16 bg-white rounded-[4rem] border-2 border-[#f0e6d2] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 mihrab-shape translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-3xl font-black text-[#042f24] mb-6 italic">A Legacy of Service</h3>
          <p className="text-slate-500 max-w-4xl mx-auto text-lg leading-relaxed italic">
            Since our establishment in November 2002, our leadership has focused on building an inclusive community based on Islamic values of charity, knowledge, and mutual respect. We welcome all who seek to learn and grow in their faith.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicLeadership;
