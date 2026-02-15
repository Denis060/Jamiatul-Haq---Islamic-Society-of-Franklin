
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Mail, Trash2, Check, User, Phone, Clock, Loader2, AlertCircle, MessageSquare } from 'lucide-react';

const AdminMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) setError(error.message);
    else setMessages(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .match({ id });
    
    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this message?')) {
      const { error } = await supabase.from('contact_messages').delete().match({ id });
      if (!error) setMessages(messages.filter(m => m.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight">Inbox</h1>
        <p className="text-slate-500 font-medium">Manage community inquiries and feedback.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-40">
          <Loader2 className="animate-spin text-[#d4af37]" size={64} />
        </div>
      ) : (
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="bg-white rounded-[4rem] p-32 text-center shadow-xl border-2 border-[#f0e6d2]">
              <MessageSquare size={64} className="text-slate-100 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-[#042f24] italic">No messages yet</h2>
              <p className="text-slate-400 font-medium mt-2">When someone contacts you, their message will appear here.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div 
                key={m.id} 
                className={`bg-white rounded-[2.5rem] border-2 transition-all overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-xl ${
                  m.is_read ? 'border-[#f0e6d2] opacity-80' : 'border-[#d4af37] border-l-[12px]'
                }`}
              >
                <div className="p-10 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-[#042f24] italic">{m.full_name}</h3>
                        {!m.is_read && <span className="w-3 h-3 bg-[#d4af37] rounded-full animate-pulse"></span>}
                      </div>
                      <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-2 text-[#d4af37]"><Mail size={14} /> {m.email}</span>
                        {m.phone && <span className="flex items-center gap-2 text-[#d4af37]"><Phone size={14} /> {m.phone}</span>}
                        <span className="flex items-center gap-2"><Clock size={14} /> {new Date(m.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic text-lg bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    "{m.message}"
                  </p>
                </div>
                <div className="bg-[#fdfbf7] p-8 md:w-32 flex flex-row md:flex-col justify-center items-center gap-4 border-t-2 md:border-t-0 md:border-l-2 border-[#f0e6d2]">
                  {!m.is_read && (
                    <button 
                      onClick={() => markAsRead(m.id)}
                      className="bg-[#042f24] text-[#d4af37] p-4 rounded-full hover:bg-[#d4af37] hover:text-[#042f24] transition-all shadow-lg"
                      title="Mark as Read"
                    >
                      <Check size={20} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(m.id)}
                    className="bg-white text-red-500 p-4 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md border border-red-50"
                    title="Delete Message"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
