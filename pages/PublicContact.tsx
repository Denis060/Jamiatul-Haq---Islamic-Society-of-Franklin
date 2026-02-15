
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../services/supabase';

const PublicContact = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Explicitly mapping fields to ensure consistency
    const { error: submitError } = await supabase
      .from('contact_messages')
      .insert([
        {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        }
      ]);

    if (submitError) {
      console.error("Supabase Error Details:", submitError);
      if (submitError.code === '42703' || submitError.message.includes('column')) {
        setError("Database Schema Mismatch: Please run the updated SQL in schema.sql to fix the table columns.");
      } else {
        setError(`Failed to send: ${submitError.message}. Please check your database connection.`);
      }
    } else {
      setSubmitted(true);
      setFormData({ full_name: '', email: '', phone: '', message: '' });
    }
    setLoading(false);
  };

  const inputStyles = "w-full px-6 py-4 bg-white border-2 border-[#f0e6d2] rounded-[1.5rem] focus:border-[#d4af37] focus:ring-0 outline-none transition-all font-bold text-[#042f24] placeholder:text-slate-300";

  return (
    <div className="bg-white">
      <div className="bg-[#042f24] py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-islamic-pattern"></div>
        <h1 className="text-5xl md:text-7xl font-black text-white italic mb-6">Get In Touch</h1>
        <p className="text-[#d4af37] max-w-2xl mx-auto text-xl italic">Have questions about our services or need assistance? Reach out to us.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black text-[#042f24] mb-12 italic">Contact Information</h2>
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="bg-[#fdfbf7] p-5 rounded-[1.5rem] text-[#d4af37] border-2 border-[#f0e6d2]">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#042f24] text-xl uppercase tracking-widest text-[10px] mb-2">Our Address</h4>
                    <p className="text-slate-500 text-lg italic">385 Lewis Street, Somerset, NJ 08873</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="bg-[#fdfbf7] p-5 rounded-[1.5rem] text-[#d4af37] border-2 border-[#f0e6d2]">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#042f24] text-xl uppercase tracking-widest text-[10px] mb-2">Phone Number</h4>
                    <p className="text-slate-500 text-lg italic">732-322-5221</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="bg-[#fdfbf7] p-5 rounded-[1.5rem] text-[#d4af37] border-2 border-[#f0e6d2]">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#042f24] text-xl uppercase tracking-widest text-[10px] mb-2">Email Address</h4>
                    <p className="text-slate-500 text-lg italic">aksavage68@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-[#f0e6d2] h-96">
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
          <div className="bg-[#fdfbf7] p-12 lg:p-16 rounded-[4rem] border-2 border-[#f0e6d2] shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/5 mihrab-shape translate-x-1/2 -translate-y-1/2"></div>
            
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in zoom-in-95 duration-500">
                <div className="bg-[#042f24] p-8 rounded-full mb-8 shadow-2xl">
                  <CheckCircle2 size={64} className="text-[#d4af37]" />
                </div>
                <h2 className="text-4xl font-black text-[#042f24] italic mb-4">Message Sent!</h2>
                <p className="text-slate-500 text-lg mb-10 italic">Thank you for reaching out. Our team will get back to you shortly, Insha'Allah.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-[#042f24] text-[#d4af37] px-12 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#d4af37] hover:text-[#042f24] transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-black text-[#042f24] mb-12 italic">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="p-6 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border-2 border-red-100 italic leading-relaxed shadow-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Full Name</label>
                      <input 
                        required
                        autoComplete="off"
                        value={formData.full_name}
                        onChange={e => setFormData({...formData, full_name: e.target.value})}
                        className={inputStyles} 
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Email</label>
                      <input 
                        required
                        type="email"
                        autoComplete="off"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className={inputStyles} 
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Phone Number</label>
                    <input 
                      type="tel"
                      autoComplete="off"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className={inputStyles} 
                      placeholder="732-000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Message</label>
                    <textarea 
                      required
                      rows={6}
                      autoComplete="off"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className={`${inputStyles} h-40 resize-none font-medium text-slate-600 italic`}
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button 
                    disabled={loading}
                    className="w-full bg-[#042f24] text-[#d4af37] font-black py-6 rounded-full shadow-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all flex items-center justify-center gap-4 uppercase text-xs tracking-[0.3em] disabled:opacity-50"
                  >
                    {loading ? <><Loader2 className="animate-spin" size={24} /> Bismillah...</> : <><Send size={20} /> Submit Message</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicContact;
