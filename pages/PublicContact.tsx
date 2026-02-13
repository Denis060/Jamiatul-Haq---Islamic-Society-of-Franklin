
import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const PublicContact = () => {
  return (
    <div className="bg-white">
      <div className="bg-emerald-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h1>
        <p className="text-emerald-100 max-w-2xl mx-auto">Have questions about our services or need assistance? Reach out to us.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-emerald-950 mb-8">Contact Information</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-lg">Our Address</h4>
                  <p className="text-gray-600">385 Lewis Street, Somerset, NJ 08873</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-lg">Phone Number</h4>
                  <p className="text-gray-600">732-322-5221</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-lg">Email Address</h4>
                  <p className="text-gray-600">aksavage68@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-lg">Hours</h4>
                  <p className="text-gray-600">Open for all five daily prayers.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-3xl overflow-hidden shadow-lg border border-gray-200 h-80">
              {/* Actual Map Embed would go here */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3032.531273934522!2d-74.4789!3d40.4871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3c1374526017b%3A0x64e32080a2947683!2s385%20Lewis%20St%2C%20Somerset%2C%20NJ%2008873!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-3xl font-bold text-emerald-950 mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"></textarea>
              </div>
              <button className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                <Send size={20} /> Submit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicContact;
