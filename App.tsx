
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  Home, MapPin, Clock, Calendar, Image as ImageIcon, LayoutDashboard, LogOut, Settings,
  Bell, Mail, Landmark, Users, Menu, X, Heart, MessageSquare, Briefcase, Megaphone, Moon, Phone
} from 'lucide-react';
import PublicHome from './pages/PublicHome';
import PublicPrayerTimes from './pages/PublicPrayerTimes';
import PublicEvents from './pages/PublicEvents';
import PublicEventDetail from './pages/PublicEventDetail';
import PublicGallery from './pages/PublicGallery';
import PublicAlbumDetail from './pages/PublicAlbumDetail';
import PublicContact from './pages/PublicContact';
import PublicServices from './pages/PublicServices';
import PublicLeadership from './pages/PublicLeadership';
import PublicAnnouncements from './pages/PublicAnnouncements';
import PublicRamadan from './pages/PublicRamadan';
import PublicDonate from './pages/PublicDonate';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminProfile from './pages/admin/AdminProfile';
import AdminMessages from './pages/admin/AdminMessages';
import AdminGallery from './pages/admin/AdminGallery';
import AdminServices from './pages/admin/AdminServices';
import AdminLeadership from './pages/admin/AdminLeadership';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminRamadan from './pages/admin/AdminRamadan';
import { supabase, MOCK_PROFILE } from './services/supabase';

