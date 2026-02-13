
import { createClient } from '@supabase/supabase-js';

// In a real app, these come from environment variables
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// This is a simplified client for the demo. 
// In practice, ensure you use environment variables.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mock data for the environment where real Supabase isn't connected
export const MOCK_PRAYER_TIMES = {
  fajr: '5:15 AM',
  dhuhr: '12:30 PM',
  asr: '3:45 PM',
  maghrib: '5:45 PM',
  isha: '7:30 PM',
  jumua: '1:15 PM',
  notes: 'Iqamah times are subject to change.'
};

export const MOCK_PROFILE = {
  official_name: 'Islamic Society of Franklin Township, Inc.',
  common_name: 'Jamiatul Haq',
  address: '385 Lewis Street, Somerset, NJ 08873',
  phone: '732-322-5221',
  email: 'aksavage68@gmail.com',
  imam: 'Alhaji Abdullah Karim Savage',
  jumua_time: '1:15 PM'
};
