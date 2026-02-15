
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Home, MapPin, Clock, Calendar, Image as ImageIcon, Info, Phone,
  Menu, X, ChevronRight, LayoutDashboard, LogOut, Settings,
  Bell, Mail, Users, Heart
} from 'lucide-react';
import PublicHome from './pages/PublicHome';
import PublicPrayerTimes from './pages/PublicPrayerTimes';
import PublicEvents from './pages/PublicEvents';
import PublicGallery from './pages/PublicGallery';
import PublicContact from './pages/PublicContact';
import PublicServices from './pages/PublicServices';
import PublicLeadership from './pages/PublicLeadership';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminEvents from './pages/admin/AdminEvents';
import { supabase } from './services/supabase';

const Navbar = ({ profile }: { profile?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Prayers', path: '/prayer-times' },
    { name: 'Events', path: '/events' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Leadership', path: '/leadership' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-[#042f24] text-white sticky top-0 z-50 shadow-2xl border-b-4 border-[#d4af37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex flex-col group">
              <span className="text-2xl font-black italic tracking-tighter text-[#d4af37] group-hover:text-white transition-colors">
                {profile?.common_name || 'Jamiatul Haq'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Franklin Township, NJ</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-[#d4af37] ${location.pathname === link.path ? 'text-[#d4af37] border-b-2 border-[#d4af37] pb-1' : ''
                  }`}
              >
                {link.name}
              </Link>
            ))}

          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#d4af37] focus:outline-none">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#042f24] border-t-2 border-[#d4af37] animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-6 pb-12 space-y-4 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-4 text-xl font-black italic text-[#d4af37] hover:text-white"
              >
                {link.name}
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = ({ profile }: { profile?: any }) => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#021f18] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-islamic-pattern pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-3xl font-black italic mb-6 text-[#d4af37]">
              {profile?.common_name || 'Jamiatul Haq'}
            </h3>
            <p className="text-sm leading-relaxed text-white/60 mb-8 italic">
              A beacon of faith and service in Franklin Township since {profile?.established_year || '2002'}. We strive to foster a community rooted in spiritual excellence and compassion.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-[#d4af37] flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#042f24] transition-all cursor-pointer">
                <Heart size={18} fill="currentColor" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-[#d4af37]">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/prayer-times" className="hover:text-[#d4af37] transition-colors">Congregational Prayers</Link></li>
              <li><Link to="/services" className="hover:text-[#d4af37] transition-colors">Our Services</Link></li>
              <li><Link to="/events" className="hover:text-[#d4af37] transition-colors">Community Events</Link></li>
              <li><Link to="/contact" className="hover:text-[#d4af37] transition-colors">Contact Masjid</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-[#d4af37]">Location</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin size={20} className="text-[#d4af37] shrink-0" />
                <span>{profile?.address || '385 Lewis Street, Somerset, NJ 08873'}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone size={20} className="text-[#d4af37] shrink-0" />
                <span>{profile?.phone || '732-322-5221'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-[#d4af37]">Support Us</h4>
            <p className="text-xs text-white/50 mb-6 italic">Help us maintain the house of Allah and our community programs.</p>
            <button className="w-full bg-white/5 border-2 border-[#d4af37] text-[#d4af37] py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#d4af37] hover:text-[#042f24] transition-all shadow-xl">
              Donate Online
            </button>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            © {new Date().getFullYear()} Islamic Society of Franklin Township, Inc. • Bismillah
          </p>
        </div>
      </div>
    </footer>
  );
};

const AuthGuard = ({ children }: { children?: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="p-32 text-center text-[#d4af37] font-black italic text-3xl">Bismillah...</div>;
  if (!session) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};

const AdminSidebar = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-[#fdfbf7] overflow-hidden">
      <aside className="w-80 bg-[#042f24] text-white hidden lg:flex flex-col border-r-8 border-[#d4af37]">
        <div className="p-10 border-b border-white/10">
          <h2 className="text-3xl font-black italic text-[#d4af37]">Admin Portal</h2>
          <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mt-2">Masjid Management</p>
        </div>
        <nav className="flex-1 p-8 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] font-black transition-all">
            <LayoutDashboard size={22} /> Dashboard
          </Link>
          <Link to="/admin/events" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] font-black transition-all">
            <Calendar size={22} /> Events
          </Link>
          <Link to="/admin/announcements" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] font-black transition-all">
            <Bell size={22} /> Announcements
          </Link>
          <Link to="/admin/gallery" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] font-black transition-all">
            <ImageIcon size={22} /> Albums
          </Link>
          <Link to="/admin/messages" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] font-black transition-all">
            <Mail size={22} /> Messages
          </Link>
          <div className="pt-10">
            <Link to="/admin/profile" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] font-black transition-all">
              <Settings size={22} /> Masjid Profile
            </Link>
          </div>
        </nav>
        <div className="p-8 border-t border-white/10">
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center justify-center gap-4 p-4 w-full rounded-2xl bg-red-950/50 text-red-400 font-black hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={22} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-12 bg-islamic-pattern">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [masjidProfile, setMasjidProfile] = useState<any>(null);

  useEffect(() => {
    supabase
      .from('masjid_profile')
      .select('*')
      .single()
      .then(({ data }) => {
        if (data) setMasjidProfile(data);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={masjidProfile} />
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/prayer-times" element={<PublicPrayerTimes />} />
          <Route path="/events" element={<PublicEvents />} />
          <Route path="/gallery" element={<PublicGallery />} />
          <Route path="/services" element={<PublicServices />} />
          <Route path="/leadership" element={<PublicLeadership />} />
          <Route path="/contact" element={<PublicContact />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AuthGuard>
              <AdminSidebar><AdminDashboard /></AdminSidebar>
            </AuthGuard>
          } />
          <Route path="/admin/events" element={
            <AuthGuard>
              <AdminSidebar><AdminEvents /></AdminSidebar>
            </AuthGuard>
          } />
        </Routes>
      </div>
      <Footer profile={masjidProfile} />
    </div>
  );
};

export default App;
