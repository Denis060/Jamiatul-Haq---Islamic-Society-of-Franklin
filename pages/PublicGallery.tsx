
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ImageIcon, Loader2, Camera, Sparkles, AlertCircle } from 'lucide-react';

const PublicGallery = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      setError(null);
      try {
        // We fetch the albums first. 
        // Note: We use a simpler select to ensure RLS doesn't trip on complex joins initially
        const { data, error: fetchError } = await supabase
          .from('gallery_albums')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // If we have albums, try to get photo counts for them
        if (data && data.length > 0) {
          const albumsWithCounts = await Promise.all(data.map(async (album) => {
            const { count } = await supabase
              .from('gallery_photos')
              .select('*', { count: 'exact', head: true })
              .eq('album_id', album.id);
            return { ...album, photo_count: count || 0 };
          }));
          setAlbums(albumsWithCounts);
        } else {
          setAlbums([]);
        }
      } catch (err: any) {
        console.error("Gallery Fetch Error:", err);
        setError(err.message || "Could not load gallery. Please ensure the database permissions are set.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const isNew = (dateString: string) => {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // Show "NEW" for a week
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fdfbf7]">
      <Loader2 className="animate-spin text-[#d4af37] mb-4" size={48} />
      <p className="text-[#042f24] font-black uppercase tracking-widest text-[10px]">Opening the archives...</p>
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen">
      <div className="bg-[#042f24] py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-islamic-pattern"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-8xl font-black text-white italic mb-6 tracking-tighter">Community Gallery</h1>
          <p className="text-[#d4af37] max-w-2xl mx-auto text-xl font-medium tracking-wide italic">"A community's journey, preserved in every frame."</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        {error ? (
          <div className="bg-red-50 border-2 border-red-100 p-12 rounded-[3rem] text-center max-w-2xl mx-auto">
             <AlertCircle size={48} className="text-red-400 mx-auto mb-6" />
             <h2 className="text-2xl font-black text-red-800 mb-2">Access Restricted</h2>
             <p className="text-red-600 font-medium italic mb-6">{error}</p>
             <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Administrator Action Required: Run the RLS Select SQL</p>
          </div>
        ) : albums.length === 0 ? (
          <div className="bg-white rounded-[4rem] p-32 text-center shadow-2xl border-2 border-[#f0e6d2]">
             <Camera size={64} className="text-[#d4af37]/20 mx-auto mb-6" />
             <h2 className="text-3xl font-black text-[#042f24] italic">Memory lane is currently quiet</h2>
             <p className="text-slate-400 font-medium mt-2 italic">We are curating beautiful moments to share. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {albums.map((album) => (
              <Link 
                key={album.id} 
                to={`/gallery/${album.slug}`}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-xl mb-6 border-4 border-white group-hover:border-[#d4af37] transition-all duration-500">
                  {album.cover_image_url ? (
                    <img 
                      src={album.cover_image_url} 
                      alt={album.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#042f24] flex items-center justify-center opacity-30 bg-islamic-pattern">
                      <ImageIcon size={64} className="text-[#d4af37]" />
                    </div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                    {isNew(album.created_at) && (
                      <div className="bg-[#d4af37] text-[#042f24] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl animate-bounce">
                        <Sparkles size={12} /> New
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <div className="bg-white/90 backdrop-blur px-6 py-2 rounded-2xl text-[#042f24] text-xs font-black uppercase tracking-widest shadow-2xl">
                      {album.photo_count || 0} Photos
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-[#042f24] italic group-hover:text-[#d4af37] transition-colors mb-2 px-2">{album.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 italic px-2 leading-relaxed">{album.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicGallery;
