
import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Bell, Mail, TrendingUp, Clock, 
  ChevronRight, ArrowUpRight, Settings
} from 'lucide-react';
import { supabase } from '../../services/supabase';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} text-white`}>
        <Icon size={24} />
      </div>
      <span className="flex items-center text-emerald-600 text-xs font-bold">
        +12% <TrendingUp size={12} className="ml-1" />
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    messages: 0,
    announcements: 0,
    users: 0
  });

  useEffect(() => {
    // In a real app, fetch these counts from Supabase
    setStats({
      events: 8,
      messages: 24,
      announcements: 5,
      users: 12
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back, Admin. Here is what's happening.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Clock size={16} /> Last updated: Just now
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Events" value={stats.events} icon={Calendar} color="bg-blue-500" />
        <StatCard title="New Messages" value={stats.messages} icon={Mail} color="bg-amber-500" />
        <StatCard title="Active Announcements" value={stats.announcements} icon={Bell} color="bg-emerald-500" />
        <StatCard title="Subscribers" value="342" icon={Users} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Recent Messages</h2>
            <button className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {i === 1 ? 'JD' : i === 2 ? 'AM' : 'SH'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 truncate">Inquiry about Nikah</h4>
                    <span className="text-[10px] text-slate-400 font-medium">2 HOURS AGO</span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-1">I would like to know the process for booking an Imam for a Nikah ceremony next month...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-emerald-950 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white/10 hover:bg-white/20 p-6 rounded-xl text-left transition-all border border-white/5">
                <Calendar className="mb-4 text-emerald-400" />
                <h4 className="font-bold">Add Event</h4>
                <p className="text-emerald-200 text-xs">Create a new program</p>
              </button>
              <button className="bg-white/10 hover:bg-white/20 p-6 rounded-xl text-left transition-all border border-white/5">
                <Bell className="mb-4 text-emerald-400" />
                <h4 className="font-bold">Broadcast</h4>
                <p className="text-emerald-200 text-xs">Post announcement</p>
              </button>
              <button className="bg-white/10 hover:bg-white/20 p-6 rounded-xl text-left transition-all border border-white/5">
                <Clock className="mb-4 text-emerald-400" />
                <h4 className="font-bold">Prayer Times</h4>
                <p className="text-emerald-200 text-xs">Update iqamah</p>
              </button>
              <button className="bg-white/10 hover:bg-white/20 p-6 rounded-xl text-left transition-all border border-white/5">
                <Settings className="mb-4 text-emerald-400" />
                <h4 className="font-bold">Profile</h4>
                <p className="text-emerald-200 text-xs">Edit masjid info</p>
              </button>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
