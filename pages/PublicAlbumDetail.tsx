
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ArrowLeft, Loader2, X, Maximize2, Camera } from 'lucide-react';

const PublicAlbumDetail = () => {
  const { slug } = useParams();
  const [album, setAlbum] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const { data: albumData, error: albumError } = await supabase
          .from('gallery_albums')
          .select('*')
          .eq('slug', slug)
          .single();

        if (albumError) throw albumError;
        setAlbum(albumData);

        const { data: photoData, error: photoError } = await supabase
          .from('gallery_photos')
          .select('*')
          .eq('album_id', albumData.id)
          .order('created_at', { ascending: true });

        if (photoError) throw photoError;
        setPhotos(photoData || []);
      } catch (err) {
        console.error("Error fetching album details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <Loader2 className="animate-spin text-[#d4af37]" size={48} />
    </div>
  );

  if (!album) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
      <h1 className="text-2xl font-black text-[#042f24] mb-4 italic">Album not found</h1>
      <Link to="/gallery" className="text-[#d4af37] font-bold underline">Back to Gallery</Link>
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-32">
      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-[#042f24]/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-10 right-10 text-white hover:text-[#d4af37] transition-colors p-4 bg-white/5 rounded-full"
          >
            <X size={32} />
          </button>
          <img 
            src={selectedPhoto} 
            className="max-w-full max-h-full rounded-[2rem] shadow-[0_0_100px_rgba(212,175,55,0.3)] object-contain"
            alt="Viewer"
          />
        </div>
      )}

      <div className="bg-[#042f24] pt-32 pb-48 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-islamic-pattern pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link 
            to="/gallery" 
            className="inline-flex items-center gap-2 text-[#d4af37] font-black uppercase tracking-[0.3em] text-[10px] mb-8 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Albums
          </Link>
          <h1 className="text-4xl md:text-7xl font-black text-white italic mb-6 tracking-tight">{album.title}</h1>
          <p className="text-white/60 text-lg italic leading-relaxed max-w-2xl mx-auto">{album.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-20">
        {photos.length === 0 ? (
          <div className="bg-white rounded-[4rem] p-32 text-center shadow-2xl border-2 border-[#f0e6d2]">
             <Camera size={64} className="text-[#d4af37]/10 mx-auto mb-6" />
             <h2 className="text-2xl font-black text-[#042f24] italic">This album is currently empty.</h2>
             <p className="text-slate-400 font-medium mt-2 italic">Please check back later as we update our collection.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="break-inside-avoid group relative cursor-zoom-in rounded-[2rem] overflow-hidden shadow-lg border-4 border-white hover:border-[#d4af37] transition-all duration-500"
                onClick={() => setSelectedPhoto(photo.image_url)}
              >
                <img 
                  src={photo.image_url} 
                  alt={photo.caption || album.title} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#042f24]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-4 bg-white rounded-full text-[#042f24] scale-0 group-hover:scale-100 transition-transform duration-500">
                    <Maximize2 size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicAlbumDetail;
