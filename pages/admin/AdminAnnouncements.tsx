
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { 
  Plus, Trash2, Edit2, X, Loader2, AlertCircle, 
  CheckCircle2, Megaphone, Pin, Star, Upload, Camera, Save
} from 'lucide-react';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('General');
  const [isPinned, setIsPinned] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const announcementTypes = ["General", "Ramadan", "Urgent", "Prayer", "Education"];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `news-${Date.now()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('events') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let finalImageUrl = imagePreview;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const payload = {
        title,
        body,
        type,
        is_pinned: isPinned,
        image_url: finalImageUrl,
        status: 'published'
      };

      let resultError;
      if (editingId) {
        const { error } = await supabase.from('announcements').update(payload).match({ id: editingId });
        resultError = error;
      } else {
        const { error } = await supabase.from('announcements').insert([payload]);
        resultError = error;
      }

      if (resultError) throw resultError;

      setSuccess(editingId ? "Announcement updated!" : "Announcement broadcasted!");
      resetForm();
      fetchAnnouncements();
      setIsAdding(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const startEdit = (news: any) => {
    setEditingId(news.id);
    setTitle(news.title);
    setBody(news.body);
    setType(news.type || 'General');
    setIsPinned(news.is_pinned || false);
    setImagePreview(news.image_url);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this announcement?')) {
      const { error } = await supabase.from('announcements').delete().match({ id });
      if (!error) {
        setAnnouncements(announcements.filter(a => a.id !== id));
        setSuccess("Message removed.");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(error.message);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setBody('');
    setType('General');
    setIsPinned(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const inputClasses = "w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] focus:bg-white outline-none font-bold text-[#042f24] transition-all shadow-sm placeholder:text-slate-300";

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight">Announcements</h1>
          <p className="text-slate-500 font-medium">Post updates, Ramadan info, and urgent alerts.</p>
        </div>
        <button 
          onClick={() => {
            if (isAdding) resetForm();
            setIsAdding(!isAdding);
          }}
          className="bg-[#042f24] text-[#d4af37] px-8 py-4 rounded-full font-black flex items-center gap-3 hover:bg-[#d4af37] hover:text-[#042f24] transition-all shadow-xl uppercase text-xs tracking-widest"
        >
          {isAdding ? <><X size={20} /> Close</> : <><Plus size={20} /> New Post</>}
        </button>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-50 border-2 border-red-100 rounded-[2.5rem] text-red-700 flex items-center gap-4 text-sm font-bold animate-in slide-in-from-top-4">
          <AlertCircle size={24} /> {error}
        </div>
      )}

      {success && (
        <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] text-emerald-700 flex items-center gap-4 text-sm font-bold animate-in bounce-in">
          <CheckCircle2 size={24} /> {success}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSave} className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-[#f0e6d2] mb-16 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Update Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className={inputClasses} required placeholder="e.g. Ramadan 2024 Start Date" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Post Category</label>
                  <select value={type} onChange={e => setType(e.target.value)} className={inputClasses}>
                    {announcementTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <button 
                    type="button" 
                    onClick={() => setIsPinned(!isPinned)}
                    className={`flex-1 p-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all ${
                      isPinned ? 'bg-[#d4af37] border-[#d4af37] text-[#042f24]' : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    <Pin size={16} /> {isPinned ? 'Urgent Alert' : 'Normal News'}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Content / Details</label>
                <textarea 
                  value={body} onChange={e => setBody(e.target.value)} 
                  className={`${inputClasses} h-56 resize-none font-medium text-slate-700`} 
                  placeholder="Share the full details of this update..."
                  required
                />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3 w-full text-center">Featured Image (Optional)</label>
              <div 
                className="w-full aspect-video border-4 border-dashed border-[#f0e6d2] rounded-[3rem] overflow-hidden group cursor-pointer hover:border-[#d4af37] transition-all bg-[#fdfbf7] flex flex-col items-center justify-center text-slate-400 relative"
                onClick={() => document.getElementById('news-photo-input')?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera size={48} className="mb-4 text-[#d4af37]/40" />
                    <span className="font-black uppercase text-[10px] tracking-widest">Add Poster/Flyer</span>
                  </>
                )}
                <input type="file" id="news-photo-input" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-4 italic text-center">Great for flyers or Ramadan calendars.</p>
            </div>
          </div>

          <button 
            type="submit" disabled={saving}
            className="w-full mt-12 bg-[#042f24] text-[#d4af37] py-6 rounded-full font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : editingId ? 'Update Post' : 'Post Announcement Bismillah'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-40">
          <Loader2 className="animate-spin text-[#d4af37]" size={64} />
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((item) => (
            <div key={item.id} className={`bg-white rounded-[3rem] p-10 border-2 transition-all flex flex-col md:flex-row gap-10 group relative ${
              item.is_pinned ? 'border-[#d4af37] shadow-xl' : 'border-[#f0e6d2] shadow-sm hover:border-[#d4af37]'
            }`}>
              {item.is_pinned && (
                <div className="absolute -top-3 left-10 bg-[#d4af37] text-[#042f24] px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg z-10">
                  <Pin size={10} /> Pinned Alert
                </div>
              )}
              
              {item.image_url && (
                <div className="md:w-1/4 aspect-[4/3] rounded-[2rem] overflow-hidden border-2 border-slate-50">
                  <img src={item.image_url} className="w-full h-full object-cover" alt="Post" />
                </div>
              )}
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-[0.2em] bg-[#fdfbf7] px-4 py-1.5 rounded-full border border-[#f0e6d2]">{item.type}</span>
                    <div className="flex gap-2">
                       <button onClick={() => startEdit(item)} className="p-3 bg-slate-50 text-[#042f24] rounded-2xl hover:bg-[#d4af37] transition-all shadow-sm">
                          <Edit2 size={16} />
                       </button>
                       <button onClick={() => handleDelete(item.id)} className="p-3 bg-slate-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-[#042f24] italic mb-4 leading-tight">{item.title}</h3>
                  <p className="text-slate-500 text-sm italic leading-relaxed line-clamp-2">"{item.body}"</p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-300">
                  <span>Published {new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}

          {announcements.length === 0 && !isAdding && (
            <div className="py-32 border-4 border-dashed border-[#f0e6d2] rounded-[4rem] text-center bg-white/50">
               <Megaphone size={64} className="text-[#d4af37]/20 mx-auto mb-6" />
               <h2 className="text-2xl font-black text-[#042f24] italic">No active announcements</h2>
               <p className="text-slate-400 font-medium">Post updates here to keep the community informed.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
