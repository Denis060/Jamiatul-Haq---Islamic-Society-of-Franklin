
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Home, MapPin, Clock, Calendar, Image as ImageIcon, LayoutDashboard, LogOut, Settings, 
  Bell, Mail, Landmark, Users, Menu, X, Heart
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
import AdminProfile from './pages/admin/AdminProfile';
import { supabase } from './services/supabase';

const Navbar = () => {
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
              <span className="text-2xl font-black italic tracking-tighter text-[#d4af37] group-hover:text-white transition-colors">Jamiatul Haq</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Franklin Township, NJ</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-[#d4af37] ${
                  location.pathname === link.path ? 'text-[#d4af37] border-b-2 border-[#d4af37] pb-1' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/admin/login" className="bg-[#d4af37] text-[#042f24] px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white transition-all">Portal</Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#d4af37] focus:outline-none">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-[#042f24] border-t-2 border-[#d4af37]">
          <div className="px-4 pt-6 pb-12 space-y-4 text-center">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block py-4 text-xl font-black italic text-[#d4af37]">{link.name}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return (
    <footer className="bg-[#021f18] text-white border-t-4 border-[#d4af37] py-12 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">© {new Date().getFullYear()} Jamiatul Haq • Bismillah</p>
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
  }, []);
  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const AdminSidebar = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-[#fdfbf7]">
      <aside className="w-80 bg-[#042f24] text-white hidden lg:flex flex-col border-r-8 border-[#d4af37]">
        <div className="p-10 border-b border-white/10">
          <h2 className="text-3xl font-black italic text-[#d4af37]">Portal</h2>
        </div>
        <nav className="flex-1 p-8 space-y-2 font-black uppercase text-[10px] tracking-widest">
          <Link to="/admin/dashboard" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24]"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/admin/profile" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24]"><Landmark size={18} /> Masjid Profile</Link>
          <Link to="/admin/events" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24]"><Calendar size={18} /> Events</Link>
          <Link to="/admin/announcements" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24]"><Bell size={18} /> News</Link>
          <Link to="/admin/gallery" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24]"><ImageIcon size={18} /> Albums</Link>
        </nav>
        <div className="p-8"><button onClick={() => supabase.auth.signOut()} className="w-full p-4 rounded-2xl bg-red-950/50 text-red-400 font-black hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"><LogOut size={18} /> Sign Out</button></div>
      </aside>
      <main className="flex-1 overflow-y-auto p-12 bg-islamic-pattern">{children}</main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/prayer-times" element={<PublicPrayerTimes />} />
          <Route path="/events" element={<PublicEvents />} />
          <Route path="/gallery" element={<PublicGallery />} />
          <Route path="/services" element={<PublicServices />} />
          <Route path="/leadership" element={<PublicLeadership />} />
          <Route path="/contact" element={<PublicContact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AuthGuard><AdminSidebar><AdminDashboard /></AdminSidebar></AuthGuard>} />
          <Route path="/admin/events" element={<AuthGuard><AdminSidebar><AdminEvents /></AuthGuard>} />
          <Route path="/admin/profile" element={<AuthGuard><AdminSidebar><AdminProfile /></AdminSidebar></AuthGuard>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
