
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { fetchEvents } from '../services/supabase';

const PublicEvents = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents().then(({ data }) => setEvents(data || []));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-emerald-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Upcoming Events</h1>
        <p className="text-emerald-100 max-w-2xl mx-auto">Connecting our hearts through shared moments and learning.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-12">
          {events.length > 0 ? events.map((e, idx) => (
            <div key={idx} className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
              <div className="md:w-1/3 bg-emerald-700 p-12 text-white flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4 text-emerald-200 uppercase tracking-widest text-xs font-bold">
                  <Calendar size={14} /> Upcoming Event
                </div>
                <h3 className="text-3xl font-bold leading-tight mb-4">{e.title}</h3>
                <div className="text-emerald-100 font-medium">
                  {new Date(e.start_time).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div className="flex-1 p-12 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-6 mb-8 text-emerald-800 font-semibold">
                    <span className="flex items-center gap-2">
                      <Clock size={18} />
                      {new Date(e.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-2"><MapPin size={18} /> {e.location || 'Masjid'}</span>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {e.description}
                  </p>
                </div>
                <button className="flex items-center gap-2 text-emerald-700 font-bold hover:underline">
                  Event Details <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
              <h3 className="text-2xl font-bold text-gray-400">No Upcoming Events</h3>
              <p className="text-gray-400 mt-2">Check back soon for updates.</p>
            </div>
          )}
        </div>

        <div className="mt-20 pt-20 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Past Events Archive</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60">
            <div className="p-6 bg-white border border-gray-100 rounded-2xl">
              <h4 className="font-bold mb-2">Winter Clothing Drive</h4>
              <p className="text-xs text-gray-400">December 2023</p>
            </div>
            <div className="p-6 bg-white border border-gray-100 rounded-2xl">
              <h4 className="font-bold mb-2">Eid-ul-Adha Celebration</h4>
              <p className="text-xs text-gray-400">June 2023</p>
            </div>
            <div className="p-6 bg-white border border-gray-100 rounded-2xl">
              <h4 className="font-bold mb-2">Ramadan Open House</h4>
              <p className="text-xs text-gray-400">April 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEvents;
