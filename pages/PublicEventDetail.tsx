
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Event } from '../types';
import { 
  Calendar, MapPin, Clock, ArrowLeft, Loader2, 
  ImageIcon, Share2, MessageCircle, CalendarPlus, Check 
} from 'lucide-react';

const PublicEventDetail = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCalendar = () => {
    if (!event) return;

    const startDate = new Date(event.start_time);
    // Assume 2 hour duration if end_time isn't provided
    const endDate = event.end_time ? new Date(event.end_time) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const shareData = {
      title: event?.title || 'Community Event',
      text: `Join us for ${event?.title} at Jamiatul Haq!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Failed to copy link', err);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <Loader2 className="animate-spin text-[#d4af37]" size={48} />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] p-4 text-center">
      <h1 className="text-3xl font-black text-[#042f24] mb-4 italic">Event not found</h1>
      <Link to="/events" className="text-[#d4af37] font-black uppercase tracking-widest text-xs flex items-center gap-2">
        <ArrowLeft size={16} /> Back to All Events
      </Link>
    </div>
  );

  const eventDate = new Date(event.start_time);

  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-32">
      {/* Hero Header */}
      <div className="relative h-[60vh] md:h-[70vh] bg-[#042f24] overflow-hidden">
        {event.cover_image_url ? (
          <img 
            src={event.cover_image_url} 
            alt={event.title} 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-10 bg-islamic-pattern">
            <ImageIcon size={120} className="text-[#d4af37]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#042f24] via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/events" 
              className="inline-flex items-center gap-2 text-[#d4af37] font-black uppercase tracking-[0.3em] text-[10px] mb-8 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Back to Events
            </Link>
            <h1 className="text-4xl md:text-8xl font-black text-white italic mb-8 tracking-tighter leading-none">{event.title}</h1>
            
            <div className="flex flex-wrap gap-8 text-white/80 font-black uppercase text-xs tracking-widest">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-6 py-3 rounded-2xl border border-white/10">
                <Calendar className="text-[#d4af37]" size={20} />
                {eventDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-6 py-3 rounded-2xl border border-white/10">
                <Clock className="text-[#d4af37]" size={20} />
                {eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-6 py-3 rounded-2xl border border-white/10">
                <MapPin className="text-[#d4af37]" size={20} />
                {event.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-12 md:p-20 rounded-[4rem] border-2 border-[#f0e6d2] shadow-sm relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 mihrab-shape -translate-y-1/2 translate-x-1/2"></div>
              <h2 className="text-3xl font-black text-[#042f24] italic mb-10 pb-6 border-b-4 border-[#d4af37]/10">About this Program</h2>
              <div className="prose prose-xl prose-emerald text-slate-600 italic leading-relaxed whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6">
               <button 
                onClick={handleAddToCalendar}
                className="bg-[#042f24] text-[#d4af37] px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"
               >
                  <CalendarPlus size={18} /> Add to Calendar
               </button>
               <button 
                onClick={handleShare}
                className={`bg-white text-[#042f24] border-2 px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-sm hover:border-[#d4af37] transition-all ${copied ? 'border-[#d4af37] text-[#d4af37]' : 'border-[#f0e6d2]'}`}
               >
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                  {copied ? 'Link Copied!' : 'Share Program'}
               </button>
            </div>
          </div>

          {/* Sidebar / Quick Inquire */}
          <div className="space-y-10">
            <div className="bg-[#042f24] p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl border-4 border-[#064e3b]">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 mihrab-shape -rotate-12 translate-x-1/4 -translate-y-1/4"></div>
               <h3 className="text-2xl font-black italic mb-6 text-[#d4af37]">Join the Program</h3>
               <p className="text-white/60 mb-10 text-sm leading-relaxed italic">
                 Have questions about attendance or logistics? Our administrative team is happy to help you.
               </p>
               <Link 
                 to="/contact" 
                 className="block w-full text-center bg-[#d4af37] text-[#042f24] py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-lg"
               >
                 Inquire Directly
               </Link>
            </div>

            <div className="bg-[#fdfbf7] border-4 border-dashed border-[#f0e6d2] p-10 rounded-[3rem] text-center">
               <MessageCircle size={32} className="text-[#d4af37] mx-auto mb-4" />
               <h4 className="text-[#042f24] font-black italic mb-2">Community Update</h4>
               <p className="text-slate-400 text-xs italic">Time and location are subject to change. Please follow our community group for live updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEventDetail;
