
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, ArrowRight, Phone, Mail, ChevronRight, Heart } from 'lucide-react';
import { fetchPrayerTimes, fetchMasjidProfile, fetchAnnouncements } from '../services/supabase';

const PublicHome = () => {
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetchMasjidProfile().then(({ data }) => setProfile(data));
    fetchPrayerTimes().then(({ data }) => setPrayerTimes(data));
    fetchAnnouncements().then(({ data }) => setAnnouncements(data || []));
  }, []);

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden bg-[#042f24]">
        <img
          src="https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&q=80&w=2070"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply"
          alt="Islamic Society of Franklin Township"
        />

        {/* Mihrab Frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[80%] h-[90%] border-[20px] border-[#d4af37] mihrab-shape"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-1 border-t-2 border-[#d4af37] mb-2"></div>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tight leading-tight italic">
            {profile?.common_name || 'Jamiatul Haq'}
          </h1>
          <p className="text-xl md:text-3xl font-arabic mb-10 text-[#d4af37] tracking-[0.2em] uppercase">
            {profile?.official_name || 'Islamic Society of Franklin Township'}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <Link
              to="/prayer-times"
              className="bg-[#d4af37] text-[#042f24] px-10 py-4 rounded-full font-black shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1 flex items-center gap-3 uppercase text-sm tracking-widest"
            >
              <Clock size={20} /> Prayer Schedule
            </Link>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=385+Lewis+Street+Somerset+NJ+08873"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-10 py-4 rounded-full font-black hover:bg-white/20 transition-all flex items-center gap-3 uppercase text-sm tracking-widest"
            >
              <MapPin size={20} /> Get Directions
            </a>
          </div>
        </div>

        {/* Floating Jumuah Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#042f24] px-8 py-3 rounded-full font-bold shadow-2xl animate-bounce flex items-center gap-2">
          <Heart size={18} fill="currentColor" /> Jumu'ah Prayer: {profile?.jumua_time || '1:15 PM'}
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-4 bg-[#d4af37] bg-islamic-pattern"></div>

      {/* Quick Access Prayer Board */}
      <section className="py-24 bg-[#fdfbf7] relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] font-bold tracking-[0.3em] uppercase text-xs">Assalamu Alaikum</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#042f24] mt-2">Daily Adhan Timings</h2>
            <div className="w-24 h-1 bg-[#d4af37] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: 'Fajr', time: prayerTimes?.fajr || '--', icon: 'dawn' },
              { label: 'Dhuhr', time: prayerTimes?.dhuhr || '--', icon: 'noon' },
              { label: 'Asr', time: prayerTimes?.asr || '--', icon: 'afternoon' },
              { label: 'Maghrib', time: prayerTimes?.maghrib || '--', icon: 'sunset' },
              { label: 'Isha', time: prayerTimes?.isha || '--', icon: 'night' },
            ].map((p, idx) => (
              <div key={p.label} className="group relative">
                <div className="absolute inset-0 bg-[#d4af37] rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                <div className="relative bg-white p-8 rounded-[2.5rem] border-2 border-[#f0e6d2] shadow-sm flex flex-col items-center group-hover:border-[#d4af37] transition-all">
                  <span className="text-xs font-bold text-[#d4af37] mb-4 tracking-widest uppercase">{p.label}</span>
                  <span className="text-3xl font-black text-[#042f24]">{p.time}</span>
                  <div className="w-10 h-[2px] bg-[#f0e6d2] mt-4 group-hover:bg-[#d4af37]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements with Arch UI */}
      <section className="py-24 bg-[#042f24] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-islamic-pattern"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black italic">Latest From Jamiatul Haq</h2>
              <p className="text-[#d4af37] text-lg mt-4 font-medium tracking-wide">Stay connected with our growing community programs.</p>
            </div>
            <Link to="/events" className="bg-[#d4af37] text-[#042f24] px-8 py-3 rounded-full font-bold hover:bg-white transition-colors flex items-center gap-2">
              All Announcements <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {announcements.length > 0 ? announcements.map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border-t-4 border-[#d4af37] p-10 rounded-b-[3rem] hover:bg-white/10 transition-all flex flex-col h-full">
                <span className="text-[#d4af37] font-black text-xs uppercase tracking-[0.2em] mb-4">Announcement</span>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/70 leading-relaxed mb-8 flex-grow">{item.body}</p>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                  <span className="text-white/40">{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</span>
                  <button className="text-[#d4af37] hover:text-white transition-colors">Read More</button>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center text-white/50 italic py-10">
                No announcements at this time.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Spotlight */}
      <section className="py-32 bg-[#fdfbf7] bg-islamic-pattern">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 border-[15px] border-[#d4af37] opacity-20 rounded-full"></div>
              <div className="relative z-10 rounded-t-full rounded-b-[5rem] overflow-hidden border-[10px] border-white shadow-2xl mihrab-shape">
                <img
                  src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=1200"
                  alt="Masjid Interior"
                  className="w-full h-[600px] object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-5xl md:text-7xl font-black text-[#042f24] mb-8 leading-tight italic">
                A Place of <span className="text-[#d4af37]">Sakinah</span> & Service.
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Jamiatul Haq has been the heartbeat of the Somerset community since 2002. Beyond a house of prayer, we are a hub for education, family support, and spiritual growth.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                {[
                  'Educational Programs',
                  'Marriage (Nikah) Services',
                  'Funeral (Janazah) Assistance',
                  'Sisters Only Programs'
                ].map(s => (
                  <div key={s} className="flex items-center gap-4 text-[#042f24] font-black italic">
                    <div className="w-3 h-3 bg-[#d4af37] rounded-full"></div>
                    {s}
                  </div>
                ))}
              </div>
              <Link to="/services" className="inline-block bg-[#042f24] text-white px-12 py-5 rounded-full font-black text-lg shadow-xl hover:bg-[#064e3b] transition-all">
                Explore All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
