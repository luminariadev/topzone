import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "http://127.0.0.1:54321";
const supabaseAnonKey = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";
let supabaseInstance = null;
{
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}
const supabase = supabaseInstance;

export { supabase as s };
