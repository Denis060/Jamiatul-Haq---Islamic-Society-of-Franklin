
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { LogIn, Lock, Mail } from 'lucide-react';

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
    <div className="min-h-screen bg-[#042f24] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-islamic-pattern pointer-events-none"></div>
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border-4 border-[#d4af37]">
        <div className="bg-[#042f24] p-10 text-center border-b-4 border-[#d4af37]">
          <h2 className="text-3xl font-black italic text-[#d4af37]">Admin Portal</h2>
          <p className="text-white/60 mt-2 text-xs font-bold uppercase tracking-widest">Jamiatul Haq Staff Login</p>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#042f24] uppercase tracking-widest mb-3">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-[#d4af37]" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#fdfbf7] border-2 border-gray-100 rounded-xl focus:border-[#d4af37] focus:ring-0 transition-all outline-none font-medium text-[#042f24]"
                placeholder="staff@jamiatulhaq.org"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#042f24] uppercase tracking-widest mb-3">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-[#d4af37]" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#fdfbf7] border-2 border-gray-100 rounded-xl focus:border-[#d4af37] focus:ring-0 transition-all outline-none font-medium text-[#042f24]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#042f24] text-[#d4af37] font-black py-4 rounded-xl shadow-lg hover:bg-[#064e3b] transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? 'Authenticating...' : <><LogIn size={20} /> Sign In</>}
          </button>

          <p className="text-center text-xs text-gray-400 font-medium">
            For access issues, please contact the IT Administrator.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
