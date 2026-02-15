
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { 
  Plus, Trash2, Camera, Image as ImageIcon, Loader2, 
  X, Upload, Grid, List, AlertCircle, CheckCircle2 
} from 'lucide-react';

const AdminGallery = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingAlbum, setIsAddingAlbum] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form States
  const [newAlbum, setNewAlbum] = useState({ title: '', description: '', cover_image: null as File | null });
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*, gallery_photos(*)').order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setAlbums(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const fullPath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('events').upload(fullPath, file);
    if (uploadError) {
      console.error("Storage Upload Error:", uploadError);
      throw new Error(`Storage Error: ${uploadError.message}. Make sure the 'events' bucket exists and has RLS policies.`);
    }

    const { data: { publicUrl } } = supabase.storage.from('events').getPublicUrl(fullPath);
    return publicUrl;
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbum.title.trim()) return;

    setUploading(true);
    setError(null);

    try {
      let coverUrl = '';
      if (newAlbum.cover_image) {
        coverUrl = await uploadFile(newAlbum.cover_image, 'gallery-covers') || '';
      }

      // Generate a clean slug
      const slug = newAlbum.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const { error: insertError } = await supabase.from('gallery_albums').insert([
        { 
          title: newAlbum.title.trim(), 
          slug: slug || `album-${Date.now()}`, 
          description: newAlbum.description, 
          cover_image_url: coverUrl 
        }
      ]);

      if (insertError) throw insertError;
      
      setSuccess("Album created successfully, Alhamdulillah!");
      setNewAlbum({ title: '', description: '', cover_image: null });
      setIsAddingAlbum(false);
      fetchAlbums();
    } catch (err: any) {
      console.error("Album Creation Error:", err);
      setError(err.message || "Failed to create album. Please run the SQL fix in the editor.");
    } finally {
      setUploading(false);
      setTimeout(() => setSuccess(null), 5000);
    }
  };

  const handleUploadPhotos = async () => {
    if (!selectedAlbum || newPhotos.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      const uploadPromises = newPhotos.map(async (file) => {
        const url = await uploadFile(file, `gallery-photos/${selectedAlbum.id}`);
        return { album_id: selectedAlbum.id, image_url: url };
      });

      const photosData = await Promise.all(uploadPromises);
      const { error: photoInsertError } = await supabase.from('gallery_photos').insert(photosData);

      if (photoInsertError) throw photoInsertError;

      setSuccess(`Uploaded ${newPhotos.length} photos!`);
      setNewPhotos([]);
      fetchAlbums();
      
      const { data: updated } = await supabase
        .from('gallery_albums')
        .select('*, gallery_photos(*)')
        .eq('id', selectedAlbum.id)
        .single();
        
      if (updated) setSelectedAlbum(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (window.confirm("Delete this entire album and all its photos?")) {
      const { error } = await supabase.from('gallery_albums').delete().match({ id });
      if (!error) {
        setAlbums(albums.filter(a => a.id !== id));
        if (selectedAlbum?.id === id) setSelectedAlbum(null);
      }
    }
  };

  const deletePhoto = async (photoId: string) => {
    if (window.confirm("Remove this photo?")) {
      const { error } = await supabase.from('gallery_photos').delete().match({ id: photoId });
      if (!error) {
        if (selectedAlbum) {
          setSelectedAlbum({
            ...selectedAlbum,
            gallery_photos: selectedAlbum.gallery_photos.filter((p: any) => p.id !== photoId)
          });
        }
        fetchAlbums();
      }
    }
  };

  if (loading && !selectedAlbum) return (
    <div className="flex justify-center py-40">
      <Loader2 className="animate-spin text-[#d4af37]" size={64} />
    </div>
  );

  const inputClasses = "w-full p-5 bg-white border-2 border-[#f0e6d2] rounded-[1.5rem] focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/5 outline-none transition-all font-bold text-[#042f24] placeholder:text-slate-300 shadow-sm";

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight">Gallery Manager</h1>
          <p className="text-slate-500 font-medium">Manage your community's visual history.</p>
        </div>
        <div className="flex gap-4">
          {selectedAlbum && (
            <button 
              onClick={() => setSelectedAlbum(null)}
              className="bg-white text-[#042f24] border-2 border-[#f0e6d2] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:border-[#d4af37] transition-all"
            >
              Back to List
            </button>
          )}
          <button 
            onClick={() => {
              setIsAddingAlbum(!isAddingAlbum);
              setError(null);
            }}
            className="bg-[#042f24] text-[#d4af37] px-8 py-4 rounded-full font-black flex items-center gap-3 hover:bg-[#d4af37] hover:text-[#042f24] transition-all shadow-xl uppercase text-xs tracking-widest"
          >
            {isAddingAlbum ? <><X size={20} /> Cancel</> : <><Plus size={20} /> Create Album</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-50 border-2 border-red-100 rounded-[2rem] text-red-700 flex items-start gap-4 text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-500">
          <AlertCircle className="shrink-0 mt-0.5" size={20} /> 
          <div>
            <p className="uppercase text-[10px] tracking-widest mb-1">Permission or Connection Error</p>
            <p className="italic">{error}</p>
            <p className="mt-2 text-[10px] opacity-70">Hint: Make sure you have run the updated SQL in the Supabase Editor.</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] text-emerald-700 flex items-center gap-3 text-sm font-bold animate-in bounce-in">
          <CheckCircle2 size={24} /> {success}
        </div>
      )}

      {isAddingAlbum && (
        <form onSubmit={handleCreateAlbum} className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-[#f0e6d2] mb-16 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3">Album Title</label>
                <input 
                  value={newAlbum.title}
                  onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                  className={inputClasses}
                  required
                  placeholder="e.g. Ramadan 2024"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3">Description</label>
                <textarea 
                  value={newAlbum.description}
                  onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                  className={`${inputClasses} h-32 resize-none font-medium text-slate-700`}
                  placeholder="Short summary of the album..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3">Cover Image</label>
              <div 
                className="relative h-64 border-4 border-dashed border-[#f0e6d2] rounded-[2rem] overflow-hidden group cursor-pointer hover:border-[#d4af37] transition-all bg-[#fdfbf7] flex flex-col items-center justify-center text-slate-400"
                onClick={() => document.getElementById('album-cover-input')?.click()}
              >
                {newAlbum.cover_image ? (
                  <img src={URL.createObjectURL(newAlbum.cover_image)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera size={48} className="mb-4 text-[#d4af37]/40" />
                    <span className="font-black uppercase text-[10px] tracking-widest text-slate-400">Select Cover Photo</span>
                  </>
                )}
                <input 
                  type="file" id="album-cover-input" className="hidden" accept="image/*"
                  onChange={(e) => e.target.files && setNewAlbum({ ...newAlbum, cover_image: e.target.files[0] })}
                />
              </div>
            </div>
          </div>
          <button 
            type="submit" disabled={uploading || !newAlbum.title}
            className="w-full mt-12 bg-[#042f24] text-[#d4af37] py-6 rounded-full font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all disabled:opacity-50"
          >
            {uploading ? 'Bismillah... Uploading' : 'Create Album'}
          </button>
        </form>
      )}

      {selectedAlbum ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-10">
          <div className="bg-[#042f24] p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 mihrab-shape -rotate-12 translate-x-1/4 -translate-y-1/4"></div>
             <div className="relative z-10">
               <h2 className="text-4xl font-black italic mb-4">{selectedAlbum.title}</h2>
               <p className="text-white/60 italic max-w-2xl">{selectedAlbum.description}</p>
             </div>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] border-2 border-[#f0e6d2] shadow-sm">
             <h3 className="text-xl font-black text-[#042f24] uppercase tracking-widest mb-8 flex items-center gap-3">
               <Upload size={24} className="text-[#d4af37]" /> Upload Photos
             </h3>
             <div className="flex flex-col md:flex-row gap-6 items-start">
               <div className="flex-1 w-full">
                 <input 
                   type="file" multiple accept="image/*" className="hidden" id="photo-multi-input"
                   onChange={(e) => e.target.files && setNewPhotos(Array.from(e.target.files))}
                 />
                 <label 
                   htmlFor="photo-multi-input"
                   className="flex items-center justify-center p-12 border-4 border-dashed border-[#f0e6d2] rounded-[2rem] bg-[#fdfbf7] cursor-pointer hover:border-[#d4af37] transition-all"
                 >
                   <div className="text-center">
                     <ImageIcon size={48} className="text-[#d4af37]/20 mx-auto mb-4" />
                     <p className="font-black text-[#042f24] uppercase tracking-widest text-xs">Choose Photos</p>
                     <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{newPhotos.length} selected</p>
                   </div>
                 </label>
               </div>
               <button 
                 onClick={handleUploadPhotos}
                 disabled={uploading || newPhotos.length === 0}
                 className="bg-[#042f24] text-[#d4af37] px-12 py-12 rounded-[2rem] font-black uppercase tracking-widest text-xs h-full disabled:opacity-50 flex flex-col items-center justify-center gap-4 min-w-[200px] shadow-lg"
               >
                 {uploading ? <Loader2 className="animate-spin" /> : <Plus size={32} />}
                 Start Upload
               </button>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {selectedAlbum.gallery_photos?.map((photo: any) => (
              <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md hover:border-red-500 transition-all">
                <img src={photo.image_url} alt="Gallery item" className="w-full h-full object-cover" />
                <button 
                  onClick={() => deletePhoto(photo.id)}
                  className="absolute inset-0 bg-red-600/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {albums.map((album) => (
            <div key={album.id} className="bg-white rounded-[3rem] border-2 border-[#f0e6d2] overflow-hidden group hover:shadow-2xl transition-all flex flex-col">
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                {album.cover_image_url ? (
                  <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={48} /></div>
                )}
                <div className="absolute top-6 right-6 flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); deleteAlbum(album.id); }} className="p-3 bg-red-500 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-[#042f24] italic mb-2 group-hover:text-[#d4af37] transition-colors">{album.title}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{(album.gallery_photos?.length || 0)} Photos</p>
                <button 
                  onClick={() => setSelectedAlbum(album)}
                  className="mt-auto w-full py-4 rounded-2xl border-2 border-[#f0e6d2] text-[#042f24] font-black uppercase tracking-widest text-[10px] hover:bg-[#042f24] hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <Grid size={16} /> Manage Photos
                </button>
              </div>
            </div>
          ))}
          {albums.length === 0 && (
            <div className="col-span-full py-40 border-4 border-dashed border-[#f0e6d2] rounded-[4rem] text-center bg-white/50">
              <Camera size={64} className="text-[#d4af37]/20 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-[#042f24] italic">Empty Gallery</h2>
              <p className="text-slate-400 font-medium">Create your first album to start sharing memories.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
