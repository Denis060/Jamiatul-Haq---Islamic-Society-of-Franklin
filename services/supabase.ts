
import { createClient } from '@supabase/supabase-js';

// Connection details provided for project: cvbtlidynsyhbtnrfccu
const SUPABASE_URL = 'https://cvbtlidynsyhbtnrfccu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2YnRsaWR5bnN5aGJ0bnJmY2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTM2NzcsImV4cCI6MjA4NjcyOTY3N30.2CbYuSWVMxzreAUjjkoyQkr5Dw_oawB8XGc3nQjw-7s';

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mock data for the environment where real Supabase records haven't been created yet
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
