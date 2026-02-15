
-- 1. Drop existing table to ensure schema sync
DROP TABLE IF EXISTS contact_messages;

-- 2. Create the table with exact columns expected by the app
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 4. Cleanup and recreate policies
DROP POLICY IF EXISTS "Public can send messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins full access messages" ON contact_messages;

-- 5. Create fresh policies
CREATE POLICY "Public can send messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins full access messages" ON contact_messages FOR ALL USING (auth.uid() IS NOT NULL);

-- 6. Masjid Profile Table with WhatsApp link
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure RLS and Policies for other tables (idempotent)
ALTER TABLE masjid_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profile" ON masjid_profile;
CREATE POLICY "Public can view profile" ON masjid_profile FOR SELECT USING (true);

-- Prayer Times Table
CREATE TABLE IF NOT EXISTS prayer_times_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fajr TEXT NOT NULL,
  dhuhr TEXT NOT NULL,
  asr TEXT NOT NULL,
  maghrib TEXT NOT NULL,
  isha TEXT NOT NULL,
  jumua TEXT NOT NULL,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE prayer_times_weekly ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view prayer times" ON prayer_times_weekly;
CREATE POLICY "Public can view prayer times" ON prayer_times_weekly FOR SELECT USING (true);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (status = 'published');

-- Add column if it doesn't exist (in case table already existed)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'masjid_profile'::regclass AND attname = 'whatsapp_link') THEN
    ALTER TABLE masjid_profile ADD COLUMN whatsapp_link TEXT;
  END IF;
END $$;
