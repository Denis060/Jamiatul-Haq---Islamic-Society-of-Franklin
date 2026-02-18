import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Event } from '../../types';
import { Plus, Trash2, Edit2, Check, X, Upload, Calendar, MapPin, ImageIcon, Loader2, AlertCircle, Clock } from 'lucide-react';

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) setError(error.message);
    if (data) setEvents(data);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Max 5MB.");
        return;
      }
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `event-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      return null;
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setTitle(event.title);
    setSlug(event.slug);
    setDescription(event.description);
    setLocation(event.location);
    setCoverImagePreview(event.cover_image_url);
    setCoverImage(null); // Reset file input

    // Format UTC time to local 'YYYY-MM-DDTHH:mm' for datetime-local input
    if (event.start_time) {
      const date = new Date(event.start_time);
      // Construct local time string manually to avoid timezone shift issues
      // Get local components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      const localIsoString = `${year}-${month}-${day}T${hours}:${minutes}`;
      setStartTime(localIsoString);
    }

    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      let finalImageUrl = coverImagePreview;

      // If a new file was selected, upload it
      if (coverImage) {
        const uploadedUrl = await uploadImage(coverImage);
        if (!uploadedUrl) throw new Error("Image upload failed");
        finalImageUrl = uploadedUrl;
      } else if (finalImageUrl?.startsWith('blob:')) {
        // Safety check to ensure we don't save blob URLs if upload failed silently
        finalImageUrl = null;
      }

      // Fix Timezone: Convert local datetime-local string to UTC ISO string
      // proper ISO string handles timezone offset correctly
      const isoStartTime = new Date(startTime).toISOString();

      const eventData = {
        title,
        slug,
        description,
        start_time: isoStartTime,
        location,
        status: 'published',
        cover_image_url: finalImageUrl
      };

      if (editingId) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;
      }

      setIsAdding(false);
      resetForm();
      fetchEvents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this event forever?')) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (!error) fetchEvents();
      else setError(error.message);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setStartTime('');
    setLocation('');
    setCoverImage(null);
    setCoverImagePreview(null);
    setEditingId(null);
    setError(null);
  };

  const inputClasses = "w-full p-5 bg-white border-2 border-[#f0e6d2] rounded-[1.5rem] focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/5 outline-none transition-all font-bold text-[#042f24] placeholder:text-slate-300 shadow-sm";

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight">Events Management</h1>
          <p className="text-slate-500 font-medium mt-1">Add, edit, or remove community programs.</p>
        </div>
        <button
          onClick={() => {
            if (isAdding) {
              setIsAdding(false);
              resetForm();
            } else {
              resetForm();
              setIsAdding(true);
            }
          }}
          className={`${isAdding ? 'bg-red-500 hover:bg-red-600' : 'bg-[#042f24] hover:bg-[#d4af37]'} text-white px-8 py-4 rounded-full font-black flex items-center gap-3 transition-all shadow-xl uppercase text-xs tracking-widest`}
        >
          {isAdding ? <><X size={20} /> Cancel</> : <><Plus size={20} /> New Event</>}
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-700 flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-[#f0e6d2] mb-16 animate-in zoom-in-95 duration-300 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3">Event Title</label>
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    // Only auto-generate slug if checking new title or if slug is empty
                    // But generally keeping it synced is fine for admin simplicty
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                  className={inputClasses}
                  required
                  placeholder="e.g. Community Potluck"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={inputClasses}
                    required
                    placeholder="Masjid Hall"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputClasses} h-44 resize-none font-medium text-slate-700`}
                  required
                  placeholder="Describe the event..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3">Event Cover Image</label>
              <div className="relative group h-full max-h-[400px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cover-upload-form"
                />
                <label
                  htmlFor="cover-upload-form"
                  className={`flex flex-col items-center justify-center w-full h-full border-4 border-dashed rounded-[3rem] cursor-pointer transition-all overflow-hidden relative group ${coverImagePreview ? 'border-[#d4af37]' : 'border-[#f0e6d2] hover:border-[#d4af37] bg-slate-50'
                    }`}
                >
                  {coverImagePreview ? (
                    <>
                      <img src={coverImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-black uppercase tracking-widest text-xs">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-[#d4af37]">
                      <div className="p-6 bg-white rounded-full shadow-lg mb-4">
                        <Upload size={32} />
                      </div>
                      <span className="font-black uppercase tracking-widest text-xs text-center">Upload Event Cover</span>
                      <span className="text-[10px] mt-2 text-slate-400">JPG, PNG up to 5MB</span>
                    </div>
                  )}
                </label>
                {coverImagePreview && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setCoverImage(null); setCoverImagePreview(null); }}
                    className="absolute top-6 right-6 bg-red-500 text-white p-3 rounded-full shadow-2xl hover:bg-red-600 transition-colors z-20"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full mt-12 bg-[#042f24] text-[#d4af37] py-6 rounded-full font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-sm"
          >
            {uploading ? (
              <><Loader2 className="animate-spin" size={24} /> Processing...</>
            ) : (
              editingId ? 'Update Event' : 'Publish to Community'
            )}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-40">
          <Loader2 className="animate-spin text-[#d4af37]" size={64} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-[#f0e6d2]">
              <Calendar size={64} className="text-[#d4af37]/20 mx-auto mb-6" />
              <h3 className="text-3xl font-black text-[#042f24] italic mb-3">The calendar is empty</h3>
              <p className="text-slate-400 font-medium">Create your first event to engage with the community.</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-white rounded-[3rem] shadow-sm border-2 border-[#f0e6d2] overflow-hidden group hover:border-[#d4af37] hover:shadow-xl transition-all duration-500 flex flex-col">
                <div className="h-64 relative overflow-hidden bg-slate-100">
                  {event.cover_image_url ? (
                    <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200 bg-islamic-pattern opacity-30">
                      <ImageIcon size={80} />
                    </div>
                  )}
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="bg-white/90 backdrop-blur p-3 rounded-2xl text-[#d4af37] shadow-xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"
                      title="Edit Event"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-white/90 backdrop-blur p-3 rounded-2xl text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all"
                      title="Delete Event"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-[#d4af37] text-[#042f24] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-2xl">
                      {new Date(event.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="p-10 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-[#042f24] italic mb-4 leading-tight group-hover:text-[#d4af37] transition-colors">{event.title}</h3>
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-slate-500 text-sm font-bold">
                        <Clock size={16} className="text-[#d4af37]" />
                        {new Date(event.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-sm font-bold">
                        <MapPin size={16} className="text-[#d4af37]" />
                        {event.location}
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm italic leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>
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
