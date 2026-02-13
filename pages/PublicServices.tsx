
import React from 'react';
import { 
  Users, Heart, GraduationCap, Home, Clock, Star, Landmark
} from 'lucide-react';

const PublicServices = () => {
  const services = [
    {
      title: 'Daily Prayers & Jumu’ah',
      desc: 'Congregational prayers five times a day and Jumu’ah service every Friday at 1:15 PM.',
      icon: <Clock className="text-emerald-600" size={40} />
    },
    {
      title: 'Youth Programs',
      desc: 'Workshops, sports activities, and Islamic educational programs for our community’s youth.',
      icon: <GraduationCap className="text-emerald-600" size={40} />
    },
    {
      title: 'Nikah Services',
      desc: 'Official Islamic marriage officiating and counseling for newly-wed couples.',
      icon: <Heart className="text-emerald-600" size={40} />
    },
    {
      title: 'Janazah Services',
      desc: 'Funeral prayer coordination and support for families during difficult times.',
      icon: <Home className="text-emerald-600" size={40} />
    },
    {
      title: 'Sisters’ Programs',
      desc: 'Special halaqas, social gatherings, and educational sessions for the sisters of our community.',
      icon: <Users className="text-emerald-600" size={40} />
    },
    {
      title: 'Taraweeh & Iftar',
      desc: 'Nightly prayers during Ramadan and community Iftars provided to the public.',
      icon: <Star className="text-emerald-600" size={40} />
    }
  ];

  const facilities = [
    'Ample On-site Parking',
    'Dedicated Wudu Area',
    'Private Women’s Prayer Area',
    'Clean Restrooms'
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-emerald-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Services</h1>
        <p className="text-emerald-100 max-w-2xl mx-auto">Providing spiritual and social support to the Somerset community since 2002.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <div key={idx} className="p-8 border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow bg-gray-50">
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-2xl font-bold text-emerald-950 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-emerald-50 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-emerald-950 mb-6 flex items-center gap-3">
              <Landmark size={32} /> Masjid Facilities
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              ISFT Jamiatul Haq is equipped with modern facilities to ensure our community members can worship comfortably.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {facilities.map((f, i) => (
                <div key={i} className="bg-white px-6 py-4 rounded-xl shadow-sm flex items-center gap-3 font-semibold text-emerald-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <img 
              src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800" 
              className="rounded-3xl shadow-lg w-full h-80 object-cover"
              alt="Masjid Facility"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicServices;
