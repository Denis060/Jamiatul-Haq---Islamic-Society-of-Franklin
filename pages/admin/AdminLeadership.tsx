
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import {
  Plus, Trash2, Edit2, X, Loader2, AlertCircle,
  CheckCircle2, Users, Upload, Camera, ArrowUp, ArrowDown, Save, Briefcase
} from 'lucide-react';

const AdminLeadership = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const commonRoles = ["Imam", "Naib", "Chief", "Chairman", "Chairlady", "Secretary", "Treasurer", "Board Member", "Youth Coordinator"];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
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
      const fileName = `team-${Date.now()}.${fileExt}`;
      const filePath = `team/${fileName}`;

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
        name,
        role,
        bio,
        sort_order: parseInt(sortOrder) || 0,
        image_url: finalImageUrl
      };

      let resultError;
      if (editingId) {
        const { error } = await supabase.from('team_members').update(payload).match({ id: editingId });
        resultError = error;
      } else {
        const { error } = await supabase.from('team_members').insert([payload]);
        resultError = error;
      }

      if (resultError) throw resultError;

      setSuccess(editingId ? "Profile updated successfully!" : "Member added to the team, Bismillah!");
      resetForm();
      fetchMembers();
      setIsAdding(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const startEdit = (member: any) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setBio(member.bio || '');
    setSortOrder(member.sort_order?.toString() || '0');
    setImagePreview(member.image_url);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this person from the leadership list?')) {
      const { error } = await supabase.from('team_members').delete().match({ id });
      if (!error) {
        setMembers(members.filter(m => m.id !== id));
        setSuccess("Member removed.");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(error.message);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setBio('');
    setSortOrder('0');
    setImageFile(null);
    setImagePreview(null);
  };

  const inputClasses = "w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] focus:bg-white outline-none font-bold text-[#042f24] transition-all shadow-sm";

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight">Leadership Portal</h1>
          <p className="text-slate-500 font-medium">Manage your Chief, Chairman, and Board Members.</p>
        </div>
        <button
          onClick={() => {
            if (isAdding) resetForm();
            setIsAdding(!isAdding);
          }}
          className="bg-[#042f24] text-[#d4af37] px-8 py-4 rounded-full font-black flex items-center gap-3 hover:bg-[#d4af37] hover:text-[#042f24] transition-all shadow-xl uppercase text-xs tracking-widest"
        >
          {isAdding ? <><X size={20} /> Close Form</> : <><Plus size={20} /> Add Personnel</>}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className={inputClasses} required placeholder="e.g. Alhaji Abdullah Karim" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Position / Title</label>
                  <input
                    list="roles"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className={inputClasses}
                    required
                    placeholder="Chief / Chairman / Imam"
                  />
                  <datalist id="roles">
                    {commonRoles.map(r => <option key={r} value={r} />)}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3">Professional Bio</label>
                <textarea
                  value={bio} onChange={e => setBio(e.target.value)}
                  className={`${inputClasses} h-40 resize-none font-medium italic leading-relaxed`}
                  placeholder="Summarize their contribution and background..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3 flex justify-between">
                  Display Priority <span>(0 = Top/First)</span>
                </label>
                <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className={inputClasses} />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3 w-full text-center">Official Portrait</label>
              <div
                className="w-full aspect-[4/5] border-4 border-dashed border-[#f0e6d2] rounded-[3rem] overflow-hidden group cursor-pointer hover:border-[#d4af37] transition-all bg-[#fdfbf7] flex flex-col items-center justify-center text-slate-400 relative"
                onClick={() => document.getElementById('team-photo-input')?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera size={48} className="mb-4 text-[#d4af37]/40" />
                    <span className="font-black uppercase text-[10px] tracking-widest">Upload Image</span>
                  </>
                )}
                <input type="file" id="team-photo-input" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-4 italic text-center">High quality portrait recommended (4:5 Ratio).</p>
            </div>
          </div>

          <button
            type="submit" disabled={saving}
            className="w-full mt-12 bg-[#042f24] text-[#d4af37] py-6 rounded-full font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : editingId ? 'Apply Changes' : 'Confirm & Save Member'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-40">
          <Loader2 className="animate-spin text-[#d4af37]" size={64} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div key={member.id} className="bg-white p-10 rounded-[3.5rem] border-2 border-[#f0e6d2] shadow-sm flex flex-col group hover:border-[#d4af37] transition-all overflow-hidden relative">
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button onClick={() => startEdit(member)} className="p-3 bg-white/90 backdrop-blur text-[#042f24] rounded-2xl shadow-xl hover:bg-[#d4af37] transition-all">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(member.id)} className="p-3 bg-white/90 backdrop-blur text-red-500 rounded-2xl shadow-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 border-2 border-slate-50 relative">
                <img
                  src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=042f24&color=d4af37&size=400`}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt={member.name}
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#042f24] text-[#d4af37] px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                    Priority: {member.sort_order}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={12} className="text-[#d4af37]" />
                  <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-[0.2em]">{member.role}</span>
                </div>
                <h3 className="text-2xl font-black text-[#042f24] italic mb-4">{member.name}</h3>
                <p className="text-slate-500 text-sm italic leading-relaxed line-clamp-3">"{member.bio || 'Dedicated community leader.'}"</p>
              </div>
            </div>
          ))}

          {members.length === 0 && !isAdding && (
            <div className="col-span-full py-32 border-4 border-dashed border-[#f0e6d2] rounded-[4rem] text-center bg-white/50">
              <Users size={64} className="text-[#d4af37]/20 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-[#042f24] italic">Empty Leadership List</h2>
              <p className="text-slate-400 font-medium">Add your executive members to showcase the masjid's leadership.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminLeadership;
