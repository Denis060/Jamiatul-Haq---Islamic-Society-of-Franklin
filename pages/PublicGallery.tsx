
import React from 'react';

const PublicGallery = () => {
  const albums = [
    { title: 'Ramadan 2023', count: 24, image: 'https://picsum.photos/600/400?random=11' },
    { title: 'Youth Trip', count: 18, image: 'https://picsum.photos/600/400?random=12' },
    { title: 'Community Picnic', count: 42, image: 'https://picsum.photos/600/400?random=13' },
    { title: 'Interfaith Dialogue', count: 12, image: 'https://picsum.photos/600/400?random=14' },
    { title: 'Eid Prayers', count: 35, image: 'https://picsum.photos/600/400?random=15' },
    { title: 'Facility Upgrades', count: 9, image: 'https://picsum.photos/600/400?random=16' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-emerald-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Gallery</h1>
        <p className="text-emerald-100 max-w-2xl mx-auto">Capturing memories of our community life and events.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {albums.map((album, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg mb-4">
                <img 
                  src={album.image} 
                  alt={album.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-emerald-900 text-sm font-bold shadow-sm">
                    {album.count} Photos
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{album.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicGallery;
