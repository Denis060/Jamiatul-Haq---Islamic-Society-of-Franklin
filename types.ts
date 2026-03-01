
export interface MasjidProfile {
  id: string;
  official_name: string;
  common_name: string;
  address: string;
  imam_name: string;
  phone: string;
  email: string;
  jumua_time: string;
  whatsapp_link?: string;
  facilities_image_url?: string;
  updated_at?: string;
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

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'financial_secretary' | 'secretary_general';
}

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
}
