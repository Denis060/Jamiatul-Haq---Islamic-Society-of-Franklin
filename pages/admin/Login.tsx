
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { LogIn, Lock, Mail, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#042f24] flex items-center justify-center px-4 bg-islamic-pattern">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border-4 border-[#d4af37]">
        <div className="bg-[#042f24] p-10 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-islamic-pattern"></div>
          <h2 className="text-4xl font-black italic text-[#d4af37] relative z-10">Admin Portal</h2>
          <p className="text-white/60 mt-2 font-bold uppercase tracking-widest text-[10px] relative z-10">Staff Access Only</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs font-bold border-2 border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] outline-none transition-all font-bold text-[#042f24]"
                placeholder="admin@jamiatulhaq.org"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] outline-none transition-all font-bold text-[#042f24]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#042f24] text-[#d4af37] font-black py-5 rounded-full shadow-xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] disabled:opacity-50"
          >
            {loading ? 'Bismillah...' : <><LogIn size={18} /> Sign In</>}
          </button>

          <div className="pt-6 border-t border-slate-100 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-[#d4af37] transition-colors">
              <ArrowLeft size={14} /> Back to Website
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
