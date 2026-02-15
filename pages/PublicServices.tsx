
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  Users, Heart, GraduationCap, Home, Clock, Star, Landmark, Loader2
} from 'lucide-react';

const PublicServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (data) setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const getIcon = (name: string) => {
    switch (name?.toLowerCase()) {
      case 'clock': return <Clock className="text-[#d4af37]" size={40} />;
      case 'heart': return <Heart className="text-[#d4af37]" size={40} />;
      case 'graduation': return <GraduationCap className="text-[#d4af37]" size={40} />;
      case 'home': return <Home className="text-[#d4af37]" size={40} />;
      case 'users': return <Users className="text-[#d4af37]" size={40} />;
      default: return <Star className="text-[#d4af37]" size={40} />;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <Loader2 className="animate-spin text-[#d4af37]" size={48} />
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen">
      <div className="bg-[#042f24] py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-islamic-pattern"></div>
        <h1 className="text-5xl md:text-7xl font-black text-white italic mb-6">Our Services</h1>
        <p className="text-[#d4af37] max-w-2xl mx-auto text-xl">Providing spiritual and social support to the Somerset community since 2002.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => (
            <div key={service.id} className="p-12 bg-white rounded-[3.5rem] border-2 border-[#f0e6d2] shadow-sm hover:shadow-2xl hover:border-[#d4af37] transition-all group">
              <div className="mb-8 p-6 bg-[#fdfbf7] rounded-[2rem] inline-block group-hover:scale-110 transition-transform">
                {getIcon(service.icon_name)}
              </div>
              <h3 className="text-3xl font-black text-[#042f24] mb-4 italic">{service.title}</h3>
              <p className="text-slate-500 leading-relaxed italic">{service.description}</p>
            </div>
          ))}
          {services.length === 0 && (
             <div className="col-span-full text-center py-20 text-slate-300 font-bold uppercase tracking-widest">
               No services listed yet.
             </div>
          )}
        </div>

        <div className="mt-32 bg-[#042f24] rounded-[4rem] p-16 lg:p-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 mihrab-shape -rotate-12 translate-x-1/3 -translate-y-1/3"></div>
          <div className="flex-1 text-white relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black italic mb-8 flex items-center gap-4">
              <Landmark size={48} className="text-[#d4af37]" /> Masjid Facilities
            </h2>
            <p className="text-white/70 mb-12 text-xl italic leading-relaxed">
              Jamiatul Haq is equipped with modern facilities to ensure our community members can worship comfortably.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {['Ample Parking', 'Dedicated Wudu Area', 'Sisters Prayer Hall', 'Islamic Library'].map((f, i) => (
                <div key={i} className="bg-white/5 border border-white/10 px-8 py-5 rounded-2xl flex items-center gap-4 font-black uppercase tracking-widest text-[10px] text-[#d4af37]">
                  <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/3 relative">
            <div className="absolute -inset-4 bg-[#d4af37]/20 rounded-[3rem] rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800" 
              className="rounded-[3rem] shadow-2xl w-full h-96 object-cover relative z-10"
              alt="Masjid Interior"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicServices;
