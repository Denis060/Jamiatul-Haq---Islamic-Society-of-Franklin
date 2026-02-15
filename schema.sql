
-- 1. Masjid Profile Table
CREATE TABLE IF NOT EXISTS masjid_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  official_name TEXT NOT NULL,
  common_name TEXT NOT NULL,
  address TEXT NOT NULL,
  imam_name TEXT,
  phone TEXT,
  email TEXT,
  jumua_time TEXT DEFAULT '1:15 PM',
  whatsapp_link TEXT,
  facilities_image_url TEXT,
  facilities_list TEXT DEFAULT 'Ample Parking, Dedicated Wudu Area, Sisters Prayer Hall, Islamic Library',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure all columns exist for masjid_profile
DO $$ BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'masjid_profile'::regclass AND attname = 'whatsapp_link') THEN
    ALTER TABLE masjid_profile ADD COLUMN whatsapp_link TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'masjid_profile'::regclass AND attname = 'facilities_image_url') THEN
    ALTER TABLE masjid_profile ADD COLUMN facilities_image_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'masjid_profile'::regclass AND attname = 'facilities_list') THEN
    ALTER TABLE masjid_profile ADD COLUMN facilities_list TEXT DEFAULT 'Ample Parking, Dedicated Wudu Area, Sisters Prayer Hall, Islamic Library';
  END IF;
END $$;

-- 2. Prayer Times Table
CREATE TABLE IF NOT EXISTS prayer_times_weekly (
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

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT DEFAULT 'star',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Announcements Table (With Column Fixes)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'General',
  is_pinned BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Defensive check for announcements columns
DO $$ BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'announcements'::regclass AND attname = 'image_url') THEN
    ALTER TABLE announcements ADD COLUMN image_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'announcements'::regclass AND attname = 'type') THEN
    ALTER TABLE announcements ADD COLUMN type TEXT DEFAULT 'General';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'announcements'::regclass AND attname = 'is_pinned') THEN
    ALTER TABLE announcements ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- 6. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Ramadan Schedule Table (The Iftar Schedule)
CREATE TABLE IF NOT EXISTS ramadan_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL,
  gregorian_date DATE NOT NULL,
  suhoor_time TEXT,
  iftar_time TEXT,
  taraweeh_imam TEXT,
  iftar_sponsor TEXT,
  is_sponsored BOOLEAN DEFAULT FALSE,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Security & Permissions
ALTER TABLE masjid_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times_weekly ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ramadan_schedule ENABLE ROW LEVEL SECURITY;

-- Reset and apply all policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public view profile" ON masjid_profile;
    CREATE POLICY "Public view profile" ON masjid_profile FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage profile" ON masjid_profile;
    CREATE POLICY "Admin manage profile" ON masjid_profile FOR ALL USING (auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "Public view prayers" ON prayer_times_weekly;
    CREATE POLICY "Public view prayers" ON prayer_times_weekly FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage prayers" ON prayer_times_weekly;
    CREATE POLICY "Admin manage prayers" ON prayer_times_weekly FOR ALL USING (auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "Public view services" ON services;
    CREATE POLICY "Public view services" ON services FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage services" ON services;
    CREATE POLICY "Admin manage services" ON services FOR ALL USING (auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "Public view team" ON team_members;
    CREATE POLICY "Public view team" ON team_members FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage team" ON team_members;
    CREATE POLICY "Admin manage team" ON team_members FOR ALL USING (auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "Public view announcements" ON announcements;
    CREATE POLICY "Public view announcements" ON announcements FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage announcements" ON announcements;
    CREATE POLICY "Admin manage announcements" ON announcements FOR ALL USING (auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "Public insert messages" ON contact_messages;
    CREATE POLICY "Public insert messages" ON contact_messages FOR INSERT WITH CHECK (true);
    DROP POLICY IF EXISTS "Admin manage messages" ON contact_messages;
    CREATE POLICY "Admin manage messages" ON contact_messages FOR ALL USING (auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "Public view ramadan" ON ramadan_schedule;
    CREATE POLICY "Public view ramadan" ON ramadan_schedule FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin manage ramadan" ON ramadan_schedule;
    CREATE POLICY "Admin manage ramadan" ON ramadan_schedule FOR ALL USING (auth.uid() IS NOT NULL);
END $$;

-- 9. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
