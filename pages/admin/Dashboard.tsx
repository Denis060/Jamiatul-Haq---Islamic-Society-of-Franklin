
import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Bell, Mail, TrendingUp, Clock, 
  ChevronRight, ArrowUpRight, Settings, MessageSquare, Loader2, Megaphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#f0e6d2] shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>
        <Icon size={24} />
      </div>
      {subValue && (
        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          {subValue}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-4xl font-black text-[#042f24] italic">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    messages: 0,
    newMessages: 0,
    teamCount: 0,
    announcementCount: 0
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [eventsRes, messagesRes, newMessagesRes, teamRes, newsRes] = await Promise.all([
          supabase.from('events').select('id', { count: 'exact' }),
          supabase.from('contact_messages').select('id', { count: 'exact' }),
          supabase.from('contact_messages').select('*').eq('is_read', false).order('created_at', { ascending: false }).limit(3),
          supabase.from('team_members').select('id', { count: 'exact' }),
          supabase.from('announcements').select('id', { count: 'exact' })
        ]);

        setStats({
          events: eventsRes.count || 0,
          messages: messagesRes.count || 0,
          newMessages: newMessagesRes.data?.length || 0,
          teamCount: teamRes.count || 0,
          announcementCount: newsRes.count || 0
        });

        setRecentMessages(newMessagesRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-40">
      <Loader2 className="animate-spin text-[#d4af37]" size={64} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight">Assalamu Alaikum</h1>
          <p className="text-slate-500 font-medium">Welcome back to the management portal.</p>
        </div>
        <div className="bg-[#f0e6d2] text-[#042f24] px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Clock size={16} className="text-[#d4af37]" /> Portal Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard title="Total Events" value={stats.events} icon={Calendar} color="bg-blue-500" />
        <StatCard title="Messages" value={stats.messages} icon={Mail} color="bg-[#042f24]" subValue={`${stats.newMessages} NEW`} />
        <StatCard title="Announcements" value={stats.announcementCount} icon={Megaphone} color="bg-[#d4af37]" />
        <StatCard title="Team Members" value={stats.teamCount} icon={Users} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Messages */}
        <div className="bg-white rounded-[3.5rem] border-2 border-[#f0e6d2] shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 border-b border-[#f0e6d2] flex justify-between items-center">
            <h2 className="font-black text-[#042f24] italic text-2xl flex items-center gap-3">
              <MessageSquare className="text-[#d4af37]" size={28} /> New Inquiries
            </h2>
            <Link to="/admin/messages" className="text-[#d4af37] text-[10px] font-black uppercase tracking-widest hover:text-[#042f24] transition-colors flex items-center gap-2">
              All Inbox <ChevronRight size={16} />
            </Link>
          </div>
          <div className="flex-1">
            {recentMessages.length === 0 ? (
              <div className="p-20 text-center">
                <p className="text-slate-300 font-black uppercase tracking-widest text-xs">No unread messages</p>
              </div>
            ) : (
              <div className="divide-y-2 divide-[#f0e6d2]">
                {recentMessages.map((m) => (
                  <Link to="/admin/messages" key={m.id} className="p-10 flex items-start gap-6 hover:bg-[#fdfbf7] transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-[#042f24] flex items-center justify-center text-[#d4af37] font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                      {m.full_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-[#042f24] italic text-xl truncate">{m.full_name}</h4>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest whitespace-nowrap">{new Date(m.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-500 text-sm italic line-clamp-1 leading-relaxed">"{m.message}"</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#042f24] rounded-[3.5rem] p-12 text-white relative overflow-hidden flex flex-col justify-between border-4 border-[#064e3b]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 mihrab-shape -rotate-12 translate-x-1/4 -translate-y-1/4"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black italic mb-10 text-[#d4af37]">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-6">
              <Link to="/admin/announcements" className="bg-white/5 hover:bg-[#d4af37] group p-8 rounded-[2rem] transition-all border border-white/10 flex flex-col items-center text-center">
                <Megaphone className="mb-4 text-[#d4af37] group-hover:text-[#042f24]" size={32} />
                <h4 className="font-black uppercase tracking-widest text-[10px] group-hover:text-[#042f24]">Broadcast</h4>
              </Link>
              <Link to="/admin/leadership" className="bg-white/5 hover:bg-[#d4af37] group p-8 rounded-[2rem] transition-all border border-white/10 flex flex-col items-center text-center">
                <Users className="mb-4 text-[#d4af37] group-hover:text-[#042f24]" size={32} />
                <h4 className="font-black uppercase tracking-widest text-[10px] group-hover:text-[#042f24]">Manage Team</h4>
              </Link>
              <Link to="/admin/profile" className="bg-white/5 hover:bg-[#d4af37] group p-8 rounded-[2rem] transition-all border border-white/10 flex flex-col items-center text-center">
                <Clock className="mb-4 text-[#d4af37] group-hover:text-[#042f24]" size={32} />
                <h4 className="font-black uppercase tracking-widest text-[10px] group-hover:text-[#042f24]">Prayers</h4>
              </Link>
              <Link to="/admin/events" className="bg-white/5 hover:bg-[#d4af37] group p-8 rounded-[2rem] transition-all border border-white/10 flex flex-col items-center text-center">
                <Calendar className="mb-4 text-[#d4af37] group-hover:text-[#042f24]" size={32} />
                <h4 className="font-black uppercase tracking-widest text-[10px] group-hover:text-[#042f24]">Events</h4>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
