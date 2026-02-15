
-- ... Existing tables (profiles, masjid_profile, prayer_times_weekly, events, services, team_members, announcements) ...

-- 8. Gallery Albums (Dynamic Gallery)
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view albums" ON gallery_albums FOR SELECT USING (true);

-- Admin Management Policies
CREATE POLICY "Admin can manage albums" ON gallery_albums FOR ALL USING (auth.uid() IS NOT NULL);
