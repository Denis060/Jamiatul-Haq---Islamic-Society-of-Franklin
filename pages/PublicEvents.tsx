
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Clock, Loader2, ImageIcon } from 'lucide-react';
import { supabase } from '../services/supabase';
import { Event } from '../types';

const PublicEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('start_time', { ascending: true });
      
      if (data) setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <Loader2 className="animate-spin text-[#d4af37]" size={48} />
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-32">
      <div className="bg-[#042f24] pt-32 pb-48 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-islamic-pattern"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-8xl font-black text-white italic mb-6 tracking-tighter">Community Programs</h1>
          <p className="text-[#d4af37] max-w-2xl mx-auto text-xl font-medium tracking-wide">Join us in learning, growth, and community bonding.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        {events.length === 0 ? (
          <div className="bg-white rounded-[4rem] p-32 text-center shadow-2xl border-2 border-[#f0e6d2]">
             <Calendar size={64} className="text-slate-100 mx-auto mb-6" />
             <h2 className="text-3xl font-black text-[#042f24] italic">No programs scheduled yet</h2>
             <p className="text-slate-400 font-medium mt-2">Check back soon for upcoming community events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {events.map((e) => (
              <div key={e.id} className="bg-white rounded-[4rem] overflow-hidden border-2 border-[#f0e6d2] flex flex-col lg:flex-row shadow-xl hover:shadow-2xl transition-all group">
                <div className="lg:w-1/2 h-80 lg:h-auto bg-[#042f24] relative overflow-hidden">
                  {e.cover_image_url ? (
                    <img src={e.cover_image_url} alt={e.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#d4af37]/20 bg-islamic-pattern opacity-30">
                      <ImageIcon size={100} />
                    </div>
                  )}
                  <div className="absolute top-10 left-10">
                    <div className="bg-[#d4af37] text-[#042f24] px-6 py-3 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl">
                       {new Date(e.start_time).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-16 lg:p-24 flex flex-col justify-between bg-white relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 mihrab-shape -translate-y-1/2 translate-x-1/2"></div>
                  <div>
                    <h3 className="text-4xl lg:text-5xl font-black text-[#042f24] leading-tight mb-8 italic">{e.title}</h3>
                    <div className="flex flex-wrap gap-10 mb-10 text-[#d4af37] font-black uppercase text-xs tracking-widest">
                      <span className="flex items-center gap-3"><Clock size={20} /> {new Date(e.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-3"><MapPin size={20} /> {e.location}</span>
                    </div>
                    <p className="text-slate-500 text-lg leading-relaxed mb-12 italic line-clamp-4">
                      {e.description}
                    </p>
                  </div>
                  <Link to={`/events/${e.slug}`} className="flex items-center gap-3 text-[#042f24] font-black uppercase tracking-widest text-xs hover:text-[#d4af37] transition-colors group/btn">
                    Program Details <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEvents;
