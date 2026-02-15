
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { 
  Save, Loader2, Moon, Utensils, UserCheck, 
  Calendar, Clock, Sparkles, AlertCircle, RefreshCw, Database
} from 'lucide-react';

const AdminRamadan = () => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ramadan_schedule')
        .select('*')
        .order('day_number', { ascending: true });
      
      if (error) throw error;
      setSchedule(data || []);
      if (data && data.length > 0) {
        setStartDate(data[0].gregorian_date);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!startDate) {
      alert("Please select a Ramadan Start Date first.");
      return;
    }

    if (schedule.length > 0 && !window.confirm("This will overwrite existing schedule. Continue?")) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      // Clear existing safely
      await supabase.from('ramadan_schedule').delete().neq('day_number', 0);

      const newSchedule = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return {
          day_number: i + 1,
          gregorian_date: date.toISOString().split('T')[0],
          suhoor_time: '05:30 AM',
          iftar_time: '07:15 PM',
          taraweeh_imam: 'Guest Qari',
          is_sponsored: false,
          iftar_sponsor: ''
        };
      });

      const { error } = await supabase.from('ramadan_schedule').insert(newSchedule);
      if (error) throw error;

      fetchSchedule();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDay = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('ramadan_schedule')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      setSchedule(schedule.map(s => s.id === id ? { ...s, ...updates } : s));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-40">
      <Loader2 className="animate-spin text-[#d4af37]" size={64} />
    </div>
  );

  // Handle case where table doesn't exist yet
  if (error && (error.includes('PGRST205') || error.includes('not find the table'))) {
    return (
      <div className="max-w-xl mx-auto py-20">
        <div className="bg-white p-12 rounded-[4rem] border-4 border-dashed border-red-100 text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Database size={40} />
          </div>
          <h2 className="text-3xl font-black text-[#042f24] italic mb-4">Ramadan Hub Not Ready</h2>
          <p className="text-slate-500 italic mb-8">
            The database table <strong>ramadan_schedule</strong> is missing.
          </p>
          <div className="bg-red-50 p-6 rounded-2xl text-left border border-red-100">
             <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Technical Action Required:</p>
             <p className="text-xs font-bold text-red-700 leading-relaxed">
               Please copy the code from <strong>schema.sql</strong> and execute it in your Supabase SQL Editor. This will create the Iftar schedule table and set up the necessary permissions.
             </p>
          </div>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#d4af37] outline-none text-xs font-bold text-[#042f24] transition-all";

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight flex items-center gap-3">
             <Moon className="text-[#d4af37]" size={36} /> Ramadan Command Center
          </h1>
          <p className="text-slate-500 font-medium">Manage Imsakiya times, Imams, and Iftar sponsorships.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border-2 border-[#f0e6d2] shadow-sm">
           <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="p-3 border rounded-xl font-bold text-xs"
           />
           <button 
            onClick={handleGenerate}
            disabled={saving}
            className="bg-[#042f24] text-[#d4af37] px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#d4af37] hover:text-[#042f24] transition-all"
           >
             {saving ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
             Initialize 30 Days
           </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-50 border-2 border-red-100 rounded-[2.5rem] text-red-700 flex items-center gap-4 text-sm font-bold">
          <AlertCircle size={24} /> {error}
        </div>
      )}

      <div className="bg-white rounded-[3.5rem] border-2 border-[#f0e6d2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#042f24] text-[#d4af37] text-[10px] font-black uppercase tracking-widest italic">
                <th className="p-6 border-b border-white/10">Day</th>
                <th className="p-6 border-b border-white/10">Date</th>
                <th className="p-6 border-b border-white/10">Suhoor Ends</th>
                <th className="p-6 border-b border-white/10">Iftar / Maghrib</th>
                <th className="p-6 border-b border-white/10">Taraweeh Imam</th>
                <th className="p-6 border-b border-white/10">Iftar Sponsor</th>
                <th className="p-6 border-b border-white/10 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.map((day) => (
                <tr key={day.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-6 font-black text-[#042f24]">{day.day_number}</td>
                  <td className="p-6 text-[10px] font-black uppercase text-slate-400">
                    {new Date(day.gregorian_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="p-6">
                    <input 
                      value={day.suhoor_time} 
                      onChange={(e) => handleUpdateDay(day.id, { suhoor_time: e.target.value })} 
                      className={inputClasses} 
                    />
                  </td>
                  <td className="p-6">
                    <input 
                      value={day.iftar_time} 
                      onChange={(e) => handleUpdateDay(day.id, { iftar_time: e.target.value })} 
                      className={inputClasses} 
                    />
                  </td>
                  <td className="p-6">
                    <input 
                      value={day.taraweeh_imam} 
                      onChange={(e) => handleUpdateDay(day.id, { taraweeh_imam: e.target.value })} 
                      className={inputClasses} 
                    />
                  </td>
                  <td className="p-6">
                    <input 
                      value={day.iftar_sponsor} 
                      onChange={(e) => handleUpdateDay(day.id, { iftar_sponsor: e.target.value })} 
                      className={inputClasses} 
                      placeholder="Family or Org Name"
                    />
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => handleUpdateDay(day.id, { is_sponsored: !day.is_sponsored })}
                      className={`p-3 rounded-2xl border-2 transition-all ${
                        day.is_sponsored 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                          : 'bg-white border-slate-200 text-slate-300 hover:border-[#d4af37]'
                      }`}
                    >
                      <UserCheck size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRamadan;