const Navbar = ({ profile }: { profile?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Prayers', path: '/prayer-times' },
    { name: 'Ramadan Hub', path: '/ramadan' },
    { name: 'News', path: '/announcements' },
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

          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-[#d4af37] ${location.pathname === link.path || (link.path.startsWith('/gallery') && location.pathname.startsWith('/gallery')) || (link.path.startsWith('/events') && location.pathname.startsWith('/events')) ? 'text-[#d4af37] border-b-2 border-[#d4af37] pb-1' : ''
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/donate"
              className="bg-[#d4af37] text-[#042f24] px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-lg hover:translate-y-[-2px]"
            >
              Donate
            </Link>
          </div>
          <div className="md:hidden flex items-center gap-4">
            <Link
              to="/donate"
              className="bg-[#d4af37] text-[#042f24] px-4 py-2 rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-white transition-all"
            >
              Donate
            </Link>
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
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-4 text-xl font-black italic text-[#d4af37] hover:text-white"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/donate"
              onClick={() => setIsOpen(false)}
              className="block py-4 text-xl font-black italic text-white bg-[#d4af37]/20 rounded-xl"
            >
              Donate
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.from('masjid_profile').select('*').single().then(({ data }) => {
      setProfile(data || MOCK_PROFILE);
    });
  }, []);

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#021f18] text-white border-t-8 border-[#d4af37] relative overflow-hidden">
      {/* Decorative background pattern - pointer events none so it doesn't block clicks */}
      <div className="absolute inset-0 opacity-5 bg-islamic-pattern pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex flex-col">
              <span className="text-3xl font-black italic tracking-tighter text-[#d4af37]">{profile?.common_name || 'Jamiatul Haq'}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Islamic Society of Franklin Township</span>
            </Link>
            <p className="text-white/50 italic text-sm leading-relaxed max-w-xs">
              Providing spiritual guidance and community services to Somerset and surrounding areas since {profile?.established_year || '2002'}.
            </p>
            <div className="flex items-start gap-3 text-white/60">
              <MapPin size={18} className="shrink-0 text-[#d4af37] mt-1" />
              <span className="text-xs font-medium italic">{profile?.address || '385 Lewis Street, Somerset, NJ 08873'}</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-[#d4af37] font-black uppercase tracking-widest text-[10px] mb-8 border-l-2 border-[#d4af37] pl-3">Quick Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Prayer Times', path: '/prayer-times' },
                { name: 'Ramadan Hub', path: '/ramadan' },
                { name: 'Latest News', path: '/announcements' },
                { name: 'Community Events', path: '/events' },
                { name: 'Masjid Services', path: '/services' }
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm font-bold text-white/50 hover:text-[#d4af37] transition-all italic flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#d4af37]/40 group-hover:w-3 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[#d4af37] font-black uppercase tracking-widest text-[10px] mb-8 border-l-2 border-[#d4af37] pl-3">Contact Admin</h4>
            <ul className="space-y-5">
              <li>
                <a href={`tel:${profile?.phone}`} className="text-sm font-bold text-white/50 hover:text-[#d4af37] transition-colors italic flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg"><Phone size={14} /></div>
                  {profile?.phone || '732-322-5221'}
                </a>
              </li>
              <li>
                <a href={`mailto:${profile?.email}`} className="text-sm font-bold text-white/50 hover:text-[#d4af37] transition-colors italic flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg"><Mail size={14} /></div>
                  {profile?.email || 'aksavage68@gmail.com'}
                </a>
              </li>
              <li className="pt-4">
                <Link to="/contact" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-6 py-3 rounded-full hover:bg-[#d4af37] hover:text-[#042f24] transition-all">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h4 className="text-[#d4af37] font-black uppercase tracking-widest text-[10px] mb-8 border-l-2 border-[#d4af37] pl-3">Social Community</h4>
            <p className="text-white/40 text-xs italic mb-8 leading-relaxed">
              Join our official WhatsApp group for moon sighting, prayer time changes, and emergency closure alerts.
            </p>
            {profile?.whatsapp_link ? (
              <a
                href={profile.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#d4af37] text-[#042f24] px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-white transition-all w-full justify-center"
              >
                <MessageSquare size={16} /> WhatsApp Community
              </a>
            ) : (
              <div className="bg-white/5 border border-white/10 text-white/20 p-5 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest italic">
                WhatsApp Link Coming Soon
              </div>
            )}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
            © {new Date().getFullYear()} Jamiatul Haq • Somerset, NJ
          </p>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
            <Link to="/admin/login" className="hover:text-[#d4af37] transition-colors">Admin Login</Link>
            <span>Bismillah ir-Rahman ir-Rahim</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AuthGuard = ({ children }: { children?: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#042f24]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4af37]"></div>
    </div>
  );

  if (!session) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};

const AdminSidebar = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#fdfbf7] overflow-hidden">
      <aside className="w-80 bg-[#042f24] text-white hidden lg:flex flex-col border-r-8 border-[#d4af37]">
        <div className="p-10 border-b border-white/10 text-center">
          <h2 className="text-3xl font-black italic text-[#d4af37]">Portal</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2 font-black">Management Console</p>
        </div>
        <nav className="flex-1 p-8 space-y-2 font-black uppercase text-[10px] tracking-widest">
          <Link to="/admin/dashboard" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/admin/messages" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"><MessageSquare size={18} /> Inbox</Link>
          <Link to="/admin/announcements" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"><Megaphone size={18} /> Announcements</Link>
          <Link to="/admin/ramadan" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"><Moon size={18} /> Ramadan hub</Link>
          <Link to="/admin/profile" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"><Landmark size={18} /> Masjid Profile</Link>
          <Link to="/admin/leadership" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"><Users size={18} /> Team</Link>
          <Link to="/admin/events" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"><Calendar size={18} /> Events</Link>
          <Link to="/admin/services" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"><Briefcase size={18} /> Services</Link>
          <Link to="/admin/gallery" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#042f24] transition-all"><ImageIcon size={18} /> Gallery</Link>
        </nav>
        <div className="p-8">
          <button
            onClick={handleSignOut}
            className="w-full p-4 rounded-2xl bg-red-950/50 text-red-400 font-black hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
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
          <Route path="/" element={<PublicHome />} />
          <Route path="/prayer-times" element={<PublicPrayerTimes />} />
          <Route path="/announcements" element={<PublicAnnouncements />} />
          <Route path="/ramadan" element={<PublicRamadan />} />
          <Route path="/events" element={<PublicEvents />} />
          <Route path="/events/:slug" element={<PublicEventDetail />} />
          <Route path="/gallery" element={<PublicGallery />} />
          <Route path="/gallery/:slug" element={<PublicAlbumDetail />} />
          <Route path="/services" element={<PublicServices />} />
          <Route path="/leadership" element={<PublicLeadership />} />
          <Route path="/donate" element={<PublicDonate />} />
          <Route path="/contact" element={<PublicContact />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AuthGuard><AdminSidebar><AdminDashboard /></AdminSidebar></AuthGuard>} />
          <Route path="/admin/messages" element={<AuthGuard><AdminSidebar><AdminMessages /></AdminSidebar></AuthGuard>} />
          <Route path="/admin/events" element={<AuthGuard><AdminSidebar><AdminEvents /></AdminSidebar></AuthGuard>} />
          <Route path="/admin/services" element={<AuthGuard><AdminSidebar><AdminServices /></AdminSidebar></AuthGuard>} />
          <Route path="/admin/profile" element={<AuthGuard><AdminSidebar><AdminProfile /></AdminSidebar></AuthGuard>} />
          <Route path="/admin/gallery" element={<AuthGuard><AdminSidebar><AdminGallery /></AdminSidebar></AuthGuard>} />
          <Route path="/admin/leadership" element={<AuthGuard><AdminSidebar><AdminLeadership /></AdminSidebar></AuthGuard>} />
          <Route path="/admin/announcements" element={<AuthGuard><AdminSidebar><AdminAnnouncements /></AdminSidebar></AuthGuard>} />
          <Route path="/admin/ramadan" element={<AuthGuard><AdminSidebar><AdminRamadan /></AdminSidebar></AuthGuard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
