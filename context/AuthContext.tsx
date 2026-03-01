import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { AdminUser } from '../types';

interface AuthContextType {
    session: any | null;
    adminUser: AdminUser | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, adminUser: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<any>(null);
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user?.email) {
                fetchAdminRole(session.user.email);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user?.email) {
                fetchAdminRole(session.user.email);
            } else {
                setAdminUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchAdminRole = async (email: string) => {
        // Prevent overriding loading state briefly if already fetching
        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .eq('email', email)
                .single();

            if (data) {
                setAdminUser(data as AdminUser);
            } else {
                // Fallback or auto-create for legacy users
                setAdminUser({ id: 'legacy', email, role: 'super_admin' });
            }
        } catch (err) {
            console.error("Error fetching admin role:", err);
            // Fallback
            setAdminUser({ id: 'error', email, role: 'super_admin' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ session, adminUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
