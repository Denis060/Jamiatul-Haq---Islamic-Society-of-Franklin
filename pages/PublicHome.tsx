
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, ArrowRight, Heart, Loader2, ImageIcon, Megaphone, Sparkles, Pin, Moon } from 'lucide-react';
import { supabase, MOCK_PROFILE, MOCK_PRAYER_TIMES } from '../services/supabase';
import { MasjidProfile, PrayerTimes, Event } from '../types';
import SEO from '../components/SEO';

const PublicHome = () => {
  const [profile, setProfile] = useState<any>(null);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [profRes, prayRes, eventRes, newsRes] = await Promise.all([
          supabase.from('masjid_profile').select('*').single(),
          supabase.from('prayer_times_weekly').select('*').single(),
          supabase.from('events').select('*').eq('status', 'published').order('start_time', { ascending: true }).limit(3),
          supabase.from('announcements').select('*').eq('status', 'published').order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(2)
        ]);

        setProfile(profRes.data || MOCK_PROFILE);
        setPrayerTimes(prayRes.data || MOCK_PRAYER_TIMES);
        if (eventRes.data) setEvents(eventRes.data);
        if (newsRes.data) setLatestNews(newsRes.data);

      } catch (err) {
        console.error("Supabase error, using fallbacks:", err);
        setProfile(MOCK_PROFILE);
        setPrayerTimes(MOCK_PRAYER_TIMES);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#042f24]">
      <Loader2 className="animate-spin text-[#d4af37] mb-4" size={64} />
      <p className="text-[#d4af37] font-black tracking-widest uppercase text-xs mt-4 animate-pulse">Bismillah...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-0">
      <SEO
        title="Home"
        description={`Welcome to ${profile?.common_name || 'Jamiatul Haq'}, a beacon of faith and service in Franklin Township, NJ. Join us for daily prayers, community events, and spiritual growth.`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Mosque",
          "name": profile?.common_name || "Jamiatul Haq",
          "alternateName": profile?.official_name,
          "url": "https://jamiatul-haq.org",
          "logo": "https://jamiatul-haq.org/logo.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": profile?.address || "385 Lewis Street",
            "addressLocality": "Somerset",
            "addressRegion": "NJ",
            "postalCode": "08873",
            "addressCountry": "US"
          },
          "telephone": profile?.phone || "+1-732-322-5221",
          "email": profile?.email || "aksavage68@gmail.com",
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "40.4868",
            "longitude": "-74.4815"
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": "05:00",
              "closes": "22:00"
            }
          ]
        }}
      />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden bg-[#042f24]">
        <img
          src="https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&q=80&w=2070"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply"
          alt="Islamic Society of Franklin Township"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[80%] h-[90%] border-[20px] border-[#d4af37] mihrab-shape"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tight leading-tight italic">
            {profile?.common_name || 'Jamiatul Haq'}
          </h1>
          <p className="text-xl md:text-3xl font-arabic mb-10 text-[#d4af37] tracking-[0.2em] uppercase">
            {profile?.official_name || 'Islamic Society of Franklin Township'}
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <Link to="/prayer-times" className="bg-[#d4af37] text-[#042f24] px-10 py-4 rounded-full font-black shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1 flex items-center gap-3 uppercase text-sm tracking-widest">
              <Clock size={20} /> Prayer Schedule
            </Link>
            <Link to="/ramadan" className="bg-white/10 backdrop-blur-md border-2 border-[#d4af37] text-white px-10 py-4 rounded-full font-black hover:bg-[#d4af37] hover:text-[#042f24] transition-all flex items-center gap-3 uppercase text-sm tracking-widest">
              <Moon size={20} /> Ramadan Hub
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#042f24] px-8 py-3 rounded-full font-bold shadow-2xl animate-bounce flex items-center gap-2">
          <Heart size={18} fill="currentColor" /> Jumu'ah: {prayerTimes?.jumua || profile?.jumua_time || '1:15 PM'}
        </div>
      </section>

      {/* Ramadan Special CTA */}
      <section className="bg-emerald-950 py-16 border-b-4 border-[#d4af37]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#d4af37] text-[#042f24] rounded-3xl shadow-sacred">
              <Moon size={40} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white italic">Ramadan is Approaching</h2>
              <p className="text-[#d4af37] font-bold italic">Check the Iftar schedule and sponsorship opportunities.</p>
            </div>
          </div>
          <Link to="/ramadan" className="bg-[#d4af37] text-[#042f24] px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-2xl">
            Enter Ramadan Portal
          </Link>
        </div>
      </section>

      {/* News & Announcements Bar / Section */}
      {latestNews.length > 0 && (
        <section className="py-24 bg-[#042f24] relative overflow-hidden border-y-4 border-[#d4af37]">
          <div className="absolute inset-0 opacity-5 bg-islamic-pattern"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
              <div>
                <span className="text-[#d4af37] font-black uppercase tracking-[0.4em] text-[10px] block mb-2">Notice Board</span>
                <h2 className="text-4xl md:text-6xl font-black text-white italic">News & Alerts</h2>
              </div>
              <Link to="/announcements" className="text-[#d4af37] font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:text-white transition-colors">
                Read All Updates <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {latestNews.map((news) => (
                <Link to="/announcements" key={news.id} className={`group bg-white/5 backdrop-blur-md p-10 rounded-[3.5rem] border-2 transition-all hover:bg-white/10 ${news.is_pinned ? 'border-[#d4af37]' : 'border-white/10'
                  }`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-[#d4af37] text-[#042f24] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                      {news.type === 'Ramadan' ? <Sparkles size={12} /> : news.is_pinned ? <Pin size={12} /> : <Megaphone size={12} />}
                      {news.type}
                    </span>
                    <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">
                      {new Date(news.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white italic mb-4 leading-tight group-hover:text-[#d4af37] transition-colors">{news.title}</h3>
                  <p className="text-white/50 text-sm italic leading-relaxed line-clamp-2">"{news.body}"</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prayer Board */}
      <section className="py-24 bg-[#fdfbf7] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 mihrab-shape -rotate-45 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] font-bold tracking-[0.3em] uppercase text-[10px]">Today's Schedule</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#042f24] mt-2 italic">Daily Adhan</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: 'Fajr', time: prayerTimes?.fajr },
              { label: 'Dhuhr', time: prayerTimes?.dhuhr },
              { label: 'Asr', time: prayerTimes?.asr },
              { label: 'Maghrib', time: prayerTimes?.maghrib },
              { label: 'Isha', time: prayerTimes?.isha },
            ].map((p) => (
              <div key={p.label} className="bg-white p-10 rounded-[3rem] border-2 border-[#f0e6d2] shadow-sm flex flex-col items-center hover:border-[#d4af37] transition-all group">
                <span className="text-[10px] font-black text-[#d4af37] mb-4 tracking-[0.2em] uppercase">{p.label}</span>
                <span className="text-3xl font-black text-[#042f24] group-hover:scale-110 transition-transform">{p.time || '--:--'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-32 bg-[#042f24] text-white relative">
        <div className="absolute inset-0 opacity-5 bg-islamic-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <span className="text-[#d4af37] font-black uppercase tracking-[0.4em] text-[10px] block mb-4">Community</span>
              <h2 className="text-4xl md:text-7xl font-black italic">Upcoming Programs</h2>
            </div>
            <Link to="/events" className="bg-[#d4af37] text-[#042f24] px-10 py-4 rounded-full font-black flex items-center gap-2 hover:bg-white transition-all uppercase text-xs tracking-widest shadow-2xl">
              See All Events <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="bg-white/5 backdrop-blur-sm border-t-8 border-[#d4af37] p-12 rounded-b-[4rem] flex flex-col h-full hover:bg-white/10 transition-colors group">
                  <h3 className="text-2xl font-black mb-6 italic text-[#d4af37] group-hover:text-white transition-colors">{event.title}</h3>
                  <p className="text-white/60 line-clamp-3 mb-10 flex-grow italic text-sm leading-relaxed">{event.description}</p>
                  <div className="pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                    <span className="text-white/30">{new Date(event.start_time).toLocaleDateString()}</span>
                    <Link to={`/events/${event.slug}`} className="text-[#d4af37] hover:underline">Details</Link>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border-t-8 border-white/10 p-12 rounded-b-[4rem] opacity-40">
                  <div className="h-6 w-3/4 bg-white/10 rounded mb-4"></div>
                  <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-white/10 rounded"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
