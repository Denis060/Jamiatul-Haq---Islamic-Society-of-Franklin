import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Loader2, UserPlus, Settings, Shield, Trash2, Mail, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminUser } from '../../types';

const AdminUsers = () => {
    const { adminUser } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successInfo, setSuccessInfo] = useState<{ email: string, pass: string } | null>(null);

    const [newUser, setNewUser] = useState({ email: '', role: 'secretary_general' });

    useEffect(() => {
        if (adminUser?.role === 'super_admin') {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [adminUser]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('admin_users').select('*').order('created_at', { ascending: true });
            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const generatePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let pass = 'JamiatulHaq';
        for (let i = 0; i < 4; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass + '!';
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessInfo(null);

        try {
            const tempPassword = generatePassword();
            const lowerEmail = newUser.email.toLowerCase();

            // 1. Create User via Supabase Auth
            const { data: authData, error: authErr } = await supabase.auth.signUp({
                email: lowerEmail,
                password: tempPassword,
            });

            if (authErr) throw authErr;

            // 2. Add Role mapping
            const { error: dbErr } = await supabase
                .from('admin_users')
                .insert([{ email: lowerEmail, role: newUser.role }]);

            if (dbErr) {
                throw new Error("Account created but failed to assign role: " + dbErr.message);
            }

            setSuccessInfo({ email: lowerEmail, pass: tempPassword });
            setNewUser({ email: '', role: 'secretary_general' });
            fetchUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (email === adminUser?.email) {
            alert("You cannot remove your own access.");
            return;
        }
        if (!window.confirm(`Are you sure you want to remove access for ${email}?`)) return;
        try {
            const { error } = await supabase.from('admin_users').delete().eq('id', id);
            if (error) throw error;
            fetchUsers();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const inputClasses = "w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] focus:bg-white outline-none font-bold text-slate-900 transition-all shadow-sm";

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-[#d4af37] mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Accounts...</p>
        </div>
    );

    if (adminUser?.role !== 'super_admin') {
        return (
            <div className="flex flex-col items-center py-40 text-center">
                <Shield size={64} className="text-red-500 mb-6" />
                <h2 className="text-3xl font-black italic text-[#042f24] mb-2">Access Restricted</h2>
                <p className="text-slate-500">Only Super Admins can manage user roles.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#042f24] italic tracking-tight">Admin Roles</h1>
                    <p className="text-slate-500 font-medium">Manage which staff accounts can access the admin panel.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl font-bold border-2 border-red-200">
                    {error}
                </div>
            )}

            {successInfo && (
                <div className="bg-[#042f24] text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-[#d4af37]">
                    <div>
                        <h3 className="text-2xl font-black italic text-[#d4af37] mb-2 flex items-center gap-2"><Shield size={24} /> Account Created Successfully!</h3>
                        <p className="text-white/70 text-sm font-medium">Please securely share these login credentials with the staff member. They can log in immediately.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 w-full md:w-auto">
                        <div className="mb-3">
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-1">Email </span>
                            <span className="font-mono text-lg font-bold">{successInfo.email}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-1">Temporary Password</span>
                            <span className="font-mono text-[#d4af37] text-2xl font-black">{successInfo.pass}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Users List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[3.5rem] border-2 border-[#f0e6d2] overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-[#f0e6d2] flex items-center gap-4 text-[#d4af37]">
                            <div className="bg-slate-50 p-3 rounded-2xl"><Users size={24} /></div>
                            <h2 className="text-xl font-black uppercase tracking-widest">Authorized Accounts</h2>
                        </div>
                        <div className="p-8">
                            {users.length === 0 ? (
                                <p className="text-slate-400 text-center italic py-20">No specific roles defined. Defaulting to Super Admin logic for unknown users unless table exists.</p>
                            ) : (
                                <div className="space-y-4">
                                    {users.map(user => (
                                        <div key={user.id} className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group">
                                            <div>
                                                <div className="font-bold text-[#042f24] text-lg mb-1">{user.email}</div>
                                                <div className="inline-block bg-[#042f24] text-[#d4af37] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                    {user.role.replace('_', ' ')}
                                                </div>
                                            </div>
                                            {user.email !== adminUser?.email && (
                                                <button
                                                    onClick={() => handleDelete(user.id, user.email)}
                                                    className="bg-white text-red-500 p-4 rounded-2xl shadow-sm border border-red-100 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add User Form */}
                <div className="bg-white p-10 rounded-[3.5rem] border-2 border-[#d4af37] shadow-lg h-fit sticky top-10 text-center">
                    <div className="w-20 h-20 bg-[#fdfbf7] mx-auto rounded-full flex items-center justify-center text-[#d4af37] mb-6 shadow-inner border border-[#f0e6d2]">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-2xl font-black italic text-[#042f24] mb-8">Grant Access</h2>

                    <form onSubmit={handleAddUser} className="space-y-6 text-left">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Staff Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#d4af37] outline-none transition-all font-bold text-[#042f24]"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Assign Role</label>
                            <select
                                value={newUser.role}
                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                className={inputClasses}
                            >
                                <option value="secretary_general">Secretary General</option>
                                <option value="financial_secretary">Financial Secretary</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                            <p className="text-[10px] text-slate-400 font-bold mt-2">
                                * <span className="text-[#042f24]">Secretary General</span> cannot view or edit financial and donation links.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-[#042f24] text-[#d4af37] font-black py-5 rounded-full shadow-xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] disabled:opacity-50 mt-4"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                            Add Staff Member
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
