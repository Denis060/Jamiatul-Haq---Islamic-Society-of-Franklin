
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Event } from '../../types';
import { Plus, Trash2, Edit2, Check, X, Upload, Calendar, MapPin } from 'lucide-react';

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setEvents(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('events').insert([
      { title, slug, description, start_time: startTime, location, status: 'published' }
    ]);

    if (!error) {
      setIsAdding(false);
      resetForm();
      fetchEvents();
    } else {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this event?')) {
      const { error } = await supabase.from('events').delete().match({ id });
      if (!error) fetchEvents();
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setStartTime('');
    setLocation('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Events</h1>
          <p className="text-slate-500">Create and update community programs.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          {isAdding ? <><X size={20} /> Cancel</> : <><Plus size={20} /> Create Event</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Event Title</label>
              <input 
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                }}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Slug (URL)</label>
              <input 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
              <input 
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <input 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-32"
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors">
            Publish Event
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {events.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500">No events found. Start by creating one.</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {event.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(event.start_time).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
