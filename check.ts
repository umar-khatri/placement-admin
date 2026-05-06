import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rlfvcgrvmijjkbvddank.supabase.co';
const supabaseAnonKey = 'sb_publishable_KOAumshkySttRTYB1LgY7g_P9MvCOfZ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log('Error:', error);
  console.log('Data:', data);
}

check();
