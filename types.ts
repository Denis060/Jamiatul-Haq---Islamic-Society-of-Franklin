
export interface MasjidProfile {
  id: string;
  official_name: string;
  common_name: string;
  established_year: number;
  address: string;
  imam_name: string;
  phone: string;
  email: string;
  jumua_time: string;
  google_maps_link: string;
}

export interface PrayerTimes {
  id: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumua: string;
  notes?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  cover_image_url: string;
  status: 'draft' | 'published';
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  is_pinned: boolean;
  status: 'draft' | 'published';
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'editor';
}

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
}
