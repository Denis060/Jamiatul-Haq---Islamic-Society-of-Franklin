
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { 
  Plus, Trash2, Edit2, X, Loader2, AlertCircle, 
  CheckCircle2, Users, Heart, GraduationCap, Home, Clock, Star, ArrowUp, ArrowDown
} from 'lucide-react';

const AdminServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('star');
  const [saving, setSaving] = useState(false);

  const iconOptions = [
    { id: 'star', icon: Star, label: 'Spiritual' },
    { id: 'graduation', icon: GraduationCap, label: 'Education' },
    { id: 'heart', icon: Heart, label: 'Welfare' },
    { id: 'home', icon: Home, label: 'Family' },
    { id: 'users', icon: Users, label: 'Community' },
    { id: 'clock', icon: Clock, label: 'Timing' }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setServices(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const nextSortOrder = services.length > 0 
        ? Math.max(...services.map(s => s.sort_order || 0)) + 1 
        : 0;

      const { error: insertError } = await supabase.from('services').insert([
        { 
          title, 
          description, 
          icon_name: iconName,
          sort_order: nextSortOrder
        }
      ]);

      if (insertError) throw insertError;

      setSuccess("Service added successfully!");
      resetForm();
      fetchServices();
      setIsAdding(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this service from the website?')) {
      const { error } = await supabase.from('services').delete().match({ id });
      if (!error) {
        setServices(services.filter(s => s.id !== id));
        setSuccess("Service removed.");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(error.message);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIconName('star');
  };

  const getIcon = (name: string) => {
    const option = iconOptions.find(o => o.id === name);
    const IconComponent = option ? option.icon : Star;
    return <IconComponent />;
  };

  const inputClasses = "w-full p-5 bg-white border-2 border-[#f0e6d2] rounded-[1.5rem] focus:border-[#d4af37] outline-none transition-all font-bold text-[#042f24] placeholder:text-slate-300 shadow-sm";

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight">Services CMS</h1>
          <p className="text-slate-500 font-medium">Manage the spiritual and community services offered.</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) resetForm();
          }}
          className="bg-[#042f24] text-[#d4af37] px-8 py-4 rounded-full font-black flex items-center gap-3 hover:bg-[#d4af37] hover:text-[#042f24] transition-all shadow-xl uppercase text-xs tracking-widest"
        >
          {isAdding ? <><X size={20} /> Cancel</> : <><Plus size={20} /> Add Service</>}
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
        <form onSubmit={handleCreate} className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-[#f0e6d2] mb-16 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Service Title</label>
                <input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClasses}
                  required
                  placeholder="e.g. Marriage Services"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Icon Style</label>
                <div className="grid grid-cols-3 gap-4">
                  {iconOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setIconName(opt.id)}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                        iconName === opt.id 
                          ? 'bg-[#042f24] border-[#d4af37] text-[#d4af37]' 
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-[#d4af37]/30'
                      }`}
                    >
                      <opt.icon size={24} />
                      <span className="text-[8px] font-black uppercase tracking-widest">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Service Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClasses} h-56 resize-none font-medium text-slate-700`}
                required
                placeholder="Briefly explain what this service entails for the community..."
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full mt-12 bg-[#042f24] text-[#d4af37] py-6 rounded-full font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : 'Save Service Bismillah'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-40">
          <Loader2 className="animate-spin text-[#d4af37]" size={64} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-10 rounded-[3rem] border-2 border-[#f0e6d2] shadow-sm flex flex-col justify-between group hover:border-[#d4af37] transition-all">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="p-5 bg-slate-50 rounded-2xl text-[#d4af37] group-hover:bg-[#042f24] transition-colors">
                    {getIcon(service.icon_name)}
                  </div>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-3 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-2xl font-black text-[#042f24] italic mb-4">{service.title}</h3>
                <p className="text-slate-500 text-sm italic leading-relaxed line-clamp-4">{service.description}</p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                 <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-widest">Order: {service.sort_order}</span>
              </div>
            </div>
          ))}

          {services.length === 0 && !isAdding && (
            <div className="col-span-full py-32 border-4 border-dashed border-[#f0e6d2] rounded-[4rem] text-center bg-white/50">
               <Star size={64} className="text-[#d4af37]/20 mx-auto mb-6" />
               <h2 className="text-2xl font-black text-[#042f24] italic">No services defined yet</h2>
               <p className="text-slate-400 font-medium">Click "Add Service" to populate this section.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminServices;
