
-- 1. Ensure the masjid_profile table exists and has the required column
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

-- 2. Add the column specifically if it was somehow missed
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'masjid_profile'::regclass AND attname = 'whatsapp_link') THEN
    ALTER TABLE masjid_profile ADD COLUMN whatsapp_link TEXT;
  END IF;
END $$;

-- 3. Enable RLS and setup policies
ALTER TABLE masjid_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profile" ON masjid_profile;
CREATE POLICY "Public can view profile" ON masjid_profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update profile" ON masjid_profile;
CREATE POLICY "Admins can update profile" ON masjid_profile FOR ALL USING (auth.uid() IS NOT NULL);

-- 4. Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can send messages" ON contact_messages;
CREATE POLICY "Public can send messages" ON contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins full access messages" ON contact_messages;
CREATE POLICY "Admins full access messages" ON contact_messages FOR ALL USING (auth.uid() IS NOT NULL);

-- 5. IMPORTANT: Force a schema cache reload for PostgREST
-- This fixes the "Could not find column in schema cache" error
NOTIFY pgrst, 'reload schema';
