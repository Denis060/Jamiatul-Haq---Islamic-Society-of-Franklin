
import React from 'react';

const PublicLeadership = () => {
  const leaders = [
    {
      name: 'Alhaji Abdullah Karim Savage',
      role: 'Chief Imam',
      bio: 'Leading the community in spiritual growth and educational development since the inception of ISFT Jamiatul Haq.',
      image: 'https://picsum.photos/400/500?grayscale&random=1'
    },
    {
      name: 'Board of Trustees',
      role: 'Administration',
      bio: 'Responsible for the governance, financial oversight, and long-term planning of the Islamic Society of Franklin Township.',
      image: 'https://picsum.photos/400/500?grayscale&random=2'
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-emerald-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Leadership</h1>
        <p className="text-emerald-100 max-w-2xl mx-auto">Guided by knowledge and dedicated to community service.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {leaders.map((leader, i) => (
            <div key={i} className="group">
              <div className="relative overflow-hidden rounded-3xl mb-6 shadow-xl aspect-[4/5]">
                <img 
                  src={leader.image} 
                  alt={leader.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent flex items-end p-8">
                  <div>
                    <span className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-2 block">{leader.role}</span>
                    <h2 className="text-white text-3xl font-bold">{leader.name}</h2>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg italic">
                "{leader.bio}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-emerald-900 mb-4">A Legacy of Service</h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Since our establishment in November 2002, our leadership has focused on building an inclusive community based on Islamic values of charity, knowledge, and mutual respect. We welcome all who seek to learn and grow in their faith.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicLeadership;
