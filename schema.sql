
-- 1. Profiles table (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Masjid Profile (Global Settings)
CREATE TABLE masjid_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  official_name TEXT NOT NULL DEFAULT 'Islamic Society of Franklin Township, Inc.',
  common_name TEXT NOT NULL DEFAULT 'Jamiatul Haq',
  established_year INTEGER DEFAULT 2002,
  address TEXT DEFAULT '385 Lewis Street, Somerset, New Jersey 08873, USA',
  imam_name TEXT DEFAULT 'Alhaji Abdullah Karim Savage',
  phone TEXT DEFAULT '732-322-5221',
  email TEXT DEFAULT 'aksavage68@gmail.com',
  jumua_time TEXT DEFAULT '1:15 PM',
  google_maps_link TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Prayer Times (Weekly/Fixed Schedule)
CREATE TABLE prayer_times_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fajr TEXT,
  dhuhr TEXT,
  asr TEXT,
  maghrib TEXT,
  isha TEXT,
  jumua TEXT,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Gallery Albums
CREATE TABLE gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Gallery Photos
CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Contact Messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --- RLS POLICIES ---

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE masjid_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times_weekly ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can Read
CREATE POLICY "Public can view published announcements" ON announcements FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view gallery albums" ON gallery_albums FOR SELECT USING (true);
CREATE POLICY "Public can view gallery photos" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "Public can view prayer times" ON prayer_times_weekly FOR SELECT USING (true);
CREATE POLICY "Public can view masjid profile" ON masjid_profile FOR SELECT USING (true);

-- Admin/Editor can CUD
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins/Editors can manage events" ON events FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins/Editors can manage gallery" ON gallery_albums FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins/Editors can manage photos" ON gallery_photos FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins/Editors can manage announcements" ON announcements FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only Admin can manage masjid profile" ON masjid_profile FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Contact Messages (Public can Create, Admin can Read)
CREATE POLICY "Public can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view contact messages" ON contact_messages FOR SELECT USING (auth.uid() IS NOT NULL);

-- STORAGE BUCKETS
-- (Manual setup in Supabase UI required for buckets 'events' and 'gallery')
-- Policy for Storage: Authenticated can upload/delete. Public can read.
